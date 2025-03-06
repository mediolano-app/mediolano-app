"use client";

import { useContract } from "@starknet-react/core";
import { Contract, Abi } from "starknet";
import { collectAbi } from "@/app/portfolio/IPCollectionAbi";

// Contract address - this should be configured in your environment variables
const contractAddress = process.env.NEXT_PUBLIC_IP_COLLECTION_ADDRESS || "";

export function useIPCollectionContract() {
  const { contract } = useContract({
    abi: collectAbi as Abi,
    address: contractAddress as `0x${string}`,
  });
  
  return contract as Contract;
} 