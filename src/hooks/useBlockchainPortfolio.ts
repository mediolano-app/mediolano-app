"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "@starknet-react/core";
import { Contract, Abi, num } from "starknet";
import { collectAbi } from "@/app/portfolio/IPCollectionAbi";
import { NFT, Collection } from "@/lib/types";

const contractAddress = process.env.NEXT_PUBLIC_IP_COLLECTION_ADDRESS || "";

export interface BlockchainAsset {
  id: string;
  name: string;
  image: string;
  collection: string;
  floorPrice: number;
  tokenURI?: string;
  description?: string;
  tokenId?: string;
  collectionId?: string;
  collectionDescription?: string;
  collectionImage?: string;
  collectionItemCount?: number;
  rarity?: string;
  attributes?: { trait_type: string; value: string }[];
  createdAt?: string;
}

export interface BlockchainCollection {
  id: string;
  name: string;
  image: string;
  floorPrice: number;
  volume24h: number;
  tokenCount: number;
}

export interface BlockchainActivity {
  type: "buy" | "sell" | "mint" | "transfer";
  item: string;
  price: number;
  date: string;
  txHash: string;
}

export interface BlockchainPortfolioStats {
  totalValue: number;
  totalNFTs: number;
  topCollection: {
    name: string;
    value: number;
  };
  recentActivity: BlockchainActivity[];
}

export function useBlockchainPortfolio() {
  const { account } = useAccount();
  
  const [userAssets, setUserAssets] = useState<BlockchainAsset[]>([]);
  const [userCollections, setUserCollections] = useState<BlockchainCollection[]>([]);
  const [portfolioStats, setPortfolioStats] = useState<BlockchainPortfolioStats>({
    totalValue: 0,
    totalNFTs: 0,
    topCollection: {
      name: "",
      value: 0
    },
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userTokens, setUserTokens] = useState<string[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);

  // Initialize contract
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (!account) {
      setIsLoading(false);
      setError("Wallet not connected");
      return;
    }
    
    if (!contractAddress) {
      setIsLoading(false);
      setError("Contract address not configured. Please set NEXT_PUBLIC_IP_COLLECTION_ADDRESS environment variable.");
      return;
    }
    
    try {
      const ipContract = new Contract(
        collectAbi as Abi,
        contractAddress as `0x${string}`,
        account
      );
      setContract(ipContract);
    } catch (err) {
      console.error("Error initializing contract:", err);
      setError("Failed to initialize contract");
      setIsLoading(false);
    }
  }, [account]);

  // Fetch user tokens
  useEffect(() => {
    const fetchUserTokens = async () => {
      if (!contract || !account) {
        setIsLoadingTokens(false);
        return;
      }
      
      try {
        setIsLoadingTokens(true);
        const result = await contract.call("list_user_tokens", [account.address]);
        setUserTokens(Array.isArray(result) ? result.map(token => token.toString()) : []);
        setIsLoadingTokens(false);
      } catch (err) {
        console.error("Error fetching user tokens:", err);
        setIsLoadingTokens(false);
      }
    };
    
    fetchUserTokens();
  }, [contract, account]);

  const fetchTokenMetadata = useCallback(async (tokenId: string): Promise<BlockchainAsset | null> => {
    try {
      if (!contract) return null;
      
      // Fetch token URI from the contract
      const tokenURI = await contract.call("token_uri", [num.toBigInt(tokenId)]);
      
      if (!tokenURI) return null;
      
      const tokenURIString = tokenURI.toString();
      
      try {
        const response = await fetch(tokenURIString);
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata: ${response.statusText}`);
        }
        
        const metadata = await response.json();
        
        // Map the metadata to BlockchainAsset format
        return {
          id: tokenId,
          name: metadata.name || `IP Asset #${tokenId}`,
          image: metadata.image || "/placeholder.svg",
          collection: metadata.collection_name || metadata.collection || "Mediolano IP Collection",
          floorPrice: metadata.floor_price || metadata.floorPrice || 0.1,
          tokenURI: tokenURIString,
          description: metadata.description || `Blockchain asset with ID ${tokenId}`,
          tokenId: metadata.token_id || `#${tokenId}`,
          collectionId: metadata.collection_id || "mediolano-ip",
          collectionDescription: metadata.collection_description || "Mediolano IP Collection",
          collectionImage: metadata.collection_image || metadata.image || "/placeholder.svg",
          collectionItemCount: metadata.collection_item_count || 1,
          rarity: metadata.rarity || "Common",
          attributes: metadata.attributes || [
            { trait_type: "Token ID", value: tokenId },
            { trait_type: "Collection", value: metadata.collection_name || metadata.collection || "Mediolano IP Collection" }
          ],
          createdAt: metadata.created_at || metadata.createdAt || new Date().toISOString()
        };
      } catch (fetchError) {
        console.error("Error fetching or parsing metadata:", fetchError);
        
        // Fallback to default values if metadata fetch fails
        return {
          id: tokenId,
          name: `IP Asset #${tokenId}`,
          image: "/placeholder.svg",
          collection: "Mediolano IP Collection",
          floorPrice: 0.1,
          tokenURI: tokenURIString,
          description: `Blockchain asset with ID ${tokenId}`,
          tokenId: `#${tokenId}`,
          collectionId: "mediolano-ip",
          collectionDescription: "Mediolano IP Collection",
          collectionImage: "/placeholder.svg",
          collectionItemCount: 1,
          rarity: "Common",
          attributes: [
            { trait_type: "Token ID", value: tokenId },
            { trait_type: "Collection", value: "Mediolano IP Collection" }
          ],
          createdAt: new Date().toISOString() // Use current date as placeholder
        };
      }
    } catch (err) {
      console.error("Error fetching token metadata:", err);
      return null;
    }
  }, [contract]);

  const convertToNFTFormat = useCallback((assets: BlockchainAsset[]): NFT[] => {
    return assets.map(asset => ({
      id: asset.id,
      name: asset.name,
      description: asset.description || `Blockchain asset with ID ${asset.id}`,
      image: asset.image || "/placeholder.svg",
      tokenId: asset.tokenId || `#${asset.id}`,
      collection: {
        id: asset.collectionId || "mediolano-ip",
        name: asset.collection || "Mediolano IP Collection",
        description: asset.collectionDescription || "Mediolano IP Collection",
        floorPrice: asset.floorPrice || 0.1,
        image: asset.collectionImage || asset.image || "/placeholder.svg",
        itemCount: asset.collectionItemCount || 1
      },
      price: asset.floorPrice || 0.1,
      rarity: asset.rarity || "Common",
      attributes: asset.attributes || [
        { trait_type: "Token ID", value: asset.id },
        { trait_type: "Collection", value: asset.collection || "Mediolano IP Collection" }
      ],
      createdAt: asset.createdAt || new Date().toISOString() // Use current date as placeholder
    }));
  }, []);

  // Convert blockchain collections to Collection format
  const convertToCollectionFormat = useCallback((collections: BlockchainCollection[]): Collection[] => {
    return collections.map(collection => ({
      id: collection.id,
      name: collection.name,
      description: `Collection with ${collection.tokenCount} tokens`,
      floorPrice: collection.floorPrice,
      image: collection.image,
      itemCount: collection.tokenCount
    }));
  }, []);

  // Fetch all user assets when tokens are loaded
  useEffect(() => {
    const fetchAllUserAssets = async () => {
      if (!userTokens.length || !contract || isLoadingTokens) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching metadata for ${userTokens.length} tokens...`);
        
        // Fetch metadata for each token
        const assetsPromises = userTokens.map(tokenId => 
          fetchTokenMetadata(tokenId)
            .catch(error => {
              console.error(`Error fetching metadata for token ${tokenId}:`, error);
              return null;
            })
        );
        
        const assets = (await Promise.all(assetsPromises)).filter(asset => asset !== null) as BlockchainAsset[];
        
        console.log(`Successfully fetched metadata for ${assets.length} of ${userTokens.length} tokens`);
        
        if (assets.length === 0) {
          setError("No valid assets found. There might be an issue with the metadata.");
          setIsLoading(false);
          return;
        }
        
        setUserAssets(assets);
        
        // Group assets by collection to create collections data
        const collectionMap = new Map<string, BlockchainCollection>();
        
        assets.forEach(asset => {
          if (!collectionMap.has(asset.collection)) {
            collectionMap.set(asset.collection, {
              id: asset.collection,
              name: asset.collection,
              image: asset.image,
              floorPrice: asset.floorPrice,
              volume24h: 0, // Placeholder
              tokenCount: 1
            });
          } else {
            const collection = collectionMap.get(asset.collection)!;
            collection.tokenCount += 1;
            
            // Update floor price if this asset has a lower price
            if (asset.floorPrice < collection.floorPrice) {
              collection.floorPrice = asset.floorPrice;
            }
          }
        });
        
        setUserCollections(Array.from(collectionMap.values()));
        
        // Calculate portfolio stats
        if (assets.length > 0) {
          // Find the collection with the most tokens
          const topCollection = Array.from(collectionMap.values()).sort((a, b) => 
            b.tokenCount - a.tokenCount
          )[0];
          
          // Calculate total value
          const totalValue = assets.reduce((sum, asset) => sum + asset.floorPrice, 0);
          
          setPortfolioStats({
            totalValue,
            totalNFTs: assets.length,
            topCollection: {
              name: topCollection.name,
              value: topCollection.tokenCount * topCollection.floorPrice
            },
            recentActivity: [] // Placeholder for now
          });
        }
      } catch (err) {
        console.error("Error fetching user assets:", err);
        setError("Failed to load portfolio data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllUserAssets();
  }, [userTokens, contract, isLoadingTokens, fetchTokenMetadata]);

  return {
    userAssets,
    userCollections,
    portfolioStats,
    isLoading,
    error,
    nfts: convertToNFTFormat(userAssets),
    collections: convertToCollectionFormat(userCollections),
    refetch: () => {
      // This would trigger a refetch of the contract data
      if (account && contract) {
        setIsLoadingTokens(true);
        contract.call("list_user_tokens", [account.address])
          .then(result => {
            setUserTokens(Array.isArray(result) ? result.map(token => token.toString()) : []);
            setIsLoadingTokens(false);
          })
          .catch(err => {
            console.error("Error refetching user tokens:", err);
            setIsLoadingTokens(false);
          });
      }
    }
  };
} 