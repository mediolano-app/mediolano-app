"use client";

import { useContract } from "@starknet-react/core";
import { Contract } from "starknet";
import { useNetworkConfig } from "./useNetworkConfig";

// Placeholder ABI - replace with your actual contract ABI
const contractAbi = [
  {
    name: "registerIP",
    type: "function",
    inputs: [
      { name: "name", type: "felt" },
      { name: "description", type: "felt" },
      { name: "asset_type", type: "felt" },
      { name: "media_url", type: "felt" },
      { name: "license", type: "felt" },
      { name: "collection", type: "felt" },
      { name: "ip_version", type: "felt" },
      { name: "is_limited", type: "felt" },
      { name: "total_supply", type: "felt" },
    ],
    outputs: [],
  },
  {
    name: "getUserIPs",
    type: "function",
    inputs: [{ name: "user", type: "felt" }],
    outputs: [{ name: "ip_ids_len", type: "felt" }, { name: "ip_ids", type: "felt*" }],
  },
  // Add more functions as needed
];

export function useSmartContract() {
  const { mipContract, currentNetwork } = useNetworkConfig();

  // Use network-aware contract address with fallback
  const contractAddress = mipContract || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

  if (!contractAddress) {
    throw new Error(`Smart contract address not configured for ${currentNetwork}`);
  }

  const { contract } = useContract({
    abi: contractAbi,
    address: contractAddress,
  });

  return contract as Contract;
}