"use server"

import { redirect } from "next/navigation"

export async function createListing(formData: FormData) {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const price = formData.get("price") as string
  const category = formData.get("category") as string
  const condition = formData.get("condition") as string
  const location = formData.get("location") as string

  // In a real app, you would save this to a database
  console.log("New listing created:", {
    title,
    description,
    price: Number.parseFloat(price),
    category,
    condition,
    location,
  })

  // Redirect to home page after successful creation
  redirect("/")
}
