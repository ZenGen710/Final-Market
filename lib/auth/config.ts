import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"

export const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key"
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"
export const BCRYPT_ROUNDS = 12

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export class AuthUtils {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, BCRYPT_ROUNDS)
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  static async generateToken(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
    const secret = new TextEncoder().encode(JWT_SECRET)

    // Calculate expiration time
    const expirationTime = JWT_EXPIRES_IN.endsWith("d")
      ? Number.parseInt(JWT_EXPIRES_IN.slice(0, -1)) * 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000 // default 7 days

    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(new Date(Date.now() + expirationTime))
      .sign(secret)

    return jwt
  }

  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)
      return payload as JWTPayload
    } catch (error) {
      console.error("Token verification failed:", error)
      return null
    }
  }

  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }
    return authHeader.substring(7)
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push("Password must contain at least one special character (@$!%*?&)")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
