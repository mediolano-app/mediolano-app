"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Palette,
  Music,
  Video,
  FileText,
  Lightbulb,
  BadgeCheck,
  Code,
  Hexagon,
  Box,
  ArrowLeft,
  Sparkles,
  Share2,
  ExternalLink,
  Calendar,
  Crown,
  Zap,
  TrendingUp,
  Eye,
  Heart,
  GitBranch,
  Shield,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getAssetById } from "@/lib/mock-data"
import { RemixAssetDialog } from "@/components/remix/remix-asset-dialog"
import type { Asset, IPType } from "@/types/asset"

const typeIcons: Record<IPType, any> = {
  Art: Palette,
  Audio: Music,
  Video: Video,
  Document: FileText,
  Patent: Lightbulb,
  Trademark: BadgeCheck,
  Software: Code,
  NFT: Hexagon,
  Other: Box,
}

// Mock remix data
const mockRemixes = [
  {
    id: "remix-1",
    name: "Abstract Dimension #312 - Neon Variant",
    creator: "RemixArtist",
    image: "/placeholder.svg?height=300&width=300&text=Neon+Remix",
    remixType: "derivative",
    createdAt: "2025-01-20T10:30:00Z",
    likes: 45,
    views: 234,
    verified: false,
  },
  {
    id: "remix-2",
    name: "Abstract Dimension #312 - 3D Interpretation",
    creator: "3DArtist",
    image: "/placeholder.svg?height=300&width=300&text=3D+Remix",
    remixType: "transformation",
    createdAt: "2025-01-18T14:20:00Z",
    likes: 67,
    views: 456,
    verified: true,
  },
  {
    id: "remix-3",
    name: "Abstract Dimension #312 - Minimalist",
    creator: "MinimalDesigner",
    image: "/placeholder.svg?height=300&width=300&text=Minimal+Remix",
    remixType: "adaptation",
    createdAt: "2025-01-15T16:45:00Z",
    likes: 23,
    views: 189,
    verified: false,
  },
]

export default function RemixPage() {
  const params = useParams()
  const router = useRouter()
  const [asset, setAsset] = useState<Asset | null>(null)
  const [remixDialogOpen, setRemixDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const assetId = params.id as string
    const foundAsset = getAssetById(assetId)
    setAsset(foundAsset || null)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-muted rounded-lg" />
                <div className="h-32 bg-muted rounded-lg" />
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-muted rounded-lg" />
                <div className="h-32 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Asset Not Found</h1>
          <p className="text-muted-foreground mb-4">The asset you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const TypeIcon = typeIcons[asset.type] || Box

  const handleRemixCreated = (remixAsset: Asset) => {
    // In a real app, this would update the remixes list
    console.log("New remix created:", remixAsset)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/assets/${asset.id}`}>Asset</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Remix</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GitBranch className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Remix Studio</h1>
              <p className="text-muted-foreground">Create and explore remixes of this IP asset</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Original Asset */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Original Asset
                  </CardTitle>
                  <Badge variant="secondary">Source</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative w-full md:w-48 aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
                    <Image src={asset.image || "/placeholder.svg"} alt={asset.name} fill className="object-cover" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-background/80 backdrop-blur">
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {asset.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{asset.name}</h3>
                      <p className="text-muted-foreground">{asset.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={`/placeholder-icon.png?height=24&width=24&text=${asset.creator.substring(0, 2)}`}
                          />
                          <AvatarFallback className="text-xs">{asset.creator.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{asset.creator}</span>
                        {asset.verified && <BadgeCheck className="h-4 w-4 text-blue-500" />}
                      </div>
                      <Separator orientation="vertical" className="h-4" />
                      <Badge variant="outline">{asset.licenseType}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {asset.registrationDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        {asset.protectionLevel}% Protected
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Remix Gallery */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Community Remixes ({mockRemixes.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Trending
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockRemixes.map((remix) => (
                    <Card key={remix.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gradient-to-br from-muted/50 to-muted">
                          <Image
                            src={remix.image || "/placeholder.svg"}
                            alt={remix.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                              {remix.remixType}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3">
                            {remix.verified && (
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              >
                                <BadgeCheck className="h-3 w-3" />
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="p-4 space-y-3">
                          <h4 className="font-medium line-clamp-2">{remix.name}</h4>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={`/placeholder-icon.png?height=20&width=20&text=${remix.creator.substring(0, 2)}`}
                              />
                              <AvatarFallback className="text-xs">{remix.creator.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{remix.creator}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {remix.views}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {remix.likes}
                              </div>
                            </div>
                            <span>{new Date(remix.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Create Remix CTA */}
            <Card className="border-2 border-dashed border-primary/50 bg-primary/5">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Create Your Remix</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Transform this asset into something new while respecting the original creator's rights
                  </p>
                </div>
                <Button onClick={() => setRemixDialogOpen(true)} className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Start Remixing
                </Button>
              </CardContent>
            </Card>

            {/* Remix Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Remix Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Remixes</span>
                  <span className="font-medium">{mockRemixes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Verified Remixes</span>
                  <span className="font-medium">{mockRemixes.filter((r) => r.verified).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Views</span>
                  <span className="font-medium">{mockRemixes.reduce((sum, r) => sum + r.views, 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Likes</span>
                  <span className="font-medium">{mockRemixes.reduce((sum, r) => sum + r.likes, 0)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Remix Rate</span>
                  <Badge variant="secondary">High</Badge>
                </div>
              </CardContent>
            </Card>

            {/* License Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  License Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">License Type</span>
                  <Badge variant="outline">{asset.licenseType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Commercial Use</span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    Allowed
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Derivatives</span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    Allowed
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Attribution</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    Required
                  </Badge>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  By creating a remix, you agree to follow the original license terms and provide proper attribution.
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href={`/assets/${asset.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Original Asset
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Remix Page
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <RemixAssetDialog
        open={remixDialogOpen}
        onOpenChange={setRemixDialogOpen}
        originalAsset={asset}
        onRemixCreated={handleRemixCreated}
      />
    </div>
  )
}
