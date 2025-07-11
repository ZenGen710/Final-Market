import { sql, createQueryBuilder } from "../database/connection"
import type { Product, ProductImage, ProductFilters, PaginatedResponse, PaginationParams } from "../types/database"

export class ProductRepository {
  async findById(id: string): Promise<Product | null> {
    const result = await sql`
      SELECT p.*, 
             u.first_name as seller_first_name, u.last_name as seller_last_name,
             u.avatar_url as seller_avatar_url, u.email as seller_email,
             c.name as category_name, c.slug as category_slug,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = true
      WHERE p.id = ${id} AND p.is_active = true
      GROUP BY p.id, u.id, c.id
    `

    if (!result[0]) return null

    const product = result[0]

    // Get product images
    const images = await sql`
      SELECT * FROM product_images 
      WHERE product_id = ${id}
      ORDER BY sort_order ASC, created_at ASC
    `

    return {
      ...product,
      images,
      seller: {
        firstName: product.seller_first_name,
        lastName: product.seller_last_name,
        avatarUrl: product.seller_avatar_url,
        email: product.seller_email,
      },
      category: {
        name: product.category_name,
        slug: product.category_slug,
      },
      averageRating: Number.parseFloat(product.average_rating),
      reviewCount: Number.parseInt(product.review_count),
    }
  }

  async findAll(filters: ProductFilters = {}, params: PaginationParams = {}): Promise<PaginatedResponse<Product>> {
    const { page = 1, limit = 20, sortBy = "created_at", sortOrder = "desc" } = params
    const offset = (page - 1) * limit

    let query = createQueryBuilder()
      .select(`
        p.*, 
        u.first_name as seller_first_name, u.last_name as seller_last_name,
        u.avatar_url as seller_avatar_url,
        c.name as category_name, c.slug as category_slug,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as review_count
      `)
      .from("products p")
      .leftJoin("users u", "p.seller_id = u.id")
      .leftJoin("categories c", "p.category_id = c.id")
      .leftJoin("reviews r", "p.id = r.product_id AND r.is_approved = true")
      .where("p.is_active = true")

    // Apply filters
    if (filters.search) {
      query = query
        .where(`(p.title ILIKE ? OR p.description ILIKE ?)`, `%${filters.search}%`)
        .where(`(p.title ILIKE ? OR p.description ILIKE ?)`, `%${filters.search}%`)
    }

    if (filters.categoryId) {
      query = query.where("p.category_id = ?", filters.categoryId)
    }

    if (filters.sellerId) {
      query = query.where("p.seller_id = ?", filters.sellerId)
    }

    if (filters.condition) {
      query = query.where("p.condition = ?", filters.condition)
    }

    if (filters.minPrice !== undefined) {
      query = query.where("p.price >= ?", filters.minPrice)
    }

    if (filters.maxPrice !== undefined) {
      query = query.where("p.price <= ?", filters.maxPrice)
    }

    if (filters.isFeatured !== undefined) {
      query = query.where("p.is_featured = ?", filters.isFeatured)
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.where("p.tags && ?", filters.tags)
    }

    // Add grouping, ordering, and pagination
    const { query: queryString, params: queryParams } = query
      .orderBy(`p.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC")
      .limit(limit)
      .offset(offset)
      .build()

    const finalQuery = queryString.replace("SELECT", "SELECT") + " GROUP BY p.id, u.id, c.id"

    const products = await sql(finalQuery, queryParams)

    // Get total count
    let countQuery = createQueryBuilder()
      .select("COUNT(DISTINCT p.id) as count")
      .from("products p")
      .where("p.is_active = true")

    // Apply same filters for count
    if (filters.search) {
      countQuery = countQuery.where(`(p.title ILIKE ? OR p.description ILIKE ?)`, `%${filters.search}%`)
    }
    if (filters.categoryId) {
      countQuery = countQuery.where("p.category_id = ?", filters.categoryId)
    }
    // ... apply other filters

    const totalResult = await countQuery.execute()
    const total = Number.parseInt(totalResult[0].count)

    return {
      data: products.map((product) => ({
        ...product,
        averageRating: Number.parseFloat(product.average_rating),
        reviewCount: Number.parseInt(product.review_count),
      })),
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

  async create(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const result = await sql`
      INSERT INTO products (
        seller_id, category_id, title, slug, description, price, compare_at_price,
        condition, brand, model, stock_quantity, is_featured, is_active, status,
        tags, location, shipping_required
      ) VALUES (
        ${productData.sellerId}, ${productData.categoryId}, ${productData.title},
        ${productData.slug}, ${productData.description}, ${productData.price},
        ${productData.compareAtPrice}, ${productData.condition}, ${productData.brand},
        ${productData.model}, ${productData.stockQuantity}, ${productData.isFeatured},
        ${productData.isActive}, ${productData.status}, ${productData.tags},
        ${JSON.stringify(productData.location)}, ${productData.shippingRequired}
      )
      RETURNING *
    `
    return result[0]
  }

  async update(id: string, productData: Partial<Product>): Promise<Product | null> {
    // Build dynamic update query
    const updateFields = Object.entries(productData)
      .filter(([key]) => !["id", "createdAt", "updatedAt"].includes(key))
      .map(([key, value]) => `${key} = ${typeof value === "object" ? `'${JSON.stringify(value)}'` : `'${value}'`}`)
      .join(", ")

    if (!updateFields) return null

    const result = await sql`
      UPDATE products 
      SET ${sql.unsafe(updateFields)}
      WHERE id = ${id}
      RETURNING *
    `
    return result[0] || null
  }

  async delete(id: string): Promise<boolean> {
    const result = await sql`
      UPDATE products SET is_active = false WHERE id = ${id}
    `
    return result.count > 0
  }

  async addImages(productId: string, images: Omit<ProductImage, "id" | "createdAt">[]): Promise<ProductImage[]> {
    const values = images
      .map((img) => `('${productId}', '${img.url}', '${img.altText || ""}', ${img.sortOrder}, ${img.isPrimary})`)
      .join(", ")

    const result = await sql`
      INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
      VALUES ${sql.unsafe(values)}
      RETURNING *
    `
    return result
  }
}

export const productRepository = new ProductRepository()
