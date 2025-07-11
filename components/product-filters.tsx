"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { categories } from "@/lib/data"
import type { ProductFilters } from "@/lib/types"

interface ProductFiltersProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  totalResults: number
}

export default function ProductFiltersComponent({ filters, onFiltersChange, totalResults }: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== "" && value !== "all",
  ).length

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search products, descriptions, or locations..."
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>

        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {totalResults} {totalResults === 1 ? "result" : "results"} found
        </p>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600">
            <X className="h-3 w-3 mr-1" />
            Clear all filters
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category && filters.category !== "all" && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Category: {categories.find((c) => c.id === filters.category)?.name}</span>
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("category", undefined)} />
            </Badge>
          )}

          {filters.condition && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Condition: {filters.condition}</span>
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("condition", undefined)} />
            </Badge>
          )}

          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>
                Price: ${filters.minPrice || 0} - ${filters.maxPrice || "∞"}
              </span>
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  updateFilter("minPrice", undefined)
                  updateFilter("maxPrice", undefined)
                }}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Detailed Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={filters.category || "all"} onValueChange={(value) => updateFilter("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Condition Filter */}
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={filters.condition || ""}
                  onValueChange={(value) => updateFilter("condition", value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Condition</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like-new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <Label htmlFor="minPrice">Min Price ($)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ""}
                  onChange={(e) => updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>

              <div>
                <Label htmlFor="maxPrice">Max Price ($)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="No limit"
                  value={filters.maxPrice || ""}
                  onChange={(e) => updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter city or state..."
                value={filters.location || ""}
                onChange={(e) => updateFilter("location", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
