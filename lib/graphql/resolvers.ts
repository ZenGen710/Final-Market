import { userRepository } from "../repositories/user-repository"
import { productRepository } from "../repositories/product-repository"
import { orderRepository } from "../repositories/order-repository"
import type { User, Product, Order, ProductFilters, OrderFilters, PaginationParams } from "../types/database"

export const resolvers = {
  Query: {
    // User queries
    user: async (_: any, { id }: { id: string }) => {
      return await userRepository.findById(id)
    },

    users: async (_: any, { pagination }: { pagination?: PaginationParams }) => {
      return await userRepository.findAll(pagination || {})
    },

    // Product queries
    product: async (_: any, { id }: { id: string }) => {
      return await productRepository.findById(id)
    },

    productBySlug: async (_: any, { slug }: { slug: string }) => {
      const products = await productRepository.findAll({ slug } as any)
      return products.data[0] || null
    },

    products: async (_: any, { filters, pagination }: { filters?: ProductFilters; pagination?: PaginationParams }) => {
      return await productRepository.findAll(filters || {}, pagination || {})
    },

    featuredProducts: async (_: any, { limit }: { limit?: number }) => {
      const result = await productRepository.findAll(
        { isFeatured: true },
        { limit: limit || 10, sortBy: "created_at", sortOrder: "desc" },
      )
      return result.data
    },

    // Order queries
    order: async (_: any, { id }: { id: string }) => {
      return await orderRepository.findById(id)
    },

    orders: async (_: any, { filters, pagination }: { filters?: OrderFilters; pagination?: PaginationParams }) => {
      return await orderRepository.findAll(filters || {}, pagination || {})
    },
  },

  Mutation: {
    // User mutations
    createUser: async (_: any, { input }: { input: any }) => {
      return await userRepository.create(input)
    },

    updateUser: async (_: any, { id, input }: { id: string; input: any }) => {
      return await userRepository.update(id, input)
    },

    deleteUser: async (_: any, { id }: { id: string }) => {
      return await userRepository.delete(id)
    },

    // Product mutations
    createProduct: async (_: any, { input }: { input: any }) => {
      const { images, ...productData } = input

      // Generate slug
      productData.slug = productData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      const product = await productRepository.create(productData)

      if (images && images.length > 0) {
        await productRepository.addImages(product.id, images)
      }

      return await productRepository.findById(product.id)
    },

    updateProduct: async (_: any, { id, input }: { id: string; input: any }) => {
      return await productRepository.update(id, input)
    },

    deleteProduct: async (_: any, { id }: { id: string }) => {
      return await productRepository.delete(id)
    },

    // Order mutations
    createOrder: async (_: any, { input }: { input: any }) => {
      const { items, ...orderData } = input

      // Calculate totals
      const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
      const taxAmount = subtotal * 0.08 // 8% tax
      const shippingAmount = subtotal > 50 ? 0 : 9.99
      const totalAmount = subtotal + taxAmount + shippingAmount

      const orderWithTotals = {
        ...orderData,
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: "pending",
        financialStatus: "pending",
        fulfillmentStatus: "unfulfilled",
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount: 0,
        totalAmount,
        source: "web",
      }

      return await orderRepository.create(orderWithTotals, items)
    },

    updateOrderStatus: async (_: any, { id, status, financialStatus, fulfillmentStatus }: any) => {
      return await orderRepository.updateStatus(id, status, financialStatus, fulfillmentStatus)
    },

    addOrderTracking: async (_: any, { id, trackingNumber, trackingUrl }: any) => {
      return await orderRepository.addTracking(id, trackingNumber, trackingUrl)
    },
  },

  // Field resolvers
  User: {
    addresses: async (user: User) => {
      return await userRepository.getAddresses(user.id)
    },

    products: async (user: User) => {
      const result = await productRepository.findAll({ sellerId: user.id })
      return result.data
    },

    orders: async (user: User) => {
      const result = await orderRepository.findAll({ userId: user.id })
      return result.data
    },
  },

  Product: {
    seller: async (product: Product) => {
      return await userRepository.findById(product.sellerId)
    },

    images: async (product: Product) => {
      return product.images || []
    },
  },

  Order: {
    user: async (order: Order) => {
      return order.userId ? await userRepository.findById(order.userId) : null
    },

    items: async (order: Order) => {
      return order.items || []
    },
  },

  OrderItem: {
    product: async (orderItem: any) => {
      return await productRepository.findById(orderItem.productId)
    },

    seller: async (orderItem: any) => {
      return await userRepository.findById(orderItem.sellerId)
    },
  },
}
