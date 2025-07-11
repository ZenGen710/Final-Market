"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff, CreditCard, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CardIcon } from "./card-icons"
import { detectCardType, formatCardNumber, validateCardNumber, validateExpiryDate } from "@/lib/card-utils"

interface CardInputProps {
  onCardChange: (cardData: {
    number: string
    expiry: string
    cvc: string
    name: string
    isValid: boolean
  }) => void
}

export default function CardInput({ onCardChange }: CardInputProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvc, setCvc] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [showCvc, setShowCvc] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const cardType = detectCardType(cardNumber)

  useEffect(() => {
    const isCardNumberValid = validateCardNumber(cardNumber)
    const isExpiryValid = validateExpiryDate(expiryDate)
    const isCvcValid = cvc.length >= 3
    const isNameValid = cardholderName.trim().length > 0

    const isValid = isCardNumberValid && isExpiryValid && isCvcValid && isNameValid

    onCardChange({
      number: cardNumber.replace(/\D/g, ""),
      expiry: expiryDate,
      cvc,
      name: cardholderName,
      isValid,
    })

    // Update errors
    const newErrors: Record<string, string> = {}
    if (cardNumber && !isCardNumberValid) {
      newErrors.cardNumber = "Invalid card number"
    }
    if (expiryDate && !isExpiryValid) {
      newErrors.expiryDate = "Invalid expiry date"
    }
    if (cvc && cvc.length < 3) {
      newErrors.cvc = "Invalid CVC"
    }
    setErrors(newErrors)
  }, [cardNumber, expiryDate, cvc, cardholderName, onCardChange])

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const maxLength = cardType?.lengths[cardType.lengths.length - 1] || 19

    if (value.length <= maxLength) {
      setCardNumber(value)
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")

    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4)
    }

    if (value.length <= 5) {
      setExpiryDate(value)
    }
  }

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const maxLength = cardType?.code.size || 4

    if (value.length <= maxLength) {
      setCvc(value)
    }
  }

  return (
    <div className="space-y-4">
      {/* Card Number */}
      <div>
        <Label htmlFor="cardNumber" className="flex items-center space-x-2">
          <span>Card Number</span>
          <Lock className="h-3 w-3 text-gray-400" />
        </Label>
        <div className="relative">
          <Input
            id="cardNumber"
            type="text"
            placeholder="1234 5678 9012 3456"
            value={formatCardNumber(cardNumber, cardType)}
            onChange={handleCardNumberChange}
            className={`pr-12 ${errors.cardNumber ? "border-red-500" : ""}`}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {cardType ? (
              <CardIcon type={cardType.name.toLowerCase().replace(/\s+/g, "")} className="h-5 w-8" />
            ) : (
              <CreditCard className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
        {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
        {cardType && (
          <p className="text-sm text-gray-600 mt-1">
            {cardType.name} • {cardType.code.name} {cardType.code.size} digits
          </p>
        )}
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            type="text"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={handleExpiryChange}
            className={errors.expiryDate ? "border-red-500" : ""}
          />
          {errors.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>}
        </div>

        <div>
          <Label htmlFor="cvc" className="flex items-center space-x-2">
            <span>{cardType?.code.name || "CVC"}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => setShowCvc(!showCvc)}
            >
              {showCvc ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </Label>
          <Input
            id="cvc"
            type={showCvc ? "text" : "password"}
            placeholder={cardType?.code.size === 4 ? "1234" : "123"}
            value={cvc}
            onChange={handleCvcChange}
            className={errors.cvc ? "border-red-500" : ""}
          />
          {errors.cvc && <p className="text-sm text-red-500 mt-1">{errors.cvc}</p>}
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <Label htmlFor="cardholderName">Cardholder Name</Label>
        <Input
          id="cardholderName"
          type="text"
          placeholder="John Doe"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          className="uppercase"
        />
      </div>
    </div>
  )
}
