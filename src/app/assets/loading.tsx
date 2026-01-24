import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function AssetCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-4 w-1/2" />
                <div className="pt-2 flex gap-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        </Card>
    )
}

export default function AssetsLoading() {
    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8 md:py-12 lg:py-16 space-y-8 md:space-y-12">
                {/* Hero Section Skeleton */}
                <div className="text-center space-y-4 md:space-y-6 max-w-4xl mx-auto">
                    <Skeleton className="h-8 w-40 mx-auto rounded-full" />
                    <Skeleton className="h-10 w-64 mx-auto" />
                    <Skeleton className="h-5 w-80 mx-auto" />
                </div>

                {/* Search Bar Skeleton */}
                <div className="flex justify-center">
                    <Skeleton className="h-10 w-full max-w-md" />
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array(8).fill(0).map((_, i) => (
                        <AssetCardSkeleton key={i} />
                    ))}
                </div>
            </main>
        </div>
    )
}
