import {
  useAccount,
  useContract,
  useReadContract,
  useSendTransaction,
} from "@starknet-react/core";
import { IPMarketplaceABI } from "../abis/ip_market";
import { Listing } from "../types/marketplace";
import { Abi } from "starknet";

export const useListItem = (data: Listing) => {
  const { address } = useAccount();

  const { contract: IPMarketplaceContract } = useContract({
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
    abi: IPMarketplaceABI as Abi,
  });

  const { sendAsync, error: listItemError } = useSendTransaction({
    calls: [],
  });

  const listItem = () => {
    console.log("listing item...");

    if (!IPMarketplaceContract || !address) {
      console.error("Contract or address not available");
      return false;
    }

    try {
      const calls = IPMarketplaceContract?.populate("list_item", [data]);
      if (calls) {
        sendAsync([calls]);
      }
    } catch (error) {
      console.log("listing error", error);
    }
  };

  return {
    listItem,
    listItemError,
  };
};

export const useUnlistItem = (data: Listing) => {
  const { address } = useAccount();

  const { contract: IPMarketplaceContract } = useContract({
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
    abi: IPMarketplaceABI as Abi,
  });

  const { sendAsync, error: unlistItemError } = useSendTransaction({
    calls: [],
  });

  const unlistItem = async () => {
    console.log("Unlisting item...");

    try {
      const calls = IPMarketplaceContract?.populate("create_listing", [data]);

      if (!IPMarketplaceContract || !address) {
        console.error("Contract or address not available");
        return false;
      }

      if (calls) {
        const result = await sendAsync([calls]);
        console.log("Transaction sent:", result);
        return true;
      }
      return false;
    } catch (error) {
      console.log("Unlisting error", error);
      return false;
    }
  };

  return {
    unlistItem,
    unlistItemError,
  };
};

export const useBuyItem = (data: Listing) => {
  const { address } = useAccount();

  const { contract: IPMarketplaceContract } = useContract({
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
    abi: IPMarketplaceABI as Abi,
  });

  const { sendAsync, error: buyItemError } = useSendTransaction({
    calls: [],
  });

  const buyItem = async () => {
    if (!IPMarketplaceContract || !address) {
      console.error("Contract or address not available");
      return false;
    }

    try {
      const calls = IPMarketplaceContract?.populate("buy_item", [data]);
      if (calls) {
        sendAsync([calls]);
      }
    } catch (error) {
      console.log("Unlisting error", error);
    }
  };

  return {
    buyItem,
    buyItemError,
  };
};

export const useUpdateListing = (data: Listing) => {
  const { address } = useAccount();

  const { contract: IPMarketplaceContract } = useContract({
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
    abi: IPMarketplaceABI as Abi,
  });

  const { sendAsync, error: UpdateListingError } = useSendTransaction({
    calls: [],
  });

  const UpdateListing = async () => {
    if (!IPMarketplaceContract || !address) {
      console.error("Contract or address not available");
      return false;
    }

    try {
      const calls = IPMarketplaceContract?.populate("update_listing", [data]);
      if (calls) {
        sendAsync([calls]);
      }
    } catch (error) {
      console.log("Unlisting error", error);
    }
  };

  return {
    UpdateListing,
    UpdateListingError,
  };
};

export function useGetListing(nftContract: string, tokenId: string) {
  const { data, error, isLoading } = useReadContract({
    abi: IPMarketplaceABI as Abi,
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
    functionName: "get_listing",
    args: [nftContract, tokenId],
    watch: true,
  });

  return {
    listing: data as Listing | undefined,
    error,
    isLoading,
  };
}
