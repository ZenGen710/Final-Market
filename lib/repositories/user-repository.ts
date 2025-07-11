import { sql, checkDatabaseConnection } from "../database/connection"
import type { User, UserAddress, PaginatedResponse, PaginationParams } from "../types/database"

export interface CreateUserData {
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  dateOfBirth?: string
  isVerified: boolean
  isActive: boolean
  role: string
}

export class UserRepository {
  private async ensureConnection() {
    const result = await checkDatabaseConnection()
    if (!result.isConnected) {
      throw new Error(`Database connection failed: ${result.error}. ${result.details || ""}`)
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      await this.ensureConnection()
      const result = await sql`
        SELECT * FROM users WHERE id = ${id} AND is_active = true
      `
      return result[0] || null
    } catch (error) {
      console.error("Error finding user by ID:", error)
      if (error instanceof Error && error.message.includes("Database connection failed")) {
        throw error // Re-throw connection errors
      }
      throw new Error("Failed to find user")
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      await this.ensureConnection()
      const result = await sql`
        SELECT * FROM users WHERE email = ${email} AND is_active = true
      `
      return result[0] || null
    } catch (error) {
      console.error("Error finding user by email:", error)
      if (error instanceof Error && error.message.includes("Database connection failed")) {
        throw error // Re-throw connection errors
      }
      throw new Error("Failed to find user")
    }
  }

  async create(userData: CreateUserData): Promise<User> {
    try {
      await this.ensureConnection()
      const result = await sql`
        INSERT INTO users (
          email, password_hash, first_name, last_name, phone, avatar_url,
          date_of_birth, is_verified, is_active, role
        ) VALUES (
          ${userData.email}, ${userData.passwordHash}, ${userData.firstName},
          ${userData.lastName}, ${userData.phone || null}, ${userData.avatarUrl || null},
          ${userData.dateOfBirth || null}, ${userData.isVerified}, ${userData.isActive},
          ${userData.role}
        )
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Error creating user:", error)
      if (error instanceof Error && error.message.includes("Database connection failed")) {
        throw error // Re-throw connection errors
      }
      throw new Error("Failed to create user")
    }
  }

  async update(id: string, userData: Partial<User & { lastLoginAt?: string }>): Promise<User | null> {
    try {
      await this.ensureConnection()
      const updateFields: string[] = []
      const values: any[] = []
      let paramCount = 0

      Object.entries(userData).forEach(([key, value]) => {
        if (key !== "id" && key !== "createdAt" && key !== "updatedAt" && value !== undefined) {
          paramCount++
          // Convert camelCase to snake_case for database columns
          const dbColumn = key.replace(/([A-Z])/g, "_$1").toLowerCase()
          updateFields.push(`${dbColumn} = $${paramCount}`)
          values.push(value)
        }
      })

      if (updateFields.length === 0) return null

      paramCount++
      values.push(id)

      const query = `
        UPDATE users 
        SET ${updateFields.join(", ")}, updated_at = NOW()
        WHERE id = $${paramCount}
        RETURNING *
      `

      const result = await sql(query, values)
      return result[0] || null
    } catch (error) {
      console.error("Error updating user:", error)
      if (error instanceof Error && error.message.includes("Database connection failed")) {
        throw error // Re-throw connection errors
      }
      throw new Error("Failed to update user")
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.ensureConnection()
      const result = await sql`
        UPDATE users SET is_active = false WHERE id = ${id}
      `
      return result.count > 0
    } catch (error) {
      console.error("Error deleting user:", error)
      if (error instanceof Error && error.message.includes("Database connection failed")) {
        throw error // Re-throw connection errors
      }
      throw new Error("Failed to delete user")
    }
  }

  async findAll(params: PaginationParams = {}): Promise<PaginatedResponse<User>> {
    try {
      await this.ensureConnection()
      const { page = 1, limit = 20, sortBy = "created_at", sortOrder = "desc" } = params
      const offset = (page - 1) * limit

      const users = await sql`
        SELECT * FROM users 
        WHERE is_active = true
        ORDER BY ${sql.unsafe(sortBy)} ${sql.unsafe(sortOrder.toUpperCase())}
        LIMIT ${limit} OFFSET ${offset}
      `

      const totalResult = await sql`
        SELECT COUNT(*) as count FROM users WHERE is_active = true
      `
      const total = Number.parseInt(totalResult[0].count)

      return {
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      }
    } catch (error) {
      console.error("Error finding all users:", error)
      if (error instanceof Error && error.message.includes("Database connection failed")) {
        throw error // Re-throw connection errors
      }
      throw new Error("Failed to find users")
    }
  }

  async getAddresses(userId: string): Promise<UserAddress[]> {
    try {
      await this.ensureConnection()
      return await sql`
        SELECT * FROM user_addresses 
        WHERE user_id = ${userId}
        ORDER BY is_default DESC, created_at DESC
      `
    } catch (error) {
      console.error("Error getting user addresses:", error)
      return []
    }
  }

  async addAddress(addressData: Omit<UserAddress, "id" | "createdAt" | "updatedAt">): Promise<UserAddress> {
    try {
      await this.ensureConnection()
      const result = await sql`
        INSERT INTO user_addresses (
          user_id, type, is_default, first_name, last_name, company,
          address_line_1, address_line_2, city, state, postal_code, country
        ) VALUES (
          ${addressData.userId}, ${addressData.type}, ${addressData.isDefault},
          ${addressData.firstName}, ${addressData.lastName}, ${addressData.company || null},
          ${addressData.addressLine1}, ${addressData.addressLine2 || null}, ${addressData.city},
          ${addressData.state}, ${addressData.postalCode}, ${addressData.country}
        )
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Error adding user address:", error)
      if (error instanceof Error && error.message.includes("Database connection failed")) {
        throw error // Re-throw connection errors
      }
      throw new Error("Failed to add address")
    }
  }
}

export const userRepository = new UserRepository()
