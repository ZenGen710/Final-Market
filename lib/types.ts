export interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: "new" | "like-new" | "good" | "fair" | "poor"
  images: string[]
  seller: {
    name: string
    avatar: string
    rating: number
  }
  location: string
  createdAt: string
  featured?: boolean
  stock?: number
}

export interface Category {
  id: string
  name: string
  icon: string
}

export interface ProductFilters {
  search?: string
  category?: string
  condition?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  sortBy?: "newest" | "oldest" | "price-low" | "price-high" | "featured"
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  addedAt: string
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

export interface ShippingAddress {
  fullName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface PaymentMethod {
  type: "card" | "paypal" | "apple_pay"
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  cardholderName?: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  subtotal: number
  tax: number
  shipping: number
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  estimatedDelivery?: string
  stripePaymentIntentId?: string
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  client_secret: string
}
