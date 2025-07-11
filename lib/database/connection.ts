import { neon } from "@neondatabase/serverless"

// Check if DATABASE_URL is available, fallback to other possible env vars
const getDatabaseUrl = () => {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL
  )
}

const databaseUrl = getDatabaseUrl()

if (!databaseUrl) {
  console.warn("⚠️  No database connection string found. Database operations will fail.")
  console.warn("Please set one of: DATABASE_URL, POSTGRES_URL, NEON_DATABASE_URL, or SUPABASE_URL")
}

// Create a safe SQL function that handles missing database URL
const createSqlClient = () => {
  if (!databaseUrl) {
    // Return a mock client for build time
    return () => {
      throw new Error("Database connection not configured. Please set DATABASE_URL environment variable.")
    }
  }

  try {
    return neon(databaseUrl)
  } catch (error) {
    console.error("Failed to create database client:", error)
    return () => {
      throw new Error("Database client creation failed. Please check your DATABASE_URL.")
    }
  }
}

export const sql = createSqlClient()

// Query builder utilities
export class QueryBuilder {
  private query = ""
  private params: any[] = []
  private paramCount = 0

  select(columns = "*"): this {
    this.query = `SELECT ${columns}`
    return this
  }

  from(table: string): this {
    this.query += ` FROM ${table}`
    return this
  }

  join(table: string, condition: string): this {
    this.query += ` JOIN ${table} ON ${condition}`
    return this
  }

  leftJoin(table: string, condition: string): this {
    this.query += ` LEFT JOIN ${table} ON ${condition}`
    return this
  }

  where(condition: string, value?: any): this {
    const operator = this.query.includes("WHERE") ? "AND" : "WHERE"

    if (value !== undefined) {
      this.paramCount++
      this.query += ` ${operator} ${condition.replace("?", `$${this.paramCount}`)}`
      this.params.push(value)
    } else {
      this.query += ` ${operator} ${condition}`
    }

    return this
  }

  orderBy(column: string, direction: "ASC" | "DESC" = "ASC"): this {
    const operator = this.query.includes("ORDER BY") ? "," : "ORDER BY"
    this.query += ` ${operator} ${column} ${direction}`
    return this
  }

  limit(count: number): this {
    this.paramCount++
    this.query += ` LIMIT $${this.paramCount}`
    this.params.push(count)
    return this
  }

  offset(count: number): this {
    this.paramCount++
    this.query += ` OFFSET $${this.paramCount}`
    this.params.push(count)
    return this
  }

  build(): { query: string; params: any[] } {
    return { query: this.query, params: this.params }
  }

  async execute(): Promise<any[]> {
    if (!databaseUrl) {
      throw new Error("Database connection not configured. Please set DATABASE_URL environment variable.")
    }
    const { query, params } = this.build()
    return await sql(query, params)
  }
}

export function createQueryBuilder(): QueryBuilder {
  return new QueryBuilder()
}

// Database health check with better error handling
export async function checkDatabaseConnection(): Promise<{
  isConnected: boolean
  error?: string
  details?: string
}> {
  try {
    if (!databaseUrl) {
      return {
        isConnected: false,
        error: "No database URL configured",
        details: "Please set DATABASE_URL, POSTGRES_URL, NEON_DATABASE_URL, or SUPABASE_URL environment variable",
      }
    }

    // Validate URL format
    try {
      new URL(databaseUrl)
    } catch (urlError) {
      return {
        isConnected: false,
        error: "Invalid database URL format",
        details: "The database URL appears to be malformed",
      }
    }

    // Test connection with a simple query
    const result = await sql`SELECT 1 as test`

    if (result && Array.isArray(result) && result.length > 0) {
      return { isConnected: true }
    } else {
      return {
        isConnected: false,
        error: "Unexpected query result",
        details: "Database responded but with unexpected format",
      }
    }
  } catch (error) {
    console.error("Database connection check failed:", error)

    let errorMessage = "Unknown database error"
    let details = ""

    if (error instanceof Error) {
      errorMessage = error.message

      // Provide more specific error details
      if (error.message.includes("Invalid")) {
        details = "The database URL or credentials appear to be invalid"
      } else if (error.message.includes("timeout")) {
        details = "Database connection timed out"
      } else if (error.message.includes("ENOTFOUND")) {
        details = "Database host not found"
      } else if (error.message.includes("authentication")) {
        details = "Database authentication failed"
      } else if (error.message.includes("permission")) {
        details = "Database permission denied"
      } else {
        details = "Check your database URL and network connectivity"
      }
    }

    return {
      isConnected: false,
      error: errorMessage,
      details,
    }
  }
}

// Get database info for debugging
export function getDatabaseInfo(): {
  hasUrl: boolean
  urlSource?: string
  urlPreview?: string
} {
  const sources = [
    { name: "DATABASE_URL", value: process.env.DATABASE_URL },
    { name: "POSTGRES_URL", value: process.env.POSTGRES_URL },
    { name: "NEON_DATABASE_URL", value: process.env.NEON_DATABASE_URL },
    { name: "SUPABASE_URL", value: process.env.SUPABASE_URL },
    { name: "NEXT_PUBLIC_SUPABASE_URL", value: process.env.NEXT_PUBLIC_SUPABASE_URL },
  ]

  const activeSource = sources.find((source) => source.value)

  if (!activeSource) {
    return { hasUrl: false }
  }

  // Create a safe preview of the URL (hide credentials)
  let urlPreview = activeSource.value
  try {
    const url = new URL(activeSource.value)
    urlPreview = `${url.protocol}//${url.hostname}:${url.port || "default"}${url.pathname}`
  } catch {
    urlPreview = "Invalid URL format"
  }

  return {
    hasUrl: true,
    urlSource: activeSource.name,
    urlPreview,
  }
}
