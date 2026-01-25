"use client";

import { useState, useCallback, useEffect } from "react";
import { RpcProvider, shortString } from "starknet";
import type { Abi } from "starknet";
import { useContract } from "@starknet-react/core";
import { ipCollectionAbi } from "@/abis/ip_collection";
import { processIPFSHashToUrl } from "@/utils/ipfs";
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
    blockNumber?: number;
    collectionAddress: string;
}

export interface UseRecentAssetsReturn {
    assets: RecentAsset[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    totalCount: number;
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

interface ParsedEvent {
    collectionId: string;
    tokenId: string;
    owner: string;
    metadataUri: string;
    txHash: string;
    blockNumber: number;
    collectionAddress: string;
}

export function useRecentAssets(pageSize: number = 50): UseRecentAssetsReturn {
    const [allParsedEvents, setAllParsedEvents] = useState<ParsedEvent[]>([]);
    const [assets, setAssets] = useState<RecentAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [displayCount, setDisplayCount] = useState(pageSize);
    const [totalCount, setTotalCount] = useState(0);

    const { contract: registryContract } = useContract({
        abi: ipCollectionAbi as unknown as Abi,
        address: COLLECTION_ADDRESS as `0x${string}`,
    });

    // Fetch ALL events from blockchain
    const fetchAllEvents = useCallback(async () => {
        if (!ALCHEMY_API_KEY || !COLLECTION_ADDRESS) return;

        try {
            setLoading(true);
            setError(null);

            const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || `https://starknet-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
            const provider = new RpcProvider({ nodeUrl: rpcUrl });

            const allEvents: ParsedEvent[] = [];
            let continuationToken: string | undefined = undefined;
            let pageCount = 0;
            const maxPages = 20; // Safety limit to prevent infinite loops

            // Fetch all pages of events
            do {
                const response = await provider.getEvents({
                    address: COLLECTION_ADDRESS,
                    keys: [[TOKEN_MINTED_SELECTOR]],
                    from_block: { block_number: 1861690 },
                    chunk_size: 100, // Max chunk size for efficiency
                    continuation_token: continuationToken,
                });

                for (const event of response.events) {
                    try {
                        const data = event.data;
                        const dataIter = data[Symbol.iterator]();

                        // Parse collection_id (u256: low, high)
                        const collectionIdLow = dataIter.next().value;
                        const collectionIdHigh = dataIter.next().value;
                        if (!collectionIdLow || !collectionIdHigh) continue;
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


                        const collectionAddress = "0x" + (BigInt(collectionIdLow) + (BigInt(collectionIdHigh) << 128n)).toString(16);
                        const assetId = `${collectionAddress}-${tokenId}`;

                        // Check if asset is reported
                        if (isAssetReported(assetId)) continue;

                        allEvents.push({
                            collectionId,
                            tokenId,
                            owner,
                            metadataUri,
                            txHash: event.transaction_hash,
                            blockNumber: event.block_number || 0,
                            collectionAddress,
                        });
                    } catch (e) {
                        console.error("Error parsing TokenMinted event:", e);
                    }
                }

                continuationToken = response.continuation_token;
                pageCount++;

                console.log(`Fetched page ${pageCount}, got ${response.events.length} events, total: ${allEvents.length}`);

            } while (continuationToken && pageCount < maxPages);

            // Step 2: Resolve real collection addresses from Registry
            const uniqueCollectionIds = [...new Set(allEvents.map(e => e.collectionId))];
            const addressMap = new Map<string, string>();

            if (registryContract) {

                await Promise.all(uniqueCollectionIds.map(async (id) => {
                    try {
                        // Call get_collection(id)
                        const result = await registryContract.get_collection(id);
                        const collection = result as any;

                        // Access ip_nft (field index 4 in struct, or property name)
                        // Note: Depending on starknet.js version, struct might be Object or Array
                        // Based on ABI struct members: name, symbol, base_uri, owner, ip_nft, ...
                        let ipNftVal = collection.ip_nft;

                        if (ipNftVal) {
                            const addr = "0x" + BigInt(ipNftVal).toString(16);
                            addressMap.set(id, addr);
                        }
                    } catch (err) {
                        console.warn(`Failed to resolve collection address for ID ${id}`, err);
                    }
                }));
            }

            // Step 3: Update events with resolved addresses
            const resolvedEvents = allEvents.map(e => ({
                ...e,
                collectionAddress: addressMap.get(e.collectionId) || e.collectionAddress
            }));

            // Sort by block number descending (most recent first)
            resolvedEvents.sort((a, b) => b.blockNumber - a.blockNumber);

            console.log(`Total events fetched: ${resolvedEvents.length}`);

            setAllParsedEvents(resolvedEvents);
            setTotalCount(resolvedEvents.length);

        } catch (err: any) {
            console.error("Error fetching all events:", err);
            setError(err.message || "Failed to load assets");
        } finally {
            setLoading(false);
        }
    }, [registryContract]);

    // Process visible assets with metadata (in batches)
    useEffect(() => {
        const processAssets = async () => {
            if (allParsedEvents.length === 0) return;

            const visibleEvents = allParsedEvents.slice(0, displayCount);

            // Process metadata in parallel batches
            const batchSize = 10;
            const processedAssets: RecentAsset[] = [];

            for (let i = 0; i < visibleEvents.length; i += batchSize) {
                const batch = visibleEvents.slice(i, i + batchSize);

                const batchResults = await Promise.all(
                    batch.map(async (parsed) => {
                        let name = `Asset #${parsed.tokenId}`;
                        let image = "/placeholder.svg";

                        if (parsed.metadataUri) {
                            try {
                                const ipfsUrl = processIPFSHashToUrl(parsed.metadataUri, "/placeholder.svg");
                                if (ipfsUrl !== "/placeholder.svg") {
                                    const res = await fetch(ipfsUrl, {
                                        signal: AbortSignal.timeout(5000)
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

                        return {
                            id: `${parsed.collectionAddress}-${parsed.tokenId}`,
                            tokenId: parsed.tokenId,
                            collectionId: parsed.collectionId,
                            name,
                            image,
                            owner: parsed.owner,
                            txHash: parsed.txHash,
                            metadataUri: parsed.metadataUri,
                            blockNumber: parsed.blockNumber,
                            collectionAddress: parsed.collectionAddress,
                        } as RecentAsset;
                    })
                );

                processedAssets.push(...batchResults);
            }

            setAssets(processedAssets);
        };

        processAssets();
    }, [allParsedEvents, displayCount]);

    // Initial fetch
    useEffect(() => {
        fetchAllEvents();
    }, [fetchAllEvents]);

    const loadMore = async () => {
        if (loadingMore || displayCount >= allParsedEvents.length) return;

        setLoadingMore(true);
        setDisplayCount(prev => Math.min(prev + pageSize, allParsedEvents.length));
        setLoadingMore(false);
    };

    const refresh = () => {
        setDisplayCount(pageSize);
        setAllParsedEvents([]);
        setAssets([]);
        fetchAllEvents();
    };

    const hasMore = displayCount < allParsedEvents.length;

    return {
        assets,
        loading,
        loadingMore,
        error,
        hasMore,
        totalCount,
        loadMore,
        refresh
    };
}
