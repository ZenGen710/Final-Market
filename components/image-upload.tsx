"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void
  maxImages?: number
}

export default function ImageUpload({ onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter((file) => file.type.startsWith("image/"))

    if (images.length + validFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`)
      return
    }

    const newImages = [...images, ...validFiles]
    setImages(newImages)
    onImagesChange(newImages)

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)

    setImages(newImages)
    setPreviews(newPreviews)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <Card key={index} className="relative overflow-hidden">
            <Image
              src={preview || "/placeholder.svg"}
              alt={`Preview ${index + 1}`}
              width={200}
              height={200}
              className="w-full h-32 object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={() => removeImage(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Card>
        ))}

        {images.length < maxImages && (
          <Card
            className="border-dashed border-2 border-gray-300 hover:border-gray-400 cursor-pointer transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="h-32 flex flex-col items-center justify-center text-gray-500">
              <Plus className="h-8 w-8 mb-2" />
              <span className="text-sm">Add Photo</span>
            </div>
          </Card>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />

      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Upload className="h-4 w-4" />
        <span>Upload up to {maxImages} images (JPG, PNG, WebP)</span>
      </div>
    </div>
  )
}
