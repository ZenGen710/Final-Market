"use client"

import { useState, useEffect } from "react"
import { detectCardType, validateCardNumber, validateExpiryDate } from "@/lib/card-utils"

interface CardData {
  number: string
  expiry: string
  cvc: string
  name: string
}

interface ValidationErrors {
  number?: string
  expiry?: string
  cvc?: string
  name?: string
}

export function useCardValidation(cardData: CardData) {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isValid, setIsValid] = useState(false)
  const [cardType, setCardType] = useState<any>(null)

  useEffect(() => {
    const newErrors: ValidationErrors = {}
    const detectedCardType = detectCardType(cardData.number)
    setCardType(detectedCardType)

    // Validate card number
    if (cardData.number && !validateCardNumber(cardData.number)) {
      newErrors.number = "Invalid card number"
    }

    // Validate expiry date
    if (cardData.expiry && !validateExpiryDate(cardData.expiry)) {
      newErrors.expiry = "Invalid or expired date"
    }

    // Validate CVC
    if (cardData.cvc) {
      const expectedLength = detectedCardType?.code.size || 3
      if (cardData.cvc.length < expectedLength) {
        newErrors.cvc = `${detectedCardType?.code.name || "CVC"} must be ${expectedLength} digits`
      }
    }

    // Validate name
    if (cardData.name && cardData.name.trim().length < 2) {
      newErrors.name = "Please enter the cardholder name"
    }

    setErrors(newErrors)

    // Check if all fields are valid
    const allFieldsValid =
      validateCardNumber(cardData.number) &&
      validateExpiryDate(cardData.expiry) &&
      cardData.cvc.length >= (detectedCardType?.code.size || 3) &&
      cardData.name.trim().length >= 2

    setIsValid(allFieldsValid)
  }, [cardData])

  return {
    errors,
    isValid,
    cardType,
  }
}
