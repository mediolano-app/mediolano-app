import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function CollectionDetailLoading() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Skeleton className="h-8 w-32" />
              <div className="hidden md:flex items-center gap-6">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-18" />
              </div>
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Collection Header */}
        <div className="mb-8">
          <Card className="overflow-hidden border-0 shadow-2xl">
            <CardContent className="p-0">
              <div className="relative">
                <Skeleton className="w-full h-80 md:h-96 lg:h-[28rem]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="max-w-4xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Skeleton className="h-8 w-64" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-5 w-96" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-background/95 backdrop-blur-sm border-t">
                <div className="container mx-auto px-6 py-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="text-center">
                        <Skeleton className="h-6 w-12 mx-auto mb-1" />
                        <Skeleton className="h-4 w-16 mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collection Address */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-80" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                </div>
                <Skeleton className="h-6 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <Skeleton className="flex-1 h-10" />
                <div className="flex gap-4">
                  <Skeleton className="w-40 h-10" />
                  <Skeleton className="w-20 h-10" />
                  <Skeleton className="w-32 h-10" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-4 space-y-3">
                <div>
                  <Skeleton className="h-5 w-full mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-muted/50">
                  <Skeleton className="flex-1 h-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
