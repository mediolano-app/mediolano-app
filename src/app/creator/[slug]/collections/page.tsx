"use client"

import { useState, use, useMemo } from "react"
import { CollectionCard } from "@/components/collection-card"
import { useGetCollections } from "@/hooks/use-collection"
import { getCreatorBySlug } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { Search, FolderOpen, AlertCircle, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CreatorCollectionsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const [searchQuery, setSearchQuery] = useState("")

    const mockCreator = slug ? getCreatorBySlug(slug) : undefined;
    const walletAddress = mockCreator?.address || slug;

    const { collections, loading, error } = useGetCollections(walletAddress as `0x${string}`);

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
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search collections..."
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
                    <p>Failed to load collections. Please try again later.</p>
                </div>
            ) : loading ? (
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
                <Card className="p-12 text-center bg-muted/20 border-dashed">
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
