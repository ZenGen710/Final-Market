"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface ProductSortProps {
  sortBy: string
  onSortChange: (sortBy: string) => void
}

export default function ProductSort({ sortBy, onSortChange }: ProductSortProps) {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="sort" className="text-sm font-medium whitespace-nowrap">
        Sort by:
      </Label>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">Featured First</SelectItem>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
