import { loadStripe } from "@stripe/stripe-js"

// Make sure to replace with your actual publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export { stripePromise }

export const formatAmountForStripe = (amount: number): number => {
  // Stripe expects amounts in cents
  return Math.round(amount * 100)
}

export const formatAmountFromStripe = (amount: number): number => {
  // Convert from cents to dollars
  return amount / 100
}
