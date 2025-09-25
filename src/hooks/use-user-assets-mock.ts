"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import type { UserAsset } from "./use-user-assets";

// Mock data for testing when you don't have real MIP Collection assets
const MOCK_ASSETS: UserAsset[] = [
  {
    id: "collection-1-token-1",
    tokenId: "1",
    collectionId: "1", 
    contractAddress: "0x0508f7202628ca1a3a7cfa11400ad7271f6d0dc285c9334b742fd5f6322929e7",
    name: "Digital Artwork #1",
    creator: "Artist Creator",
    verified: true,
    image: "https://gateway.pinata.cloud/ipfs/QmYourImageHash",
    collection: "Art Collection",
    licenseType: "Creative Commons",
    description: "Beautiful digital artwork showcasing modern design principles",
    registrationDate: "2024-01-15",
    value: "0.5 ETH",
    views: 150,
    type: "Art",
    protectionLevel: 85,
    metadata: {
      name: "Digital Artwork #1",
      description: "Beautiful digital artwork showcasing modern design principles", 
      image: "https://gateway.pinata.cloud/ipfs/QmYourImageHash",
      attributes: [
        { trait_type: "Type", value: "Art" },
        { trait_type: "Rarity", value: "Rare" }
      ]
    },
    ownershipHistory: [
      {
        owner: "0x123...",
        acquiredDate: "2024-01-15",
        transferType: "Creation"
      }
    ],
    licensingTerms: {
      type: "Creative Commons",
      commercialUse: true,
      modifications: true, 
      attribution: true,
      territory: "Worldwide"
    }
  },
  {
    id: "collection-1-token-2",
    tokenId: "2",
    collectionId: "1",
    contractAddress: "0x0508f7202628ca1a3a7cfa11400ad7271f6d0dc285c9334b742fd5f6322929e7",
    name: "Audio Track - Synthwave Beats",
    creator: "Music Producer",
    verified: true,
    image: "https://gateway.pinata.cloud/ipfs/QmAudioImageHash",
    collection: "Music Collection",
    licenseType: "Commercial Use",
    description: "High-energy synthwave track perfect for gaming and media",
    registrationDate: "2024-02-01",
    value: "1.2 ETH",
    views: 89,
    type: "Audio",
    protectionLevel: 92,
    metadata: {
      name: "Audio Track - Synthwave Beats",
      description: "High-energy synthwave track perfect for gaming and media",
      image: "https://gateway.pinata.cloud/ipfs/QmAudioImageHash"
    },
    ownershipHistory: [
      {
        owner: "0x123...",
        acquiredDate: "2024-02-01", 
        transferType: "Creation"
      }
    ],
    licensingTerms: {
      type: "Commercial Use",
      commercialUse: true,
      modifications: false,
      attribution: true,
      territory: "Worldwide"
    }
  },
  {
    id: "collection-2-token-1", 
    tokenId: "1",
    collectionId: "2",
    contractAddress: "0x0508f7202628ca1a3a7cfa11400ad7271f6d0dc285c9334b742fd5f6322929e7",
    name: "Software License - API Tool",
    creator: "Dev Studio",
    verified: true,
    image: "https://gateway.pinata.cloud/ipfs/QmSoftwareImageHash",
    collection: "Software Collection",
    licenseType: "Open Source",
    description: "Powerful API integration tool for developers",
    registrationDate: "2024-01-30",
    value: "2.1 ETH", 
    views: 245,
    type: "Software",
    protectionLevel: 78,
    metadata: {
      name: "Software License - API Tool",
      description: "Powerful API integration tool for developers",
      image: "https://gateway.pinata.cloud/ipfs/QmSoftwareImageHash"
    },
    ownershipHistory: [
      {
        owner: "0x123...",
        acquiredDate: "2024-01-30",
        transferType: "Creation"
      }
    ],
    licensingTerms: {
      type: "Open Source",
      commercialUse: true,
      modifications: true,
      attribution: true,
      territory: "Worldwide"
    }
  }
];

export const useUserAssetsMock = () => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const refetch = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return {
    assets: address ? MOCK_ASSETS : [],
    loading,
    error,
    refetch,
    totalCount: address ? MOCK_ASSETS.length : 0,
  };
};