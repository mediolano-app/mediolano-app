"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-destructive/10 p-4">
                <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
            <p className="max-w-[500px] text-muted-foreground">
                We apologize for the inconvenience. An unexpected error occurred.
            </p>
            <div className="flex gap-2">
                <Button onClick={() => reset()} variant="default">
                    Try again
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                    Reload Page
                </Button>
            </div>
        </div>
    )
}
