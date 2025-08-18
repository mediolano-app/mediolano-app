"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Share2 } from "lucide-react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getAssetById, getAssetProvenance } from "@/lib/mock-data"
import { AssetProvenance } from "@/components/asset-provenance/asset-provenance"
import { Badge } from "@/components/ui/badge"

interface ProvenancePageProps {
  params: {
    id: string
  }
}

export default function ProvenancePage({ params }: ProvenancePageProps) {
  const { id } = params

  // Get asset from mock data
  const asset = getAssetById(id)
  const provenanceData = getAssetProvenance(id)

  if (!asset || !provenanceData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
            <ArrowLeft className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Provenance Not Found</h1>
            <p className="text-muted-foreground">
              The asset provenance you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/assets">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                Browse Assets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Enhanced asset object for provenance
  const enhancedAsset = {
    id: asset.id,
    name: asset.name,
    type: asset.type,
    creator: {
      name: asset.creator,
      address: "0x1a2b3c4d5e6f7g8h9i0j",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: asset.verified || true,
    },
    currentOwner: {
      name: "CollectorDAO",
      address: "0x9i8h7g6f5e4d3c2b1a",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    creationDate: asset.registrationDate,
    registrationDate: asset.registrationDate,
    blockchain: "Ethereum",
    contract: "0x1234567890abcdef1234567890abcdef12345678",
    tokenId: asset.id,
    image: asset.image,
    description: asset.description,
    fingerprint: `sha256:${Math.random().toString(16).substr(2, 64)}`,
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
        // Could add a toast notification here
      } catch (error) {
        console.error("Failed to copy URL:", error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      
      

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Enhanced Page Header */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold">Asset Provenance</h1>
                <Badge variant="secondary" className="text-xs">
                  {provenanceData.events.length} Events
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base">
                Complete ownership history and chain of custody for{" "}
                <span className="font-semibold text-foreground">{asset.name}</span>
              </p>
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-2">
              <Link href={`/proof-of-ownership/${asset.id}`}>
                <Button variant="outline" size="sm" className="text-xs bg-transparent">
                  View Certificate
                </Button>
              </Link>
              <Link href={`/assets/${asset.id}`}>
                <Button size="sm" className="text-xs">
                  View Asset
                </Button>
              </Link>
            </div>
          </div>

          {/* Asset quick info */}
          <div className="flex flex-wrap items-center gap-2 p-4 rounded-lg bg-muted/30 border">
            <Badge variant="outline">{asset.type}</Badge>
            <Badge variant="secondary">Created {new Date(asset.registrationDate).toLocaleDateString()}</Badge>
            <Badge variant="outline">By {asset.creator}</Badge>
            {asset.verified && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Verified</Badge>
            )}
          </div>
        </div>

        {/* Enhanced Provenance Component */}
        <AssetProvenance asset={enhancedAsset} events={provenanceData.events} showActions={true} compact={false} />

        {/* Back to asset button */}
        <div className="mt-12 flex justify-center">
          <Link href={`/assets/${asset.id}`}>
            <Button variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Asset Details
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
