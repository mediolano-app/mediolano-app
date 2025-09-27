"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CollectionsGrid, FeaturedCollectionCard } from "@/components/collections/collections-public"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetAllCollections } from "@/hooks/use-collection"
import { ReportAssetDialog } from "@/components/report-asset-dialog"
import { HeroSlider } from "@/components/hero-slider"

export default function CollectionsPage() {
  const router = useRouter();
  const { collections, loading, error } = useGetAllCollections();
  const featuredCollectionId = "5";
  const [reportDialogState, setReportDialogState] = useState<{ isOpen: boolean; collectionId: string; collectionName: string }>({
    isOpen: false,
    collectionId: "",
    collectionName: ""
  });

  return (
    <div className="container mx-auto px-4 py-8 mb-20">




      <div className="container py-10 space-y-8">
        <div className="space-y-2">
          <p className="text-muted-foreground">Explore IP Collections</p>
        </div>

        {/* Show loading state while data is being fetched */}
        {loading && <CollectionsSkeleton />}

        {/* Show error state */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading collections</p>
          </div>
        )}

        {/* Show collections when loaded successfully */}
        {!loading && !error && collections && collections.length > 0 && (() => {
          // Find featured collection otherwise use the first collection
          const featuredCollection = collections.find(c => c.id.toString() === featuredCollectionId) || collections[0];
          const remainingCollections = collections.find(c => c.id.toString() === featuredCollectionId) 
            ? collections.filter(c => c.id.toString() !== featuredCollectionId)
            : collections.slice(1);
          
          return (
            <div className="mb-10">


              <HeroSlider />
              
              {/* featured collection 
              <div onClick={() => router.push(`/collections/${featuredCollection.id}`)}>
                <FeaturedCollectionCard
                  collection={featuredCollection}
                  nftCount={featuredCollection.itemCount}
                  onReportClick={() => setReportDialogState({
                    isOpen: true,
                    collectionId: String(featuredCollection.id),
                    collectionName: featuredCollection.name
                  })}
                />
              </div>*/}
              
              
              
              
              {/* collections in grid */}
              {remainingCollections.length > 0 && (
                <div className="mt-8">
                  <CollectionsGrid collections={remainingCollections} />
                </div>
              )}
            </div>
          );
        })()}

        {/* Show no collections message */}
        {!loading && !error && (!collections || collections.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No collections found</p>
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
  )
}

