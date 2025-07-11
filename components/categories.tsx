import { categories } from "@/lib/data"
import { Button } from "@/components/ui/button"

export default function Categories() {
  return (
    <div className="bg-white py-6 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold mb-4">Browse Categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Button key={category.id} variant="outline" className="flex items-center space-x-2 h-auto py-3 px-4">
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
