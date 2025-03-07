"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "@starknet-react/core";
import { useIPCollectionContract } from "./useIPCollectionContract";
import { num } from "starknet";

export interface UserAsset {
  id: string;
  name: string;
  image: string;
  collection: string;
  floorPrice: number;
  tokenURI?: string;
}

export interface UserCollection {
  id: string;
  name: string;
  image: string;
  floorPrice: number;
  volume24h: number;
  tokenCount: number;
}

export interface UserActivity {
  type: "buy" | "sell" | "mint" | "transfer";
  item: string;
  price: number;
  date: string;
  txHash: string;
}

export interface UserPortfolioStats {
  totalValue: number;
  totalNFTs: number;
  topCollection: {
    name: string;
    value: number;
  };
  recentActivity: UserActivity[];
}

export function usePortfolio() {
  const { account } = useAccount();
  const contract = useIPCollectionContract();
  
  const [userAssets, setUserAssets] = useState<UserAsset[]>([]);
  const [userCollections, setUserCollections] = useState<UserCollection[]>([]);
  const [portfolioStats, setPortfolioStats] = useState<UserPortfolioStats>({
    totalValue: 0,
    totalNFTs: 0,
    topCollection: {
      name: "",
      value: 0
    },
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userTokens, setUserTokens] = useState<string[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);

  // Fetch user tokens
  useEffect(() => {
    const fetchUserTokens = async () => {
      if (!contract || !account) {
        setIsLoadingTokens(false);
        setError("Wallet not connected or contract not initialized");
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
        setError("Failed to fetch user tokens");
      }
    };
    
    fetchUserTokens();
  }, [contract, account]);

  // Function to fetch token metadata
  const fetchTokenMetadata = useCallback(async (tokenId: string): Promise<UserAsset | null> => {
    try {
      if (!contract) return null;
      const tokenURI = await contract.call("token_uri", [num.toBigInt(tokenId)]);
      if (!tokenURI) return null;
      const tokenURIString = tokenURI.toString();
      try {
        // Fetch metadata from the token URI
        const response = await fetch(tokenURIString);
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata: ${response.statusText}`);
        }
        const metadata = await response.json();
        return {
          id: tokenId,
          name: metadata.name || `IP Asset #${tokenId}`,
          image: metadata.image || "/placeholder.svg",
          collection: metadata.collection_name || metadata.collection || "Mediolano IP Collection",
          floorPrice: metadata.floor_price || metadata.floorPrice || 0.1,
          tokenURI: tokenURIString,
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
        };
      }
    } catch (err) {
      console.error("Error fetching token metadata:", err);
      return null;
    }
  }, [contract]);

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
        
        const assets = (await Promise.all(assetsPromises)).filter(asset => asset !== null) as UserAsset[];
        
        console.log(`Successfully fetched metadata for ${assets.length} of ${userTokens.length} tokens`);
        
        if (assets.length === 0) {
          setError("No valid assets found. There might be an issue with the metadata.");
          setIsLoading(false);
          return;
        }
        
        setUserAssets(assets);
        const collectionMap = new Map<string, UserCollection>();
        
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
            recentActivity: [] // This would be fetched from transaction history in a real implementation
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
    account,
    error,
    refetch: () => {
      // This triggers a refetch of the contract data
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
            setError("Failed to refetch user tokens");
          });
      }
    }
  };
} 