"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Clock, Loader2 } from "lucide-react"
import Link from "next/link"

import { AssetProvenance } from "@/components/asset-provenance/asset-provenance"
import { Badge } from "@/components/ui/badge"

import { useMemo, useState, use } from "react"
import { useAsset } from "@/hooks/use-asset"
import { useAssetProvenanceEvents } from "@/hooks/useEvents"

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

  // Debug log to check addresses and owner
  console.log(`[ProvenancePage] URL Address: ${contractAddress}, Asset NFT Address: ${asset?.nftAddress}, TokenID: ${tokenId}, Owner: ${asset?.owner}`);

  const { events: provenanceEventsRaw, isLoading: eventsLoading } = useAssetProvenanceEvents(contractAddress, tokenId || "")

  const isLoading = assetLoading || eventsLoading

  const provenanceEvents = useMemo(() => {
    if (!provenanceEventsRaw || provenanceEventsRaw.length === 0) return []

    return provenanceEventsRaw.map((event) => {
      const isMint = event.type === "mint"
      const from = event.from || "0x0"
      const to = event.to || "Unknown"
      const timestamp = event.timestamp ? new Date(event.timestamp) : new Date();

      return {
        id: event.id,
        type: isMint ? "mint" : "transfer",
        title: event.title || (isMint ? "Asset Minted" : "Ownership Transferred"),
        description: event.description || (isMint
          ? `Asset minted by ${to.substring(0, 6)}...${to.substring(to.length - 4)}`
          : `Transferred from ${from.substring(0, 6)}...${from.substring(from.length - 4)} to ${to.substring(0, 6)}...${to.substring(to.length - 4)}`),
        from,
        to,
        date: timestamp.toLocaleDateString(),
        timestamp: timestamp.toISOString(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        verified: true,
      }
    }) as any[]
  }, [provenanceEventsRaw])

  const enhancedAsset = useMemo(() => {
    if (!asset) return null;

    // improved creator detection from provenance
    // The 'to' address of the creation/mint event is the original creator
    const mintEvent = provenanceEvents.find(e => e.type === "mint");
    const minterAddress = mintEvent?.to || asset.properties?.creator as string;

    // logic to determine display name
    let creatorName = "Unknown Creator";
    if (asset.collectionName) {
      creatorName = asset.collectionName;
    } else if (typeof asset.properties?.creator === 'string' && !asset.properties.creator.startsWith("0x")) {
      creatorName = asset.properties.creator;
    } else if (minterAddress && typeof minterAddress === 'string' && minterAddress !== "Unknown") {
      creatorName = `${minterAddress.substring(0, 6)}...${minterAddress.substring(minterAddress.length - 4)}`;
    }

    return {
      id: asset.id,
      name: asset.name,
      type: asset.type || "Asset",
      creator: {
        name: creatorName,
        address: minterAddress || "Unknown",
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
  }, [asset, provenanceEvents]);

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
                <Button variant="outline">Start</Button>
              </Link>
              <Link href="/assets">
                <Button>Explore</Button>
              </Link>
            </div>
          </div>
        </div>

      </>
    )
  }

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
              <h1 className="text-3xl font-black tracking-tight mb-3">Provenance </h1>
            </div>
          </div>

        </div>

        <AssetProvenance asset={enhancedAsset} events={provenanceEvents} showActions={true} compact={false} />
      </main>

    </>
  )
}
