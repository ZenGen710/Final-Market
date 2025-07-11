// Fallback authentication for when database is not available
interface FallbackUser {
  id: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

// In-memory storage for development (not for production!)
const fallbackUsers: Map<string, FallbackUser> = new Map()

// Create a demo user for testing
const demoUser: FallbackUser = {
  id: "demo-user-123",
  email: "demo@example.com",
  passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G", // "password123"
  firstName: "Demo",
  lastName: "User",
  role: "user",
  isActive: true,
  isVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

fallbackUsers.set(demoUser.email, demoUser)

export class FallbackUserRepository {
  async findById(id: string): Promise<FallbackUser | null> {
    for (const user of fallbackUsers.values()) {
      if (user.id === id && user.isActive) {
        return user
      }
    }
    return null
  }

  async findByEmail(email: string): Promise<FallbackUser | null> {
    const user = fallbackUsers.get(email.toLowerCase())
    return user && user.isActive ? user : null
  }

  async create(userData: any): Promise<FallbackUser> {
    const user: FallbackUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email.toLowerCase(),
      passwordHash: userData.passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || "user",
      isActive: true,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    fallbackUsers.set(user.email, user)
    return user
  }

  async update(id: string, userData: any): Promise<FallbackUser | null> {
    const user = await this.findById(id)
    if (!user) return null

    const updatedUser = {
      ...user,
      ...userData,
      updatedAt: new Date().toISOString(),
    }

    fallbackUsers.set(user.email, updatedUser)
    return updatedUser
  }
}

export const fallbackUserRepository = new FallbackUserRepository()
