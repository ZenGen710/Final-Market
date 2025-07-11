"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string[]
  redirectTo?: string
}

export default function ProtectedRoute({ children, requiredRole, redirectTo = "/auth/login" }: ProtectedRouteProps) {
  const { state } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!state.isLoading) {
      if (!state.isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && state.user && !requiredRole.includes(state.user.role)) {
        router.push("/unauthorized")
        return
      }
    }
  }, [state.isLoading, state.isAuthenticated, state.user, requiredRole, router, redirectTo])

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!state.isAuthenticated) {
    return null
  }

  if (requiredRole && state.user && !requiredRole.includes(state.user.role)) {
    return null
  }

  return <>{children}</>
}
