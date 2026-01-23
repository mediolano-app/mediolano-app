"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  CheckCircle,
  Globe,
  Share2,
  Palette,
  FolderOpen,
} from "lucide-react"
import { CollectionCard } from "@/components/collection-card";
import { CreatorPageSkeleton } from "@/components/creator-page-skeleton";
import { getCreatorBySlug } from "@/lib/mock-data";
import { useGetCollections } from "@/hooks/use-collection";
import { useOwnerAssets } from "@/hooks/use-owner-assets";
import { PortfolioAssets } from "@/components/portfolio/portfolio-assets";
import type { TokenData } from "@/hooks/use-portfolio";
import { Skeleton } from "@/components/ui/skeleton";

interface CreatorPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function CreatorPage({ params }: CreatorPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [activeTab, setActiveTab] = useState("collections")
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

  // Derive wallet address for hooks (handle mock slugs)
  const mockCreator = resolvedAddress ? getCreatorBySlug(resolvedAddress) : undefined;
  const walletAddress = mockCreator?.address || resolvedAddress;

  const {
    collections,
    loading: collection_loading,
  } = useGetCollections(walletAddress as `0x${string}`);

  // Fetch assets using the owner assets hook (reliable on-chain scanning)
  const {
    tokens: ownerTokens,
    loading: assetsLoading,
  } = useOwnerAssets(walletAddress, collections);

  // Flatten and filter tokens
  const allTokens = Object.values(ownerTokens).flat().filter(asset => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (asset.name && asset.name.toLowerCase().includes(q)) ||
      (asset.collection_id && asset.collection_id.toLowerCase().includes(q)) ||
      (asset.token_id && asset.token_id.includes(q))
    );
  });

  // Filter out Remixes (we are hiding them now)
  const standardTokens = allTokens.filter(t =>
    !(t.metadata?.templateType === "Remix Art" ||
      t.metadata?.originalAsset ||
      (t.attributes && t.attributes.some(a => a.trait_type === "Type" && a.value === "Remix")))
  );

  // Determine dynamic header image
  const firstAsset = standardTokens[0];
  const dynamicImage = firstAsset ? firstAsset.image : (collections.length > 0 ? collections[0].image : null);

  // Helper to group tokens back into a map for PortfolioAssets
  const groupTokens = (tokens: TokenData[]) => {
    const map: Record<string, TokenData[]> = {};
    tokens.forEach(t => {
      if (!map[t.collection_id]) map[t.collection_id] = [];
      map[t.collection_id].push(t);
    });
    return map;
  };

  const standardTokensMap = groupTokens(standardTokens);

  const creator = slug ? getCreatorBySlug(slug) : undefined

  // Initial loading state
  if (collection_loading && assetsLoading && !resolvedAddress) {
    return <CreatorPageSkeleton />
  }

  // Create fallback creator data for blockchain addresses
  const fallbackCreator = {
    name: creator?.name || `${resolvedAddress.slice(0, 6)}...${resolvedAddress.slice(-4)}`,
    address: creator?.address || resolvedAddress,
    avatar: creator?.avatar || "/placeholder.svg",
    verified: creator?.verified || false,
    bio: creator?.bio || "Starknet 8",
    website: creator?.website || "",
    twitter: creator?.twitter || "",
    instagram: creator?.instagram || "",
    discord: creator?.discord || "",
    joinDate: creator?.joinDate || "",
    totalAssets: creator?.totalAssets || 0,
    totalValue: creator?.totalValue || "",
    totalSales: creator?.totalSales || 0,
    followers: creator?.followers || 0,
    following: creator?.following || 0,
    specialties: creator?.specialties || [],
    location: creator?.location || "",
  }

  const headerBackground = dynamicImage || "/placeholder.svg?height=600&width=1200&text=Creator+Background";
  const avatarImage = dynamicImage || fallbackCreator.avatar || "/placeholder.svg";

  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fallbackCreator.address)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (error) {
      console.error("Failed to copy address:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background/60">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background with gradient overlay and blur effect */}
        <div className="absolute inset-0">
          <div className="h-full w-full bg-black/40" />
          <Image
            src={headerBackground}
            alt="Creator Background"
            fill
            className="object-cover opacity-50 blur-xl scale-110"
            priority
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white/20 shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
                <AvatarImage src={avatarImage} alt={fallbackCreator.name || resolvedAddress} className="object-cover" />
                <AvatarFallback className="text-white text-2xl md:text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600">
                  {fallbackCreator.name.split(" ").map((n: any) => n[0]).join("")}
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

              <div className="flex flex-wrap gap-2">
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
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm bg-transparent"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
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

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-2 md:gap-4 w-full xl:w-auto xl:min-w-[280px] mt-6 lg:mt-0">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white flex-1">
                <CardContent className="p-2 md:p-4 text-center">
                  <div className="text-lg md:text-2xl font-bold">{collections.length}</div>
                  <div className="text-xs md:text-sm text-white/80">Collections</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white flex-1">
                <CardContent className="p-2 md:p-4 text-center">
                  {assetsLoading && standardTokens.length === 0 ? (
                    <div className="flex justify-center items-center h-8">
                      <Skeleton className="h-6 w-12 bg-white/20" />
                    </div>
                  ) : (
                    <div className="text-lg md:text-2xl font-bold">{standardTokens.length}</div>
                  )}
                  <div className="text-xs md:text-sm text-white/80">Assets</div>
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

          <div className="flex justify-center gap-2 mb-6">
            <Button variant="outline" size="sm" className="flex-1 max-w-[120px] bg-transparent">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="xl:col-span-4">
            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <TabsList className="grid w-full sm:w-auto grid-cols-2 lg:grid-cols-2">
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
                </div>
              </div>

              {/* Tab Contents */}
              <TabsContent value="collections" className="mt-0">
                {collection_loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} className="h-[300px] w-full bg-muted rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : filteredCollections.length > 0 ? (
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
                <PortfolioAssets
                  tokens={standardTokensMap}
                  loading={assetsLoading}
                  collections={collections}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
