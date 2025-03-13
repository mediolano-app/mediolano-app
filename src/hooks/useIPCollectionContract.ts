"use client";

import { useContract } from "@starknet-react/core";
import { Contract, Abi } from "starknet";
import { abi } from "@/abis/abi";

// Contract address - this should be configured in your environment variables
const contractAddressMIP = process.env.CONTRACT_ADDRESS_MIP;

export function useIPCollectionContract() {
  const { contract } = useContract({
    abi: abi as Abi,
    address: contractAddressMIP as `0x${string}`,
  });
  
  return contract as Contract;
} 