export interface CardType {
  name: string
  pattern: RegExp
  gaps: number[]
  lengths: number[]
  code: {
    name: string
    size: number
  }
}

export const cardTypes: Record<string, CardType> = {
  visa: {
    name: "Visa",
    pattern: /^4/,
    gaps: [4, 8, 12],
    lengths: [13, 16, 19],
    code: {
      name: "CVV",
      size: 3,
    },
  },
  mastercard: {
    name: "Mastercard",
    pattern: /^(5[1-5]|2[2-7])/,
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: "CVC",
      size: 3,
    },
  },
  amex: {
    name: "American Express",
    pattern: /^3[47]/,
    gaps: [4, 10],
    lengths: [15],
    code: {
      name: "CID",
      size: 4,
    },
  },
  discover: {
    name: "Discover",
    pattern: /^6(?:011|5)/,
    gaps: [4, 8, 12],
    lengths: [16, 19],
    code: {
      name: "CID",
      size: 3,
    },
  },
  dinersclub: {
    name: "Diners Club",
    pattern: /^3[068]/,
    gaps: [4, 10],
    lengths: [14],
    code: {
      name: "CVV",
      size: 3,
    },
  },
  jcb: {
    name: "JCB",
    pattern: /^35/,
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: "CVV",
      size: 3,
    },
  },
}

export function detectCardType(number: string): CardType | null {
  const cleanNumber = number.replace(/\D/g, "")

  for (const [key, cardType] of Object.entries(cardTypes)) {
    if (cardType.pattern.test(cleanNumber)) {
      return cardType
    }
  }

  return null
}

export function formatCardNumber(number: string, cardType?: CardType | null): string {
  const cleanNumber = number.replace(/\D/g, "")
  const gaps = cardType?.gaps || [4, 8, 12]

  let formatted = ""
  let gapIndex = 0

  for (let i = 0; i < cleanNumber.length; i++) {
    if (gapIndex < gaps.length && i === gaps[gapIndex]) {
      formatted += " "
      gapIndex++
    }
    formatted += cleanNumber[i]
  }

  return formatted
}

export function validateCardNumber(number: string): boolean {
  const cleanNumber = number.replace(/\D/g, "")

  // Luhn algorithm
  let sum = 0
  let isEven = false

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(cleanNumber[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0 && cleanNumber.length >= 13
}

export function validateExpiryDate(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return false

  const month = Number.parseInt(match[1])
  const year = Number.parseInt(`20${match[2]}`)

  if (month < 1 || month > 12) return false

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false
  }

  return true
}
