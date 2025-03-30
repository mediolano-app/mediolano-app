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

  console.log("address", address);

  const { contract: IPMarketplaceContract } = useContract({
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
    abi: IPMarketplaceABI as Abi,
  });

  const { send, error: listItemError } = useSendTransaction({
    calls:
      IPMarketplaceContract && address
        ? [IPMarketplaceContract.populate("list_item", [data])] // take note of the metadata type
        : undefined,
  });

  const listItem = () => {
    console.log("listing item...");

    try {
      send();
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

  console.log("address", address);

  const { contract: IPMarketplaceContract } = useContract({
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
    abi: IPMarketplaceABI as Abi,
  });

  const { send, error: unlistItemError } = useSendTransaction({
    calls:
      IPMarketplaceContract && address
        ? [IPMarketplaceContract.populate("unlist_item", [data])] // nft_contract: ContractAddress & token_id: u256
        : undefined,
  });

  const unlistItem = () => {
    console.log("Unlisting item...");

    try {
      send();
    } catch (error) {
      console.log("Unlisting error", error);
    }
  };

  return {
    unlistItem,
    unlistItemError,
  };
};

export const useBuyItem = (data: Listing) => {
  const { address } = useAccount();

  console.log("address", address);

  const { contract: IPMarketplaceContract } = useContract({
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
    abi: IPMarketplaceABI as Abi,
  });

  const { send, error: buyItemError } = useSendTransaction({
    calls:
      IPMarketplaceContract && address
        ? [IPMarketplaceContract.populate("buy_item", [data])] // nft_contract: ContractAddress & token_id: u256
        : undefined,
  });

  const buyItem = () => {
    console.log("Unlisting item...");

    try {
      send();
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

  console.log("address", address);

  const { contract: IPMarketplaceContract } = useContract({
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
    abi: IPMarketplaceABI as Abi,
  });

  const { send, error: UpdateListingError } = useSendTransaction({
    calls:
      IPMarketplaceContract && address
        ? [IPMarketplaceContract.populate("update_listing", [data])] // nft_contract: ContractAddress, token_id: u256 & new_price: u256
        : undefined,
  });

  const UpdateListing = () => {
    console.log("Unlisting item...");

    try {
      send();
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
    functionName: "get_listing",
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
    args: [nftContract, tokenId],
    watch: true,
  });

  return {
    listing: data as Listing | undefined,
    error,
    isLoading,
  };
}
