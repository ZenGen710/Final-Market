"use client"

import { useState } from "react"
import { Camera, Mail, Phone, Calendar, Edit2, Save, X } from "lucide-react"
import Header from "@/components/header"
import ProtectedRoute from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth/context"

export default function ProfilePage() {
  const { state, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: state.user?.firstName || "",
    lastName: state.user?.lastName || "",
    phone: state.user?.phone || "",
    dateOfBirth: state.user?.dateOfBirth || "",
  })

  const handleSave = async () => {
    try {
      await updateUser(formData)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: state.user?.firstName || "",
      lastName: state.user?.lastName || "",
      phone: state.user?.phone || "",
      dateOfBirth: state.user?.dateOfBirth || "",
    })
    setIsEditing(false)
  }

  return (
    <ProtectedRoute>
      <div>
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={state.user?.avatarUrl || "/placeholder.svg"} alt={state.user?.firstName} />
                      <AvatarFallback className="text-lg">
                        {state.user?.firstName?.[0]}
                        {state.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      variant="secondary"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold">
                          {state.user?.firstName} {state.user?.lastName}
                        </h1>
                        <p className="text-gray-600">{state.user?.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant={state.user?.role === "seller" ? "default" : "secondary"}>
                            {state.user?.role === "seller" ? "Seller" : "Buyer"}
                          </Badge>
                          {state.user?.isVerified && <Badge variant="outline">Verified</Badge>}
                        </div>
                      </div>

                      <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "default"}>
                        {isEditing ? (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </>
                        ) : (
                          <>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit Profile
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details */}
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList>
                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        {isEditing ? (
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                            <span>{state.user?.firstName}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        {isEditing ? (
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                            <span>{state.user?.lastName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{state.user?.email}</span>
                        <Badge variant="outline" className="ml-auto">
                          {state.user?.isVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{state.user?.phone || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      {isEditing ? (
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>
                            {state.user?.dateOfBirth
                              ? new Date(state.user.dateOfBirth).toLocaleDateString()
                              : "Not provided"}
                          </span>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex space-x-2 pt-4">
                        <Button onClick={handleSave}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security and password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Password</h3>
                          <p className="text-sm text-gray-600">Last updated 30 days ago</p>
                        </div>
                        <Button variant="outline">Change Password</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-600">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline">Enable 2FA</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Login Sessions</h3>
                          <p className="text-sm text-gray-600">Manage your active sessions</p>
                        </div>
                        <Button variant="outline">View Sessions</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your marketplace experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-600">Receive updates about your orders and account</p>
                        </div>
                        <Button variant="outline">Manage</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Privacy Settings</h3>
                          <p className="text-sm text-gray-600">Control who can see your profile information</p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Account Deletion</h3>
                          <p className="text-sm text-gray-600">Permanently delete your account and data</p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
