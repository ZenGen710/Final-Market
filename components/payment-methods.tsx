import { CreditCard, Smartphone, Shield, Zap } from "lucide-react"

export default function PaymentMethods() {
  const features = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "256-bit SSL encryption",
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Real-time payment confirmation",
    },
    {
      icon: CreditCard,
      title: "All Major Cards",
      description: "Visa, Mastercard, Amex, Discover",
    },
    {
      icon: Smartphone,
      title: "Mobile Wallets",
      description: "Apple Pay, Google Pay (coming soon)",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="text-center py-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">We accept all major payment methods:</p>
        <div className="flex justify-center items-center space-x-3">
          <img src="/placeholder.svg?height=32&width=50" alt="Visa" className="h-8" />
          <img src="/placeholder.svg?height=32&width=50" alt="Mastercard" className="h-8" />
          <img src="/placeholder.svg?height=32&width=50" alt="American Express" className="h-8" />
          <img src="/placeholder.svg?height=32&width=50" alt="Discover" className="h-8" />
          <img src="/placeholder.svg?height=32&width=50" alt="Apple Pay" className="h-8 opacity-50" />
          <img src="/placeholder.svg?height=32&width=50" alt="Google Pay" className="h-8 opacity-50" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <Icon className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-xs font-medium">{feature.title}</p>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
