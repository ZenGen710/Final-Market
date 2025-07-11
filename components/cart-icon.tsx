"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart, useCartReady } from "@/lib/cart-context"
import Link from "next/link"

export default function CartIcon() {
  const { state } = useCart()
  const isReady = useCartReady()

  // Don't show count until cart is loaded to prevent hydration mismatch
  const itemCount = isReady ? state.cart.itemCount : 0

  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {itemCount > 99 ? "99+" : itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  )
}
