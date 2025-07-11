"use client"

import { CreditCard } from "lucide-react"

interface CardIconProps {
  type: string
  className?: string
}

export function CardIcon({ type, className = "h-6 w-10" }: CardIconProps) {
  const icons: Record<string, string> = {
    visa: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNTFBNSIvPgo8cGF0aCBkPSJNMTYuNzUgN0gxNC4yNUwxMi41IDE3SDE1TDE2Ljc1IDdaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjMuMjUgN0gyMC43NUwxOSAxN0gyMS41TDIzLjI1IDdaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K",
    mastercard:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0VCMDAxQiIvPgo8Y2lyY2xlIGN4PSIxNSIgY3k9IjEyIiByPSI3IiBmaWxsPSIjRkY1RjAwIi8+CjxjaXJjbGUgY3g9IjI1IiBjeT0iMTIiIHI9IjciIGZpbGw9IiNGRkY1RjAiLz4KPC9zdmc+",
    amex: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNkZDRiIvPgo8dGV4dCB4PSIyMCIgeT0iMTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QU1FWDWVYDC90ZXh0Pgo8L3N2Zz4K",
    discover:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0ZGNjAwMCIvPgo8dGV4dCB4PSIyMCIgeT0iMTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RElTQ09WRVI8L3RleHQ+Cjwvc3ZnPg==",
  }

  if (icons[type]) {
    return <img src={icons[type] || "/placeholder.svg"} alt={type} className={className} />
  }

  return <CreditCard className={className} />
}

export function CardBrandSelector({
  selectedBrands,
  onBrandToggle,
}: {
  selectedBrands: string[]
  onBrandToggle: (brand: string) => void
}) {
  const brands = [
    { id: "visa", name: "Visa" },
    { id: "mastercard", name: "Mastercard" },
    { id: "amex", name: "American Express" },
    { id: "discover", name: "Discover" },
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Accepted Cards</h3>
      <div className="grid grid-cols-2 gap-3">
        {brands.map((brand) => (
          <button
            key={brand.id}
            type="button"
            onClick={() => onBrandToggle(brand.id)}
            className={`flex items-center space-x-2 p-3 border rounded-lg transition-colors ${
              selectedBrands.includes(brand.id) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <CardIcon type={brand.id} className="h-5 w-8" />
            <span className="text-sm font-medium">{brand.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
