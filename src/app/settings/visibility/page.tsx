import AssetFetcher from "@/components/assets/AssetFetcher"
import AssetDashboard from "@/components/assets/AssetDashboard"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AssetsVisibility() {
  return (
    <Suspense fallback={<AssetDashboardSkeleton />}>
      <AssetFetcher>{(assets) => <AssetDashboard initialAssets={assets} />}</AssetFetcher>
    </Suspense>
  )
}

function AssetDashboardSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Asset Visibility Dashboard</h1>
      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

