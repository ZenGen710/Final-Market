"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { User } from "../types/database"

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_USER"; payload: User }

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true }

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      }

    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      }

    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "UPDATE_USER":
      return { ...state, user: action.payload }

    default:
      return state
  }
}

interface AuthContextType {
  state: AuthState
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  signup: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    role?: string
  }) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load token from localStorage on mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (token) {
          // Verify token and get user data
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: { user: data.data, token },
            })
          } else {
            // Token is invalid, remove it
            localStorage.removeItem("auth_token")
            dispatch({ type: "LOGIN_FAILURE" })
          }
        } else {
          dispatch({ type: "SET_LOADING", payload: false })
        }
      } catch (error) {
        console.error("Error loading stored auth:", error)
        localStorage.removeItem("auth_token")
        dispatch({ type: "LOGIN_FAILURE" })
      }
    }

    loadStoredAuth()
  }, [])

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      dispatch({ type: "LOGIN_START" })

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Store token in localStorage
      localStorage.setItem("auth_token", data.data.token)

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: data.data.user,
          token: data.data.token,
        },
      })
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" })
      throw error
    }
  }

  const signup = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    role?: string
  }) => {
    try {
      dispatch({ type: "LOGIN_START" })

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }

      // Store token in localStorage
      localStorage.setItem("auth_token", data.data.token)

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: data.data.user,
          token: data.data.token,
        },
      })
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    dispatch({ type: "LOGOUT" })

    // Call logout endpoint to handle any server-side cleanup
    fetch("/api/auth/logout", { method: "POST" }).catch(console.error)
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await fetch(`/api/users/${state.user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user")
      }

      dispatch({ type: "UPDATE_USER", payload: data.data })
    } catch (error) {
      throw error
    }
  }

  const refreshToken = async () => {
    try {
      if (!state.token) return

      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: state.token }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("auth_token", data.data.token)
        // Update token in state without changing user data
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: state.user!,
            token: data.data.token,
          },
        })
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
    }
  }

  const value: AuthContextType = {
    state,
    login,
    signup,
    logout,
    updateUser,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
