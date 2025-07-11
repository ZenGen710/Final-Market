import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider as AuthContextProvider } from "@/lib/auth/context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zen-Gen Marketplace - Buy & Sell Everything",
  description: "Your trusted marketplace for buying and selling items locally",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50">{children}</div>
          </CartProvider>
        </AuthContextProvider>
      </body>
    </html>
  )
}
