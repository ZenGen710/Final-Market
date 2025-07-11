"use client"

import { Elements } from "@stripe/react-stripe-js"
import { stripePromise } from "@/lib/stripe"
import StripePaymentForm from "./stripe-payment-form"

interface StripeCheckoutProps {
  clientSecret: string
  amount: number
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

export default function StripeCheckout({ clientSecret, amount, onSuccess, onError }: StripeCheckoutProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#2563eb",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        fontFamily: "Inter, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "6px",
      },
    },
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <StripePaymentForm clientSecret={clientSecret} amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  )
}
