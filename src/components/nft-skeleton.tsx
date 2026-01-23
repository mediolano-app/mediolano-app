import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function NFTSkeleton() {
  return (
    <Card className="overflow-hidden border bg-card/50 backdrop-blur-sm">
      {/* Image Skeleton */}
      <Skeleton className="aspect-square w-full" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Menu */}
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-32 flex-1" />
          <Skeleton className="h-8 w-8 rounded-md shrink-0" />
        </div>

        {/* Creator info */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-3 w-24 flex-1" />
        </div>

        {/* Footer section */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </Card>
  )
}
