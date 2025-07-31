"use client"

import { useRouter } from "next/navigation"
import { CollectionsGrid, FeaturedCollectionCard } from "@/components/collections/collections-public"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetAllCollections } from "@/hooks/use-collection"

export default function CollectionsPage() {
  const router = useRouter();
  const { collections, loading, error } = useGetAllCollections();
  const featuredCollectionId = "5";


  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mb-20">
        <div className="container py-10 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Collections</h1>
            <p className="text-muted-foreground">Discover IP Collections</p>
          </div>
          <CollectionsSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    console.log("error loading collections", error);  
    return (
      <div className="container mx-auto px-4 py-8 mb-20">
        <div className="container py-10 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Collections</h1>
            <p className="text-muted-foreground">Discover IP Collections</p>
          </div>
          <div className="text-center py-8">
            <p className="text-red-500">Error loading collections</p>
          </div>
        </div>
      </div>
    );    
  }

  return (
    <div className="container mx-auto px-4 py-8 mb-20">
      <div className="container py-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">Discover IP Collections</p>
        </div>

        {collections && collections.length > 0 ? (
          <>
            {collections.length > 0 && (
              <div className="mb-10">
                  {(() => {
                   // Find featured collection otherwise use the first collection
                   const featuredCollection = collections.find(c => c.id.toString() === featuredCollectionId) || collections[0];
                   const remainingCollections = collections.find(c => c.id.toString() === featuredCollectionId) 
                     ? collections.filter(c => c.id.toString() !== featuredCollectionId)
                     : collections.slice(1);
                  
                  return (
                    <>
                      <FeaturedCollectionCard
                        collection={featuredCollection}
                        nftCount={featuredCollection.itemCount}
                        onClick={() => router.push(`/collections/${featuredCollection.id}`)}
                      />
                      {/* collections in grid */}
                      {remainingCollections.length > 0 && (
                        <div className="mt-8">
                          <CollectionsGrid collections={remainingCollections} />
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No collections found</p>
          </div>
        )}
      </div>
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

