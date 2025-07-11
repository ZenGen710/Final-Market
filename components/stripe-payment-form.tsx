"use client"

import type React from "react"
import { useState } from "react"
import { useStripe, useElements, PaymentElement, AddressElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Shield, Truck } from "lucide-react"

interface StripePaymentFormProps {
  clientSecret: string
  amount: number
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

export default function StripePaymentForm({ clientSecret, amount, onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<any>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      })

      if (error) {
        setErrorMessage(error.message || "An error occurred during payment")
        onError(error.message || "Payment failed")
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent.id)
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred")
      onError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Shipping Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddressElement
            options={{
              mode: "shipping",
              allowedCountries: ["US"],
              fields: {
                phone: "always",
              },
              validation: {
                phone: {
                  required: "always",
                },
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement
            options={{
              layout: {
                type: "tabs",
                defaultCollapsed: false,
              },
              fields: {
                billingDetails: {
                  name: "auto",
                  email: "auto",
                  phone: "auto",
                  address: {
                    country: "auto",
                    line1: "auto",
                    line2: "auto",
                    city: "auto",
                    state: "auto",
                    postalCode: "auto",
                  },
                },
              },
              terms: {
                card: "auto",
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Payment Features */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Secure Encryption</p>
                <p className="text-xs text-gray-600">256-bit SSL protection</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">All Major Cards</p>
                <p className="text-xs text-gray-600">Visa, MC, Amex, Discover</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">3D</span>
              </div>
              <div>
                <p className="font-medium text-sm">3D Secure</p>
                <p className="text-xs text-gray-600">Extra fraud protection</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Security Notice */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <Shield className="h-4 w-4" />
        <span>Your payment information is secure and encrypted with Stripe</span>
      </div>

      {/* Submit Button */}
      <Button type="submit" size="lg" className="w-full" disabled={!stripe || !elements || isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Shield className="h-4 w-4 mr-2" />
            Complete Secure Payment - ${amount.toFixed(2)}
          </>
        )}
      </Button>

      {/* Payment Methods Accepted */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">We accept:</p>
        <div className="flex justify-center items-center space-x-2">
          <img src="/placeholder.svg?height=24&width=38" alt="Visa" className="h-6" />
          <img src="/placeholder.svg?height=24&width=38" alt="Mastercard" className="h-6" />
          <img src="/placeholder.svg?height=24&width=38" alt="American Express" className="h-6" />
          <img src="/placeholder.svg?height=24&width=38" alt="Discover" className="h-6" />
          <img src="/placeholder.svg?height=24&width=38" alt="Apple Pay" className="h-6" />
          <img src="/placeholder.svg?height=24&width=38" alt="Google Pay" className="h-6" />
        </div>
      </div>
    </form>
  )
}
