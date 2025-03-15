import { Suspense } from "react"
import { getCollections } from "@/lib/mockupPortfolioData"
import { CollectionsGrid } from "@/components/CollectionsGrid"
import { CollectionStats } from "@/components/CollectionsStats"
import { Skeleton } from "@/components/ui/skeleton"

export default function CollectionsPage() {
  const collections = getCollections()

  return (
    <div className="container mx-auto px-4 py-8 mb-20">
      <div className="container py-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">Browse and manage your NFT collections</p>
        </div>

        <Suspense fallback={<StatsSkeleton />}>
          <CollectionStats />
        </Suspense>

        <Suspense fallback={<CollectionsSkeleton />}>
          <CollectionsGrid collections={collections} />
        </Suspense>
      </div>
    </div>
  )
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
  )
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
  )
}

