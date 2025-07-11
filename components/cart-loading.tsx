import { Loader2 } from "lucide-react"

interface CartLoadingProps {
  message?: string
}

export default function CartLoading({ message = "Loading..." }: CartLoadingProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  )
}
