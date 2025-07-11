"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import ImageUpload from "@/components/image-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { categories } from "@/lib/data"
import { createListingWithImages } from "./upload-actions"

export default function SellPage() {
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)

    try {
      // Add images to form data
      images.forEach((image, index) => {
        formData.append("images", image)
      })

      await createListingWithImages(formData)
    } catch (error) {
      console.error("Error submitting listing:", error)
      alert("Failed to create listing. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">List Your Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Photos *</Label>
                <ImageUpload onImagesChange={setImages} maxImages={5} />
                <p className="text-sm text-gray-500 mt-2">Add at least one photo to help buyers see your item</p>
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" placeholder="What are you selling?" required />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your item in detail..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="0.00" required />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select name="condition" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like-new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input id="location" name="location" placeholder="City, State" required />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || images.length === 0}>
                {isSubmitting ? "Creating Listing..." : "List Item"}
              </Button>

              {images.length === 0 && (
                <p className="text-sm text-red-500 text-center">Please add at least one photo to continue</p>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
