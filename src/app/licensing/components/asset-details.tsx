"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { IPAsset } from "@/app/licensing/lib/types"
import Image from "next/image"
import { Clock, Copy, Share2, UserRound } from "lucide-react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"

interface AssetDetailsProps {
  asset: IPAsset
}

export function AssetDetails({ asset }: AssetDetailsProps) {
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The address has been copied to your clipboard",
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Information</CardTitle>
            <CardDescription>Details about this intellectual property asset</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="mt-1 text-muted-foreground">{asset.description}</p>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium">Asset Type</h3>
                <Badge className="mt-1" variant={asset.type === "original" ? "default" : "secondary"}>
                  {asset.type}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <Badge className="mt-1" variant={asset.status === "active" ? "success" : "destructive"}>
                  {asset.status}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium">Created</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {new Date(asset.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <h3 className="font-medium">Creator</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <UserRound className="h-4 w-4" />
                  {asset.creator}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium">Blockchain Information</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <span>Contract Address</span>
                  <div className="flex items-center gap-1">
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">{asset.contractAddress}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => copyToClipboard(asset.contractAddress)}
                    >
                      <Copy className="h-3 w-3 text-muted-foreground" />
                      <span className="sr-only">Copy contract address</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <span>Token ID</span>
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">{asset.tokenId}</code>
                </div>
                <div className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <span>Network</span>
                  <Badge variant="outline">Starknet Mainnet</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {asset.terms && (
          <Card>
            <CardHeader>
              <CardTitle>IP Terms</CardTitle>
              <CardDescription>Licensing terms and conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(asset.terms).map(([key, value]) => (
                <div key={key}>
                  <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</h3>
                  <p className="mt-1 text-muted-foreground">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card className="overflow-hidden">
          <AspectRatio ratio={1}>
            <Image
              src={asset.image || "/placeholder.svg?height=400&width=400"}
              alt={asset.name}
              className="object-cover"
              fill
            />
          </AspectRatio>
          <CardContent className="p-4">
            <h3 className="font-medium">Preview</h3>
            <p className="text-sm text-muted-foreground">Visual representation of the IP asset</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>License Stats</CardTitle>
            <CardDescription>License usage statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Licenses</span>
              <Badge variant="outline">{asset.licenseCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Revenue Generated</span>
              <Badge variant="outline">{asset.revenueGenerated || "0"} ETH</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last License</span>
              <Badge variant="outline">{asset.lastLicenseDate || "N/A"}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Share Asset</CardTitle>
            <CardDescription>Share this asset with others</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="flex-1 overflow-hidden">
                <code className="block w-full truncate rounded bg-muted px-2 py-1 text-xs">
                  {`https://ipchain.example/asset/${asset.id}`}
                </code>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(`https://ipchain.example/asset/${asset.id}`)}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy link</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
