"use client"

import { useSearchParams } from "next/navigation"
import { RemixAssetForm } from "@/components/remix/remix-asset-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RemixPage() {
  const searchParams = useSearchParams()
  const assetSlug = searchParams.get("asset")

  // Parse asset slug [address]-[tokenid]
  const [nftAddress, tokenIdStr] = (assetSlug || "").split("-")
  const tokenId = parseInt(tokenIdStr)

  if (!assetSlug || !nftAddress || isNaN(tokenId)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Invalid Asset</h1>
          <p className="text-muted-foreground">Please select an asset to remix.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Remix</h1>
          <p className="text-muted-foreground">
            Create a new work base on the original asset.
          </p>
        </div>

        <RemixAssetForm nftAddress={nftAddress} tokenId={tokenId} />
      </main>
    </div>
  )
}
