import { useState, useCallback, useEffect } from "react";
import { useAccount, useContract } from "@starknet-react/core";
import { Abi } from "starknet";
import { ipCollectionAbi } from "@/abis/ip_collection";
import { COLLECTION_CONTRACT_ADDRESS } from "@/services/constants";
import { useGetCollections } from "./use-collection";
import type { Collection } from "@/lib/types";
import { fetchIPFSMetadata, processIPFSHashToUrl } from "@/utils/ipfs";

export interface TokenData {
  collection_id: string;
  token_id: string;
  owner: string;
  metadata_uri: string;
  name?: string;
  image?: string;
  description?: string;
  floorPrice?: number;
}

export interface UserActivity {
  type: "buy" | "sell" | "mint" | "transfer" | "burn";
  item: string;
  price?: number;
  date: string;
  txHash: string;
}

export interface PortfolioStats {
  totalValue: number;
  totalNFTs: number;
  topCollection: {
    name: string;
    value: number;
    tokenCount: number;
  };
  recentActivity: UserActivity[];
}

export interface PortfolioData {
  collections: Collection[];
  tokens: Record<string, TokenData[]>; // Key is collection_id
  stats: PortfolioStats;
  loading: boolean;
  error: string | null;
}

export function usePortfolio(): PortfolioData & { refetch: () => void } {
  const { address } = useAccount();
  const [tokens, setTokens] = useState<Record<string, TokenData[]>>({});
  const [stats, setStats] = useState<PortfolioStats>({
    totalValue: 0,
    totalNFTs: 0,
    topCollection: {
      name: "",
      value: 0,
      tokenCount: 0
    },
    recentActivity: []
  });

  
  const { collections, loading: collectionsLoading, error: collectionsError, reload: reloadCollections } = useGetCollections(address);

  const { contract } = useContract({
    abi: ipCollectionAbi as Abi,
    address: COLLECTION_CONTRACT_ADDRESS as `0x${string}`
  });

  // Function to fetch and process token metadata
  const processTokenMetadata = useCallback(async (
    tokenId: string,
    metadata_uri: string,
    collection_id: string
  ): Promise<TokenData> => {
    let tokenData: TokenData = {
      collection_id,
      token_id: tokenId,
      owner: address || "",
      metadata_uri,
      name: `IP Asset #${tokenId}`,
      image: "/placeholder.svg",
      description: "No description available",
      floorPrice: 0
    };

    try {
      if (metadata_uri && metadata_uri.includes('/ipfs/')) {
        const cidMatch = metadata_uri.match(/\/ipfs\/([a-zA-Z0-9]+)/);
        if (cidMatch) {
          const cid = cidMatch[1];
          const metadata = await fetchIPFSMetadata(cid);
          if (metadata) {
            const floorPrice = typeof metadata.floorPrice === 'number' ? metadata.floorPrice : 0;
            tokenData = {
              ...tokenData,
              name: metadata.name || tokenData.name,
              description: metadata.description || tokenData.description,
              image: processIPFSHashToUrl(metadata.image as string, '/placeholder.svg'),
              floorPrice
            };
          }
        }
      }
    } catch (err) {
      console.warn(`Failed to fetch metadata for token ${tokenId}:`, err);
    }

    return tokenData;
  }, [address]);

  // Load tokens for collections
  const loadTokens = useCallback(async () => {
    if (!contract || !address || !collections.length) {
      return;
    }

    try {
      const tokensMap: Record<string, TokenData[]> = {};
      let totalValue = 0;
      let totalNFTs = 0;
      const collectionStats = new Map<string, { value: number; tokenCount: number }>();
      const activities: UserActivity[] = [];

      // Calculate total NFTs from collection data as fallback
      const totalNFTsFromCollections = collections.reduce((sum, collection) => {
        const itemCount = collection.totalMinted - collection.totalBurned;
        return sum + itemCount;
      }, 0);

      await Promise.all(
        collections.map(async (collection) => {
          try {
            // Get token IDs for this collection
            let collectionIdParam = collection.id;
            if (typeof collection.id === 'string') {
              const numId = parseInt(collection.id);
              if (!isNaN(numId)) {
                collectionIdParam = numId.toString();
              }
            }
            
            const tokenIds: string[] = await contract.call(
              "list_user_tokens_per_collection",
              [collectionIdParam, address],
              {
                parseRequest: true,
                parseResponse: true,
              }
            );

            if (!tokenIds || tokenIds.length === 0) {
              return;
            }

            // Get token details and metadata for each ID
            const tokenDetails = await Promise.all(
              tokenIds.map(async (tokenId) => {
                let tokenIdParam = tokenId;
                if (typeof tokenId === 'string') {
                  const numTokenId = parseInt(tokenId);
                  if (!isNaN(numTokenId)) {
                    tokenIdParam = numTokenId.toString();
                  }
                }
                
                const token = await contract.call("get_token", [tokenIdParam]);
                
                const processedToken = await processTokenMetadata(
                  tokenId,
                  token.metadata_uri,
                  collection.id.toString()
                );

                // Update stats
                totalValue += processedToken.floorPrice || 0;
                totalNFTs++;

                // Update collection stats
                const currentStats = collectionStats.get(collection.id.toString()) || { value: 0, tokenCount: 0 };
                collectionStats.set(collection.id.toString(), {
                  value: currentStats.value + (processedToken.floorPrice || 0),
                  tokenCount: currentStats.tokenCount + 1
                });

                // Add mint activity
                activities.push({
                  type: "mint",
                  item: processedToken.name || `Token #${tokenId}`,
                  date: new Date().toISOString(),
                  txHash: "0x"
                });

                return processedToken;
              })
            );

            tokensMap[collection.id.toString()] = tokenDetails;
          } catch (err) {
            console.error("Error loading tokens:", err);
          }
        })
      );

      // Use collection data as fallback if no tokens were fetched
      if (totalNFTs === 0) {
        totalNFTs = totalNFTsFromCollections;
      }

      // Find top collection
      let topCollection = {
        name: "",
        value: 0,
        tokenCount: 0
      };

      collectionStats.forEach((stats, collectionId) => {
        const collection = collections.find(c => c.id.toString() === collectionId);
        if (collection && stats.value > topCollection.value) {
          topCollection = {
            name: collection.name,
            value: stats.value,
            tokenCount: stats.tokenCount
          };
        }
      });

      // Update state
      setTokens(tokensMap);
      setStats({
        totalValue,
        totalNFTs,
        topCollection,
        recentActivity: activities.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ).slice(0, 10)
      });

    } catch (err) {
      console.error("Error loading tokens:", err);
    }
  }, [contract, address, collections, processTokenMetadata]);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  const refetch = useCallback(() => {
    reloadCollections();
  }, [reloadCollections]);

  return { 
    collections, 
    tokens, 
    stats,
    loading: collectionsLoading, 
    error: collectionsError,
    refetch
  };
}

