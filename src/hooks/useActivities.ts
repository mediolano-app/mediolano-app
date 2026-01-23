import { useState, useCallback, useEffect } from "react";
import { RpcProvider, shortString, num } from "starknet";
import { fetchIPFSMetadata, processIPFSHashToUrl } from "@/utils/ipfs";

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const COLLECTION_ADDRESS = process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS;

// Event selectors for different activity types
const TOKEN_MINTED_SELECTOR = "0x3e517dedbc7bae62d4ace7e3dfd33255c4a7fe7c1c6f53c725d52b45f9c5a00";
const COLLECTION_CREATED_SELECTOR = "0x2f241bb3f752d1fb3ac68c703d92bb418a7a7c165f066fdb2d90094b5d95f0e";
const TOKEN_TRANSFERRED_SELECTOR = "0x3ddaa3f2d17cc7984d82075aa171282e6fff4db61944bf218f60678f95e2567";

export interface Activity {
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
}

export interface UseActivitiesReturn {
    activities: Activity[];
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

export function useActivities(pageSize: number = 30): UseActivitiesReturn {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [continuationToken, setContinuationToken] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true);

    const fetchActivities = useCallback(async (isLoadMore: boolean = false) => {
        if ((isLoadMore && !hasMore) || !ALCHEMY_API_KEY || !COLLECTION_ADDRESS) return;

        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || `https://starknet-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
            const provider = new RpcProvider({ nodeUrl: rpcUrl });

            // Fetch multiple event types in one query
            const response = await provider.getEvents({
                address: COLLECTION_ADDRESS,
                keys: [[
                    TOKEN_MINTED_SELECTOR,
                    COLLECTION_CREATED_SELECTOR,
                    TOKEN_TRANSFERRED_SELECTOR
                ]],
                from_block: { block_number: 1861690 }, // Start from first activity block
                chunk_size: pageSize,
                continuation_token: isLoadMore ? continuationToken : undefined,
            });

            const events = response.events;
            const nextToken = response.continuation_token;

            const processedActivities: Activity[] = [];

            for (const event of events) {
                const eventKey = event.keys[0];

                try {
                    // Determine event type and process accordingly
                    if (eventKey === TOKEN_MINTED_SELECTOR) {
                        // TokenMinted: collection_id(2), token_id(2), owner(1), metadata_uri(ByteArray)
                        const data = event.data;
                        const dataIter = data[Symbol.iterator]();

                        dataIter.next(); dataIter.next(); // Skip collection_id

                        const low = dataIter.next().value;
                        const high = dataIter.next().value;
                        if (!low || !high) continue;

                        const tokenId = BigInt(low) + (BigInt(high) << 128n);
                        const tokenIdStr = tokenId.toString();

                        const owner = dataIter.next().value;
                        if (!owner) continue;

                        const metadataUri = parseByteArray(dataIter);

                        let metadata: any = {};
                        let name = `Asset #${tokenIdStr}`;
                        let image = "/placeholder.svg";

                        if (metadataUri) {
                            try {
                                const ipfsUrl = processIPFSHashToUrl(metadataUri, "/placeholder.svg");
                                if (ipfsUrl !== "/placeholder.svg") {
                                    const res = await fetch(ipfsUrl, {
                                        signal: AbortSignal.timeout(3000)
                                    });
                                    if (res.ok) {
                                        metadata = await res.json();
                                        name = metadata.name || name;
                                        image = processIPFSHashToUrl(metadata.image || "/placeholder.svg", "/placeholder.svg");
                                    }
                                }
                            } catch (e) {
                                console.warn(`Metadata fetch failed for token ${tokenIdStr}`);
                            }
                        }

                        let type: "mint" | "remix" = "mint";
                        const isRemixMetadata =
                            metadata.templateType === "Remix Art" ||
                            metadata.template_type === "Remix Art" ||
                            (metadata.attributes && Array.isArray(metadata.attributes) &&
                                metadata.attributes.some((attr: any) => attr.trait_type === "Type" && attr.value === "Remix"));

                        if (isRemixMetadata) {
                            type = "remix";
                        }

                        processedActivities.push({
                            id: `${event.transaction_hash}-${processedActivities.length}`,
                            type,
                            assetId: tokenIdStr,
                            assetName: name,
                            assetImage: image,
                            user: owner,
                            timestamp: new Date().toISOString(),
                            details: type === "mint" ? "Minted a new asset" : "Remixed an asset",
                            txHash: event.transaction_hash,
                            price: undefined
                        });

                    } else if (eventKey === COLLECTION_CREATED_SELECTOR) {
                        // CollectionCreated: collection_id(2), owner(1), name(ByteArray), symbol(ByteArray), base_uri(ByteArray)
                        const data = event.data;
                        const dataIter = data[Symbol.iterator]();

                        const collectionIdLow = dataIter.next().value;
                        const collectionIdHigh = dataIter.next().value;
                        const collectionId = BigInt(collectionIdLow) + (BigInt(collectionIdHigh) << 128n);

                        const owner = dataIter.next().value;
                        const collectionName = parseByteArray(dataIter);

                        processedActivities.push({
                            id: `${event.transaction_hash}-${processedActivities.length}`,
                            type: "collection",
                            assetId: collectionId.toString(),
                            assetName: collectionName || `Collection #${collectionId}`,
                            assetImage: "/placeholder.svg",
                            user: owner,
                            timestamp: new Date().toISOString(),
                            details: "Created a new collection",
                            txHash: event.transaction_hash,
                            price: undefined
                        });

                    } else if (eventKey === TOKEN_TRANSFERRED_SELECTOR) {
                        // TokenTransferred: collection_id(2), token_id(2), operator(1), timestamp(1)
                        const data = event.data;
                        const dataIter = data[Symbol.iterator]();

                        dataIter.next(); dataIter.next(); // Skip collection_id

                        const low = dataIter.next().value;
                        const high = dataIter.next().value;
                        const tokenId = BigInt(low) + (BigInt(high) << 128n);

                        const operator = dataIter.next().value;

                        processedActivities.push({
                            id: `${event.transaction_hash}-${processedActivities.length}`,
                            type: "transfer",
                            assetId: tokenId.toString(),
                            assetName: `Asset #${tokenId}`,
                            assetImage: "/placeholder.svg",
                            user: operator,
                            timestamp: new Date().toISOString(),
                            details: "Transferred an asset",
                            txHash: event.transaction_hash,
                            price: undefined
                        });
                    }
                } catch (e) {
                    console.error("Error processing event:", e);
                    // Continue to next event
                }
            }

            if (isLoadMore) {
                setActivities(prev => [...prev, ...processedActivities]);
            } else {
                setActivities(processedActivities);
            }

            setContinuationToken(nextToken);
            setHasMore(!!nextToken);

        } catch (err: any) {
            console.error("Error fetching activities:", err);
            setError(err.message || "Failed to load activities");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [pageSize, continuationToken, hasMore]);

    useEffect(() => {
        fetchActivities(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMore = async () => {
        if (!loadingMore && hasMore) {
            await fetchActivities(true);
        }
    };

    const refresh = () => {
        setContinuationToken(undefined);
        setHasMore(true);
        fetchActivities(false);
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
