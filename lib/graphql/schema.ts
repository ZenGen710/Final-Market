import { gql } from "graphql-tag"

export const typeDefs = gql`
  scalar DateTime
  scalar JSON

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    phone: String
    avatarUrl: String
    dateOfBirth: DateTime
    isVerified: Boolean!
    isActive: Boolean!
    role: UserRole!
    addresses: [UserAddress!]!
    products: [Product!]!
    orders: [Order!]!
    reviews: [Review!]!
    favorites: [Product!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum UserRole {
    USER
    SELLER
    ADMIN
  }

  type UserAddress {
    id: ID!
    userId: ID!
    type: AddressType!
    isDefault: Boolean!
    firstName: String!
    lastName: String!
    company: String
    addressLine1: String!
    addressLine2: String
    city: String!
    state: String!
    postalCode: String!
    country: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum AddressType {
    SHIPPING
    BILLING
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    icon: String
    parentId: ID
    parent: Category
    children: [Category!]!
    products: [Product!]!
    isActive: Boolean!
    sortOrder: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Product {
    id: ID!
    sellerId: ID!
    seller: User!
    categoryId: ID!
    category: Category!
    title: String!
    slug: String!
    description: String!
    price: Float!
    compareAtPrice: Float
    condition: ProductCondition!
    brand: String
    model: String
    sku: String
    stockQuantity: Int!
    isFeatured: Boolean!
    isActive: Boolean!
    status: ProductStatus!
    tags: [String!]!
    location: JSON!
    images: [ProductImage!]!
    variants: [ProductVariant!]!
    reviews: [Review!]!
    averageRating: Float!
    reviewCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum ProductCondition {
    NEW
    LIKE_NEW
    GOOD
    FAIR
    POOR
  }

  enum ProductStatus {
    DRAFT
    ACTIVE
    INACTIVE
    ARCHIVED
  }

  type ProductImage {
    id: ID!
    productId: ID!
    url: String!
    altText: String
    sortOrder: Int!
    isPrimary: Boolean!
    createdAt: DateTime!
  }

  type ProductVariant {
    id: ID!
    productId: ID!
    title: String!
    price: Float!
    compareAtPrice: Float
    sku: String
    stockQuantity: Int!
    option1: String
    option2: String
    option3: String
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Order {
    id: ID!
    orderNumber: String!
    userId: ID
    user: User
    email: String!
    status: OrderStatus!
    financialStatus: FinancialStatus!
    fulfillmentStatus: FulfillmentStatus!
    subtotal: Float!
    taxAmount: Float!
    shippingAmount: Float!
    discountAmount: Float!
    totalAmount: Float!
    shippingAddress: JSON!
    billingAddress: JSON!
    paymentMethod: String
    trackingNumber: String
    items: [OrderItem!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum OrderStatus {
    PENDING
    CONFIRMED
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
    REFUNDED
  }

  enum FinancialStatus {
    PENDING
    AUTHORIZED
    PAID
    PARTIALLY_PAID
    REFUNDED
    PARTIALLY_REFUNDED
    VOIDED
  }

  enum FulfillmentStatus {
    UNFULFILLED
    PARTIAL
    FULFILLED
  }

  type OrderItem {
    id: ID!
    orderId: ID!
    productId: ID!
    product: Product!
    variantId: ID
    variant: ProductVariant
    sellerId: ID!
    seller: User!
    title: String!
    quantity: Int!
    price: Float!
    totalDiscount: Float!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Review {
    id: ID!
    productId: ID!
    product: Product!
    userId: ID!
    user: User!
    rating: Int!
    title: String
    content: String
    isVerifiedPurchase: Boolean!
    isApproved: Boolean!
    helpfulCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type PaginationInfo {
    page: Int!
    limit: Int!
    total: Int!
    totalPages: Int!
    hasNext: Boolean!
    hasPrev: Boolean!
  }

  type ProductConnection {
    data: [Product!]!
    pagination: PaginationInfo!
  }

  type OrderConnection {
    data: [Order!]!
    pagination: PaginationInfo!
  }

  type UserConnection {
    data: [User!]!
    pagination: PaginationInfo!
  }

  input ProductFilters {
    search: String
    categoryId: ID
    sellerId: ID
    condition: ProductCondition
    minPrice: Float
    maxPrice: Float
    location: String
    tags: [String!]
    isFeatured: Boolean
  }

  input OrderFilters {
    userId: ID
    status: OrderStatus
    financialStatus: FinancialStatus
    fulfillmentStatus: FulfillmentStatus
    dateFrom: DateTime
    dateTo: DateTime
  }

  input PaginationInput {
    page: Int = 1
    limit: Int = 20
    sortBy: String = "createdAt"
    sortOrder: SortOrder = DESC
  }

  enum SortOrder {
    ASC
    DESC
  }

  input CreateUserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    phone: String
    role: UserRole = USER
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    phone: String
    avatarUrl: String
    dateOfBirth: DateTime
  }

  input CreateProductInput {
    sellerId: ID!
    categoryId: ID!
    title: String!
    description: String!
    price: Float!
    compareAtPrice: Float
    condition: ProductCondition!
    brand: String
    model: String
    stockQuantity: Int!
    isFeatured: Boolean = false
    tags: [String!] = []
    location: JSON!
    images: [ProductImageInput!]!
  }

  input ProductImageInput {
    url: String!
    altText: String
    sortOrder: Int!
    isPrimary: Boolean!
  }

  input UpdateProductInput {
    title: String
    description: String
    price: Float
    compareAtPrice: Float
    condition: ProductCondition
    brand: String
    model: String
    stockQuantity: Int
    isFeatured: Boolean
    tags: [String!]
    status: ProductStatus
  }

  input CreateOrderInput {
    userId: ID
    email: String!
    shippingAddress: JSON!
    billingAddress: JSON!
    paymentMethod: String
    items: [OrderItemInput!]!
  }

  input OrderItemInput {
    productId: ID!
    variantId: ID
    sellerId: ID!
    quantity: Int!
    price: Float!
  }

  type Query {
    # Users
    user(id: ID!): User
    users(pagination: PaginationInput): UserConnection!

    # Products
    product(id: ID!): Product
    productBySlug(slug: String!): Product
    products(filters: ProductFilters, pagination: PaginationInput): ProductConnection!
    featuredProducts(limit: Int = 10): [Product!]!

    # Categories
    category(id: ID!): Category
    categories: [Category!]!

    # Orders
    order(id: ID!): Order
    orders(filters: OrderFilters, pagination: PaginationInput): OrderConnection!

    # Reviews
    productReviews(productId: ID!, pagination: PaginationInput): [Review!]!
  }

  type Mutation {
    # Users
    createUser(input: CreateUserInput  [Review!]!
  }

  type Mutation {
    # Users
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!

    # Products
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!

    # Orders
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(id: ID!, status: OrderStatus!, financialStatus: FinancialStatus, fulfillmentStatus: FulfillmentStatus): Order!
    addOrderTracking(id: ID!, trackingNumber: String!, trackingUrl: String): Order!

    # Reviews
    createReview(productId: ID!, rating: Int!, title: String, content: String): Review!
    updateReview(id: ID!, rating: Int, title: String, content: String): Review!
    deleteReview(id: ID!): Boolean!

    # Favorites
    addToFavorites(productId: ID!): Boolean!
    removeFromFavorites(productId: ID!): Boolean!
  }

  type Subscription {
    orderStatusUpdated(userId: ID!): Order!
    productStockUpdated(productId: ID!): Product!
  }
`
