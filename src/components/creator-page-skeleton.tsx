
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import NFTSkeleton from "@/components/assets/nft-skeleton"

export function CreatorPageSkeleton() {
    return (
        <div className="min-h-screen">
            {/* Hero Skeleton */}
            <div className="relative h-[400px] w-full bg-muted/30">
                <div className="container mx-auto px-4 py-12 md:py-20 h-full flex items-center">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 w-full z-10">
                        <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full" />
                        <div className="flex-1 space-y-4 w-full text-center lg:text-left">
                            <Skeleton className="h-10 w-64 mx-auto lg:mx-0" />
                            <Skeleton className="h-4 w-full max-w-2xl mx-auto lg:mx-0" />
                            <Skeleton className="h-4 w-3/4 max-w-xl mx-auto lg:mx-0" />
                            <div className="flex gap-2 justify-center lg:justify-start mt-4">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Skeleton */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    <div className="xl:col-span-4 space-y-6">
                        {/* Tabs Skeleton */}
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                <Skeleton className="h-10 w-32" />
                                <Skeleton className="h-10 w-32" />
                                <Skeleton className="h-10 w-32" />
                            </div>
                            <div className="flex gap-4">
                                <Skeleton className="h-10 w-64" />
                            </div>
                        </div>

                        {/* Grid Skeleton */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(6).fill(0).map((_, i) => (
                                <NFTSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
