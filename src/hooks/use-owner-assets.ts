
import { useState, useCallback, useEffect } from "react";
import { useContract, useProvider } from "@starknet-react/core";
import { Abi, shortString } from "starknet";
import { ipCollectionAbi } from "@/abis/ip_collection";
import { COLLECTION_CONTRACT_ADDRESS } from "@/lib/constants";
import type { Collection } from "@/lib/types";
import { fetchIPFSMetadata, processIPFSHashToUrl } from "@/utils/ipfs";
import type { TokenData, PortfolioStats, UserActivity } from "./use-portfolio";

// Re-export types if needed, or import them from use-portfolio
// For now, I'll rely on importing them to ensure consistency.

// Helper to decode Cairo 1 ByteArray from raw felt array (Duplicated from use-portfolio for independence)
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

// Helper to extract CID from various metadata URI formats
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

export interface OwnerAssetsData {
    tokens: Record<string, TokenData[]>; // Key is collection_id
    stats: PortfolioStats;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useOwnerAssets(address?: string, collections: Collection[] = []): OwnerAssetsData {
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
    const [loadingTokens, setLoadingTokens] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            floorPrice: 0,
            attributes: []
        };

        if (!metadata_uri || metadata_uri === "") return tokenData;

        try {
            const cid = extractCid(metadata_uri);
            if (cid) {
                const metadata = await fetchIPFSMetadata(cid);
                if (metadata) {
                    tokenData = {
                        ...tokenData,
                        name: metadata.name || tokenData.name,
                        description: metadata.description || tokenData.description,
                        image: processIPFSHashToUrl(metadata.image as string, '/placeholder.svg'),
                        floorPrice: typeof metadata.floorPrice === 'number' ? metadata.floorPrice : 0,
                        attributes: Array.isArray(metadata.attributes) ? metadata.attributes : [],
                        metadata: metadata
                    };
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
                                image: metadata.image ? (metadata.image.startsWith('ipfs') ? processIPFSHashToUrl(metadata.image, '/placeholder.svg') : metadata.image) : tokenData.image,
                                attributes: Array.isArray(metadata.attributes) ? metadata.attributes : [],
                                metadata: metadata
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
        // Wait for collections to be populated, or if explicit empty array passed, stop.
        if (!managerContract || !address || !provider) {
            return;
        }

        if (collections.length === 0) {
            setLoadingTokens(false);
            setTokens({});
            return;
        }

        setLoadingTokens(true);
        setError(null);

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

                                // Handle u256 return (2 felts) or felt return (1 felt)
                                // Standard ERC721 balanceOf returns u256.
                                const balance = balanceData && balanceData.length > 0 ? Number(BigInt(balanceData[0])) : 0;

                                if (balance > 0) {
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

                        // 2. Manager Fallback (if direct checking failed or returned 0, though Manager is usually for listing)
                        // In usePortfolio, this was a fallback. We'll keep it.
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

                        const tokenDetails = await Promise.all(
                            tokenIds.map(async (tokenId) => {
                                let metadataUri = "";

                                // Try fetching metadata_uri from Manager if possible
                                try {
                                    // @ts-ignore
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

        } catch (err) {
            console.error("Error loading owner assets:", err);
            setError("Failed to load assets");
        } finally {
            setLoadingTokens(false);
        }
    }, [managerContract, address, collections, processTokenMetadata, provider]);

    useEffect(() => {
        if (address && collections.length > 0) {
            loadTokens();
        } else if (address && collections.length === 0) {
            // If we have an address but no collections yet, we might be loading. 
            // BUT if collections is truly empty after loading, we should stop loading.
            // For now, let's assume if this hook is called, collections might be empty initially.
            // We'll let the user control the loading state via the collections length check outside or just default here.
            setLoadingTokens(false);
        }
    }, [loadTokens, address, collections.length]);

    return {
        tokens,
        stats,
        loading: loadingTokens,
        error,
        refetch: loadTokens
    };
}
