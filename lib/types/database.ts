export interface User {
  id: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  dateOfBirth?: string
  isVerified: boolean
  isActive: boolean
  role: "user" | "seller" | "admin"
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface UserAddress {
  id: string
  userId: string
  type: "shipping" | "billing"
  isDefault: boolean
  firstName: string
  lastName: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  parentId?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  children?: Category[]
  parent?: Category
}

export interface Product {
  id: string
  sellerId: string
  categoryId: string
  title: string
  slug: string
  description: string
  price: number
  compareAtPrice?: number
  costPerItem?: number
  condition: "new" | "like-new" | "good" | "fair" | "poor"
  brand?: string
  model?: string
  sku?: string
  barcode?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
    unit: string
  }
  stockQuantity: number
  lowStockThreshold: number
  trackInventory: boolean
  allowBackorders: boolean
  isFeatured: boolean
  isActive: boolean
  status: "draft" | "active" | "inactive" | "archived"
  seoTitle?: string
  seoDescription?: string
  tags: string[]
  location: {
    city: string
    state: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  shippingRequired: boolean
  shippingWeight?: number
  shippingDimensions?: {
    length: number
    width: number
    height: number
    unit: string
  }
  createdAt: string
  updatedAt: string

  // Relations
  seller?: User
  category?: Category
  images?: ProductImage[]
  variants?: ProductVariant[]
  reviews?: Review[]
  averageRating?: number
  reviewCount?: number
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  altText?: string
  sortOrder: number
  isPrimary: boolean
  createdAt: string
}

export interface ProductVariant {
  id: string
  productId: string
  title: string
  price: number
  compareAtPrice?: number
  sku?: string
  barcode?: string
  stockQuantity: number
  weight?: number
  option1?: string
  option2?: string
  option3?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  email: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  financialStatus: "pending" | "authorized" | "paid" | "partially_paid" | "refunded" | "partially_refunded" | "voided"
  fulfillmentStatus: "unfulfilled" | "partial" | "fulfilled"

  subtotal: number
  taxAmount: number
  shippingAmount: number
  discountAmount: number
  totalAmount: number

  shippingAddress: UserAddress
  billingAddress: UserAddress

  paymentMethod?: string
  paymentGateway?: string
  paymentGatewayTransactionId?: string

  shippingMethod?: string
  trackingNumber?: string
  trackingUrl?: string
  shippedAt?: string
  deliveredAt?: string

  notes?: string
  tags: string[]
  source: string

  createdAt: string
  updatedAt: string

  // Relations
  user?: User
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId?: string
  sellerId: string

  title: string
  variantTitle?: string
  sku?: string
  quantity: number
  price: number
  compareAtPrice?: number
  totalDiscount: number

  productSnapshot: any
  fulfillmentStatus: string
  fulfillmentService?: string

  createdAt: string
  updatedAt: string

  // Relations
  product?: Product
  variant?: ProductVariant
  seller?: User
}

export interface CartItem {
  id: string
  userId?: string
  sessionId?: string
  productId: string
  variantId?: string
  quantity: number
  createdAt: string
  updatedAt: string

  // Relations
  product?: Product
  variant?: ProductVariant
}

export interface Review {
  id: string
  productId: string
  userId: string
  orderItemId?: string
  rating: number
  title?: string
  content?: string
  isVerifiedPurchase: boolean
  isApproved: boolean
  helpfulCount: number
  createdAt: string
  updatedAt: string

  // Relations
  product?: Product
  user?: User
}

export interface Favorite {
  id: string
  userId: string
  productId: string
  createdAt: string

  // Relations
  product?: Product
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Query parameters
export interface ProductFilters {
  search?: string
  categoryId?: string
  sellerId?: string
  condition?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  tags?: string[]
  isFeatured?: boolean
  isActive?: boolean
  status?: string
}

export interface OrderFilters {
  userId?: string
  status?: string
  financialStatus?: string
  fulfillmentStatus?: string
  dateFrom?: string
  dateTo?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}
