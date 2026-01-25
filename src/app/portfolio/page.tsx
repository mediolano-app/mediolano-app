"use client";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid3X3 } from "lucide-react";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useAccount } from "@starknet-react/core";
import { Alert } from "@/components/ui/alert";
import { CollectionsPortfolioGrid } from "@/components/collections/collections-portfolio";
import { CollectionStats } from "@/components/collections/collections-stats";
import { CollectionValidator } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioAssets } from "@/components/portfolio/portfolio-assets";

export default function PortfolioPage() {
  const { address } = useAccount();
  const { collections, stats, loading, error, tokens } = usePortfolio();

  // Validate collections before passing to components
  const validCollections = collections.filter(collection => {
    const isValid = CollectionValidator.isValid(collection);
    return isValid;
  });

  return (
    <div className="p-8">
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-1 mb-5 px-4 mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">IP Portfolio</h1>
          {address ?
            <p className="text-muted-foreground">
              Showcase and manage your digital assets
            </p> :
            <p className="text-muted-foreground badge">
              Connect your wallet to open your onchain portfolio.
            </p>
          }
        </div>
      </div>

      {/* Show message when no wallet is connected */}
      {!address && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Please connect your wallet to view your portfolio</p>
        </div>
      )}

      {/* Show content when wallet is connected */}
      {address && (
        <Suspense fallback={<PortfolioSkeleton />}>
          <div className="space-y-8 container mx-auto">
            {loading ? (
              <StatsSkeleton />
            ) : (
              <CollectionStats
                totalCollections={validCollections.length}
                totalAssets={stats.totalNFTs}
                totalValue={stats.totalValue}
                topCollection={stats.topCollection}
                collections={validCollections}
                tokens={tokens}
              />
            )}

            {loading ? (
              <CollectionsSkeleton />
            ) : error ? (
              <Alert variant="destructive">{error}</Alert>
            ) : (
              <Tabs defaultValue="collections" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 max-w-[400px]">
                  <TabsTrigger value="collections">Collections</TabsTrigger>
                  <TabsTrigger value="assets">My Assets</TabsTrigger>
                </TabsList>

                <TabsContent value="collections" className="space-y-6">
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
                </TabsContent>

                <TabsContent value="assets">
                  <PortfolioAssets
                    tokens={tokens}
                    loading={loading}
                    collections={validCollections}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </Suspense>
      )}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Array(4)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="rounded-xl border glass text-card-foreground shadow space-y-2 p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
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

function PortfolioSkeleton() {
  return (
    <div className="space-y-8 container mx-auto">
      <StatsSkeleton />
      <CollectionsSkeleton />
    </div>
  );
}
