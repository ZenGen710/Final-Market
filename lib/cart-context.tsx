"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { Cart, CartItem, Product } from "./types"

interface CartState {
  cart: Cart
  isLoaded: boolean
}

type CartAction =
  | { type: "ADD_TO_CART"; product: Product; quantity?: number }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; cart: Cart }
  | { type: "SET_LOADED"; isLoaded: boolean }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function calculateCartTotals(items: CartItem[]): { total: number; itemCount: number } {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { total, itemCount }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItemIndex = state.cart.items.findIndex((item) => item.product.id === action.product.id)
      let newItems: CartItem[]

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.cart.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + (action.quantity || 1) } : item,
        )
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${action.product.id}-${Date.now()}`,
          product: action.product,
          quantity: action.quantity || 1,
          addedAt: new Date().toISOString(),
        }
        newItems = [...state.cart.items, newItem]
      }

      const { total, itemCount } = calculateCartTotals(newItems)
      const newCart = { items: newItems, total, itemCount }

      // Save to localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("cart", JSON.stringify(newCart))
        } catch (error) {
          console.warn("Failed to save cart to localStorage:", error)
        }
      }

      return { ...state, cart: newCart }
    }

    case "REMOVE_FROM_CART": {
      const newItems = state.cart.items.filter((item) => item.product.id !== action.productId)
      const { total, itemCount } = calculateCartTotals(newItems)
      const newCart = { items: newItems, total, itemCount }

      // Save to localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("cart", JSON.stringify(newCart))
        } catch (error) {
          console.warn("Failed to save cart to localStorage:", error)
        }
      }

      return { ...state, cart: newCart }
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.cart.items
        .map((item) =>
          item.product.id === action.productId ? { ...item, quantity: Math.max(0, action.quantity) } : item,
        )
        .filter((item) => item.quantity > 0)

      const { total, itemCount } = calculateCartTotals(newItems)
      const newCart = { items: newItems, total, itemCount }

      // Save to localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("cart", JSON.stringify(newCart))
        } catch (error) {
          console.warn("Failed to save cart to localStorage:", error)
        }
      }

      return { ...state, cart: newCart }
    }

    case "CLEAR_CART": {
      const newCart = { items: [], total: 0, itemCount: 0 }

      // Clear localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("cart")
        } catch (error) {
          console.warn("Failed to clear cart from localStorage:", error)
        }
      }

      return { ...state, cart: newCart }
    }

    case "LOAD_CART": {
      return { ...state, cart: action.cart }
    }

    case "SET_LOADED": {
      return { ...state, isLoaded: action.isLoaded }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: { items: [], total: 0, itemCount: 0 },
    isLoaded: false,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          // Validate the parsed cart structure
          if (parsedCart && Array.isArray(parsedCart.items)) {
            dispatch({ type: "LOAD_CART", cart: parsedCart })
          }
        }
      } catch (error) {
        console.warn("Error loading cart from localStorage:", error)
        // Clear corrupted data
        localStorage.removeItem("cart")
      } finally {
        dispatch({ type: "SET_LOADED", isLoaded: true })
      }
    } else {
      // Server-side rendering
      dispatch({ type: "SET_LOADED", isLoaded: true })
    }
  }, [])

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider. Make sure your component is wrapped with CartProvider.",
    )
  }
  return context
}

// Hook to check if cart is ready (useful for SSR)
export function useCartReady() {
  const { state } = useCart()
  return state.isLoaded
}
