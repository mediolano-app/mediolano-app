"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error in create page:", error)
  }, [error])

  // Handle reset with try/catch
  const handleReset = () => {
    try {
      reset()
    } catch (resetError) {
      console.error("Error during reset:", resetError)
      // If reset fails, redirect to home
      window.location.href = "/"
    }
  }

  return (
    <div className="container py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>An error occurred. Please contact our support channel.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {error.message || "Please try again or contact support if the problem persists."}
          </p>
          {error.digest && <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={handleReset} variant="outline">
            Try again
          </Button>
          <Button asChild>
            <Link href="/support">Go to Support</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

