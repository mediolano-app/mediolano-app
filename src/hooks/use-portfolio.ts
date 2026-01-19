import { useState, useCallback, useEffect } from "react";
import { useAccount, useContract, useProvider } from "@starknet-react/core";
import { Abi, shortString, uint256 } from "starknet";
import { ipCollectionAbi } from "@/abis/ip_collection";
import { COLLECTION_NFT_ABI } from "@/abis/ip_nft";
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

/**
 * Helper to decode Cairo 1 ByteArray from raw felt array
 */
function decodeByteArray(data: string[]): string {
  if (!data || data.length < 1) return "";
  try {
    const numWords = parseInt(data[0]);
    let str = "";

    // Words are 31 bytes each
    for (let i = 0; i < numWords; i++) {
      const word = data[i + 1];
      if (word) {
        str += shortString.decodeShortString(word);
      }
    }

    // Pending word
    if (data.length >= numWords + 3) {
      const pendingWord = data[numWords + 1];
      const pendingLen = parseInt(data[numWords + 2]);
      if (pendingLen > 0 && pendingWord) {
        const decoded = shortString.decodeShortString(pendingWord);
        str += decoded.substring(0, pendingLen);
      }
    }

    return str.replace(/\0/g, "").trim();
  } catch (e) {
    console.warn("[DEBUG] Failed to decode ByteArray:", e);
    return "";
  }
}

/**
 * Helper to extract CID from various metadata URI formats
 */
function extractCid(uri: string): string | null {
  if (!uri) return null;

  const cleanUri = uri.replace(/\0/g, "").trim();

  // 1. Raw CID
  if (cleanUri.match(/^[a-zA-Z0-9]{46,}$/) || (cleanUri.startsWith('ba') && cleanUri.length >= 50)) {
    return cleanUri;
  }

  // 2. ipfs://CID
  if (cleanUri.startsWith('ipfs:')) {
    return cleanUri.replace(/^ipfs:(?:\/\/)?/, "");
  }

  // 3. Gateway URLs
  const match = cleanUri.match(/\/ipfs\/([a-zA-Z0-9]+)/);
  if (match) return match[1];

  return null;
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

  const { collections, loading: collectionsLoading, error: collectionsError, reload: reloadCollections } = useGetCollections(address as `0x${string}`);
  const { provider } = useProvider();

  const { contract: managerContract } = useContract({
    abi: ipCollectionAbi as Abi,
    address: COLLECTION_CONTRACT_ADDRESS as `0x${string}`
  });

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

    if (!metadata_uri || metadata_uri === "") return tokenData;

    try {
      const cid = extractCid(metadata_uri);
      if (cid) {
        console.log(`[DEBUG] Attempting to fetch IPFS metadata for CID: ${cid}`);
        const metadata = await fetchIPFSMetadata(cid);
        if (metadata) {
          tokenData = {
            ...tokenData,
            name: metadata.name || tokenData.name,
            description: metadata.description || tokenData.description,
            image: processIPFSHashToUrl(metadata.image as string, '/placeholder.svg'),
            floorPrice: typeof metadata.floorPrice === 'number' ? metadata.floorPrice : 0
          };
          console.log(`[DEBUG] Metadata loaded for ${tokenData.name}`);
        }
      } else {
        // Maybe it's a direct JSON URL?
        if (metadata_uri.startsWith('http')) {
          try {
            const res = await fetch(metadata_uri);
            const metadata = await res.json();
            if (metadata) {
              tokenData = {
                ...tokenData,
                name: metadata.name || tokenData.name,
                description: metadata.description || tokenData.description,
                image: metadata.image ? (metadata.image.startsWith('ipfs') ? processIPFSHashToUrl(metadata.image, '/placeholder.svg') : metadata.image) : tokenData.image
              };
            }
          } catch (e) { }
        }
      }
    } catch (err) {
      console.warn(`Failed to process metadata for token ${tokenId}:`, err);
    }

    return tokenData;
  }, [address]);

  const loadTokens = useCallback(async () => {
    if (!managerContract || !address || !collections.length || !provider) {
      return;
    }

    console.log(`[DEBUG] loadTokens for address: ${address}`);

    try {
      const tokensMap: Record<string, TokenData[]> = {};
      let totalValue = 0;
      let totalNFTs = 0;
      const collectionStats = new Map<string, { value: number; tokenCount: number }>();
      const activities: UserActivity[] = [];

      await Promise.all(
        collections.map(async (collection) => {
          try {
            let tokenIds: string[] = [];

            // 1. Direct NFT Contract Check
            if (collection.nftAddress && collection.nftAddress !== "0x0") {
              try {
                let balanceData: string[] = [];
                try {
                  balanceData = await provider.callContract({
                    contractAddress: collection.nftAddress,
                    entrypoint: "balance_of",
                    calldata: [address]
                  });
                } catch (e) {
                  balanceData = await provider.callContract({
                    contractAddress: collection.nftAddress,
                    entrypoint: "balanceOf",
                    calldata: [address]
                  });
                }

                const balance = balanceData && balanceData.length > 0 ? Number(BigInt(balanceData[0])) : 0;

                if (balance > 0) {
                  console.log(`[DEBUG] Collection ${collection.id} has ${balance} tokens`);
                  for (let i = 0; i < balance; i++) {
                    try {
                      let tidData: string[] = [];
                      try {
                        tidData = await provider.callContract({
                          contractAddress: collection.nftAddress,
                          entrypoint: "token_of_owner_by_index",
                          calldata: [address, i.toString(), "0"]
                        });
                      } catch (e) {
                        tidData = await provider.callContract({
                          contractAddress: collection.nftAddress,
                          entrypoint: "tokenOfOwnerByIndex",
                          calldata: [address, i.toString(), "0"]
                        });
                      }

                      if (tidData && tidData.length > 0) {
                        const low = BigInt(tidData[0]);
                        const high = tidData.length > 1 ? BigInt(tidData[1]) : 0n;
                        tokenIds.push((low + (high << 128n)).toString());
                      }
                    } catch (e) { }
                  }
                }
              } catch (err) { }
            }

            // 2. Manager Fallback
            if (tokenIds.length === 0) {
              const strategies = ["list_user_tokens_per_collection", "listUserTokensPerCollection"];
              for (const strat of strategies) {
                try {
                  const res = await provider.callContract({
                    contractAddress: COLLECTION_CONTRACT_ADDRESS as string,
                    entrypoint: strat,
                    calldata: [collection.id.toString(), "0", address]
                  });
                  if (res && res.length > 0) {
                    const len = parseInt(res[0]);
                    if (len > 0) {
                      const isU256 = res.length >= 1 + (len * 2);
                      for (let i = 0; i < len; i++) {
                        if (isU256) {
                          const idx = 1 + (i * 2);
                          tokenIds.push((BigInt(res[idx]) + (BigInt(res[idx + 1]) << 128n)).toString());
                        } else {
                          tokenIds.push(BigInt(res[1 + i]).toString());
                        }
                      }
                      break;
                    }
                  }
                } catch (e) { }
              }
            }

            if (tokenIds.length === 0) return;

            console.log(`[DEBUG] Found ${tokenIds.length} tokens for collection ${collection.id}`);

            const tokenDetails = await Promise.all(
              tokenIds.map(async (tokenId) => {
                let metadataUri = "";

                // Try fetching metadata_uri from Manager if possible
                try {
                  const token: any = await managerContract.call("get_token", [tokenId]);
                  if (token && token.metadata_uri) metadataUri = token.metadata_uri;
                } catch (e) { }

                // Try fetching directly from NFT
                if (!metadataUri && collection.nftAddress) {
                  try {
                    let uriData: string[] = [];
                    try {
                      uriData = await provider.callContract({
                        contractAddress: collection.nftAddress,
                        entrypoint: "token_uri",
                        calldata: [tokenId, "0"]
                      });
                    } catch (e) {
                      uriData = await provider.callContract({
                        contractAddress: collection.nftAddress,
                        entrypoint: "tokenURI",
                        calldata: [tokenId, "0"]
                      });
                    }

                    if (uriData && uriData.length > 0) {
                      metadataUri = decodeByteArray(uriData);
                      if (metadataUri) console.log(`[DEBUG] Decoded metadata_uri: ${metadataUri}`);
                    }
                  } catch (e) { }
                }

                const processedToken = await processTokenMetadata(tokenId, metadataUri, collection.id.toString());

                totalValue += processedToken.floorPrice || 0;
                totalNFTs++;

                const currentStats = collectionStats.get(collection.id.toString()) || { value: 0, tokenCount: 0 };
                collectionStats.set(collection.id.toString(), {
                  value: currentStats.value + (processedToken.floorPrice || 0),
                  tokenCount: currentStats.tokenCount + 1
                });

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
            console.error("Error loading collection tokens:", collection.id, err);
          }
        })
      );

      // Find top collection
      let topCollection = { name: "", value: 0, tokenCount: 0 };
      collectionStats.forEach((stats, collectionId) => {
        const collection = collections.find(c => c.id.toString() === collectionId);
        if (collection && stats.value > topCollection.value) {
          topCollection = { name: collection.name, value: stats.value, tokenCount: stats.tokenCount };
        }
      });

      setTokens(tokensMap);
      setStats({
        totalValue,
        totalNFTs,
        topCollection,
        recentActivity: activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)
      });

      console.log(`[DEBUG] Final stats: totalNFTs=${totalNFTs}`);
    } catch (err) {
      console.error("Error loading portfolio:", err);
    }
  }, [managerContract, address, collections, processTokenMetadata, provider]);

  useEffect(() => { loadTokens(); }, [loadTokens]);

  return {
    collections,
    tokens,
    stats,
    loading: collectionsLoading,
    error: collectionsError,
    refetch: reloadCollections
  };
}
