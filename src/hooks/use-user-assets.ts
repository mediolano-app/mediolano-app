"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "@starknet-react/core";
import { useIPCollectionContract } from "./useIPCollectionContract";
import type { Asset, IPType, LicenseType } from "@/types/asset";

export interface UserAsset extends Asset {
  tokenId: string;
  collectionId: string;
  contractAddress: string;
  metadata?: {
    name: string;
    description: string;
    image: string;
    attributes?: Array<{ trait_type: string; value: string }>;
    [key: string]: unknown;
  };
}

interface UseUserAssetsReturn {
  assets: UserAsset[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  totalCount: number;
}

// Contract address for MIP Collections - using the new Collections Protocol
const MIP_COLLECTION_CONTRACT = process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS || "0x077840ce59ce16b3ceb3625059568e103eaae36635b82793b7386bed09fbc3a8";

export const useUserAssets = (): UseUserAssetsReturn => {
  const { address } = useAccount();
  const { contract, loading: contractLoading, error: contractError } = useIPCollectionContract();
  
  const [assets, setAssets] = useState<UserAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchMetadata = async (uri: string): Promise<Record<string, unknown> | null> => {
    try {
      // Handle IPFS URLs
      const metadataUrl = uri.startsWith('ipfs://') 
        ? uri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
        : uri;
      
      const response = await fetch(metadataUrl);
      if (!response.ok) throw new Error('Failed to fetch metadata');
      
      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch metadata from URI:', uri, error);
      return null;
    }
  };

  const mapIPType = (type: string): IPType => {
    const typeMap: Record<string, IPType> = {
      'art': 'Art',
      'artwork': 'Art',
      'audio': 'Audio',
      'music': 'Audio',
      'video': 'Video',
      'document': 'Document',
      'patent': 'Patent',
      'rwa': 'RWA',
      'software': 'Software',
      'nft': 'NFT',
    };
    
    return typeMap[type.toLowerCase()] || 'Custom';
  };

  const transformTokenToAsset = useCallback(async (
    tokenData: Record<string, unknown>,
    collectionData: Record<string, unknown>
  ): Promise<UserAsset> => {
    // Fetch metadata from token URI
    const metadata = await fetchMetadata(tokenData.metadata_uri as string);
    
    // Extract image from metadata, fallback to placeholder
    const image = (metadata?.image as string) || '/placeholder.svg';
    const assetImage = image.startsWith('ipfs://') 
      ? image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
      : image;

    // Determine asset type from metadata or collection
    const assetType = mapIPType(
      (metadata?.type as string) || 
      (metadata?.attributes as Array<{ trait_type: string; value: string }>)?.find((attr) => attr.trait_type === 'Type')?.value ||
      'Custom'
    );

    // Generate mock values for display (in a real app, these might come from marketplace data)
    const mockValue = (Math.random() * 2 + 0.1).toFixed(2);
    const mockViews = Math.floor(Math.random() * 1000) + 10;
    const mockProtectionLevel = Math.floor(Math.random() * 40) + 60;

    return {
      id: `${tokenData.collection_id}-${tokenData.token_id}`,
      tokenId: (tokenData.token_id as string).toString(),
      collectionId: (tokenData.collection_id as string).toString(),
      contractAddress: MIP_COLLECTION_CONTRACT || '',
      name: (metadata?.name as string) || `MIP Asset #${tokenData.token_id}`,
      creator: (collectionData?.owner as string) || 'Unknown Creator',
      verified: true, // MIP collections are verified by default
      image: assetImage,
      collection: (collectionData?.name as string) || 'Unnamed Collection',
      licenseType: ((metadata?.license_type as string) || 'Creative Commons') as LicenseType,
      description: (metadata?.description as string) || 'Mediolano IP Collection asset',
      registrationDate: new Date().toISOString().split('T')[0], // Mock date
      value: `${mockValue} ETH`,
      views: mockViews,
      type: assetType,
      protectionLevel: mockProtectionLevel,
      metadata: metadata ? {
        name: (metadata.name as string) || '',
        description: (metadata.description as string) || '',
        image: (metadata.image as string) || '',
        attributes: metadata.attributes as Array<{ trait_type: string; value: string }> | undefined,
        ...metadata
      } : undefined,
      ownershipHistory: [
        {
          owner: tokenData.owner as string,
          acquiredDate: new Date().toISOString().split('T')[0],
          transferType: 'Creation' as const,
        },
      ],
      licensingTerms: {
        type: (metadata?.license_type as string) || 'Creative Commons',
        commercialUse: (metadata?.commercial_use as boolean) ?? true,
        modifications: (metadata?.modifications as boolean) ?? true,
        attribution: (metadata?.attribution as boolean) ?? true,
        territory: 'Worldwide',
      },
    };
  }, []);

  const fetchUserAssets = useCallback(async () => {
    if (!address || !contract || contractLoading) {
      if (!contractLoading) {
        setAssets([]);
        setTotalCount(0);
        setLoading(false);
      }
      return;
    }

    if (contractError) {
      setError(`Contract initialization error: ${contractError}`);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get user's collections first
      let userCollections;
      try {
        userCollections = await contract.list_user_collections(address);
      } catch (error) {
        console.warn('list_user_collections function not available, falling back to mock data:', error);
        // Fallback to empty array if function doesn't exist
        setAssets([]);
        setTotalCount(0);
        setError('Contract interface mismatch - some functions are not available');
        return;
      }

      const collectionIds = Array.isArray(userCollections) ? userCollections : [];

      if (collectionIds.length === 0) {
        setAssets([]);
        setTotalCount(0);
        return;
      }

      const allAssets: UserAsset[] = [];

      // For each collection, get tokens and collection details
      for (const collectionId of collectionIds) {
        try {
          // Get collection information
          let collectionData;
          try {
            const formattedCollectionId = BigInt(collectionId);
            collectionData = await contract.get_collection(formattedCollectionId);
          } catch (error) {
            console.warn(`Failed to fetch collection ${collectionId}:`, error);
            continue;
          }
          
          // Get user's tokens in this collection
          let userTokens;
          try {
            // Ensure collection_id is properly formatted as u256
            const formattedCollectionId = BigInt(collectionId);
            
            // Try calling the method directly first
            console.log(`Calling list_user_tokens_per_collection for collection ${collectionId} and user ${address}`);
            userTokens = await contract.call("list_user_tokens_per_collection", [formattedCollectionId, address]);
          } catch (error) {
            console.warn(`list_user_tokens_per_collection failed for collection ${collectionId}:`, error);
            // Skip this collection if the function doesn't work
            continue;
          }

          const tokenIds = Array.isArray(userTokens) ? userTokens : [];

          // For each token, get detailed information
          for (const tokenId of tokenIds) {
            try {
              // Create token identifier (this might need adjustment based on contract implementation)
              const tokenIdentifier = `${collectionId}-${tokenId}`;
              const tokenData = await contract.get_token(tokenIdentifier);

              // Transform to our Asset interface
              const asset = await transformTokenToAsset(tokenData, collectionData);
              allAssets.push(asset);
            } catch (tokenError) {
              console.warn(`Failed to fetch token ${tokenId} from collection ${collectionId}:`, tokenError);
            }
          }
        } catch (collectionError) {
          console.warn(`Failed to process collection ${collectionId}:`, collectionError);
        }
      }

      setAssets(allAssets);
      setTotalCount(allAssets.length);

      // If we couldn't load any assets but had collections, show a more specific error
      if (allAssets.length === 0 && collectionIds.length > 0) {
        setError('Unable to load assets - contract interface may have changed');
      }

    } catch (error) {
      console.error('Error fetching user assets:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch assets');
      setAssets([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [address, contract, contractLoading, contractError, transformTokenToAsset]);

  // Refetch function for manual refresh
  const refetch = useCallback(async () => {
    await fetchUserAssets();
  }, [fetchUserAssets]);

  // Fetch assets when address or contract changes
  useEffect(() => {
    fetchUserAssets();
  }, [fetchUserAssets]);

  return {
    assets,
    loading,
    error,
    refetch,
    totalCount,
  };
};