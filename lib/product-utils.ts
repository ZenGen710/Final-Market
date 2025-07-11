import type { Product, ProductFilters } from "./types"

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((product) => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.location.toLowerCase().includes(searchTerm)

      if (!matchesSearch) return false
    }

    // Category filter
    if (filters.category && filters.category !== "all") {
      if (product.category !== filters.category) return false
    }

    // Condition filter
    if (filters.condition) {
      if (product.condition !== filters.condition) return false
    }

    // Price range filter
    if (filters.minPrice !== undefined) {
      if (product.price < filters.minPrice) return false
    }

    if (filters.maxPrice !== undefined) {
      if (product.price > filters.maxPrice) return false
    }

    // Location filter
    if (filters.location) {
      const locationTerm = filters.location.toLowerCase()
      if (!product.location.toLowerCase().includes(locationTerm)) return false
    }

    return true
  })
}

export function sortProducts(products: Product[], sortBy: string): Product[] {
  const sorted = [...products]

  switch (sortBy) {
    case "newest":
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    case "oldest":
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    case "price-low":
      return sorted.sort((a, b) => a.price - b.price)

    case "price-high":
      return sorted.sort((a, b) => b.price - a.price)

    case "featured":
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })

    default:
      return sorted
  }
}

export function paginateProducts(products: Product[], page: number, itemsPerPage: number) {
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  return {
    products: products.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(products.length / itemsPerPage),
      totalItems: products.length,
      itemsPerPage,
    },
  }
}
