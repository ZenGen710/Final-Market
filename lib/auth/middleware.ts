import { type NextRequest, NextResponse } from "next/server"
import { AuthUtils } from "./config"
import { userRepository } from "../repositories/user-repository"
import { fallbackUserRepository } from "./fallback"
import { checkDatabaseConnection } from "../database/connection"

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    role: string
  }
}

export async function authenticateUser(request: NextRequest): Promise<{
  user: { id: string; email: string; role: string } | null
  error: string | null
}> {
  try {
    const authHeader = request.headers.get("authorization")
    const token = AuthUtils.extractTokenFromHeader(authHeader)

    if (!token) {
      return { user: null, error: "No token provided" }
    }

    const payload = await AuthUtils.verifyToken(token)
    if (!payload) {
      return { user: null, error: "Invalid or expired token" }
    }

    // Verify user still exists and is active
    let user
    const isDatabaseAvailable = await checkDatabaseConnection()

    if (isDatabaseAvailable) {
      user = await userRepository.findById(payload.userId)
    } else {
      user = await fallbackUserRepository.findById(payload.userId)
    }

    if (!user || !user.isActive) {
      return { user: null, error: "User not found or inactive" }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      error: null,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return { user: null, error: "Authentication failed" }
  }
}

export function requireAuth(handler: (req: AuthenticatedRequest) => Promise<Response>) {
  return async (request: NextRequest) => {
    const { user, error } = await authenticateUser(request)

    if (!user) {
      return NextResponse.json({ success: false, error: error || "Authentication required" }, { status: 401 })
    }
    // Add user to request object
    ;(request as AuthenticatedRequest).user = user

    return handler(request as AuthenticatedRequest)
  }
}

export function requireRole(roles: string[]) {
  return (handler: (req: AuthenticatedRequest) => Promise<Response>) => async (request: NextRequest) => {
    const { user, error } = await authenticateUser(request)

    if (!user) {
      return NextResponse.json({ success: false, error: error || "Authentication required" }, { status: 401 })
    }

    if (!roles.includes(user.role)) {
      return NextResponse.json({ success: false, error: "Insufficient permissions" }, { status: 403 })
    }
    ;(request as AuthenticatedRequest).user = user
    return handler(request as AuthenticatedRequest)
  }
}
