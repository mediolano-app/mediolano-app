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
  //   const fromBlock = blockNumber.data ? blockNumber.data - 1000 : 0;
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
        const isMatchingTokenId = keys?.[3] === toHexString(tokenId);

        return (isSender || isRecipient) && isMatchingTokenId;
      });
  }, [data, walletAddress, tokenId]);

  return {
    ...data,
    filteredEvents,
  };
}
