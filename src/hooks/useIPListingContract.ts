import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { IPListingABI } from "@/abis/ip_listing";
import { Abi } from "starknet";
import { Listing } from "@/types/marketplace";

export const useCreateIPLising = (data: Listing) => {
  const { address } = useAccount();

  // Initialize contract
  const { contract: IPListingContract } = useContract({
    address: process.env.NEXT_PUBLIC_LISTING_CONTRACT_ADDRESS as `0x${string}`,
    abi: IPListingABI as Abi,
  });

  // Set up the transaction
  const { sendAsync, error: createListingError } = useSendTransaction({
    calls: [],
  });

  const createListing = async () => {
    try {
      if (!IPListingContract || !address) {
        console.error("Contract or address not available");
        return false;
      }

      console.log("Sending transaction to create listing...");

      // Format the data for the contract call
      const formattedData = [
        data.assetContract,
        BigInt(data.tokenId),
        BigInt(data.startTime),
        BigInt(data.secondsUntilEndTime),
        BigInt(data.quantityToList),
        data.currencyToAccept,
        BigInt(data.buyoutPricePerToken),
        BigInt(data.tokenTypeOfListing),
      ];

      console.log("Formatted data:", formattedData);

      // Create the transaction call
      const calls = IPListingContract.populate("create_listing", formattedData);

      // Send the transaction
      const result = await sendAsync([calls]);
      console.log("Transaction sent:", result);
      return true;
    } catch (error) {
      console.error("Error creating listing:", error, createListingError);
      return false;
    }
  };

  return {
    createListing,
    createListingError,
  };
};

export const useUpdateIPMarketplaceAddress = (newAddress: string) => {
  const { address } = useAccount();

  console.log("address", address);

  // Initialize contract
  const { contract: IPListingContract } = useContract({
    address: process.env.NEXT_PUBLIC_LISTING_CONTRACT_ADDRESS as `0x${string}`,
    abi: IPListingABI as Abi,
  });

  // Creating listing
  const { send, error: createListingError } = useSendTransaction({
    calls:
      IPListingContract && address
        ? [
            IPListingContract.populate("update_ip_marketplace_address", [
              newAddress,
            ]),
          ]
        : undefined,
  });

  // Updating marketplace address
  const updateAddress = () => {
    console.log("creating listing...");

    try {
      send();
    } catch (error) {
      console.log("mint error", error);
    }
  };

  return {
    updateAddress,
    createListingError,
  };
};
// 0x03ea0f81ff87b75f465e186ec1f8440409e2d835b3f42b6d3e2baa4b4cc89e4a