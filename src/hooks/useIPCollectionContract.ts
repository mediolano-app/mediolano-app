"use client";

import { useContract } from "@starknet-react/core";
import { Contract, Abi } from "starknet";
import { abi } from "@/abis/abi";

// Contract address - this should be configured in your environment variables
const contractAddressMIP = "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0";

export function useIPCollectionContract() {
  const { contract } = useContract({
    abi: abi as Abi,
    address: contractAddressMIP as `0x${string}`,
  });
  
  return contract as Contract;
} 