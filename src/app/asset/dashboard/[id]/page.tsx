"use client";

import { AssetInfo } from "./components/asset-info"
import { AssetActivity } from "./components/asset-activity"
import { CollectionCarousel } from "./components/collection-carousel"
import { LicensingSection } from "./components/licensing-section"
import { ActionButtons } from "./components/action-buttons"
import { AssetMetadata } from "./components/asset-metadata"
import { CreatorInfo } from "./components/creator-info"
import { use } from "react"
import { useNFTDetails } from "@/hooks/useNFTDetails"
import { IPTypeInfo } from "@/components/ip-type-info"

interface AssetPageProps {
    params: Promise<{
      id: string
    }>
  }
  

  export default function AssetPage({ params }: AssetPageProps) {
    // Unwrap the params Promise using React.use()
    const resolvedParams = use(params)
    const { id } = resolvedParams

  const tokenId = id || 42;
  const { nftData } = useNFTDetails(Number(tokenId));

  const extractCidFromUri = (uri?: string): string | null => {
    if (!uri) return null;
    if (uri.startsWith("ipfs://")) return uri.replace("ipfs://", "");
    const match = uri.match(/\/ipfs\/([a-zA-Z0-9]+)/);
    if (match && match[1]) return match[1];
    const parts = uri.split("/");
    const last = parts[parts.length - 1];
    return last && /[a-zA-Z0-9]{34,}/.test(last) ? last : null;
  };
  const ipfsCid = extractCidFromUri(nftData.ipfsUrl) || undefined;
  const ipTemplateAsset = {
    id: String(nftData.tokenId),
    name: nftData.title,
    description: nftData.description,
    image: nftData.imageUrl,
    creator: { name: nftData.creator, address: "" },
    owner: { name: nftData.owner, address: "" },
    ipfsCid,
  };
  
  return (
    <div className="container mx-auto px-4 py-4 space-y-4 overflow-x-hidden">
        <h1 className="text-xl text-foreground/50">Programmable IP Dashboard</h1>
      <AssetInfo nftData={nftData} />
      <ActionButtons />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AssetMetadata nftData={nftData} />
        <CreatorInfo nftData={nftData}/>
      </div>
      <IPTypeInfo asset={ipTemplateAsset as any} />
      <AssetActivity />
      <CollectionCarousel />
      <LicensingSection />
      {/*<LicensePreview />*/}
      <div className="flex mb-20"></div>
    </div>
  )
}

