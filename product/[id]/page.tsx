"use client"

import { useState } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Star, MapPin, Calendar, Shield, Minus, Plus } from "lucide-react"
import Header from "@/components/header"
import AddToCartButton from "@/components/add-to-cart-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockProducts } from "@/lib/data"
import { formatPrice, formatDate } from "@/lib/utils"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1)
  const product = mockProducts.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, Math.min(10, newQuantity)))
  }

  return (
    <div>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square mb-4">
              <Image
                src={product.images[0] || "/placeholder.svg?height=400&width=400"}
                alt={product.title}
                fill
                className="object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=400&width=400"
                }}
              />
              {product.featured && <Badge className="absolute top-4 left-4 bg-yellow-500">Featured</Badge>}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4">
              <Badge variant="secondary" className="capitalize mb-2">
                {product.condition}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-4xl font-bold text-blue-600 mb-4">{formatPrice(product.price)}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{product.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Listed on {formatDate(product.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Condition: {product.condition}</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <Label htmlFor="quantity" className="text-sm font-medium mb-2 block">
                Quantity
              </Label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                  className="w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Purchase Options */}
            <div className="space-y-3 mb-6">
              <AddToCartButton product={product} quantity={quantity} size="lg" className="w-full" />
              <Button size="lg" className="w-full" variant="outline">
                Buy Now
              </Button>
            </div>

            {/* Seller Info */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Seller Information</h3>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={product.seller.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{product.seller.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{product.seller.name}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{product.seller.rating} rating</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Seller */}
            <div className="space-y-3">
              <Button variant="outline" size="lg" className="w-full">
                Contact Seller
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                Make Offer
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
