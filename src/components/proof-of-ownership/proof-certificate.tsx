"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, CheckCircle, Copy, Share2, Shield, Calendar, Info, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Asset } from "@/types/asset"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProofCertificateProps {
  asset: Asset & {
    creator: {
      name: string
      address: string
      verified: boolean
    }
    owner: {
      name: string
      address: string
      verified: boolean
      acquired: string
    }
    blockchain: string
    tokenStandard: string
    contract: string
    licenseInfo: {
      type: string
      terms: string
      allowCommercial: boolean
      allowDerivatives: boolean
      requireAttribution: boolean
      royaltyPercentage: number
    }
  }
}

export function ProofCertificate({ asset }: ProofCertificateProps) {
  const [copied, setCopied] = useState<string>("")

  const handleCopyAddress = async (address: string, type: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(type)
      setTimeout(() => setCopied(""), 2000)
    } catch (error) {
      console.error("Error copying:", error)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Proof of Ownership - ${asset.name}`,
          text: `Verify ownership of ${asset.name} onchain.`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setCopied("share")
        setTimeout(() => setCopied(""), 2000)
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://starkscan.co"

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-700 slide-in-from-bottom-4">

      {/* Responsive Card: Stacked on Mobile, Side-by-Side on Desktop */}
      <Card className="overflow-hidden border-border/50 bg-background/60 backdrop-blur-xl shadow-lg rounded-3xl">
        <CardContent className="p-0 flex flex-col lg:flex-row align-stretch">

          {/* Visual Header / Side */}
          <div className="relative aspect-square w-full lg:w-[45%] lg:aspect-auto lg:min-h-[500px] bg-muted/20 border-b lg:border-b-0 lg:border-r border-border/50">
            <Image
              src={asset.image || "/placeholder.svg"}
              alt={asset.name}
              fill
              className="object-cover"
              priority
            />

            {/* Overlay Badges */}
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur shadow-sm border-white/10 text-xs font-medium">
                {asset.type}
              </Badge>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 p-6 lg:p-10 space-y-6 lg:space-y-8 flex flex-col justify-center">

            {/* Title & Collection */}
            <div>
              <Link href={`/asset/${asset.id}`} className="block group">
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {asset.name}
                </h2>
              </Link>
              <p className="text-sm text-muted-foreground mt-2 font-mono break-all">
                Token ID: <span className="select-all">{asset.id}</span>
              </p>
            </div>

            <div className="h-px bg-border/50 w-full" />

            {/* Ownership Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Owner */}
              <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Owner</div>
                <div>
                  <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity" onClick={() => handleCopyAddress(asset.owner.address, "owner")}>
                    <span className="font-semibold text-base text-foreground truncate max-w-[150px]">{asset.owner.name}</span>
                    {copied === "owner" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Since {new Date(asset.owner.acquired).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Creator */}
              <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Creator</div>
                <div>
                  <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity" onClick={() => handleCopyAddress(asset.creator.address, "creator")}>
                    <span className="font-semibold text-base text-foreground truncate max-w-[150px]">{asset.creator.name}</span>
                    {asset.creator.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                    {copied === "creator" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Onchain
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-border/50 w-full" />

            {/* Technical Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground text-xs mb-1">Network</div>
                <div className="font-medium">{asset.blockchain}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-1">Standard</div>
                <div className="font-medium">{asset.tokenStandard}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-1">License</div>
                <div className="font-medium truncate" title={asset.licenseInfo.type}>{asset.licenseInfo.type}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-1">Status</div>
                <Badge variant="outline" className="text-[10px] h-5 border-green-500/30 text-green-600 px-2">Verified</Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link href={`/provenance/${asset.id}`} className="flex-1">
                <Button variant="outline" className="w-full justify-between group h-12 rounded-xl border-border/60 hover:bg-accent/50">
                  <span className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    View Provenance
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Button>
              </Link>

              <div className="flex gap-3 flex-1">
                <Link href={`${EXPLORER_URL}/contract/${asset.contract}`} target="_blank" className="flex-1">
                  <Button variant="secondary" className="w-full h-12 rounded-xl bg-secondary/80 hover:bg-secondary">
                    Explorer
                  </Button>
                </Link>
                <Button onClick={handleShare} className="h-12 w-12 rounded-xl shrink-0 p-0">
                  {copied === "share" ? <CheckCircle className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
                </Button>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground opacity-60">
        Immutable Record • {asset.id}
      </p>

    </div>
  )
}
