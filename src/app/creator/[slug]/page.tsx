"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  ExternalLink,
  MapPin,
  Calendar,
  Copy,
  Check,
  Palette,
  FolderOpen,
  GitBranch,
  TrendingUp,
  CheckCircle,
  Globe,
  Twitter,
  Instagram,
  MessageCircle,
  Users,
  Heart,
  Share2,
  ArrowLeft,
  Grid3X3,
  List,
} from "lucide-react"
import Link from "next/link"
import { CollectionCard } from "@/components/collection-card"
import NFTCard from "@/components/nft-card"
import { getCreatorBySlug, getAssetsByCreator, getRemixAssetsByCreator } from "@/lib/mock-data";
import {
  useGetCollections,
} from "@/hooks/use-collection";


interface CreatorPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function CreatorPage({ params }: CreatorPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("collections")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterType, setFilterType] = useState<string>("all")
  const [slug, setSlug] = useState<string | undefined>();
  const [resolvedAddress, setResolvedAddress] = useState<string>("")

  // Resolve address from params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setResolvedAddress(resolvedParams.slug)
      setSlug(resolvedParams.slug)
    }
    resolveParams()
  }, [params])

  const {
    collections,
    loading: collection_loading,
    error: collection_error,
    reload,
  } = useGetCollections(resolvedAddress as `0x${string}`);


  useEffect(() => {
    (async () => {
      const p = await params;
      setSlug(p.slug);
    })();
  }, [params]);

  const creator = slug ? getCreatorBySlug(slug) : undefined

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // if (!collection_loading) {
  //   notFound()
  // }

  if (collection_loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-80 bg-muted rounded-2xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded-xl" />
                ))}
            </div>
          </div>
        </div>
      </div>
    )
  }


  // Create fallback creator data for blockchain addresses
  const fallbackCreator = {
    name: creator?.name || `${resolvedAddress.slice(0, 6)}...${resolvedAddress.slice(-4)}`,
    address: creator?.address || resolvedAddress,
    avatar: creator?.avatar || "/placeholder.svg",
    verified: creator?.verified || false,
    bio: creator?.bio || "Blockchain user",
    website: creator?.website || "",
    twitter: creator?.twitter || "",
    instagram: creator?.instagram || "",
    discord: creator?.discord || "",
    joinDate: creator?.joinDate || "Unknown",
    totalAssets: creator?.totalAssets || 0,
    totalValue: creator?.totalValue || "0 ETH",
    totalSales: creator?.totalSales || 0,
    followers: creator?.followers || 0,
    following: creator?.following || 0,
    specialties: creator?.specialties || [],
    location: creator?.location || "",
  }

  const creatorAssets = getAssetsByCreator("Alex Chen")
  const remixAssets = getRemixAssetsByCreator("Alex Chen")

  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredAssets = creatorAssets.filter((collection) => {
    const matchesSearch =
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterType === "all" || collection.type?.toLowerCase() === filterType.toLowerCase()

    return matchesSearch && matchesFilter
  })

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fallbackCreator.address)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (error) {
      console.error("Failed to copy address:", error)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const assetTypes = ["all", ...new Set(creatorAssets.map((asset) => asset.type))]

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0">
          <div className="h-full w-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200&text=Creator+Background')] bg-cover bg-center opacity-20" />
        </div>

        {/* Navigation */}
        <div className="relative z-10 container mx-auto px-4 pt-6">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Link>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white/20 shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
                <AvatarImage src={fallbackCreator.avatar || "/placeholder.svg"} alt={fallbackCreator.name || resolvedAddress} />
                <AvatarFallback className="text-white text-2xl md:text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600">
                  {fallbackCreator.name
                    .split(" ")
                    .map((n: any) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              {/* Mobile-only basic info */}
              <div className="mt-4 lg:hidden">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{fallbackCreator.name || resolvedAddress}</h1>
                  {fallbackCreator.verified && <CheckCircle className="h-6 w-6 text-blue-400" />}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {fallbackCreator.specialties.slice(0, 2).map((specialty: any) => (
                    <Badge key={specialty} className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Info - Hidden on mobile, shown on larger screens */}
            <div className="hidden lg:block flex-1 text-white">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl xl:text-5xl font-bold">{fallbackCreator.name.slice(0, 5) || resolvedAddress.slice(0, 5)}...{fallbackCreator.name.slice(-5) || resolvedAddress.slice(-5)}</h1>
                {fallbackCreator.verified || true && <CheckCircle className="h-8 w-8 text-blue-400" />}
              </div>

              <p className="text-xl text-white/90 mb-6 max-w-2xl leading-relaxed">{fallbackCreator.bio || ""}</p>

              <div className="flex flex-wrap items-center gap-6 text-white/80 mb-6">
                {fallbackCreator.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{fallbackCreator.location || ""}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Joined {fallbackCreator.joinDate || ""}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{fallbackCreator.followers.toLocaleString() || "0"} followers</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {fallbackCreator.specialties.map((specialty: any) => (
                  <Badge
                    key={specialty}
                    className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-sm px-3 py-1"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button className="bg-white text-black hover:bg-white/90 font-semibold">
                  <Heart className="h-4 w-4 mr-2" />
                  Follow
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm bg-transparent"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Profile
                </Button>
                {fallbackCreator.website && (
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm bg-transparent"
                    asChild
                  >
                    <a href={fallbackCreator.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Cards - Desktop */}
            <div className="hidden xl:grid grid-cols-2 gap-4 min-w-[280px]">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{collections.length}</div>
                  <div className="text-sm text-white/80">Collections</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{collections.length}</div>
                  <div className="text-sm text-white/80">Assets</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{remixAssets.length}</div>
                  <div className="text-sm text-white/80">Remixes</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{fallbackCreator.totalValue}</div>
                  <div className="text-sm text-white/80">Total Value</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Info Section */}
      <div className="lg:hidden bg-background border-b">
        <div className="container mx-auto px-4 py-6">
          <p className="text-muted-foreground mb-4 text-center">{fallbackCreator.bio}</p>

          <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground mb-4">
            {fallbackCreator.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{fallbackCreator.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {fallbackCreator.joinDate}</span>
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            <Button size="sm" className="flex-1 max-w-[120px]">
              <Heart className="h-4 w-4 mr-2" />
              Follow
            </Button>
            <Button variant="outline" size="sm" className="flex-1 max-w-[120px] bg-transparent">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Mobile & Tablet */}
      <div className="xl:hidden bg-background border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <FolderOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{collections.length}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Collections</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center">
                <Palette className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">{collections.length}</div>
                <div className="text-sm text-green-700 dark:text-green-300">Assets</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <GitBranch className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{remixAssets.length}</div>
                <div className="text-sm text-purple-700 dark:text-purple-300">Remixes</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{fallbackCreator.totalSales}</div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Sales</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="xl:col-span-3">
            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <TabsList className="grid w-full sm:w-auto grid-cols-3 lg:grid-cols-3">
                  <TabsTrigger value="collections" className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Collections</span>
                    <span className="sm:hidden">Collections</span>
                  </TabsTrigger>
                  <TabsTrigger value="assets" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span className="hidden sm:inline">Assets</span>
                    <span className="sm:hidden">Assets</span>
                  </TabsTrigger>
                  <TabsTrigger value="remixes" className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    <span className="hidden sm:inline">Remixes</span>
                    <span className="sm:hidden">Remixes</span>
                  </TabsTrigger>
                </TabsList>

                {/* Search and Controls */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={`Search ${activeTab}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {activeTab === "assets" && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                        className="shrink-0"
                      >
                        {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                      </Button>

                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border rounded-md text-sm bg-background"
                      >
                        {assetTypes.map((type) => (
                          <option key={type} value={type}>
                            {type === "all" ? "All Types" : type}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
              </div>

              {/* Tab Contents */}
              <TabsContent value="collections" className="mt-0">
                {filteredCollections.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCollections.map((collection, index) => (
                      <CollectionCard key={collection.id} collection={collection} index={index} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No collections found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? `No collections match "${searchQuery}"`
                        : `${fallbackCreator.name} hasn't created any collections yet.`}
                    </p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="assets" className="mt-0">
                {filteredAssets.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
                    }
                  >
                    {filteredAssets.map((asset) => (
                      <NFTCard key={asset.id} asset={asset} view={viewMode} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No assets found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery || filterType !== "all"
                        ? "No assets match your current filters"
                        : `${fallbackCreator.name} hasn't created any assets yet.`}
                    </p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="remixes" className="mt-0">
                {remixAssets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {remixAssets.map((asset) => (
                      <NFTCard key={asset.id} asset={asset} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No remixes found</h3>
                    <p className="text-muted-foreground">{`${fallbackCreator.name} hasn't created any remixes yet.`}</p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Creator Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Creator Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-muted px-2 py-1 rounded flex-1 font-mono">
                      {formatAddress(fallbackCreator.address)}
                    </code>
                    <Button variant="ghost" size="sm" onClick={handleCopyAddress} className="h-8 w-8 p-0">
                      {copiedAddress ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{fallbackCreator.followers.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{fallbackCreator.following.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Portfolio Value</label>
                  <div className="text-xl font-bold mt-1">{fallbackCreator.totalValue}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Specialties</label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {fallbackCreator.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Connect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {fallbackCreator.website && (
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <a href={fallbackCreator.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                )}

                {fallbackCreator.twitter && (
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <a href={fallbackCreator.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                )}

                {fallbackCreator.instagram && (
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <a href={fallbackCreator.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                )}

                {fallbackCreator.discord && (
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {fallbackCreator.discord}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span className="text-muted-foreground">Created new collection</span>
                    <span className="text-xs text-muted-foreground ml-auto">2h ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <span className="text-muted-foreground">Asset sold</span>
                    <span className="text-xs text-muted-foreground ml-auto">1d ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 bg-purple-500 rounded-full" />
                    <span className="text-muted-foreground">New remix created</span>
                    <span className="text-xs text-muted-foreground ml-auto">3d ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
