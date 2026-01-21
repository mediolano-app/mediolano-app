import { useEvents, useBlockNumber, useAccount } from "@starknet-react/core";
import { BlockTag } from "starknet";
import { useMemo } from "react";
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
  });

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
  });

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
