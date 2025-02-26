import type { Asset } from "@/types/asset"
import { mockAssets } from "@/lib/mockAssetsVisib"
import type React from "react" // Import React

async function fetchAssets(): Promise<Asset[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockAssets
}

export default async function AssetFetcher({ children }: { children: (assets: Asset[]) => React.ReactNode }) {
  const assets = await fetchAssets()
  return children(assets)
}

