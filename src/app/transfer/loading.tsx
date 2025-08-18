import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="w-40">
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="mb-6">
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </main>
    </div>
  )
}
