"use client";

import type { Metadata } from "next"
import { useReadContract } from "@starknet-react/core"
import { AssetInfo } from "./components/asset-info"
import { AssetActivity } from "./components/asset-activity"
import { CollectionCarousel } from "./components/collection-carousel"
import { LicensingSection } from "./components/licensing-section"
import { ActionButtons } from "./components/action-buttons"
import { AssetMetadata } from "./components/asset-metadata"
import { CreatorInfo } from "./components/creator-info"
import { LicensePreview } from "./components/license-preview"
import { abi } from "@/abis/abi"
import { Abi } from "starknet"
import { CONTRACT_ADDRESS } from "@/lib/constants"
import { useEffect, useState } from "react"

interface NFTMetadata {
  name: string;
  description: string;
  author: string;
  type: string;
  image: string;
  version: string;
  external_url: string;
}

export default function AssetDashboard() {
  // Set token ID to 1 as specified
  const tokenId = 1;
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  
  // Read basic NFT information (name, symbol)
  const { data: nftSymbol } = useReadContract({
    abi: abi as Abi,
    functionName: "symbol",
    address: CONTRACT_ADDRESS,
    args: [],
  });

  // Read token name
  const { data: nftName } = useReadContract({
    abi: abi as Abi,
    functionName: "name",
    address: CONTRACT_ADDRESS,
    args: [],
  });

  // Read token URI for metadata
  const { data: tokenURI } = useReadContract({
    abi: abi as Abi,
    functionName: "tokenURI",
    address: CONTRACT_ADDRESS,
    args: [tokenId],
  });

  // Read token owner
  const { data: tokenOwner } = useReadContract({
    abi: abi as Abi,
    functionName: "ownerOf",
    address: CONTRACT_ADDRESS,
    args: [tokenId],
  });

  // Fetch metadata when tokenURI changes
  useEffect(() => {
    const fetchMetadata = async () => {
      if (tokenURI) {
        try {
          const response = await fetch(tokenURI);
          const data = await response.json();
          setMetadata(data);
        } catch (error) {
          console.error('Error fetching metadata:', error);
        }
      }
    };

    fetchMetadata();
  }, [tokenURI]);
  
  // Construct NFT data object to pass to components
  const nftData = {
    title: metadata?.name || nftName || "Unnamed NFT",
    description: metadata?.description || "",
    nftId: "NFT #" + tokenId,
    symbol: nftSymbol || "NIL",
    tokenId: tokenId.toString(),
    tokenURI: tokenURI || "",
    owner: tokenOwner || "",
    tokenStandard: "ERC721",
    collection: nftName || "Collection",
    creator: metadata?.author || tokenOwner || "",
    imageUrl: metadata?.image || "/background.jpg",
    blockchain: "Starknet",
    contractAddress: CONTRACT_ADDRESS || "",
    ipfsUrl: tokenURI || "",
    externalUrl: metadata?.external_url || ""
  };
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 overflow-x-hidden">
        <h1 className="text-2xl font-bold">Programmable IP Dashboard</h1>
      <AssetInfo nftData={nftData} />
      <ActionButtons />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AssetMetadata nftData={nftData} />
        <CreatorInfo nftData={nftData}/>
      </div>
      <AssetActivity />
      <CollectionCarousel />
      <LicensingSection />
      {/*<LicensePreview />*/}
      <div className="flex mb-20"></div>
    </div>
  )
}

