"use client";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid3X3, ArrowLeft } from "lucide-react";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useAccount } from "@starknet-react/core";
import { Alert } from "@/components/ui/alert";
import { CollectionValidator } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";

const CollectionsPortfolioGrid = dynamic(() =>
    import("@/components/collections/collections-portfolio").then(mod => mod.CollectionsPortfolioGrid), {
    loading: () => <CollectionsSkeleton />
});

export default function CollectionsClientPage() {
    const { address } = useAccount();
    const { collections, loading, error } = usePortfolio();

    // Validate collections before passing to components
    const validCollections = collections.filter(collection => {
        const isValid = CollectionValidator.isValid(collection);
        return isValid;
    });

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
                        <h1 className="text-2xl font-bold tracking-tight">My Collections</h1>
                        <p className="text-muted-foreground">Manage your created collections</p>
                    </div>
                </div>

                {/* Show message when no wallet is connected */}
                {!address && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Please connect your wallet to view your collections</p>
                    </div>
                )}

                {/* Show content when wallet is connected */}
                {address && (
                    <Suspense fallback={<CollectionsSkeleton />}>
                        <div className="space-y-8 container mx-auto">

                            {loading ? (
                                <CollectionsSkeleton />
                            ) : error ? (
                                <Alert variant="destructive">{error}</Alert>
                            ) : (
                                <div className="space-y-6">
                                    {validCollections.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                                            <div className="bg-muted/30 p-6 rounded-full">
                                                <Grid3X3 className="h-10 w-10 text-muted-foreground/50" />
                                            </div>
                                            <div className="space-y-2 max-w-md">
                                                <h3 className="text-xl font-bold">No collections found</h3>
                                                <p className="text-muted-foreground">
                                                    You don't have any collections yet. Create your first IP collection to start managing your assets.
                                                </p>
                                            </div>
                                            <Button asChild size="lg" className="mt-4">
                                                <Link href="/create/collection">Create Collection</Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <CollectionsPortfolioGrid collections={validCollections} />
                                    )}
                                </div>
                            )}
                        </div>
                    </Suspense>
                )}
            </div>
        </div>
    );
}

function CollectionsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Skeleton className="h-10 w-full sm:w-[350px]" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-36" />
                </div>
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {Array(6)
                    .fill(null)
                    .map((_, i) => (
                        <div key={i} className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden h-[380px]">
                            <Skeleton className="h-64 w-full" />
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <div className="flex justify-between pt-4">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
