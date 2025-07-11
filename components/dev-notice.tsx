"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, AlertTriangle, Database } from "lucide-react"

interface DatabaseStatus {
  connected: boolean
  hasUrl: boolean
  urlSource?: string
  urlPreview?: string
  error?: string
  details?: string
}

export default function DevNotice() {
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkDatabaseStatus = async () => {
      try {
        const response = await fetch("/api/health")
        const data = await response.json()
        setDbStatus(data.database)
      } catch (error) {
        console.error("Failed to check database status:", error)
        setDbStatus({
          connected: false,
          hasUrl: false,
          error: "Failed to check database status",
          details: "Could not connect to health check endpoint",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkDatabaseStatus()
  }, [])

  if (isLoading) {
    return (
      <Alert className="mb-4 border-blue-200 bg-blue-50">
        <Database className="h-4 w-4 text-blue-600 animate-pulse" />
        <AlertDescription className="text-blue-800">Checking database connection...</AlertDescription>
      </Alert>
    )
  }

  if (!dbStatus || dbStatus.connected) {
    return null
  }

  const getAlertVariant = () => {
    if (!dbStatus.hasUrl) return "default"
    return "destructive"
  }

  const getIcon = () => {
    if (!dbStatus.hasUrl) return Info
    return AlertTriangle
  }

  const Icon = getIcon()

  return (
    <Alert variant={getAlertVariant()} className="mb-4">
      <Icon className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <div>
            <strong>Database Connection Issue:</strong> {dbStatus.error || "Connection failed"}
          </div>

          {dbStatus.details && <div className="text-sm opacity-90">{dbStatus.details}</div>}

          {!dbStatus.hasUrl ? (
            <div className="text-sm">
              <strong>Development Mode:</strong> Using demo authentication system.
              <br />
              Demo credentials: <code className="bg-black/10 px-1 rounded">demo@example.com</code> /{" "}
              <code className="bg-black/10 px-1 rounded">password123</code>
            </div>
          ) : (
            <div className="text-sm space-y-1">
              <div>
                Database URL source: <code className="bg-black/10 px-1 rounded">{dbStatus.urlSource}</code>
              </div>
              {dbStatus.urlPreview && (
                <div>
                  Connection target: <code className="bg-black/10 px-1 rounded text-xs">{dbStatus.urlPreview}</code>
                </div>
              )}
              <div className="mt-2 p-2 bg-black/5 rounded text-xs">
                <strong>Troubleshooting:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Verify your database URL is correct</li>
                  <li>Check if your database service is running</li>
                  <li>Ensure network connectivity to the database</li>
                  <li>Verify database credentials and permissions</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
