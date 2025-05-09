"use client"

import { useState, useEffect } from "react"
import type { Agreement } from "@/types/agreement"
import { mockAgreements } from "@/lib/mockupProofofLicensing"

// Mock user data for the current user
const MOCK_USER = {
  name: "Demo User",
  walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
}

interface UseAgreementsOptions {
  limit?: number
}

export function useAgreements(options: UseAgreementsOptions = {}) {
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAgreements = async () => {
      setIsLoading(true)

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Filter agreements by mock user address
        let filteredAgreements = mockAgreements.filter(
          (agreement) =>
            agreement.createdBy.toLowerCase() === MOCK_USER.walletAddress.toLowerCase() ||
            agreement.parties.some(
              (party) => party.walletAddress.toLowerCase() === MOCK_USER.walletAddress.toLowerCase(),
            ),
        )

        // Apply limit if specified
        if (options.limit) {
          filteredAgreements = filteredAgreements.slice(0, options.limit)
        }

        setAgreements(filteredAgreements)
      } catch (error) {
        console.error("Error fetching agreements:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgreements()
  }, [options.limit])

  return { agreements, isLoading }
}
