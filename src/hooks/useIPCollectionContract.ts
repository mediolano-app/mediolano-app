"use client";

import { useContract } from "@starknet-react/core";
import { Contract, Abi } from "starknet";
import { abi } from "@/abis/abi";
import { useNetworkConfig } from "./useNetworkConfig";

export function useIPCollectionContract() {
  const { mipContract, validation, currentNetwork } = useNetworkConfig();

  // Validate that the contract address is available
  if (!mipContract) {
    throw new Error(`MIP contract address not configured for ${currentNetwork}`);
  }

  if (!validation.isValid) {
    console.warn(`Network validation failed for ${currentNetwork}:`, validation.missingContracts);
  }

  const { contract } = useContract({
    abi: abi as Abi,
    address: mipContract as `0x${string}`,
  });

  return contract as Contract;
}