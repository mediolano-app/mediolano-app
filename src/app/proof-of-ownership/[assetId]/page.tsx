"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShieldCheck, Loader2 } from "lucide-react"
import Link from "next/link"
import { ProofCertificate } from "@/components/proof-of-ownership/proof-certificate"
import { useMemo, use } from "react"
import { useAsset } from "@/hooks/use-asset"
import { useAssetProvenanceEvents } from "@/hooks/useEvents"

interface ProofOfOwnershipPageProps {
  params: Promise<{
    assetId: string
  }>
}

export default function ProofOfOwnershipPage({ params }: ProofOfOwnershipPageProps) {
  const { assetId } = use(params)

  // Parse assetId to get contractAddress and tokenId
  const [contractAddress, tokenId] = useMemo(() => {
    if (!assetId) return ["", ""]
    const parts = assetId.split("-")
    if (parts.length < 2) return ["", ""]
    const token = parts.pop()
    const address = parts.join("-")
    return [address, token]
  }, [assetId])

  const { asset, loading: assetLoading, error: assetError } = useAsset(contractAddress as `0x${string}`, Number(tokenId))
  const { events, isLoading: eventsLoading } = useAssetProvenanceEvents(contractAddress, tokenId || "")

  const isLoading = assetLoading || eventsLoading

  // Re-map events to match the expected interface if necessary, or pass directly if the new component handles it.
  // The hook returns: { type, title, description, from, to, timestamp, transactionHash, blockNumber, verified }
  // We will pass this directly to the updated component.

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Verifying ownership...</p>
        </div>
      </div>
    )
  }

  if (assetError || !asset) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 glass-card p-8 rounded-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center backdrop-blur-sm">
            <ShieldCheck className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Certificate Not Found</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              This ownership certificate doesn't exist in our records or could not be loaded from the blockchain.
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="mt-4 w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  /*
   * Derive Original Creator from Mint Event
   * We prioritize the on-chain "Mint" event receiver as the original creator.
   * If not found, we fallback to asset properties or "Unknown".
   */
  const mintEvent = events.find(e => e.type === "mint");
  const creatorAddress = mintEvent ? mintEvent.to : ((asset.properties?.creator as string) || "Unknown");

  const enhancedAsset = {
    ...asset,
    creator: {
      // Use the derived address. Name logic is tricky without a profile system, so we use the address as the name or fallback.
      name: creatorAddress === "Unknown" ? "Unknown" : (creatorAddress.length > 10 ? `${creatorAddress.slice(0, 6)}...${creatorAddress.slice(-4)}` : creatorAddress),
      address: creatorAddress,
      verified: true,
    },
    owner: {
      name: asset.owner ? (asset.owner.length > 10 ? `${asset.owner.slice(0, 6)}...${asset.owner.slice(-4)}` : asset.owner) : "Unknown",
      address: asset.owner ? String(asset.owner) : "",
      verified: true,
      acquired: events[0]?.timestamp || "Unknown",
    },
    blockchain: "Starknet",
    tokenStandard: "ERC-721",
    contract: asset.nftAddress,
    licenseInfo: {
      type: asset.licenseType || "Unknown",
      terms: "Unknown",
      allowCommercial: false,
      allowDerivatives: true,
      requireAttribution: true,
      royaltyPercentage: 5,
    },
  } as any

  return (
    <main className="min-h-screen text-foreground">
      <div className="container mx-auto px-4 py-8 sm:py-16 max-w-5xl">
        <div className="text-center mb-12 space-y-4">
          <Badge variant="outline" className="mb-4 border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Onchain Certificate
          </Badge>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Proof of Ownership
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Verifiable onchain record for <span className="text-foreground font-medium">{enhancedAsset.name}</span>
          </p>
        </div>

        <ProofCertificate asset={enhancedAsset} />
      </div>
    </main>
  )
}
