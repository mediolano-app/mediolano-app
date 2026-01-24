"use client";

import { useState, useCallback, useEffect } from "react";
import { RpcProvider, shortString } from "starknet";
import { fetchIPFSMetadata, processIPFSHashToUrl } from "@/utils/ipfs";
import { isAssetReported } from "@/lib/reported-content";

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const COLLECTION_ADDRESS = process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS;

// TokenMinted event selector
const TOKEN_MINTED_SELECTOR = "0x3e517dedbc7bae62d4ace7e3dfd33255c4a7fe7c1c6f53c725d52b45f9c5a00";

export interface RecentAsset {
    id: string;
    tokenId: string;
    collectionId: string;
    name: string;
    image: string;
    owner: string;
    txHash: string;
    metadataUri?: string;
}

export interface UseRecentAssetsReturn {
    assets: RecentAsset[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    refresh: () => void;
}

// Helper to parse Cairo ByteArray from event data iterator
function parseByteArray(dataIter: IterableIterator<string>): string {
    const lenResult = dataIter.next();
    if (lenResult.done) return "";
    const dataLen = parseInt(lenResult.value, 16);

    let result = "";

    // Read data chunks (bytes31)
    for (let i = 0; i < dataLen; i++) {
        const chunk = dataIter.next().value;
        if (chunk) {
            try {
                result += shortString.decodeShortString(chunk);
            } catch {
                // Silently skip invalid chunks
            }
        }
    }

    // Read pending word
    const pendingWord = dataIter.next().value;
    const pendingLen = dataIter.next().value;

    if (pendingWord && pendingWord !== "0x0" && pendingWord !== "0x00") {
        try {
            result += shortString.decodeShortString(pendingWord);
        } catch {
            // Silently skip
        }
    }

    return result;
}

export function useRecentAssets(pageSize: number = 20): UseRecentAssetsReturn {
    const [assets, setAssets] = useState<RecentAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [continuationToken, setContinuationToken] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true);

    const fetchAssets = useCallback(async (isLoadMore: boolean = false) => {
        if ((isLoadMore && !hasMore) || !ALCHEMY_API_KEY || !COLLECTION_ADDRESS) return;

        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || `https://starknet-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
            const provider = new RpcProvider({ nodeUrl: rpcUrl });

            // Fetch TokenMinted events
            const response = await provider.getEvents({
                address: COLLECTION_ADDRESS,
                keys: [[TOKEN_MINTED_SELECTOR]],
                from_block: { block_number: 1861690 },
                chunk_size: pageSize,
                continuation_token: isLoadMore ? continuationToken : undefined,
            });

            const events = response.events;
            const nextToken = response.continuation_token;

            const processedAssets: RecentAsset[] = [];

            for (const event of events) {
                try {
                    // TokenMinted: collection_id(2), token_id(2), owner(1), metadata_uri(ByteArray)
                    const data = event.data;
                    const dataIter = data[Symbol.iterator]();

                    // Parse collection_id (u256: low, high)
                    const collectionIdLow = dataIter.next().value;
                    const collectionIdHigh = dataIter.next().value;
                    const collectionId = (BigInt(collectionIdLow) + (BigInt(collectionIdHigh) << 128n)).toString();

                    // Parse token_id (u256: low, high)
                    const tokenIdLow = dataIter.next().value;
                    const tokenIdHigh = dataIter.next().value;
                    if (!tokenIdLow || !tokenIdHigh) continue;
                    const tokenId = (BigInt(tokenIdLow) + (BigInt(tokenIdHigh) << 128n)).toString();

                    // Parse owner
                    const owner = dataIter.next().value;
                    if (!owner) continue;

                    // Parse metadata_uri (ByteArray)
                    const metadataUri = parseByteArray(dataIter);

                    const assetId = `${COLLECTION_ADDRESS}-${collectionId}-${tokenId}`;

                    // Check if asset is reported
                    if (isAssetReported(assetId)) continue;

                    let name = `Asset #${tokenId}`;
                    let image = "/placeholder.svg";

                    // Fetch metadata from IPFS
                    if (metadataUri) {
                        try {
                            const ipfsUrl = processIPFSHashToUrl(metadataUri, "/placeholder.svg");
                            if (ipfsUrl !== "/placeholder.svg") {
                                const res = await fetch(ipfsUrl, {
                                    signal: AbortSignal.timeout(3000)
                                });
                                if (res.ok) {
                                    const metadata = await res.json();
                                    name = metadata.name || name;
                                    image = processIPFSHashToUrl(metadata.image || "/placeholder.svg", "/placeholder.svg");
                                }
                            }
                        } catch {
                            // Continue with default values
                        }
                    }

                    processedAssets.push({
                        id: assetId,
                        tokenId,
                        collectionId,
                        name,
                        image,
                        owner,
                        txHash: event.transaction_hash,
                        metadataUri,
                    });
                } catch (e) {
                    console.error("Error processing TokenMinted event:", e);
                }
            }

            if (isLoadMore) {
                setAssets(prev => [...prev, ...processedAssets]);
            } else {
                setAssets(processedAssets);
            }

            setContinuationToken(nextToken);
            setHasMore(!!nextToken);

        } catch (err: any) {
            console.error("Error fetching recent assets:", err);
            setError(err.message || "Failed to load assets");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [pageSize, continuationToken, hasMore]);

    useEffect(() => {
        fetchAssets(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMore = async () => {
        if (!loadingMore && hasMore) {
            await fetchAssets(true);
        }
    };

    const refresh = () => {
        setContinuationToken(undefined);
        setHasMore(true);
        fetchAssets(false);
    };

    return {
        assets,
        loading,
        loadingMore,
        error,
        hasMore,
        loadMore,
        refresh
    };
}
