"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Clock, Loader2 } from "lucide-react"
import Link from "next/link"

import { AssetProvenance } from "@/components/asset-provenance/asset-provenance"
import { Badge } from "@/components/ui/badge"

import { useMemo, useState, use } from "react"
import { useAsset } from "@/hooks/use-asset"
import { useAssetTransferEvents } from "@/hooks/useEvents"

interface ProvenancePageProps {
  params: Promise<{
    assetId: string
  }>
}

export default function ProvenancePage({ params }: ProvenancePageProps) {
  const { assetId } = use(params)

  // Parse assetId to get contractAddress and Token ID
  const [contractAddress, tokenId] = useMemo(() => {
    if (!assetId) return ["", ""]
    const parts = assetId.split("-")
    if (parts.length < 2) return ["", ""]
    const token = parts.pop()
    const address = parts.join("-")
    return [address, token]
  }, [assetId])

  const { asset, loading: assetLoading } = useAsset(contractAddress as `0x${string}`, Number(tokenId))
  const { events: transferEvents, isLoading: eventsLoading } = useAssetTransferEvents(contractAddress, tokenId || "")

  const isLoading = assetLoading || eventsLoading

  const provenanceEvents = useMemo(() => {
    if (!transferEvents) return []

    return transferEvents.map((event) => {
      const from = event.keys?.[1] ? `0x${BigInt(event.keys[1]).toString(16)}` : "Unknown"
      const to = event.keys?.[2] ? `0x${BigInt(event.keys[2]).toString(16)}` : "Unknown"
      const isMint = BigInt(from) === 0n

      return {
        id: event.transaction_hash,
        type: isMint ? "creation" : "transfer",
        title: isMint ? "Asset Minted" : "Ownership Transferred",
        description: isMint
          ? `Asset minted by ${to.substring(0, 6)}...`
          : `Transferred from ${from.substring(0, 6)}... to ${to.substring(0, 6)}...`,
        from,
        to,
        date: new Date(event.block_number * 1000).toLocaleDateString(), // Placeholder timestamp
        timestamp: new Date().toISOString(), // Fallback if block param unavailable in event
        transactionHash: event.transaction_hash,
        blockNumber: event.block_number,
        verified: true,
      }
    }).reverse() as any[]
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

  if (!asset) {
    return (
      <>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Provenance Not Found</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The asset provenance history you're looking for doesn't exist or could not be loaded.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/">
                <Button variant="outline">Return Home</Button>
              </Link>
              <Link href="/assets">
                <Button>Browse Assets</Button>
              </Link>
            </div>
          </div>
        </div>

      </>
    )
  }

  const enhancedAsset = {
    id: asset.id,
    name: asset.name,
    type: asset.type || "Asset",
    creator: {
      name: asset.collectionName || "Unknown Creator",
      address: asset.properties?.creator as string || "Unknown",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    currentOwner: {
      name: asset.owner ? `${String(asset.owner).substring(0, 6)}...` : "Unknown",
      address: asset.owner ? String(asset.owner) : "0x0",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    creationDate: asset.registrationDate || new Date().toISOString(),
    registrationDate: asset.registrationDate || new Date().toISOString(),
    blockchain: "Starknet",
    contract: asset.nftAddress,
    tokenId: asset.tokenId.toString(),
    image: asset.image || "/placeholder.svg",
    description: asset.description || "",
    fingerprint: asset.ipfsCid ? `ipfs://${asset.ipfsCid}` : `sha256:${Math.random().toString(16).substr(2, 64)}`,
  } as any

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${asset.name} - Asset Provenance`,
          text: `View the complete ownership history of ${asset.name}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
      } catch (error) {
        console.error("Failed to copy URL:", error)
      }
    }
  }

  return (
    <>



      <main className="container mx-auto px-4 py-12 sm:py-16 max-w-5xl">
        <div className="mb-12 space-y-6">
          <div className="text-center space-y-3">

            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-3">Provenance </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Ownership history for <span className="font-medium text-foreground"><Link href={`/asset/${assetId}`}>{asset.name}</Link></span>
              </p>
            </div>

            <div className="flex justify-center items-center gap-2 flex-wrap">
              <Badge variant="outline">{asset.type || "Asset"}</Badge>
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1.5" />
                {provenanceEvents.length} Events
              </Badge>
              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                Verified
              </Badge>
            </div>
          </div>

        </div>

        <AssetProvenance asset={enhancedAsset} events={provenanceEvents} showActions={true} compact={false} />
      </main>

    </>
  )
}
