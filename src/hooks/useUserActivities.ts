import { useState, useCallback, useEffect } from "react";
import { RpcProvider, shortString } from "starknet";
import { fetchIPFSMetadata, processIPFSHashToUrl } from "@/utils/ipfs";
import { isAssetReported } from "@/lib/reported-content";
import { normalizeStarknetAddress } from "@/lib/utils";

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const COLLECTION_ADDRESS = process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS;

// Event selectors
const TOKEN_MINTED_SELECTOR = "0x3e517dedbc7bae62d4ace7e3dfd33255c4a7fe7c1c6f53c725d52b45f9c5a00";
const COLLECTION_CREATED_SELECTOR = "0x2f241bb3f752d1fb3ac68c703d92bb418a7a7c165f066fdb2d90094b5d95f0e";
const TOKEN_TRANSFERRED_SELECTOR = "0x3ddaa3f2d17cc7984d82075aa171282e6fff4db61944bf218f60678f95e2567";

const BLOCK_WINDOW_SIZE = 50000; // Scan 50k blocks at a time

export interface UserActivity {
    id: string;
    type: "mint" | "transfer" | "remix" | "collection";
    assetId: string;
    assetName: string;
    assetImage: string;
    user: string;
    recipient?: string;
    timestamp: string;
    details: string;
    txHash: string;
    price?: string;
    blockNumber: number;
}

export interface UseUserActivitiesReturn {
    activities: UserActivity[];
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
            } catch (e) {
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
        } catch (e) {
            // Silently skip
        }
    }

    return result;
}

interface ParsedEvent {
    id: string;
    type: "mint" | "transfer" | "collection";
    collectionId: string;
    collectionAddress?: string;
    tokenId?: string;
    owner: string;
    recipient?: string;
    metadataUri?: string;
    descriptor?: string;
    txHash: string;
    blockNumber: number;
    rawTimestamp?: number;
}

export function useUserActivities(walletAddress: string, pageSize: number = 20): UseUserActivitiesReturn {
    const [allParsedEvents, setAllParsedEvents] = useState<ParsedEvent[]>([]);
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [displayCount, setDisplayCount] = useState(pageSize);

    // Cache for block timestamps
    const [blockTimestamps, setBlockTimestamps] = useState<Record<number, string>>({});

    // Scanning state
    const [lastScannedBlock, setLastScannedBlock] = useState<number | null>(null);
    const [hasMoreBlocks, setHasMoreBlocks] = useState(true);
    const [isScanning, setIsScanning] = useState(false);

    // Normalized wallet address for comparisons
    const normalizedWallet = walletAddress ? normalizeStarknetAddress(walletAddress.toLowerCase()) : null;

    // Fetch events for a specific block range, filtered by user
    const fetchEventsInRange = useCallback(async (fromBlock: number, toBlock: number) => {
        if (!ALCHEMY_API_KEY || !COLLECTION_ADDRESS || !normalizedWallet) return [];

        const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || `https://starknet-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
        const provider = new RpcProvider({ nodeUrl: rpcUrl });

        const rangeEvents: ParsedEvent[] = [];
        let continuationToken: string | undefined = undefined;
        let pageCount = 0;
        const maxPagesPerWindow = 50;

        try {
            do {
                const response = await provider.getEvents({
                    address: COLLECTION_ADDRESS,
                    keys: [[
                        TOKEN_MINTED_SELECTOR,
                        COLLECTION_CREATED_SELECTOR,
                        TOKEN_TRANSFERRED_SELECTOR
                    ]],
                    from_block: { block_number: fromBlock },
                    to_block: { block_number: toBlock },
                    chunk_size: 100,
                    continuation_token: continuationToken,
                });

                for (const event of response.events) {
                    try {
                        const eventKey = event.keys[0];
                        const data = event.data;
                        const dataIter = data[Symbol.iterator]();

                        if (eventKey === TOKEN_MINTED_SELECTOR) {
                            // TokenMinted: collection_id(2), token_id(2), owner(1), metadata_uri(ByteArray)

                            const cIdLow = dataIter.next().value;
                            const cIdHigh = dataIter.next().value;
                            if (!cIdLow || !cIdHigh) continue;
                            const collectionId = (BigInt(cIdLow) + (BigInt(cIdHigh) << 128n)).toString();
                            const collectionAddress = "0x" + (BigInt(cIdLow) + (BigInt(cIdHigh) << 128n)).toString(16);

                            const tIdLow = dataIter.next().value;
                            const tIdHigh = dataIter.next().value;
                            if (!tIdLow || !tIdHigh) continue;
                            const tokenId = (BigInt(tIdLow) + (BigInt(tIdHigh) << 128n)).toString();

                            const assetId = `${collectionAddress}-${tokenId}`;
                            if (isAssetReported(assetId)) continue;

                            const owner = dataIter.next().value;
                            if (!owner) continue;

                            // Filter: Only include if owner is the connected user
                            const normalizedOwner = normalizeStarknetAddress(owner.toLowerCase());
                            if (normalizedOwner !== normalizedWallet) continue;

                            const metadataUri = parseByteArray(dataIter);

                            const uniqueId = `${event.transaction_hash}-${tokenId}`;

                            rangeEvents.push({
                                id: uniqueId,
                                type: "mint",
                                collectionId,
                                collectionAddress,
                                tokenId,
                                owner,
                                metadataUri,
                                txHash: event.transaction_hash,
                                blockNumber: event.block_number || 0
                            });

                        } else if (eventKey === COLLECTION_CREATED_SELECTOR) {
                            // CollectionCreated
                            const cIdLow = dataIter.next().value;
                            const cIdHigh = dataIter.next().value;
                            if (!cIdLow || !cIdHigh) continue;
                            const collectionId = (BigInt(cIdLow) + (BigInt(cIdHigh) << 128n)).toString();

                            const owner = dataIter.next().value;
                            const collectionName = parseByteArray(dataIter);

                            // Filter: Only include if owner is the connected user
                            const normalizedOwner = normalizeStarknetAddress(owner.toLowerCase());
                            if (normalizedOwner !== normalizedWallet) continue;

                            rangeEvents.push({
                                id: `${event.transaction_hash}-${collectionId}`,
                                type: "collection",
                                collectionId,
                                owner,
                                descriptor: collectionName,
                                txHash: event.transaction_hash,
                                blockNumber: event.block_number || 0
                            });

                        } else if (eventKey === TOKEN_TRANSFERRED_SELECTOR) {
                            // TokenTransferred
                            const cIdLow = dataIter.next().value;
                            const cIdHigh = dataIter.next().value;
                            if (!cIdLow || !cIdHigh) continue;
                            const collectionId = (BigInt(cIdLow) + (BigInt(cIdHigh) << 128n)).toString();
                            const collectionAddress = "0x" + (BigInt(cIdLow) + (BigInt(cIdHigh) << 128n)).toString(16);

                            const tIdLow = dataIter.next().value;
                            const tIdHigh = dataIter.next().value;
                            if (!tIdLow || !tIdHigh) continue;
                            const tokenId = (BigInt(tIdLow) + (BigInt(tIdHigh) << 128n)).toString();

                            const operator = dataIter.next().value;
                            const tsHex = dataIter.next().value;
                            const timestamp = parseInt(tsHex, 16);

                            // Filter: Only include if operator (sender/recipient) is the connected user
                            const normalizedOperator = normalizeStarknetAddress(operator.toLowerCase());
                            if (normalizedOperator !== normalizedWallet) continue;

                            rangeEvents.push({
                                id: `${event.transaction_hash}-${tokenId}-tr`,
                                type: "transfer",
                                collectionId,
                                collectionAddress,
                                tokenId,
                                owner: operator,
                                txHash: event.transaction_hash,
                                blockNumber: event.block_number || 0,
                                rawTimestamp: timestamp
                            });
                        }

                    } catch (e) {
                        console.error("Error parsing event:", e);
                    }
                }

                continuationToken = response.continuation_token;
                pageCount++;
            } while (continuationToken && pageCount < maxPagesPerWindow);

        } catch (err) {
            console.error(`Error fetching events range ${fromBlock}-${toBlock}:`, err);
        }

        return rangeEvents;
    }, [normalizedWallet]);

    // Fetch next batch (scanning backwards)
    const fetchMoreActivityEvents = useCallback(async (targetCount: number = pageSize) => {
        if (isScanning || !hasMoreBlocks || !normalizedWallet) return;

        setIsScanning(true);
        if (allParsedEvents.length === 0) setLoading(true);

        try {
            const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || `https://starknet-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
            const provider = new RpcProvider({ nodeUrl: rpcUrl });

            let currentToBlock = lastScannedBlock;

            if (currentToBlock === null) {
                try {
                    const block = await provider.getBlock("latest");
                    currentToBlock = block.block_number;
                } catch (e) {
                    console.error("Failed to get latest block", e);
                    currentToBlock = 0;
                    setHasMoreBlocks(false);
                }
            }

            const newEvents: ParsedEvent[] = [];
            let attempts = 0;
            const maxAttempts = 10;

            while (newEvents.length < targetCount && attempts < maxAttempts && currentToBlock > 0) {
                const currentFromBlock = Math.max(0, currentToBlock - BLOCK_WINDOW_SIZE);

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

            if (newEvents.length > 0) {
                setAllParsedEvents(prev => {
                    const combined = [...prev, ...newEvents];
                    const uniqueMap = new Map();
                    for (const e of combined) {
                        if (!uniqueMap.has(e.id)) {
                            uniqueMap.set(e.id, e);
                        }
                    }
                    return Array.from(uniqueMap.values()).sort((a, b) => b.blockNumber - a.blockNumber);
                });
            } else if (currentToBlock <= 0) {
                setHasMoreBlocks(false);
            }

        } catch (err: any) {
            console.error("Error fetching more activities:", err);
            setError(err.message || "Failed to load activities");
        } finally {
            setLoading(false);
            setIsScanning(false);
        }

    }, [isScanning, hasMoreBlocks, lastScannedBlock, fetchEventsInRange, allParsedEvents.length, pageSize, normalizedWallet]);

    useEffect(() => {
        if (normalizedWallet && lastScannedBlock === null && !loadingMore && !isScanning) {
            fetchMoreActivityEvents(pageSize);
        }
    }, [normalizedWallet, lastScannedBlock, fetchMoreActivityEvents, pageSize, loadingMore, isScanning]);

    const hasMore = hasMoreBlocks || allParsedEvents.length > displayCount;

    useEffect(() => {
        const processMetadata = async () => {
            if (!normalizedWallet) {
                setActivities([]);
                return;
            }

            const eventsToProcess = allParsedEvents.slice(0, displayCount);

            const uniqueBlocks = [...new Set(eventsToProcess.map(e => e.blockNumber))];
            const missingBlocks = uniqueBlocks.filter(bn => !blockTimestamps[bn]);
            const newTimestamps: Record<number, string> = {};

            if (missingBlocks.length > 0) {
                try {
                    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || `https://starknet-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
                    const provider = new RpcProvider({ nodeUrl: rpcUrl });

                    const batchSize = 5;
                    for (let i = 0; i < missingBlocks.length; i += batchSize) {
                        const batch = missingBlocks.slice(i, i + batchSize);
                        await Promise.all(batch.map(async (bn) => {
                            try {
                                const block = await provider.getBlock(bn);
                                newTimestamps[bn] = new Date(block.timestamp * 1000).toISOString();
                            } catch (e) {
                                newTimestamps[bn] = new Date().toISOString();
                            }
                        }));
                    }

                    setBlockTimestamps(prev => ({ ...prev, ...newTimestamps }));
                } catch (e) {
                    console.warn("Error fetching timestamps", e);
                }
            }

            const currentTimestamps = { ...blockTimestamps, ...newTimestamps };

            const processedActivities: UserActivity[] = [];
            const existingMap = new Map(activities.map(a => [a.id, a]));

            const itemsToFetch: { event: ParsedEvent, index: number }[] = [];

            for (let i = 0; i < eventsToProcess.length; i++) {
                const evt = eventsToProcess[i];
                const existing = existingMap.get(evt.id);

                if (existing) {
                    const ts = evt.rawTimestamp ? new Date(evt.rawTimestamp * 1000).toISOString() : currentTimestamps[evt.blockNumber];
                    if (ts && existing.timestamp !== ts) {
                        itemsToFetch.push({ event: evt, index: i });
                    } else {
                        processedActivities[i] = existing;
                    }
                } else {
                    itemsToFetch.push({ event: evt, index: i });
                }
            }

            if (itemsToFetch.length === 0 && processedActivities.length === eventsToProcess.length) {
                if (processedActivities.length !== activities.length) {
                    setActivities(processedActivities);
                }
                return;
            }

            const batchSize = 10;
            const toFetch = itemsToFetch;

            for (let i = 0; i < toFetch.length; i += batchSize) {
                const batch = toFetch.slice(i, i + batchSize);

                await Promise.all(batch.map(async ({ event: parsed, index }) => {
                    let activityType = parsed.type;
                    let assetName = parsed.descriptor || (parsed.tokenId ? `Asset #${parsed.tokenId}` : "Unknown");
                    let assetImage = "/placeholder.svg";
                    let details = "";

                    if (activityType === "collection") {
                        details = "Created a new collection";
                        assetName = parsed.descriptor || `Collection #${parsed.collectionId}`;
                    } else if (activityType === "transfer") {
                        details = "Transferred an asset";
                    } else {
                        details = "Minted a new asset";
                    }

                    if (parsed.type === "mint" && parsed.metadataUri) {
                        try {
                            const ipfsUrl = processIPFSHashToUrl(parsed.metadataUri, "/placeholder.svg");
                            if (ipfsUrl !== "/placeholder.svg") {
                                const res = await fetch(ipfsUrl, { signal: AbortSignal.timeout(5000) });
                                if (res.ok) {
                                    const metadata = await res.json();
                                    assetName = metadata.name || assetName;
                                    assetImage = processIPFSHashToUrl(metadata.image || "/placeholder.svg", "/placeholder.svg");

                                    const isRemix =
                                        metadata.templateType === "Remix Art" ||
                                        metadata.template_type === "Remix Art" ||
                                        (metadata.attributes && Array.isArray(metadata.attributes) &&
                                            metadata.attributes.some((attr: any) => attr.trait_type === "Type" && attr.value === "Remix"));

                                    if (isRemix) {
                                        activityType = "remix";
                                        details = "Remixed an asset";
                                    }
                                }
                            }
                        } catch (e) {
                            // Ignore
                        }
                    }

                    const timestamp = parsed.rawTimestamp
                        ? new Date(parsed.rawTimestamp * 1000).toISOString()
                        : (currentTimestamps[parsed.blockNumber] || new Date().toISOString());

                    // Construct proper asset ID for linking
                    const assetKey = parsed.type === "collection"
                        ? parsed.collectionId
                        : (parsed.collectionAddress && parsed.tokenId ? `${parsed.collectionAddress}-${parsed.tokenId}` : (parsed.tokenId || parsed.collectionId));

                    processedActivities[index] = {
                        id: parsed.id,
                        type: activityType as any,
                        assetId: assetKey,
                        assetName,
                        assetImage,
                        user: parsed.owner,
                        timestamp,
                        details,
                        txHash: parsed.txHash,
                        blockNumber: parsed.blockNumber
                    };
                }));
            }

            setActivities(processedActivities.filter(Boolean));
        };

        processMetadata();
    }, [allParsedEvents, displayCount, blockTimestamps, normalizedWallet]);

    const loadMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);

        const newDisplayCount = displayCount + pageSize;

        if (allParsedEvents.length < newDisplayCount && hasMoreBlocks) {
            await fetchMoreActivityEvents(pageSize);
        }

        setDisplayCount(newDisplayCount);
        setLoadingMore(false);
    };

    const refresh = () => {
        setDisplayCount(pageSize);
        setAllParsedEvents([]);
        setActivities([]);
        setLastScannedBlock(null);
        setHasMoreBlocks(true);
        setError(null);
    };

    return {
        activities,
        loading,
        loadingMore,
        error,
        hasMore,
        loadMore,
        refresh
    };
}
