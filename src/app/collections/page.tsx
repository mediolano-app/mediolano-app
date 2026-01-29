"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CollectionsGrid } from "@/components/collections/collections-public"
import { Skeleton } from "@/components/ui/skeleton"
import { usePaginatedCollections } from "@/hooks/use-collection"
import { ReportAssetDialog } from "@/components/report-asset-dialog"
import { Grid3X3, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function CollectionsPage() {
  const router = useRouter();
  const { collections, loading, loadingMore, error, hasMore, loadMore } = usePaginatedCollections(12);

  const [reportDialogState, setReportDialogState] = useState<{ isOpen: boolean; collectionId: string; collectionName: string }>({
    isOpen: false,
    collectionId: "",
    collectionName: ""
  });

  return (
    <main className="container mx-auto px-4">

      <div className="py-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Collections</h1>
      </div>

      <div className="container">


        {/* Show loading state while data is being fetched */}
        {loading && (
          <div className="space-y-10">
            <CollectionsSkeleton />
          </div>
        )}

        {/* Show error state */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading collections</p>
          </div>
        )}

        {/* Show collections when loaded successfully */}
        {!loading && !error && collections && collections.length > 0 && (
          <div className="mb-10">
            {/* collections in grid */}
            <div className="mt-8">
              <CollectionsGrid collections={collections} />

              {!hasMore && collections.length > 0 && (
                <div className="mt-16 text-center text-muted-foreground pb-10">
                  <Badge variant="outline" className="text-muted-foreground">You have reached the end of the Protocol</Badge>
                </div>
              )}

              {hasMore && (
                <div className="mt-12 mb-10 text-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => loadMore()}
                    disabled={loadingMore}
                    className="min-w-[200px] h-12 text-md font-medium shadow-sm transition-all hover:shadow-md"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
                        Loading more...
                      </>
                    ) : (
                      "Load More Collections"
                    )}
                  </Button>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Displaying {collections.length} collections
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Show no collections message */}
        {!loading && !error && (!collections || collections.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="bg-muted/30 p-6 rounded-full">
              <Grid3X3 className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-bold">No collections found</h3>
              <p className="text-muted-foreground">
                There are no collections available yet. Be the first to create one!
              </p>
            </div>
            <Button asChild size="lg" className="mt-4">
              <Link href="/create/collection">Create Collection</Link>
            </Button>
          </div>
        )}
      </div>

      <ReportAssetDialog
        contentId={reportDialogState.collectionId}
        contentName={reportDialogState.collectionName}
        contentType="collection"
        open={reportDialogState.isOpen}
        onOpenChange={(open) => setReportDialogState(prev => ({ ...prev, isOpen: open }))}
      />
    </main>
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
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="rounded-xl border glass text-card-foreground overflow-hidden h-[380px]">
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
  )
}

