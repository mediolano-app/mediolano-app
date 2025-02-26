import type { Metadata } from "next"
import { AssetInfo } from "./components/asset-info"
import { AssetActivity } from "./components/asset-activity"
import { CollectionCarousel } from "./components/collection-carousel"
import { LicensingSection } from "./components/licensing-section"
import { ActionButtons } from "./components/action-buttons"
import { AssetMetadata } from "./components/asset-metadata"
import { CreatorInfo } from "./components/creator-info"
import { LicensePreview } from "./components/license-preview"

export default function AssetDashboard() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 overflow-x-hidden">
        <h1 className="text-2xl font-bold">Programmable IP Dashboard</h1>
      <AssetInfo />
      <ActionButtons />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AssetMetadata />
        <CreatorInfo />
      </div>
      <AssetActivity />
      <CollectionCarousel />
      <LicensingSection />
      {/*<LicensePreview />*/}
      <div className="flex mb-20"></div>
    </div>
  )
}

