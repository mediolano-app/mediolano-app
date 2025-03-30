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
        ? [IPListingContract.populate("create_listing", [data])]
        : undefined,
  });

  const createListing = () => {
    console.log("creating listing...");

    try {
      send();
    } catch (error) {
      console.log("mint error", error);
    }
  };

  return {
    createListing,
    createListingError,
  };
};

export const useCreateDummyIPLising = () => {
  const { address } = useAccount();

  // Initialize contract
  const { contract: IPListingContract } = useContract({
    address: process.env.NEXT_PUBLIC_LISTING_CONTRACT_ADDRESS as `0x${string}`,
    abi: IPListingABI as Abi,
  });

  const dummyData = [
    "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0",
    BigInt(42),
    BigInt(Math.floor(Date.now() / 1000)),
    BigInt(86400),
    BigInt(1),
    process.env.NEXT_PUBLIC_STRK_ADDRESS as `0x${string}`,
    BigInt("1000000000000000000"),
    BigInt(0),
  ];


  const { send, error: createListingError } = useSendTransaction({
    calls:
      IPListingContract && address
        ? [IPListingContract.populate("create_listing", dummyData)]
        : undefined,
  });

  const createListing = () => {
    try {
      console.log("Calling create_listing with parameters:", dummyData);

      send();

      console.log("Sent successfully");
    } catch (error) {
      console.log("mint error", error);
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
