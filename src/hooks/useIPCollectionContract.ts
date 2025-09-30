"use client";

import { useEffect, useState } from "react";
import { useProvider } from "@starknet-react/core";
import { Contract } from "starknet";

// Contract address from environment variables
const contractAddressMIP = process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS || "0x03990b145bec2bb3d3143e7cb3b8a89a72272cf562d2b0278f38e3357cbc976f";

export function useIPCollectionContract() {
  const { provider } = useProvider();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initContract = async () => {
      if (!provider) return;

      try {
        setLoading(true);
        setError(null);
        
        // Get the actual deployed contract's ABI using getClassAt
        const classDefinition = await provider.getClassAt(contractAddressMIP);
        
        if (!classDefinition.abi) {
          throw new Error('No ABI found in contract class definition');
        }
        
        
        // Create contract instance with the actual deployed ABI
        const contractInstance = new Contract(
          classDefinition.abi,
          contractAddressMIP,
          provider
        );
        
        setContract(contractInstance);
      } catch (err) {
        console.error('Failed to initialize contract:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize contract');
      } finally {
        setLoading(false);
      }
    };

    initContract();
  }, [provider]);

  return { contract, loading, error };
} 