"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Share2, ShieldCheck, Loader2 } from "lucide-react"
import Link from "next/link"
import { ProofCertificate } from "@/components/proof-of-ownership/proof-certificate"
import { useState, useMemo, use } from "react"
import { useAsset } from "@/hooks/use-asset"
import { useAssetTransferEvents } from "@/hooks/useEvents"

interface ProofOfOwnershipPageProps {
  params: Promise<{
    assetId: string
  }>
}

export default function ProofOfOwnershipPage({ params }: ProofOfOwnershipPageProps) {
  const { assetId } = use(params)
  const [copied, setCopied] = useState(false)

  // Parse assetId to get contractAddress and tokenId
  const [contractAddress, tokenId] = useMemo(() => {
    if (!assetId) return ["", ""]
    const parts = assetId.split("-")
    if (parts.length < 2) return ["", ""]
    // Handle case where contract address might contain - (unlikely for hex but good to be safe if format changes)
    const token = parts.pop()
    const address = parts.join("-")
    return [address, token]
  }, [assetId])

  const { asset, loading: assetLoading, error: assetError } = useAsset(contractAddress as `0x${string}`, Number(tokenId))
  const { events: transferEvents, isLoading: eventsLoading } = useAssetTransferEvents(contractAddress, tokenId || "")

  const isLoading = assetLoading || eventsLoading

  const ownershipHistory = useMemo(() => {
    if (!transferEvents) return []

    return transferEvents.map((event) => {
      // Basic decoding for standard Transfer(from, to, tokenId)
      // keys: [selector, from, to, tokenId]
      const from = event.keys?.[1] ? `0x${BigInt(event.keys[1]).toString(16)}` : "Unknown"
      const to = event.keys?.[2] ? `0x${BigInt(event.keys[2]).toString(16)}` : "Unknown"

      return {
        event: BigInt(from) === 0n ? "Mint" : "Transfer",
        from,
        to,
        date: new Date(event.block_number * 1000).toLocaleDateString(), // Approx timestamp if block_timestamp not available, ideal if event has it
        transactionHash: event.transaction_hash,
        verified: true,
        type: BigInt(from) === 0n ? "mint" : "transfer",
      }
    }).reverse() // Newest first
  }, [transferEvents])

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    )
  }

  if (assetError || !asset) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Certificate Not Found</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                This ownership certificate doesn't exist in our records or could not be loaded.
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" className="mt-4 bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  const enhancedAsset = {
    ...asset,
    creator: {
      name: asset.collectionName || "Unknown Creator", // Fallback
      address: asset.properties?.creator as string || "Unknown",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    owner: {
      name: asset.owner ? `${String(asset.owner).substring(0, 6)}...${String(asset.owner).substring(String(asset.owner).length - 4)}` : "Unknown Owner",
      address: asset.owner ? String(asset.owner) : "",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      acquired: ownershipHistory[0]?.date || "Unknown",
    },
    blockchain: "Starknet",
    tokenStandard: "ERC-721",
    contract: asset.nftAddress,
    licenseInfo: {
      type: asset.licenseType || "Personal Use",
      terms: "Standard License",
      allowCommercial: false,
      allowDerivatives: true,
      requireAttribution: true,
      royaltyPercentage: 5,
    },
  } as any

  const handleShare = async () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: `Ownership Certificate - ${enhancedAsset.name}`,
          url: window.location.href,
        })
      } else {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  return (
    <>


      <main className="container mx-auto px-4 py-12 sm:py-16 max-w-4xl">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-foreground/5 mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Proof of Ownership</h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Blockchain-verified certificate with complete ownership history
          </p>
        </div>

        <ProofCertificate asset={enhancedAsset} ownershipHistory={ownershipHistory} />
      </main>

    </>
  )
}
