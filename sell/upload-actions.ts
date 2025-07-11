"use server"

import { put } from "@vercel/blob"
import { redirect } from "next/navigation"

export async function uploadImages(formData: FormData) {
  const files = formData.getAll("images") as File[]
  const uploadedUrls: string[] = []

  try {
    // Upload each image to Vercel Blob
    for (const file of files) {
      if (file.size > 0) {
        const blob = await put(`products/${Date.now()}-${file.name}`, file, {
          access: "public",
          addRandomSuffix: true,
        })
        uploadedUrls.push(blob.url)
      }
    }

    return { success: true, urls: uploadedUrls }
  } catch (error) {
    console.error("Error uploading images:", error)
    return { success: false, error: "Failed to upload images" }
  }
}

export async function createListingWithImages(formData: FormData) {
  // First upload images
  const imageFiles = formData.getAll("images") as File[]
  const imageUrls: string[] = []

  try {
    // Upload images to Vercel Blob
    for (const file of imageFiles) {
      if (file.size > 0) {
        const blob = await put(`products/${Date.now()}-${file.name}`, file, {
          access: "public",
          addRandomSuffix: true,
        })
        imageUrls.push(blob.url)
      }
    }

    // Get form data
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = formData.get("price") as string
    const category = formData.get("category") as string
    const condition = formData.get("condition") as string
    const location = formData.get("location") as string

    // In a real app, you would save this to a database
    const newListing = {
      id: Date.now().toString(),
      title,
      description,
      price: Number.parseFloat(price),
      category,
      condition,
      location,
      images: imageUrls,
      seller: {
        name: "Current User",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 5.0,
      },
      createdAt: new Date().toISOString(),
    }

    console.log("New listing created with images:", newListing)

    // Redirect to home page after successful creation
    redirect("/")
  } catch (error) {
    console.error("Error creating listing:", error)
    throw new Error("Failed to create listing")
  }
}
