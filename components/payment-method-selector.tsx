"use client"

import { useState } from "react"
import { CreditCard, Smartphone, Wallet, Building } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import CardInput from "./card-input"

interface PaymentMethodSelectorProps {
  onPaymentMethodChange: (method: {
    type: string
    cardData?: any
    isValid: boolean
  }) => void
}

export default function PaymentMethodSelector({ onPaymentMethodChange }: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState("card")
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    isValid: false,
  })

  const paymentMethods = [
    {
      id: "card",
      name: "Credit or Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, American Express, Discover",
      popular: true,
    },
    {
      id: "apple_pay",
      name: "Apple Pay",
      icon: Smartphone,
      description: "Pay with Touch ID or Face ID",
      disabled: true,
    },
    {
      id: "google_pay",
      name: "Google Pay",
      icon: Wallet,
      description: "Pay with your Google account",
      disabled: true,
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: Building,
      description: "Direct bank account transfer",
      disabled: true,
    },
  ]

  const handleMethodChange = (method: string) => {
    setSelectedMethod(method)

    if (method === "card") {
      onPaymentMethodChange({
        type: method,
        cardData,
        isValid: cardData.isValid,
      })
    } else {
      onPaymentMethodChange({
        type: method,
        isValid: false, // Other methods not implemented yet
      })
    }
  }

  const handleCardDataChange = (newCardData: typeof cardData) => {
    setCardData(newCardData)

    if (selectedMethod === "card") {
      onPaymentMethodChange({
        type: "card",
        cardData: newCardData,
        isValid: newCardData.isValid,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>

        <RadioGroup value={selectedMethod} onValueChange={handleMethodChange} className="space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <div key={method.id}>
                <Label
                  htmlFor={method.id}
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedMethod === method.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  } ${method.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <RadioGroupItem value={method.id} id={method.id} disabled={method.disabled} />
                  <Icon className="h-5 w-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{method.name}</span>
                      {method.popular && (
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      )}
                      {method.disabled && (
                        <Badge variant="outline" className="text-xs">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </div>

      {/* Card Input Form */}
      {selectedMethod === "card" && (
        <Card>
          <CardContent className="p-6">
            <CardInput onCardChange={handleCardDataChange} />
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">🔒</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm">Secure Payment</h4>
            <p className="text-sm text-gray-600">
              Your payment information is encrypted and processed securely by Stripe. We never store your card details
              on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
