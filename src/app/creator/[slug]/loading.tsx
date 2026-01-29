import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CreatorLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton matched to CreatorHeader */}
      <div className="relative overflow-hidden -mt-[88px] pt-[120px] pb-12 z-0">
        {/* Background Placeholder */}
        <div className="absolute inset-0 z-0 bg-muted/20 animate-pulse" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Avatar Skeleton */}
            <div className="flex flex-col items-center lg:items-start w-full lg:w-auto">
              <Skeleton className="h-28 w-28 md:h-40 md:w-40 rounded-full border-4 border-background shadow-xl" />

              {/* Mobile info skeleton */}
              <div className="mt-4 flex flex-col items-center lg:hidden w-full max-w-xs space-y-3">
                <Skeleton className="h-8 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>

            {/* Desktop Info Skeleton */}
            <div className="hidden lg:block flex-1 mt-4">
              <Skeleton className="h-12 w-64 mb-4" />
              <Skeleton className="h-6 w-full max-w-xl mb-2" />
              <Skeleton className="h-6 w-2/3 max-w-xl mb-6" />
              <div className="flex gap-2">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Loading Indicator */}
          <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
            <div className="h-4 w-4 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="h-4 w-4 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="h-4 w-4 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "300ms" }} />
            <span className="ml-2 text-sm font-medium">Syncing with Starknet...</span>
          </div>

          {/* Content Tabs Skeleton */}
          <div className="space-y-6">
            <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg w-fit">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="overflow-hidden border-border/50 bg-card/50">
                    <Skeleton className="aspect-square w-full" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
