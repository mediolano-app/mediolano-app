import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CollectionsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Skeleton */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Skeleton className="h-8 w-32" />
              <div className="hidden md:flex items-center gap-6">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <Skeleton className="h-10 flex-1" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Collection Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="h-full overflow-hidden">
              <CardHeader className="p-0">
                <Skeleton className="aspect-video w-full" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardContent>
              <div className="p-4 pt-0">
                <Skeleton className="h-9 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
