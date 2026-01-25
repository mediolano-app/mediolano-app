"use client"

import { useState, use, useMemo } from "react"
import { useOwnerAssets } from "@/hooks/use-owner-assets"
import { useGetCollections } from "@/hooks/use-collection"
import { getCreatorBySlug } from "@/lib/mock-data"
import { PortfolioAssets } from "@/components/portfolio/portfolio-assets"
import type { TokenData } from "@/hooks/use-portfolio"
import { Input } from "@/components/ui/input"
import { Search, AlertCircle, X } from "lucide-react"

export default function CreatorAssetsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const [searchQuery, setSearchQuery] = useState("")

    const mockCreator = slug ? getCreatorBySlug(slug) : undefined;
    const walletAddress = mockCreator?.address || slug;

    // We need collections for useOwnerAssets
    const { collections, error: collectionsError } = useGetCollections(walletAddress as `0x${string}`);

    const {
        tokens: ownerTokens,
        loading: assetsLoading,
        error: assetsError
    } = useOwnerAssets(walletAddress, collections);

    const error = collectionsError || assetsError;

    // Flatten and filter tokens
    const standardTokensMap = useMemo(() => {
        const allTokens = Object.values(ownerTokens).flat().filter(asset => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return (
                (asset.name && asset.name.toLowerCase().includes(q)) ||
                (asset.collection_id && asset.collection_id.toLowerCase().includes(q)) ||
                (asset.token_id && asset.token_id.includes(q))
            );
        });

        const standardTokens = allTokens.filter(t =>
            !(t.metadata?.templateType === "Remix Art" ||
                t.metadata?.originalAsset ||
                (t.attributes && t.attributes.some(a => a.trait_type === "Type" && a.value === "Remix")))
        );

        const map: Record<string, TokenData[]> = {};
        standardTokens.forEach(t => {
            if (!map[t.collection_id]) map[t.collection_id] = [];
            map[t.collection_id].push(t);
        });
        return map;
    }, [ownerTokens, searchQuery]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {error ? (
                <div className="p-6 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3">
                    <AlertCircle className="h-5 w-5" />
                    <p>Failed to load assets. Please try again later.</p>
                </div>
            ) : (
                <PortfolioAssets
                    tokens={standardTokensMap}
                    loading={assetsLoading}
                    collections={collections}
                />
            )}
        </div>
    )
}
