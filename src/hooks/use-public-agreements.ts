"use client"

import { useState, useEffect } from "react"
import type { Agreement } from "@/lib/types"
import { mockAgreements } from "@/lib/mock-data"

export function usePublicAgreements() {
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPublicAgreements = async () => {
      setIsLoading(true)

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Filter only completed agreements for public directory
        const publicAgreements = mockAgreements.filter((agreement) => agreement.status === "completed")

        setAgreements(publicAgreements)
      } catch (error) {
        console.error("Error fetching public agreements:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublicAgreements()
  }, [])

  return { agreements, isLoading }
}

