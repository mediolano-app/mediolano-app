"use client"

import { useState, useMemo } from "react"
import { CollectionCard } from "@/components/collection-card"
import { Input } from "@/components/ui/input"
import { Search, FolderOpen, AlertCircle, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useCreatorData } from "@/components/creator/creator-data-context"

export default function CreatorCollectionsPage() {
    const [searchQuery, setSearchQuery] = useState("")

    // Use context instead of hooks - no duplicate data fetching!
    const { collections, collectionsLoading, collectionsError } = useCreatorData()

    const filteredCollections = useMemo(() => {
        if (!searchQuery) return collections

        const lowerQuery = searchQuery.toLowerCase()
        return collections.filter(
            (collection) =>
                (collection.name || "").toLowerCase().includes(lowerQuery) ||
                (collection.description || "").toLowerCase().includes(lowerQuery)
        )
    }, [collections, searchQuery])

    return (
        <div className="container mx-auto px-4 py-8 pb-20">
            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg blur-xl opacity-50" />
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search collections..."
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

            {collectionsError ? (
                <Card className="p-6 bg-destructive/10 border-destructive/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <p>Failed to load collections. Please try again later.</p>
                    </div>
                </Card>
            ) : collectionsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-[300px] w-full bg-muted/50 rounded-xl animate-pulse backdrop-blur-sm" />
                    ))}
                </div>
            ) : filteredCollections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCollections.map((collection, index) => (
                        <CollectionCard key={collection.id} collection={collection} index={index} />
                    ))}
                </div>
            ) : (
                <Card className="p-12 text-center bg-muted/20 border-dashed backdrop-blur-sm">
                    <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No collections found</h3>
                    <p className="text-muted-foreground">
                        {searchQuery
                            ? `No collections match "${searchQuery}"`
                            : `This creator hasn't created any collections yet.`}
                    </p>
                </Card>
            )}
        </div>
    )
}
