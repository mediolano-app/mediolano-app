import { useEvents, useBlockNumber, useAccount } from "@starknet-react/core";
import { BlockTag, RpcProvider, hash, num } from "starknet";
import { useMemo, useEffect, useState, useCallback } from "react";
import { CONTRACT_ADDRESS } from "@/lib/constants";
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
  const fromBlock = 0;
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
export function useAssetProvenanceEvents(contractAddress: string, tokenId: string) {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchProvenance = useCallback(async () => {
    if (!tokenId || !RPC_URL || !CONTRACT_ADDRESS) return;

    setIsLoading(true);
    setError(null);

    const provider = new RpcProvider({ nodeUrl: RPC_URL });
    const targetTokenId = BigInt(tokenId);

    console.log(`[Provenance] Fetching events for Token ID: ${tokenId}`);

    const fetchAllRegistryEvents = async () => {
      try {
        const registryAddress = normalizeStarknetAddress(CONTRACT_ADDRESS);

        const response = await provider.getEvents({
          address: registryAddress,
          from_block: { block_number: 1861690 },
          to_block: "latest",
          keys: [[
            REGISTRY_TOKEN_MINTED_SELECTOR,
            REGISTRY_TOKEN_TRANSFERRED_SELECTOR,
            STANDARD_TRANSFER_SELECTOR
          ]],
          chunk_size: 1000,
        });

        console.log(`[Provenance] Found ${response.events?.length || 0} registry events`);
        return response.events || [];
      } catch (err: any) {
        console.error("[Provenance] Registry Fetch Error:", err.message || err);
        return [];
      }
    };

    try {
      const registryRawEvents = await fetchAllRegistryEvents();
      const processedEvents: any[] = [];
      const seenHashes = new Set<string>();

      // First pass: Filter relevance and collect block numbers
      const relevantEvents: { event: any; type: string; from: string; to: string }[] = [];
      const blockNumbers = new Set<number>();

      for (const event of registryRawEvents) {
        if (!event.transaction_hash) continue;

        const keys = (event.keys || []).map(k => num.toHex(k));
        const data = (event.data || []).map(d => num.toHex(d));
        const eventSelector = keys[0];

        let match = false;
        let type: "mint" | "transfer" = "transfer";
        let from = "0x0";
        let to = "Unknown";

        // Handle Registry TokenMinted
        if (eventSelector === REGISTRY_TOKEN_MINTED_SELECTOR && data.length >= 5) {
          const tokenLow = BigInt(data[2]);
          const tokenHigh = BigInt(data[3]);
          const eventTokenId = tokenLow + (tokenHigh << 128n);

          if (eventTokenId === targetTokenId) {
            match = true;
            type = "mint";
            from = "0x0";
            to = data[4];
          }
        }

        // Handle Registry TokenTransferred
        else if (eventSelector === REGISTRY_TOKEN_TRANSFERRED_SELECTOR && data.length >= 5) {
          const tokenLow = BigInt(data[2]);
          const tokenHigh = BigInt(data[3]);
          const eventTokenId = tokenLow + (tokenHigh << 128n);

          if (eventTokenId === targetTokenId) {
            match = true;
            type = "transfer";
            to = data[4];
          }
        }

        // Standard ERC721 Transfer
        else if (eventSelector === STANDARD_TRANSFER_SELECTOR && keys.length >= 4) {
          const tokenLow = BigInt(keys[3]);
          const tokenHigh = keys.length > 4 ? BigInt(keys[4]) : 0n;
          const eventTokenId = tokenLow + (tokenHigh << 128n);

          if (eventTokenId === targetTokenId) {
            match = true;
            type = BigInt(keys[1]) === 0n ? "mint" : "transfer";
            from = keys[1];
            to = keys[2];
          }
        }

        if (match && !seenHashes.has(event.transaction_hash)) {
          seenHashes.add(event.transaction_hash);
          relevantEvents.push({ event, type, from, to });
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

      // Third pass: Assemble final events
      for (const { event, type, from, to } of relevantEvents) {
        const timestamp = blockTimestamps.get(event.block_number) || new Date().toISOString();

        processedEvents.push({
          id: event.transaction_hash,
          type,
          title: type === "mint" ? "Asset Minted" : "Asset Transferred",
          description: type === "mint" ? "Original IP Asset minted" : "Ownership transferred on-chain",
          from: normalizeStarknetAddress(from),
          to: normalizeStarknetAddress(to),
          timestamp,
          transactionHash: event.transaction_hash,
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
  }, [tokenId]);

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
