"use client"
import { CreditCard, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CardIcon } from "./card-icons"

interface SavedCard {
  id: string
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
}

interface SavedCardsProps {
  cards: SavedCard[]
  selectedCardId?: string
  onCardSelect: (cardId: string) => void
  onAddNewCard: () => void
  onDeleteCard: (cardId: string) => void
}

export default function SavedCards({
  cards,
  selectedCardId,
  onCardSelect,
  onAddNewCard,
  onDeleteCard,
}: SavedCardsProps) {
  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-medium mb-2">No saved cards</h3>
          <p className="text-sm text-gray-600 mb-4">Add a payment method to get started</p>
          <Button onClick={onAddNewCard} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Payment Method</span>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Saved Payment Methods</span>
          <Button variant="outline" size="sm" onClick={onAddNewCard}>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedCardId} onValueChange={onCardSelect} className="space-y-3">
          {cards.map((card) => (
            <div key={card.id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value={card.id} id={card.id} />
              <CardIcon type={card.brand} className="h-6 w-10" />
              <div className="flex-1">
                <Label htmlFor={card.id} className="cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">•••• •••• •••• {card.last4}</span>
                    {card.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Expires {card.expiryMonth.toString().padStart(2, "0")}/{card.expiryYear.toString().slice(-2)}
                  </p>
                </Label>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteCard(card.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
