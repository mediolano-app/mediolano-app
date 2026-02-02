import { useEvents, useBlockNumber, useAccount } from "@starknet-react/core";
import { BlockTag, RpcProvider, hash, num } from "starknet";
import { useMemo, useEffect, useState, useCallback } from "react";
import { CONTRACT_ADDRESS, START_BLOCK, REGISTRY_START_BLOCK } from "@/lib/constants";
import { normalizeStarknetAddress, toHexString } from "@/lib/utils";

export function useMyTransferEvents() {
  const blockNumber = useBlockNumber();
  const fromBlock = blockNumber.data ? blockNumber.data - 10000 : 0;
  const toBlock = BlockTag.LATEST;
  const pageSize = 1000;
  const { address: walletAddress } = useAccount();

  const data = useEvents({
    address: CONTRACT_ADDRESS,
    eventName: "Transfer",
    fromBlock,
    toBlock,
    pageSize,
    enabled: !!walletAddress,
    refetchInterval: 0,
  } as any);

  const myEvents = useMemo(() => {
    if (!walletAddress || !data?.data?.pages) return [];

    const lowerWallet = walletAddress.toLowerCase();

    return data.data.pages
      .flatMap((page) => page.events || [])
      .filter((event) => {
        const keys = event.keys.map((k) => k.toLowerCase());
        const isSender = keys?.[1] === normalizeStarknetAddress(lowerWallet);
        const isRecipient = keys?.[2] === normalizeStarknetAddress(lowerWallet);
        return isSender || isRecipient;
      });
  }, [data, walletAddress]);

  return {
    ...data,
    filteredEvents: myEvents,
  };
}

export function useMyTransferEventsForTokenId(tokenId: string) {
  const blockNumber = useBlockNumber();
  const fromBlock = blockNumber.data ? blockNumber.data - 10000 : 0;
  const toBlock = BlockTag.LATEST;
  const pageSize = 1000;
  const { address: walletAddress } = useAccount();

  const data = useEvents({
    address: CONTRACT_ADDRESS,
    eventName: "Transfer",
    fromBlock,
    toBlock,
    pageSize,
    enabled: !!walletAddress,
    refetchInterval: 0,
  } as any);

  const filteredEvents = useMemo(() => {
    if (!walletAddress || !data?.data?.pages) return [];

    const normalizedWallet = normalizeStarknetAddress(
      walletAddress.toLowerCase()
    );

    return data.data.pages
      .flatMap((page) => page.events || [])
      .filter((event) => {
        const keys = event.keys.map((k) => k.toLowerCase());
        const isSender = keys?.[1] === normalizedWallet;
        const isRecipient = keys?.[2] === normalizedWallet;

        if (!event.keys || event.keys.length < 4) return false;

        try {
          const targetId = BigInt(tokenId);
          const lowValue = BigInt(event.keys[3]);
          const highValue = event.keys.length > 4 ? BigInt(event.keys[4]) : 0n;
          const eventId = lowValue + (highValue << 128n);

          return (isSender || isRecipient) && eventId === targetId;
        } catch (e) {
          return false;
        }
      });
  }, [data, walletAddress, tokenId]);

  return {
    ...data,
    filteredEvents,
  };
}

export function useAssetTransferEvents(contractAddress: string, tokenId: string) {
  const normalizedAddress = useMemo(() => {
    if (!contractAddress) return undefined;
    try {
      // Ensure the address is normalized for Starknet (lowercase, leading zeros handled)
      return normalizeStarknetAddress(contractAddress) as `0x${string}`;
    } catch (e) {
      console.warn("Address normalization failed in useAssetTransferEvents:", e);
      return contractAddress as `0x${string}`;
    }
  }, [contractAddress]);

  const blockNumber = useBlockNumber();
  const fromBlock = START_BLOCK;
  const toBlock = BlockTag.LATEST;
  const pageSize = 1000;

  const data = useEvents({
    address: normalizedAddress,
    eventName: "Transfer",
    fromBlock,
    toBlock,
    pageSize,
  } as any);

  const filteredEvents = useMemo(() => {
    if (!data?.data?.pages || !tokenId) return [];

    const targetId = BigInt(tokenId);

    return data.data.pages
      .flatMap((page) => page.events || [])
      .filter((event) => {
        // Standard Transfer event: Transfer(from, to, tokenId)
        // keys[0]: selector
        // keys[1]: from
        // keys[2]: to
        // keys[3]: tokenId (low if u256)
        // keys[4]: tokenId (high if u256)

        if (!event.keys || event.keys.length < 4) return false;

        try {
          // Compare using BigInt to be format-agnostic (0x0 vs 0x00...0)
          const lowValue = BigInt(event.keys[3]);
          const highValue = event.keys.length > 4 ? BigInt(event.keys[4]) : 0n;

          // Reconstruct Uint256: low + (high << 128)
          // Handle both single felt IDs and u256 IDs correctly
          const eventId = lowValue + (highValue << 128n);

          return eventId === targetId;
        } catch (e) {
          return false;
        }
      });
  }, [data, tokenId]);

  return {
    ...data,
    events: filteredEvents,
  };
}


// Event selectors from the registry contract
const REGISTRY_TOKEN_MINTED_SELECTOR = "0x3e517dedbc7bae62d4ace7e3dfd33255c4a7fe7c1c6f53c725d52b45f9c5a00";
const REGISTRY_TOKEN_TRANSFERRED_SELECTOR = "0x3ddaa3f2d17cc7984d82075aa171282e6fff4db61944bf218f60678f95e2567";
const STANDARD_TRANSFER_SELECTOR = "0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9";
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

/**
 * Hook for fetching comprehensive provenance events for a specific asset
 * Queries the central Collection Registry (CONTRACT_ADDRESS) for lifecycle events
 */
export function useAssetProvenanceEvents(contractAddress: string, tokenId: string, knownCollectionId?: string) {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchProvenance = useCallback(async () => {
    if (!tokenId || !RPC_URL || !CONTRACT_ADDRESS) return;

    setIsLoading(true);
    setError(null);

    const provider = new RpcProvider({ nodeUrl: RPC_URL });
    const targetTokenId = BigInt(tokenId);


    const fetchAllRegistryEvents = async () => {
      try {
        const registryAddress = normalizeStarknetAddress(CONTRACT_ADDRESS);

        // 1. Get the Collection ID for this asset's contract
        let collectionId = -1n;

        if (knownCollectionId) {
          try {
            collectionId = BigInt(knownCollectionId);
          } catch (e) {
            console.warn("[Provenance] Invalid knownCollectionId:", knownCollectionId);
          }
        }

        if (collectionId === -1n) {
          try {
            const normalizedContractAddress = normalizeStarknetAddress(contractAddress);
            let collectionIdResult: string[] | null = null;

            // Try snake_case selector first
            try {
              const entrypointSnake = hash.getSelectorFromName("get_collection_id");
              collectionIdResult = await provider.callContract({
                contractAddress: normalizedContractAddress,
                entrypoint: entrypointSnake,
                calldata: []
              });
            } catch (snakeErr) {
              // Try camelCase selector
              const entrypointCamel = hash.getSelectorFromName("getCollectionId");
              collectionIdResult = await provider.callContract({
                contractAddress: normalizedContractAddress,
                entrypoint: entrypointCamel,
                calldata: []
              });
            }

            // Result is u256 (low, high)
            if (collectionIdResult && collectionIdResult.length >= 2) {
              const low = BigInt(collectionIdResult[0]);
              const high = BigInt(collectionIdResult[1]);
              collectionId = low + (high << 128n);
            } else if (collectionIdResult && collectionIdResult.length === 1) {
              collectionId = BigInt(collectionIdResult[0]);
            }
          } catch (e) {
            console.warn(`[Provenance] Failed to fetch collection ID for ${contractAddress} with both selectors`, e);
          }
        }

        // STRICT FILTER: If we don't know the collection ID, we CANNOT safely filter Registry events.
        // Returning mixed events (same Token ID, different Collection) is worse than returning no Registry events.
        if (collectionId === -1n) {
          console.warn("[Provenance] Collection ID unknown. Skipping Registry events to avoid data pollution.");
          return { events: [], collectionId: -1n };
        }

        const events = [];
        let continuationToken: string | undefined = undefined;
        let page = 0;
        const MAX_PAGES = 50;

        do {
          const response = await provider.getEvents({
            address: registryAddress,
            from_block: { block_number: REGISTRY_START_BLOCK },
            to_block: "latest",
            keys: [[
              REGISTRY_TOKEN_MINTED_SELECTOR,
              REGISTRY_TOKEN_TRANSFERRED_SELECTOR
            ]],
            chunk_size: 1000,
            continuation_token: continuationToken
          });

          if (response.events) {
            events.push(...response.events);
          }

          continuationToken = response.continuation_token;
          page++;
        } while (continuationToken && page < MAX_PAGES);

        return { events, collectionId };
      } catch (err: any) {
        console.error("[Provenance] Registry/Collection Fetch Error:", err.message || err);
        return { events: [], collectionId: -1n };
      }
    };

    const fetchAllContractEvents = async (contractAddr: string) => {
      try {
        const normalizedContractAddress = normalizeStarknetAddress(contractAddr);

        const events = [];
        let continuationToken: string | undefined = undefined;
        let page = 0;
        const MAX_PAGES = 50;

        do {
          const response = await provider.getEvents({
            address: normalizedContractAddress,
            from_block: { block_number: START_BLOCK }, // Start from predefined block
            to_block: "latest",
            keys: [[STANDARD_TRANSFER_SELECTOR]],
            chunk_size: 1000,
            continuation_token: continuationToken
          });

          if (response.events) {
            events.push(...response.events);
          }

          continuationToken = response.continuation_token;
          page++;
        } while (continuationToken && page < MAX_PAGES);

        return events;
      } catch (err: any) {
        console.error(`[Provenance] Contract Event Fetch Error for ${contractAddr}:`, err.message || err);
        return [];
      }
    };

    try {
      const { events: registryRawEvents, collectionId: targetCollectionId } = await fetchAllRegistryEvents();
      const contractRawEvents = await fetchAllContractEvents(contractAddress);

      const allRawEvents = [...registryRawEvents, ...contractRawEvents];

      if (targetCollectionId === -1n && registryRawEvents.length > 0) {
        // Double check: if we skipped registry events above, this logic is moot, but safe to keep.
        console.warn("[Provenance] Collection ID not resolved. Filtering registry events might be inaccurate.");
      }

      const processedEvents: any[] = [];
      const seenEventHashes = new Set<string>(); // To prevent duplicates from different sources

      // Group relevant events by transaction hash
      const eventsByTx = new Map<string, { event: any; type: string; from: string; to: string; source: 'registry' | 'contract' }[]>();
      const blockNumbers = new Set<number>();

      for (const event of allRawEvents) {
        if (!event.transaction_hash) continue;

        const keys = (event.keys || []).map(k => num.toHex(k));
        const data = (event.data || []).map(d => num.toHex(d));
        const eventSelector = keys[0];
        const txHash = normalizeStarknetAddress(event.transaction_hash);

        let match = false;
        let type: "mint" | "transfer" = "transfer";
        let from = "0x0";
        let to = "Unknown";
        let source: 'registry' | 'contract' = 'contract'; // Initialize source

        // Handle Registry TokenMinted
        if (eventSelector === REGISTRY_TOKEN_MINTED_SELECTOR && data.length >= 5) {
          source = 'registry';
          const eventCollectionId = BigInt(data[0]) + (BigInt(data[1]) << 128n);

          // Strict check: We ONLY match if collection ID matches strictly.
          // Since we skip fetching if targetCollectionId is -1n, this comparison assumes targetCollectionId is valid.
          if (eventCollectionId === targetCollectionId) {
            const tokenLow = BigInt(data[2]);
            const tokenHigh = BigInt(data[3]);
            const eventTokenId = tokenLow + (tokenHigh << 128n);
            const targetTokenId = BigInt(tokenId); // re-parse for safety

            if (eventTokenId === targetTokenId) {
              match = true;
              type = "mint";
              from = "0x0";
              to = data[4];
            }
          }
        }
        // Handle Registry TokenTransferred
        else if (eventSelector === REGISTRY_TOKEN_TRANSFERRED_SELECTOR && data.length >= 5) {
          source = 'registry';
          const eventCollectionId = BigInt(data[0]) + (BigInt(data[1]) << 128n);

          if (eventCollectionId === targetCollectionId) {
            const tokenLow = BigInt(data[2]);
            const tokenHigh = BigInt(data[3]);
            const eventTokenId = tokenLow + (tokenHigh << 128n);
            const targetTokenId = BigInt(tokenId);

            if (eventTokenId === targetTokenId) {
              match = true;
              type = "transfer";
              from = data[4]; // Registry transfer data[4] is 'from'
              to = data[5]; // Registry transfer data[5] is 'to'
            }
          }
        }
        // Handle Standard Transfer (from the asset contract itself)
        else if (eventSelector === STANDARD_TRANSFER_SELECTOR && keys.length >= 4) {
          source = 'contract';
          try {
            const tokenLow = BigInt(keys[3]);
            const tokenHigh = keys.length > 4 ? BigInt(keys[4]) : 0n;
            const eventTokenId = tokenLow + (tokenHigh << 128n);
            const targetTokenId = BigInt(tokenId);

            if (eventTokenId === targetTokenId) {
              match = true;
              const sender = normalizeStarknetAddress(keys[1]);
              const receiver = normalizeStarknetAddress(keys[2]);

              // Check for Mint (from 0x0)
              if (sender === "0x0" || sender === "0x0000000000000000000000000000000000000000000000000000000000000000") {
                type = "mint";
                from = "0x0";
              } else {
                type = "transfer";
                from = sender;
              }
              to = receiver;
            }
          } catch (e) {
            console.warn(`[Provenance] Error parsing contract Transfer event keys for token ID: ${e}`);
            match = false;
          }
        }

        if (match) {
          if (!eventsByTx.has(txHash)) {
            eventsByTx.set(txHash, []);
          }
          eventsByTx.get(txHash)?.push({ event, type, from, to, source });

          if (event.block_number) blockNumbers.add(event.block_number);
        }
      }

      // Second pass: Fetch block timestamps in parallel
      const blockTimestamps = new Map<number, string>();
      await Promise.all(Array.from(blockNumbers).map(async (blockNum) => {
        try {
          const block = await provider.getBlock(blockNum);
          if (block?.timestamp) {
            blockTimestamps.set(blockNum, new Date(block.timestamp * 1000).toISOString());
          }
        } catch (e) {
          console.warn(`[Provenance] Failed to fetch block ${blockNum}:`, e);
        }
      }));

      // Third pass: Select best event per transaction and assemble final events
      for (const [txHash, txEvents] of eventsByTx.entries()) {
        // Priority: Mint (from registry) > Transfer (from registry) > Transfer (from contract)
        txEvents.sort((a, b) => {
          if (a.type === "mint" && b.type !== "mint") return -1;
          if (a.type !== "mint" && b.type === "mint") return 1;
          // Both are transfers, prioritize registry over contract (IF and ONLY IF we trust registry)
          // Since we strictly filter registry now, we trust it.
          if (a.type === "transfer" && b.type === "transfer") {
            if (a.source === 'registry' && b.source === 'contract') return -1;
            if (a.source === 'contract' && b.source === 'registry') return 1;
          }
          return 0;
        });

        const bestEvent = txEvents[0]; // Pick the highest priority
        const { event, type, from, to, source } = bestEvent;

        // Create a unique identifier for the event to prevent duplicates if multiple sources report the same event
        const eventUniqueId = `${txHash}-${type}-${from}-${to}-${event.block_number}`;
        if (seenEventHashes.has(eventUniqueId)) {
          continue; // Skip if we've already processed this exact event
        }
        seenEventHashes.add(eventUniqueId);

        const timestamp = blockTimestamps.get(event.block_number) || new Date().toISOString();

        processedEvents.push({
          id: txHash,
          type,
          title: type === "mint" ? "Asset Minted" : "Asset Transferred",
          description: type === "mint" ? `Programmable IP minted (Source: ${source})` : `Ownership transferred on-chain (Source: ${source})`,
          from: normalizeStarknetAddress(from),
          to: normalizeStarknetAddress(to),
          timestamp,
          transactionHash: txHash,
          blockNumber: event.block_number,
          verified: true,
        });
      }

      setEvents(processedEvents.sort((a, b) => (b.blockNumber || 0) - (a.blockNumber || 0)));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [tokenId, contractAddress, knownCollectionId]);

  useEffect(() => {
    fetchProvenance();
  }, [fetchProvenance]);

  return {
    events,
    isLoading,
    error,
    refetch: fetchProvenance,
    transferData: { isLoading, error, data: { pages: [{ events }] } },
    mintData: { isLoading, error, data: { pages: [{ events }] } }
  };
}
