"use client";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CreatorNFTPortfolio from "@/components/creator-asset/creator-portfolio";

export default function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-5 mb-20">
      <div className="space-y-1 mb-5">
        <h1 className="text-2xl font-bold tracking-tight">IP Portfolio</h1>
        <p className="text-muted-foreground">
          Showcase and manage your digital assets
        </p>
      </div>
      <Suspense fallback={<PortfolioSkeleton />}>
        <CreatorNFTPortfolio />
      </Suspense>
    </div>
  );
}

function PortfolioSkeleton() {
  return (
    <div className="space-y-6">
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
