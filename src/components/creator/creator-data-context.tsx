"use client"

import { createContext, useContext, useMemo, ReactNode } from "react"
import { useGetCollections } from "@/hooks/use-collection"
import { useOwnerAssets } from "@/hooks/use-owner-assets"
import { getCreatorBySlug } from "@/lib/start-data"
import type { Collection } from "@/lib/types"
import type { TokenData, PortfolioStats } from "@/hooks/use-portfolio"

interface CreatorData {
    // Core data
    slug: string
    walletAddress: string

    // Collections
    collections: Collection[]
    collectionsLoading: boolean
    collectionsError: string | null

    // Assets/Tokens
    tokens: Record<string, TokenData[]>
    standardTokens: TokenData[]
    assetsLoading: boolean
    assetsError: string | null
    stats: PortfolioStats

    // Creator info
    creatorInfo: {
        name: string
        address: string
        avatar: string
        verified: boolean
        bio: string
        website: string
        twitter: string
        instagram: string
        discord: string
        joinDate: string
        specialties: string[]
        location: string
    }

    // Derived data for header
    headerImage: string | null
    avatarImage: string | null

    // Refresh functions
    refetchCollections: () => void
    refetchAssets: () => void
}

const CreatorDataContext = createContext<CreatorData | null>(null)

export function useCreatorData() {
    const context = useContext(CreatorDataContext)
    if (!context) {
        throw new Error("useCreatorData must be used within a CreatorDataProvider")
    }
    return context
}

interface CreatorDataProviderProps {
    slug: string
    children: ReactNode
}

export function CreatorDataProvider({ slug, children }: CreatorDataProviderProps) {
    // Resolve wallet address from slug (handle mock creators)
    const mockCreator = slug ? getCreatorBySlug(slug) : undefined
    const walletAddress = mockCreator?.address || slug

    // Fetch collections ONCE
    const {
        collections,
        loading: collectionsLoading,
        error: collectionsError,
        reload: refetchCollections,
    } = useGetCollections(walletAddress as `0x${string}`)

    // Fetch assets ONCE (depends on collections)
    const {
        tokens,
        stats,
        loading: assetsLoading,
        error: assetsError,
        refetch: refetchAssets,
    } = useOwnerAssets(walletAddress, collections)

    // Memoize standard tokens (filter out remixes)
    const standardTokens = useMemo(() => {
        const allTokens = Object.values(tokens).flat()
        return allTokens.filter(t =>
            !(t.metadata?.templateType === "Remix Art" ||
                t.metadata?.originalAsset ||
                (t.attributes && t.attributes.some(a => a.trait_type === "Type" && a.value === "Remix")))
        )
    }, [tokens])

    // Creator info with fallbacks
    const creatorInfo = useMemo(() => {
        const creator = slug ? getCreatorBySlug(slug) : undefined
        return {
            name: creator?.name || `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
            address: creator?.address || walletAddress,
            avatar: creator?.avatar || "",
            verified: creator?.verified || false,
            bio: creator?.bio || "onchain creator",
            website: creator?.website || "",
            twitter: creator?.twitter || "",
            instagram: creator?.instagram || "",
            discord: creator?.discord || "",
            joinDate: creator?.joinDate || "",
            specialties: creator?.specialties || [],
            location: creator?.location || "",
        }
    }, [slug, walletAddress])

    // Determine dynamic header image from first valid asset or collection
    const headerImage = useMemo(() => {
        const validAsset = standardTokens.find(t => t.image && t.image !== "/placeholder.svg");
        if (validAsset) {
            return validAsset.image || null;
        }

        const validCollection = collections.find(c => c.image && c.image !== "/placeholder.svg");
        if (validCollection) {
            return validCollection.image || null;
        }

        return null;
    }, [standardTokens, collections])

    // Avatar image with fallback
    const avatarImage = useMemo(() => {
        return headerImage || creatorInfo.avatar || null
    }, [headerImage, creatorInfo.avatar])

    const value: CreatorData = {
        slug,
        walletAddress,
        collections,
        collectionsLoading,
        collectionsError,
        tokens,
        standardTokens,
        assetsLoading,
        assetsError,
        stats,
        creatorInfo,
        headerImage,
        avatarImage,
        refetchCollections,
        refetchAssets,
    }

    return (
        <CreatorDataContext.Provider value={value}>
            {children}
        </CreatorDataContext.Provider>
    )
}
