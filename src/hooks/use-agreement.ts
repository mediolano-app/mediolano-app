"use client"

import { useState, useEffect } from "react"
import type { Agreement } from "@/types/agreement"
import { mockAgreements } from "@/lib/mockupProofofLicensing"
import { useWallet } from "@/hooks/use-wallet"

export function useAgreement(id: string) {
  const [agreement, setAgreement] = useState<Agreement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { address } = useWallet()

  useEffect(() => {
    const fetchAgreement = async () => {
      setIsLoading(true)

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const foundAgreement = mockAgreements.find((a) => a.id === id) || null
        setAgreement(foundAgreement)
      } catch (error) {
        console.error("Error fetching agreement:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgreement()
  }, [id])

  const signAgreement = async () => {
    if (!agreement || !address) return

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const party = agreement.parties.find((p) => p.walletAddress.toLowerCase() === address.toLowerCase())

    if (!party) throw new Error("Not authorized to sign this agreement")

    const newSignature = {
      id: `sig-${crypto.randomUUID()}`,
      name: party.name,
      walletAddress: address,
      timestamp: new Date().toISOString(),
      signatureHash:
        "0x" +
        Array.from(crypto.getRandomValues(new Uint8Array(32)))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
    }

    const updatedAgreement = {
      ...agreement,
      signatures: [...agreement.signatures, newSignature],
    }

    setAgreement(updatedAgreement)

    return updatedAgreement
  }

  const finalizeAgreement = async () => {
    if (!agreement || !address) return

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (agreement.createdBy.toLowerCase() !== address.toLowerCase()) {
      throw new Error("Only the creator can finalize this agreement")
    }

    if (agreement.signatures.length !== agreement.parties.length) {
      throw new Error("All parties must sign before finalizing")
    }

    const updatedAgreement = {
      ...agreement,
      status: "completed" as const,
      completedAt: new Date().toISOString(),
      transactionHash:
        "0x" +
        Array.from(crypto.getRandomValues(new Uint8Array(32)))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
    }

    setAgreement(updatedAgreement)

    return updatedAgreement
  }

  return { agreement, isLoading, signAgreement, finalizeAgreement }
}

