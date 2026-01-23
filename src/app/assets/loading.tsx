import { Skeleton } from "@/components/ui/skeleton"

export default function AssetsLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 hidden sm:block" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-9 rounded" />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 py-6 space-y-6">
        {/* Page Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Search and Filters Skeleton */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-10 flex-1" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>

        {/* Results Summary Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Assets Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-center gap-2 pt-8">
          <Skeleton className="h-9 w-20" />
          <div className="flex gap-1">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-9 w-9" />
              ))}
          </div>
          <Skeleton className="h-9 w-16" />
        </div>
      </main>
    </div>
  )
}
