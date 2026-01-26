"use client"

import { useState, useMemo } from "react"
import { PortfolioAssets } from "@/components/portfolio/portfolio-assets"
import type { TokenData } from "@/hooks/use-portfolio"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, AlertCircle, X, Palette } from "lucide-react"
import { useCreatorData } from "@/components/creator/creator-data-context"

export default function CreatorAssetsPage() {
    const [searchQuery, setSearchQuery] = useState("")

    // Use context instead of hooks - no duplicate data fetching!
    const {
        tokens,
        assetsLoading,
        assetsError,
        collections,
    } = useCreatorData()

    // Filter tokens based on search and exclude remixes
    const standardTokensMap = useMemo(() => {
        const allTokens = Object.values(tokens).flat().filter(asset => {
            if (!searchQuery) return true
            const q = searchQuery.toLowerCase()
            return (
                (asset.name && asset.name.toLowerCase().includes(q)) ||
                (asset.collection_id && asset.collection_id.toLowerCase().includes(q)) ||
                (asset.token_id && asset.token_id.includes(q))
            )
        })

        const standardTokens = allTokens.filter(t =>
            !(t.metadata?.templateType === "Remix Art" ||
                t.metadata?.originalAsset ||
                (t.attributes && t.attributes.some(a => a.trait_type === "Type" && a.value === "Remix")))
        )

        const map: Record<string, TokenData[]> = {}
        standardTokens.forEach(t => {
            if (!map[t.collection_id]) map[t.collection_id] = []
            map[t.collection_id].push(t)
        })
        return map
    }, [tokens, searchQuery])

    const hasAssets = Object.values(standardTokensMap).flat().length > 0

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Glassmorphism Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg blur-xl opacity-50" />
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search assets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-10 bg-background/80 backdrop-blur-sm border-white/10 focus:border-primary/50 transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {assetsError ? (
                <Card className="p-6 bg-destructive/10 border-destructive/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <p>Failed to load assets. Please try again later.</p>
                    </div>
                </Card>
            ) : !assetsLoading && !hasAssets ? (
                <Card className="p-12 text-center bg-muted/20 border-dashed backdrop-blur-sm">
                    <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No assets found</h3>
                    <p className="text-muted-foreground">
                        {searchQuery
                            ? `No assets match "${searchQuery}"`
                            : `This creator hasn't created any assets yet.`}
                    </p>
                </Card>
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
