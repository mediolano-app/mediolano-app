"use client";

import { Suspense, useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Search, X } from "lucide-react";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useAccount } from "@starknet-react/core";
import { Alert } from "@/components/ui/alert";
import { CollectionValidator } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import dynamic from "next/dynamic";

const PortfolioAssets = dynamic(() =>
    import("@/components/portfolio/portfolio-assets").then(mod => mod.PortfolioAssets), {
    loading: () => <AssetsSkeleton />
});

export default function AssetsClientPage() {
    const { address } = useAccount();
    const { collections, loading, error, tokens } = usePortfolio();
    const [searchQuery, setSearchQuery] = useState("");

    // Validate collections before passing to components
    const validCollections = collections.filter(collection => {
        const isValid = CollectionValidator.isValid(collection);
        return isValid;
    });

    // Filter tokens based on search query
    const filteredTokens = useMemo(() => {
        if (!searchQuery) return tokens;

        const query = searchQuery.toLowerCase();
        const filtered: Record<string, any[]> = {};

        Object.keys(tokens).forEach(collectionId => {
            const collectionTokens = tokens[collectionId].filter(asset =>
                (asset.name && asset.name.toLowerCase().includes(query)) ||
                (asset.collection_id && asset.collection_id.toLowerCase().includes(query)) ||
                (asset.token_id && asset.token_id.includes(query))
            );

            if (collectionTokens.length > 0) {
                filtered[collectionId] = collectionTokens;
            }
        });

        return filtered;
    }, [tokens, searchQuery]);

    return (
        <div className="p-8">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/portfolio">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Assets</h1>
                        <p className="text-muted-foreground">View and manage your digital assets</p>
                    </div>
                </div>

                {/* Show message when no wallet is connected */}
                {!address && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Please connect your wallet to view your assets</p>
                    </div>
                )}

                {/* Show content when wallet is connected */}
                {address && (
                    <Suspense fallback={<AssetsSkeleton />}>
                        <div className="space-y-8 container mx-auto">
                            <div className="relative w-full sm:w-[350px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search your assets..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-9"
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

                            {loading ? (
                                <AssetsSkeleton />
                            ) : error ? (
                                <Alert variant="destructive">{error}</Alert>
                            ) : (
                                <PortfolioAssets
                                    tokens={filteredTokens}
                                    loading={loading}
                                    collections={validCollections}
                                />
                            )}
                        </div>
                    </Suspense>
                )}
            </div>
        </div>
    );
}

function AssetsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-[300px]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array(8).fill(0).map((_, i) => (
                    <div key={i} className="rounded-lg border overflow-hidden">
                        <Skeleton className="aspect-square w-full" />
                        <div className="p-3 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                            <div className="pt-2 flex gap-2">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
