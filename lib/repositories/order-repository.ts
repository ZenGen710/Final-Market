import { sql, createQueryBuilder } from "../database/connection"
import type { Order, OrderItem, OrderFilters, PaginatedResponse, PaginationParams } from "../types/database"

export class OrderRepository {
  async findById(id: string): Promise<Order | null> {
    const result = await sql`
      SELECT o.*, 
             u.first_name as user_first_name, u.last_name as user_last_name,
             u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ${id}
    `

    if (!result[0]) return null

    const order = result[0]

    // Get order items
    const items = await sql`
      SELECT oi.*, 
             p.title as product_title, p.slug as product_slug,
             u.first_name as seller_first_name, u.last_name as seller_last_name
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN users u ON oi.seller_id = u.id
      WHERE oi.order_id = ${id}
      ORDER BY oi.created_at ASC
    `

    return {
      ...order,
      user: order.user_first_name
        ? {
            firstName: order.user_first_name,
            lastName: order.user_last_name,
            email: order.user_email,
          }
        : undefined,
      items,
    }
  }

  async findAll(filters: OrderFilters = {}, params: PaginationParams = {}): Promise<PaginatedResponse<Order>> {
    const { page = 1, limit = 20, sortBy = "created_at", sortOrder = "desc" } = params
    const offset = (page - 1) * limit

    let query = createQueryBuilder()
      .select("o.*, u.first_name as user_first_name, u.last_name as user_last_name")
      .from("orders o")
      .leftJoin("users u", "o.user_id = u.id")

    // Apply filters
    if (filters.userId) {
      query = query.where("o.user_id = ?", filters.userId)
    }

    if (filters.status) {
      query = query.where("o.status = ?", filters.status)
    }

    if (filters.financialStatus) {
      query = query.where("o.financial_status = ?", filters.financialStatus)
    }

    if (filters.dateFrom) {
      query = query.where("o.created_at >= ?", filters.dateFrom)
    }

    if (filters.dateTo) {
      query = query.where("o.created_at <= ?", filters.dateTo)
    }

    const orders = await query
      .orderBy(`o.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC")
      .limit(limit)
      .offset(offset)
      .execute()

    // Get total count with same filters
    let countQuery = createQueryBuilder().select("COUNT(*) as count").from("orders o")

    if (filters.userId) {
      countQuery = countQuery.where("o.user_id = ?", filters.userId)
    }
    // ... apply other filters

    const totalResult = await countQuery.execute()
    const total = Number.parseInt(totalResult[0].count)

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    }
  }

  async create(
    orderData: Omit<Order, "id" | "createdAt" | "updatedAt">,
    items: Omit<OrderItem, "id" | "orderId" | "createdAt" | "updatedAt">[],
  ): Promise<Order> {
    // Start transaction
    const result = await sql.begin(async (sql) => {
      // Create order
      const [order] = await sql`
        INSERT INTO orders (
          order_number, user_id, email, status, financial_status, fulfillment_status,
          subtotal, tax_amount, shipping_amount, discount_amount, total_amount,
          shipping_address, billing_address, payment_method, payment_gateway,
          payment_gateway_transaction_id, shipping_method, source
        ) VALUES (
          ${orderData.orderNumber}, ${orderData.userId}, ${orderData.email},
          ${orderData.status}, ${orderData.financialStatus}, ${orderData.fulfillmentStatus},
          ${orderData.subtotal}, ${orderData.taxAmount}, ${orderData.shippingAmount},
          ${orderData.discountAmount}, ${orderData.totalAmount},
          ${JSON.stringify(orderData.shippingAddress)}, ${JSON.stringify(orderData.billingAddress)},
          ${orderData.paymentMethod}, ${orderData.paymentGateway},
          ${orderData.paymentGatewayTransactionId}, ${orderData.shippingMethod}, ${orderData.source}
        )
        RETURNING *
      `

      // Create order items
      const orderItems = []
      for (const item of items) {
        const [orderItem] = await sql`
          INSERT INTO order_items (
            order_id, product_id, variant_id, seller_id, title, variant_title,
            sku, quantity, price, compare_at_price, total_discount, product_snapshot
          ) VALUES (
            ${order.id}, ${item.productId}, ${item.variantId}, ${item.sellerId},
            ${item.title}, ${item.variantTitle}, ${item.sku}, ${item.quantity},
            ${item.price}, ${item.compareAtPrice}, ${item.totalDiscount},
            ${JSON.stringify(item.productSnapshot)}
          )
          RETURNING *
        `
        orderItems.push(orderItem)
      }

      return { ...order, items: orderItems }
    })

    return result
  }

  async updateStatus(
    id: string,
    status: string,
    financialStatus?: string,
    fulfillmentStatus?: string,
  ): Promise<Order | null> {
    const updates = [`status = '${status}'`]

    if (financialStatus) {
      updates.push(`financial_status = '${financialStatus}'`)
    }

    if (fulfillmentStatus) {
      updates.push(`fulfillment_status = '${fulfillmentStatus}'`)
    }

    const result = await sql`
      UPDATE orders 
      SET ${sql.unsafe(updates.join(", "))}
      WHERE id = ${id}
      RETURNING *
    `
    return result[0] || null
  }

  async addTracking(id: string, trackingNumber: string, trackingUrl?: string): Promise<Order | null> {
    const result = await sql`
      UPDATE orders 
      SET tracking_number = ${trackingNumber}, 
          tracking_url = ${trackingUrl},
          shipped_at = NOW(),
          status = 'shipped',
          fulfillment_status = 'fulfilled'
      WHERE id = ${id}
      RETURNING *
    `
    return result[0] || null
  }
}

export const orderRepository = new OrderRepository()
