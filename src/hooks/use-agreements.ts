"use client"

import { useState, useEffect } from "react"
import type { Agreement } from "@/types/agreement"
import { mockAgreements } from "@/lib/mockupProofofLicensing"

interface UseAgreementsOptions {
  limit?: number
}

export function useAgreements(options: UseAgreementsOptions = {}) {
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const address = "0x1234567890";

  useEffect(() => {
    const fetchAgreements = async () => {
      setIsLoading(true)

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Filter agreements by connected wallet address
        let filteredAgreements = mockAgreements.filter(
          (agreement) =>
            agreement.createdBy.toLowerCase() === address.toLowerCase() ||
            agreement.parties.some((party) => party.walletAddress.toLowerCase() === address.toLowerCase()),
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
  }, [address, options.limit])

  return { agreements, isLoading }
}

