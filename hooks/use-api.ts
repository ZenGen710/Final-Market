"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api/client"

export function useUsers(params?: any) {
  const [users, setUsers] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const result = await apiClient.getUsers(params)
      setUsers(result.data)
      setPagination(result.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers, JSON.stringify(params)])

  return { users, pagination, loading, error, refetch: () => fetchUsers() }
}

export function useProducts(params?: any) {
  const [products, setProducts] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const result = await apiClient.getProducts(params)
      setProducts(result.data)
      setPagination(result.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts, JSON.stringify(params)])

  return { products, pagination, loading, error, refetch: () => fetchProducts() }
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true)
      const result = await apiClient.getProduct(id)
      setProduct(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch product")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id, fetchProduct])

  return { product, loading, error, refetch: () => fetchProduct() }
}

export function useOrders(params?: any) {
  const [orders, setOrders] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const result = await apiClient.getOrders(params)
      setOrders(result.data)
      setPagination(result.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders, JSON.stringify(params)])

  return { orders, pagination, loading, error, refetch: () => fetchOrders() }
}

export function useCreateProduct() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProduct = async (productData: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.createProduct(productData)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create product"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { createProduct, loading, error }
}

export function useCreateOrder() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = async (orderData: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.createOrder(orderData)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create order"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { createOrder, loading, error }
}
