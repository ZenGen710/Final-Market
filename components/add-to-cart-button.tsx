"use client"

import { useState } from "react"
import { ShoppingCart, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart, useCartReady } from "@/lib/cart-context"
import type { Product } from "@/lib/types"

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  variant?: "default" | "outline" | "secondary"
  size?: "sm" | "default" | "lg"
  className?: string
}

export default function AddToCartButton({
  product,
  quantity = 1,
  variant = "default",
  size = "default",
  className,
}: AddToCartButtonProps) {
  const { dispatch } = useCart()
  const isReady = useCartReady()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    if (!isReady) return

    dispatch({ type: "ADD_TO_CART", product, quantity })
    setIsAdded(true)

    // Reset the success state after 2 seconds
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  if (!isReady) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Loading...
      </Button>
    )
  }

  return (
    <Button onClick={handleAddToCart} variant={variant} size={size} className={className} disabled={isAdded}>
      {isAdded ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
