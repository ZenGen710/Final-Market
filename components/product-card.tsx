import Image from "next/image"
import Link from "next/link"
import { Star, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AddToCartButton from "./add-to-cart-button"
import type { Product } from "@/lib/types"
import { formatPrice, formatDate } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <Link href={`/product/${product.id}`}>
        <div className="relative">
          <Image
            src={product.images[0] || "/placeholder.svg?height=300&width=300"}
            alt={product.title}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=300&width=300"
            }}
          />
          {product.featured && <Badge className="absolute top-2 left-2 bg-yellow-500">Featured</Badge>}
          <Badge variant="secondary" className="absolute top-2 right-2 capitalize">
            {product.condition}
          </Badge>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600">{product.title}</h3>
        </Link>

        <p className="text-2xl font-bold text-blue-600 mb-2">{formatPrice(product.price)}</p>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{product.location}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{product.seller.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">{formatDate(product.createdAt)}</div>
          <AddToCartButton product={product} size="sm" />
        </div>
      </CardContent>
    </Card>
  )
}
