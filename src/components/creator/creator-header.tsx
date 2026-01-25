"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    CheckCircle,
    Globe,
    Share2,
} from "lucide-react"
import { getCreatorBySlug } from "@/lib/mock-data"
import { useGetCollections } from "@/hooks/use-collection"
import { useOwnerAssets } from "@/hooks/use-owner-assets"
import { Skeleton } from "@/components/ui/skeleton"

interface CreatorHeaderProps {
    slug: string
}

export function CreatorHeader({ slug }: CreatorHeaderProps) {
    const [resolvedAddress, setResolvedAddress] = useState<string>(slug)
    const [copiedAddress, setCopiedAddress] = useState(false)

    // Derive wallet address for hooks (handle mock slugs)
    const mockCreator = resolvedAddress ? getCreatorBySlug(resolvedAddress) : undefined;
    const walletAddress = mockCreator?.address || resolvedAddress;

    const {
        collections,
        loading: collection_loading,
    } = useGetCollections(walletAddress as `0x${string}`);

    // Fetch assets using the owner assets hook
    const {
        tokens: ownerTokens,
        loading: assetsLoading,
    } = useOwnerAssets(walletAddress, collections);

    // Flatten and filter tokens
    const allTokens = Object.values(ownerTokens).flat();

    // Filter out Remixes (we are hiding them now)
    const standardTokens = allTokens.filter(t =>
        !(t.metadata?.templateType === "Remix Art" ||
            t.metadata?.originalAsset ||
            (t.attributes && t.attributes.some(a => a.trait_type === "Type" && a.value === "Remix")))
    );

    // Determine dynamic header image
    const firstAsset = standardTokens[0];
    const dynamicImage = firstAsset ? firstAsset.image : (collections.length > 0 ? collections[0].image : null);

    const creator = slug ? getCreatorBySlug(slug) : undefined

    // Create fallback creator data for blockchain addresses
    const fallbackCreator = {
        name: creator?.name || `${resolvedAddress.slice(0, 6)}...${resolvedAddress.slice(-4)}`,
        address: creator?.address || resolvedAddress,
        avatar: creator?.avatar || "/placeholder.svg",
        verified: creator?.verified || false,
        bio: creator?.bio || "onchain creator",
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

    const handleCopyAddress = async () => {
        try {
            await navigator.clipboard.writeText(fallbackCreator.address)
            setCopiedAddress(true)
            setTimeout(() => setCopiedAddress(false), 2000)
        } catch (error) {
            console.error("Failed to copy address:", error)
        }
    }

    const isLoading = collection_loading && assetsLoading;

    return (
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
            <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                    {/* Avatar and Basic Info */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                        <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white/20 shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
                            <AvatarImage src={avatarImage} alt={fallbackCreator.name} className="object-cover" />
                            <AvatarFallback className="text-white text-2xl md:text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600">
                                {fallbackCreator.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        {/* Mobile-only basic info */}
                        <div className="mt-4 lg:hidden">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-white shadow-sm">{fallbackCreator.name}</h1>
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
                            <h1 className="text-4xl xl:text-5xl font-bold drop-shadow-md">{fallbackCreator.name}</h1>
                            {fallbackCreator.verified && <CheckCircle className="h-8 w-8 text-blue-400" />}
                        </div>

                        <p className="text-xl text-white/90 mb-6 max-w-2xl leading-relaxed drop-shadow-sm">{fallbackCreator.bio}</p>

                        <div className="flex flex-wrap gap-2 mb-6">
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
                                onClick={handleCopyAddress}
                            >
                                <Share2 className="h-4 w-4 mr-2" />
                                {copiedAddress ? "Copied!" : "Share Profile"}
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
                        <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white flex-1 hover:bg-white/20 transition-colors">
                            <CardContent className="p-2 md:p-4 text-center">
                                {collection_loading ? (
                                    <Skeleton className="h-8 w-16 mx-auto bg-white/20 mb-1" />
                                ) : (
                                    <div className="text-lg md:text-2xl font-bold">{collections.length}</div>
                                )}
                                <div className="text-xs md:text-sm text-white/80">Collections</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white flex-1 hover:bg-white/20 transition-colors">
                            <CardContent className="p-2 md:p-4 text-center">
                                {assetsLoading ? (
                                    <Skeleton className="h-8 w-16 mx-auto bg-white/20 mb-1" />
                                ) : (
                                    <div className="text-lg md:text-2xl font-bold">{standardTokens.length}</div>
                                )}
                                <div className="text-xs md:text-sm text-white/80">Assets</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Mobile Bio Section */}
            <div className="lg:hidden px-4 pb-6 pt-2 text-center">
                <p className="text-white/90 mb-4">{fallbackCreator.bio}</p>
                <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm bg-transparent w-full"
                    onClick={handleCopyAddress}
                >
                    <Share2 className="h-4 w-4 mr-2" />
                    Copy Address
                </Button>
            </div>
        </div>
    )
}
