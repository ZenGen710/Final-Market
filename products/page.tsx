"use client"

import { useState, useMemo } from "react"
import Header from "@/components/header"
import ProductCard from "@/components/product-card"
import ProductFiltersComponent from "@/components/product-filters"
import ProductSort from "@/components/product-sort"
import Pagination from "@/components/pagination"
import { mockProducts } from "@/lib/data"
import { filterProducts, sortProducts, paginateProducts } from "@/lib/product-utils"
import type { ProductFilters } from "@/lib/types"

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({ sortBy: "featured" })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const filteredAndSortedProducts = useMemo(() => {
    let products = filterProducts(mockProducts, filters)
    products = sortProducts(products, filters.sortBy || "featured")
    return products
  }, [filters])

  const paginatedData = useMemo(() => {
    return paginateProducts(filteredAndSortedProducts, currentPage, itemsPerPage)
  }, [filteredAndSortedProducts, currentPage])

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSortChange = (sortBy: string) => {
    setFilters({ ...filters, sortBy })
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <p className="text-gray-600">Discover amazing items from our community</p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ProductFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            totalResults={filteredAndSortedProducts.length}
          />
        </div>

        {/* Sort */}
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <ProductSort sortBy={filters.sortBy || "featured"} onSortChange={handleSortChange} />
        </div>

        {/* Products Grid */}
        {paginatedData.products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedData.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination pagination={paginatedData.pagination} onPageChange={handlePageChange} />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <button onClick={() => handleFiltersChange({})} className="text-blue-600 hover:text-blue-800 font-medium">
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
