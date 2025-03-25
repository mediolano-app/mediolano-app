"use client"

import { useState, useEffect } from "react"
import { getMockAgreementStats } from "@/lib/mockupProofofLicensing"

export function useAgreementStats() {
  const [stats, setStats] = useState({
    totalAgreements: 0,
    totalSignatures: 0,
    completedAgreements: 0,
    publicViews: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockStats = getMockAgreementStats()
      setStats(mockStats)
    }

    fetchStats()
  }, [])

  return stats
}

