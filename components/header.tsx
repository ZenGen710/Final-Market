"use client"

import Link from "next/link"
import { Search, Plus, User, LogOut, Settings, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import CartIcon from "./cart-icon"
import { useAuth } from "@/lib/auth/context"

export default function Header() {
  const { state, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Zen-Gen 
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium">
                Search
              </Link>
            </nav>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              
              
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {state.isAuthenticated && (state.user?.role === "seller" || state.user?.role === "admin") && (
              <Link href="/sell">
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Sell Item</span>
                </Button>
              </Link>
            )}

            <CartIcon />

            {state.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={state.user?.avatarUrl || "/placeholder.svg"} alt={state.user?.firstName} />
                      <AvatarFallback>
                        {state.user?.firstName?.[0]}
                        {state.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {state.user?.firstName} {state.user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">{state.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <Package className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
