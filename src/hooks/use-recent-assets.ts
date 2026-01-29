"use client";

import { useState, useCallback, useEffect } from "react";
import { RpcProvider, shortString } from "starknet";
import type { Abi } from "starknet";
import { useContract } from "@starknet-react/core";
import { ipCollectionAbi } from "@/abis/ip_collection";
import { processIPFSHashToUrl, fetchIPFSMetadata } from "@/utils/ipfs";
import { isAssetReported } from "@/lib/reported-content";

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const COLLECTION_ADDRESS = process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS;

// TokenMinted event selector
const TOKEN_MINTED_SELECTOR = "0x3e517dedbc7bae62d4ace7e3dfd33255c4a7fe7c1c6f53c725d52b45f9c5a00";
const BLOCK_WINDOW_SIZE = 50000; // Scan 50k blocks at a time

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
    collectionName?: string;
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
    collectionName?: string;
}

export function useRecentAssets(pageSize: number = 50): UseRecentAssetsReturn {
    const [allParsedEvents, setAllParsedEvents] = useState<ParsedEvent[]>([]);
    const [assets, setAssets] = useState<RecentAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [displayCount, setDisplayCount] = useState(pageSize);
    const [totalCount, setTotalCount] = useState(0);

    // Scanning state
    const [lastScannedBlock, setLastScannedBlock] = useState<number | null>(null);
    const [hasMoreBlocks, setHasMoreBlocks] = useState(true);
    const [isScanning, setIsScanning] = useState(false);

    const { contract: registryContract } = useContract({
        abi: ipCollectionAbi as unknown as Abi,
        address: COLLECTION_ADDRESS as `0x${string}`,
    });

    // Fetch events for a specific block range
    const fetchEventsInRange = useCallback(async (fromBlock: number, toBlock: number) => {
        if (!ALCHEMY_API_KEY || !COLLECTION_ADDRESS) return [];

        const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || `https://starknet-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
        const provider = new RpcProvider({ nodeUrl: rpcUrl });

        const rangeEvents: ParsedEvent[] = [];
        let continuationToken: string | undefined = undefined;
        let pageCount = 0;
        const maxPagesPerWindow = 50; // Safety limit per window

        try {
            do {
                const response = await provider.getEvents({
                    address: COLLECTION_ADDRESS,
                    keys: [[TOKEN_MINTED_SELECTOR]],
                    from_block: { block_number: fromBlock },
                    to_block: { block_number: toBlock }, // Restrict to window
                    chunk_size: 100,
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

                        rangeEvents.push({
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
            } while (continuationToken && pageCount < maxPagesPerWindow);

        } catch (err) {
            console.error(`Error fetching events range ${fromBlock}-${toBlock}:`, err);
        }

        return rangeEvents;
    }, []);

    // Fetch next batch of events (scanning backwards)
    const fetchMoreEvents = useCallback(async (targetCount: number = pageSize) => {
        if (isScanning || !hasMoreBlocks) return;

        setIsScanning(true);
        if (allParsedEvents.length === 0) setLoading(true);

        try {
            const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || `https://starknet-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
            const provider = new RpcProvider({ nodeUrl: rpcUrl });

            let currentToBlock = lastScannedBlock;

            // If starting fresh, get latest block
            if (currentToBlock === null) {
                const block = await provider.getBlock("latest");
                currentToBlock = block.block_number;
            }

            const newEvents: ParsedEvent[] = [];
            // Keep scanning windows until we have enough events or hit genesis
            // Limit loop to avoid hanging if sparse
            let attempts = 0;
            const maxAttempts = 10;

            while (newEvents.length < targetCount && attempts < maxAttempts && currentToBlock > 0) {
                const currentFromBlock = Math.max(0, currentToBlock - BLOCK_WINDOW_SIZE);

                // console.log(`Scanning window: ${currentFromBlock} - ${currentToBlock}`);

                const windowEvents = await fetchEventsInRange(currentFromBlock, currentToBlock);
                newEvents.push(...windowEvents);

                currentToBlock = currentFromBlock - 1;
                attempts++;

                if (currentToBlock < 0) {
                    setHasMoreBlocks(false);
                    break;
                }
            }

            setLastScannedBlock(currentToBlock);

            // Resolve addresses and names for new events
            if (newEvents.length > 0 && registryContract) {
                const uniqueCollectionIds = [...new Set(newEvents.map(e => e.collectionId))];
                const collectionMap = new Map<string, { address: string, name: string }>();

                await Promise.all(uniqueCollectionIds.map(async (id) => {
                    try {
                        const result = await registryContract.get_collection(id);
                        const collection = result as any;
                        let ipNftVal = collection.ip_nft;
                        let addr = "";
                        if (ipNftVal) {
                            addr = "0x" + BigInt(ipNftVal).toString(16);
                        }

                        // Try to get name (handle ByteArray or string)
                        let name = collection.name;
                        // Some basic cleaning if it's a string
                        if (typeof name === 'string') {
                            name = name.replace(/\0/g, '').trim();
                        }

                        if (addr) {
                            collectionMap.set(id, { address: addr, name: name || `Collection #${id}` });
                        }
                    } catch (err) {
                        console.warn(`Failed to resolve collection info for ID ${id}`, err);
                    }
                }));

                // Update events with resolved info
                const resolvedEvents = newEvents.map(e => {
                    const info = collectionMap.get(e.collectionId);
                    return {
                        ...e,
                        collectionAddress: info?.address || e.collectionAddress,
                        collectionName: info?.name
                    };
                });

                setAllParsedEvents(prev => {
                    const combined = [...prev, ...resolvedEvents];

                    // Deduplicate key: collectionAddress-tokenId
                    const uniqueMap = new Map();
                    for (const event of combined) {
                        const key = `${event.collectionAddress}-${event.tokenId}`;
                        if (!uniqueMap.has(key)) {
                            uniqueMap.set(key, event);
                        }
                    }

                    return Array.from(uniqueMap.values()).sort((a, b) => b.blockNumber - a.blockNumber);
                });
            }

        } catch (err: any) {
            console.error("Error fetching more events:", err);
            setError(err.message || "Failed to load assets");
        } finally {
            setLoading(false);
            setIsScanning(false);
        }
    }, [isScanning, hasMoreBlocks, lastScannedBlock, fetchEventsInRange, registryContract, allParsedEvents.length]);

    // Update total count
    useEffect(() => {
        setTotalCount(allParsedEvents.length);
    }, [allParsedEvents]);

    // Initial fetch
    useEffect(() => {
        if (lastScannedBlock === null && !loadingMore && !isScanning) {
            fetchMoreEvents(pageSize);
        }
    }, [lastScannedBlock, fetchMoreEvents, pageSize, loadingMore, isScanning]);

    // Process visible assets with metadata (in batches)
    useEffect(() => {
        const processAssets = async () => {
            // Only process what we need to display
            const eventsToProcess = allParsedEvents.slice(0, displayCount);

            // Optimization: don't re-process if we already have these assets and count hasn't increased
            // This checks if we already have enough processed assets matching the events
            if (assets.length >= eventsToProcess.length &&
                assets[0]?.id === `${eventsToProcess[0]?.collectionAddress}-${eventsToProcess[0]?.tokenId}`) {
                // But we might need to update if displayCount increased?
                // Simple approach: re-slice/re-map is cheap, network fetch is expensive.
                // We should filter out already processed ones to avoid re-fetching metadata.
            }

            // Identify which events need processing (assets we don't have yet)
            // But we need to maintain order. 
            // Let's re-build the list. Preserving existing processed assets is good.

            // Map event ID to existing asset
            const existingAssetsMap = new Map(assets.map(a => [a.id, a]));

            const processedAssets: RecentAsset[] = [];

            // Items needing fetch
            const itemsToFetch: { event: ParsedEvent, index: number }[] = [];

            for (let i = 0; i < eventsToProcess.length; i++) {
                const evt = eventsToProcess[i];
                const id = `${evt.collectionAddress}-${evt.tokenId}`;
                if (existingAssetsMap.has(id)) {
                    processedAssets[i] = existingAssetsMap.get(id)!;
                } else {
                    itemsToFetch.push({ event: evt, index: i });
                }
            }

            if (itemsToFetch.length === 0) {
                if (processedAssets.length !== assets.length) {
                    setAssets(processedAssets);
                }
                return;
            }

            // Batch fetch new items
            const batchSize = 10;
            for (let i = 0; i < itemsToFetch.length; i += batchSize) {
                const batch = itemsToFetch.slice(i, i + batchSize);

                await Promise.all(batch.map(async ({ event: parsed, index }) => {
                    let name = `Asset #${parsed.tokenId}`;
                    let image = "/placeholder.svg";

                    if (parsed.metadataUri) {
                        // Check if it's likely an IPFS CID or ipfs:// URI
                        const isIpfs = !parsed.metadataUri.startsWith("http") || parsed.metadataUri.startsWith("ipfs://");

                        if (isIpfs) {
                            // Extract CID for the utility
                            let cid = parsed.metadataUri;
                            if (cid.startsWith("ipfs://")) cid = cid.replace("ipfs://", "");
                            if (cid.startsWith("ipfs/")) cid = cid.replace("ipfs/", "");

                            const metadata = await fetchIPFSMetadata(cid);
                            if (metadata) {
                                name = metadata.name || name;
                                image = processIPFSHashToUrl(metadata.image || "/placeholder.svg", "/placeholder.svg");
                            }
                        } else {
                            // Direct HTTP fetch for non-IPFS URIs
                            try {
                                const res = await fetch(parsed.metadataUri, {
                                    signal: AbortSignal.timeout(5000)
                                });
                                if (res.ok) {
                                    const metadata = await res.json();
                                    name = metadata.name || name;
                                    image = processIPFSHashToUrl(metadata.image || "/placeholder.svg", "/placeholder.svg");
                                }
                            } catch {
                                // Continue with default values
                            }
                        }
                    }

                    processedAssets[index] = {
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
                        collectionName: parsed.collectionName,
                    } as RecentAsset;
                }));
            }

            // Filter out empty slots if any parsing failed (shouldn't happen due to index assignment)
            setAssets(processedAssets.filter(Boolean));
        };

        processAssets();
    }, [allParsedEvents, displayCount]); // Intentionally omitting assets to avoid loops, logic handles diff

    const loadMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);

        const newDisplayCount = displayCount + pageSize;

        // Check if we need to fetch more events from chain to satisfy the display count
        // Allow a buffer (e.g. if we have 45 and want 50, fetch more)
        if (allParsedEvents.length < newDisplayCount && hasMoreBlocks) {
            await fetchMoreEvents(pageSize);
        }

        setDisplayCount(newDisplayCount);
        setLoadingMore(false);
    };

    const refresh = () => {
        setDisplayCount(pageSize);
        setAllParsedEvents([]);
        setAssets([]);
        setLastScannedBlock(null);
        setHasMoreBlocks(true);
        // Effect will trigger fetchMoreEvents
    };

    const hasMore = hasMoreBlocks || allParsedEvents.length > displayCount;

    return {
        assets,
        loading: loading || (allParsedEvents.length > 0 && assets.length < Math.min(allParsedEvents.length, displayCount)),
        loadingMore,
        error,
        hasMore,
        totalCount,
        loadMore,
        refresh
    };
}
