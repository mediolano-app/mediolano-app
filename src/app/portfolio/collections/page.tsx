"use client";

import { usePortfolio } from "@/hooks/use-portfolio";
import { CollectionsPortfolioGrid } from "@/components/collections/collections-portfolio";
import { CollectionStats } from "@/components/collections/collections-stats";
import { CollectionValidator } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAccount } from "@starknet-react/core";
import Link from "next/link";

export default function CollectionsPage() {
  const { address } = useAccount();
  const { collections, stats, loading, error } = usePortfolio();
  
  // Validate collections before passing to components
  const validCollections = collections.filter(collection => {
    const isValid = CollectionValidator.isValid(collection);
    return isValid;
  });

  return (
    <div className="container mx-auto px-4 py-8 mb-20">
      <div className="container py-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">My Collections</h1>
          <p className="text-muted-foreground">Browse and manage your IP Collections</p>
        </div>

        {!address ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Please connect your wallet to view your collections</p>
          </div>
        ) : error ? (
          <Alert variant="destructive">{error}</Alert>
        ) : loading ? (
          <>
            <StatsSkeleton />
            <CollectionsSkeleton />
          </>
        ) : (
          <>
            <CollectionStats
              totalCollections={validCollections.length}
              totalAssets={stats.totalNFTs}
              totalValue={stats.totalValue}
              topCollection={stats.topCollection}
              collections={validCollections}
            />

            {validCollections.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-5">No collections found. Create your first collection to get started.</p>
                <Link href="/create/collection"><Button>Create Collection</Button></Link>
              </div>
            ) : (
              <CollectionsPortfolioGrid collections={validCollections} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array(4)
        .fill(null)
        .map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
    </div>
  );
}

function CollectionsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-64 w-full rounded-xl mb-8" />
      <div className="flex justify-between mb-6">
        <Skeleton className="h-10 w-[350px]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
      </div>
    </div>
  );
}