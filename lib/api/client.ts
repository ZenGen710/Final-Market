import type { ApiResponse, PaginatedResponse } from "../types/database"

class ApiClient {
  private baseUrl: string

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Generic CRUD methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }

  // User methods
  async getUsers(params?: any): Promise<PaginatedResponse<any>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
    const response = await this.get<any>(`/users${queryString}`)
    return response.data!
  }

  async getUser(id: string) {
    const response = await this.get<any>(`/users/${id}`)
    return response.data
  }

  async createUser(userData: any) {
    const response = await this.post<any>("/users", userData)
    return response.data
  }

  async updateUser(id: string, userData: any) {
    const response = await this.put<any>(`/users/${id}`, userData)
    return response.data
  }

  async deleteUser(id: string) {
    return await this.delete(`/users/${id}`)
  }

  // Product methods
  async getProducts(params?: any): Promise<PaginatedResponse<any>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
    const response = await this.get<any>(`/products${queryString}`)
    return response.data!
  }

  async getProduct(id: string) {
    const response = await this.get<any>(`/products/${id}`)
    return response.data
  }

  async createProduct(productData: any) {
    const response = await this.post<any>("/products", productData)
    return response.data
  }

  async updateProduct(id: string, productData: any) {
    const response = await this.put<any>(`/products/${id}`, productData)
    return response.data
  }

  async deleteProduct(id: string) {
    return await this.delete(`/products/${id}`)
  }

  // Order methods
  async getOrders(params?: any): Promise<PaginatedResponse<any>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
    const response = await this.get<any>(`/orders${queryString}`)
    return response.data!
  }

  async getOrder(id: string) {
    const response = await this.get<any>(`/orders/${id}`)
    return response.data
  }

  async createOrder(orderData: any) {
    const response = await this.post<any>("/orders", orderData)
    return response.data
  }

  async updateOrderStatus(id: string, statusData: any) {
    const response = await this.put<any>(`/orders/${id}/status`, statusData)
    return response.data
  }
}

export const apiClient = new ApiClient()
