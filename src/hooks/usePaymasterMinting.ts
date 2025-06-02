/**
 * Enhanced minting hook with AVNU Paymaster support
 */

import { useState, useCallback } from "react";
import { useAccount, useContract } from "@starknet-react/core";
import { Abi } from "starknet";
import { abi } from "@/abis/abi";
import { usePaymasterTransaction } from "./usePaymasterTransaction";
import { useToast } from "@/components/ui/use-toast";

interface UsePaymasterMintingProps {
  contractAddress?: string;
  enabled?: boolean;
}

interface UsePaymasterMintingReturn {
  // Minting functions
  mintWithPaymaster: (recipient: string, tokenURI: string, gasTokenAddress?: string, maxAmount?: bigint) => Promise<void>;
  mintSponsored: (recipient: string, tokenURI: string) => Promise<void>;
  mintTraditional: (recipient: string, tokenURI: string) => Promise<void>;
  
  // State
  isMinting: boolean;
  mintingHash: string | null;
  mintingError: string | null;
  canSponsorMint: boolean;
  
  // Paymaster state
  isGaslessCompatible: boolean;
  gasTokenPrices: any[];
  
  // Utilities
  refreshGasPrices: () => Promise<void>;
  resetMintingState: () => void;
}

export function usePaymasterMinting({
  contractAddress,
  enabled = true,
}: UsePaymasterMintingProps = {}): UsePaymasterMintingReturn {
  const { account, address } = useAccount();
  const { toast } = useToast();
  
  // Local state
  const [isMinting, setIsMinting] = useState(false);
  const [mintingHash, setMintingHash] = useState<string | null>(null);
  const [mintingError, setMintingError] = useState<string | null>(null);

  // Contract setup
  const finalContractAddress = contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP;
  
  const { contract } = useContract({
    abi: abi as Abi,
    address: finalContractAddress as `0x${string}`,
  });

  // Paymaster transaction hook
  const {
    executeGasless,
    executeSponsored,
    executeTransaction,
    isLoading: isPaymasterLoading,
    isGaslessCompatible,
    gasTokenPrices,
    transactionHash: paymasterHash,
    error: paymasterError,
    canSponsor,
    refreshGasPrices,
  } = usePaymasterTransaction({
    transactionType: "mint",
    enabled,
  });

  // Reset minting state
  const resetMintingState = useCallback(() => {
    setIsMinting(false);
    setMintingHash(null);
    setMintingError(null);
  }, []);

  // Prepare mint calls
  const prepareMintCalls = useCallback((recipient: string, tokenURI: string) => {
    if (!contract || !address) {
      throw new Error("Contract or wallet not available");
    }

    return [
      contract.populate("mint_item", [recipient, tokenURI])
    ];
  }, [contract, address]);

  // Mint with Paymaster (gasless)
  const mintWithPaymaster = useCallback(async (
    recipient: string, 
    tokenURI: string, 
    gasTokenAddress?: string, 
    maxAmount?: bigint
  ) => {
    if (!gasTokenAddress || !maxAmount) {
      throw new Error("Gas token address and max amount required for gasless minting");
    }

    setIsMinting(true);
    setMintingError(null);
    setMintingHash(null);

    try {
      const calls = prepareMintCalls(recipient, tokenURI);
      
      // Update the paymaster transaction hook with our calls
      const paymasterHook = usePaymasterTransaction({
        calls,
        transactionType: "mint",
        enabled: true,
      });

      await paymasterHook.executeGasless(gasTokenAddress, maxAmount);
      
      if (paymasterHook.transactionHash) {
        setMintingHash(paymasterHook.transactionHash);
        toast({
          title: "Gasless Mint Successful",
          description: `NFT minted successfully using alternative gas token!`,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Gasless minting failed";
      setMintingError(errorMessage);
      toast({
        title: "Gasless Mint Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  }, [prepareMintCalls, toast]);

  // Mint with sponsorship
  const mintSponsored = useCallback(async (recipient: string, tokenURI: string) => {
    if (!canSponsor) {
      throw new Error("Minting sponsorship not available");
    }

    setIsMinting(true);
    setMintingError(null);
    setMintingHash(null);

    try {
      const calls = prepareMintCalls(recipient, tokenURI);
      
      // Update the paymaster transaction hook with our calls
      const paymasterHook = usePaymasterTransaction({
        calls,
        transactionType: "mint",
        enabled: true,
      });

      await paymasterHook.executeSponsored();
      
      if (paymasterHook.transactionHash) {
        setMintingHash(paymasterHook.transactionHash);
        toast({
          title: "Sponsored Mint Successful",
          description: "NFT minted successfully with sponsored gas fees!",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sponsored minting failed";
      setMintingError(errorMessage);
      toast({
        title: "Sponsored Mint Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  }, [canSponsor, prepareMintCalls, toast]);

  // Traditional mint (fallback)
  const mintTraditional = useCallback(async (recipient: string, tokenURI: string) => {
    setIsMinting(true);
    setMintingError(null);
    setMintingHash(null);

    try {
      const calls = prepareMintCalls(recipient, tokenURI);
      
      // Update the paymaster transaction hook with our calls
      const paymasterHook = usePaymasterTransaction({
        calls,
        transactionType: "mint",
        enabled: true,
      });

      await paymasterHook.executeTransaction();
      
      if (paymasterHook.transactionHash) {
        setMintingHash(paymasterHook.transactionHash);
        toast({
          title: "Traditional Mint Successful",
          description: "NFT minted successfully with traditional gas payment!",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Traditional minting failed";
      setMintingError(errorMessage);
      toast({
        title: "Traditional Mint Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  }, [prepareMintCalls, toast]);

  // Determine if we can sponsor minting
  const canSponsorMint = canSponsor && enabled;

  return {
    // Minting functions
    mintWithPaymaster,
    mintSponsored,
    mintTraditional,
    
    // State
    isMinting: isMinting || isPaymasterLoading,
    mintingHash: mintingHash || paymasterHash,
    mintingError: mintingError || paymasterError,
    canSponsorMint,
    
    // Paymaster state
    isGaslessCompatible,
    gasTokenPrices,
    
    // Utilities
    refreshGasPrices,
    resetMintingState,
  };
}
