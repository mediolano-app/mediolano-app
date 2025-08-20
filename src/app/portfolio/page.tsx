"use client";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useAccount } from "@starknet-react/core";
import { Alert } from "@/components/ui/alert";
import { CollectionsPortfolioGrid } from "@/components/collections/collections-portfolio";
import { CollectionStats } from "@/components/collections/collections-stats";
import { CollectionValidator } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PortfolioPage() {
  const { address } = useAccount();
  const { collections, stats, loading, error } = usePortfolio();

  // Validate collections before passing to components
  const validCollections = collections.filter(collection => {
    const isValid = CollectionValidator.isValid(collection);
    return isValid;
  });

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8 mt-5 mb-20">
        <div className="space-y-1 mb-5">
          <h1 className="text-2xl font-bold tracking-tight">IP Portfolio</h1>
          <p className="text-muted-foreground badge">
            Connect your wallet to open your onchain portfolio
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-5 mb-20">
        <div className="space-y-1 mb-5">
          <h1 className="text-2xl font-bold tracking-tight">IP Portfolio</h1>
          <p className="text-muted-foreground">
            Showcase and manage your digital assets
          </p>
        </div>
        <Alert variant="destructive">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="bg-background/70 p-8 mb-20">
      <main className="container mx-auto px-4 py-6">
      <div className="space-y-1 mb-5">
        <h1 className="text-2xl font-bold tracking-tight">IP Portfolio</h1>
        <p className="text-muted-foreground">
          Showcase and manage your digital assets
        </p>
      </div>
      </main>
      <Suspense fallback={<PortfolioSkeleton />}>
        <div className="space-y-8">
          {loading ? (
            <StatsSkeleton />
          ) : (
            <CollectionStats
              totalCollections={validCollections.length}
              totalAssets={stats.totalNFTs}
              totalValue={stats.totalValue}
              topCollection={stats.topCollection}
              collections={validCollections}
            />
          )}

          {loading ? (
            <CollectionsSkeleton />
          ) : validCollections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-5">No collections found. Create your first collection to get started.</p>
              <Button variant="outline" asChild>
                <Link href="/create/collection">Create Collection</Link>
              </Button>
            </div>
          ) : (
            <CollectionsPortfolioGrid collections={validCollections} />
          )}
        </div>
      </Suspense>
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

function PortfolioSkeleton() {
  return (
    <div className="space-y-6 max-w-screen-lg mx-auto">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Skeleton className="h-10 w-full sm:w-[250px]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
      </div>
    </div>
  );
}
