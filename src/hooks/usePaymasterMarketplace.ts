/**
 * Enhanced marketplace hook with AVNU Paymaster support
 */

import { useState, useCallback } from "react";
import { useAccount, useContract } from "@starknet-react/core";
import { Abi } from "starknet";
import { IPMarketplaceABI } from "@/abis/ip_market";
import { usePaymasterTransaction } from "./usePaymasterTransaction";
import { useToast } from "@/components/ui/use-toast";
import { Listing } from "@/types/marketplace";

interface UsePaymasterMarketplaceReturn {
  // Marketplace functions
  buyItemWithPaymaster: (listing: Listing, gasTokenAddress?: string, maxAmount?: bigint) => Promise<void>;
  buyItemSponsored: (listing: Listing) => Promise<void>;
  buyItemTraditional: (listing: Listing) => Promise<void>;
  
  listItemWithPaymaster: (listing: Listing, gasTokenAddress?: string, maxAmount?: bigint) => Promise<void>;
  listItemSponsored: (listing: Listing) => Promise<void>;
  listItemTraditional: (listing: Listing) => Promise<void>;
  
  // State
  isProcessing: boolean;
  transactionHash: string | null;
  transactionError: string | null;
  canSponsorMarketplace: boolean;
  
  // Paymaster state
  isGaslessCompatible: boolean;
  gasTokenPrices: any[];
  
  // Utilities
  refreshGasPrices: () => Promise<void>;
  resetTransactionState: () => void;
}

export function usePaymasterMarketplace(): UsePaymasterMarketplaceReturn {
  const { account, address } = useAccount();
  const { toast } = useToast();
  
  // Local state
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [transactionError, setTransactionError] = useState<string | null>(null);

  // Contract setup
  const { contract: marketplaceContract } = useContract({
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
    abi: IPMarketplaceABI as Abi,
  });

  // Paymaster transaction hook for buying
  const {
    executeGasless: executeGaslessBuy,
    executeSponsored: executeSponsoredBuy,
    executeTransaction: executeTraditionalBuy,
    isLoading: isBuyLoading,
    isGaslessCompatible,
    gasTokenPrices,
    transactionHash: buyHash,
    error: buyError,
    canSponsor: canSponsorBuy,
    refreshGasPrices,
  } = usePaymasterTransaction({
    transactionType: "marketplace_buy",
    enabled: true,
  });

  // Paymaster transaction hook for listing
  const {
    executeGasless: executeGaslessList,
    executeSponsored: executeSponsoredList,
    executeTransaction: executeTraditionalList,
    isLoading: isListLoading,
    transactionHash: listHash,
    error: listError,
    canSponsor: canSponsorList,
  } = usePaymasterTransaction({
    transactionType: "marketplace_list",
    enabled: true,
  });

  // Reset transaction state
  const resetTransactionState = useCallback(() => {
    setIsProcessing(false);
    setTransactionHash(null);
    setTransactionError(null);
  }, []);

  // Prepare buy calls
  const prepareBuyCalls = useCallback((listing: Listing) => {
    if (!marketplaceContract || !address) {
      throw new Error("Marketplace contract or wallet not available");
    }

    return [
      marketplaceContract.populate("buy_item", [listing])
    ];
  }, [marketplaceContract, address]);

  // Prepare list calls
  const prepareListCalls = useCallback((listing: Listing) => {
    if (!marketplaceContract || !address) {
      throw new Error("Marketplace contract or wallet not available");
    }

    return [
      marketplaceContract.populate("list_item", [listing])
    ];
  }, [marketplaceContract, address]);

  // Buy item with Paymaster (gasless)
  const buyItemWithPaymaster = useCallback(async (
    listing: Listing,
    gasTokenAddress?: string,
    maxAmount?: bigint
  ) => {
    if (!gasTokenAddress || !maxAmount) {
      throw new Error("Gas token address and max amount required for gasless purchase");
    }

    setIsProcessing(true);
    setTransactionError(null);
    setTransactionHash(null);

    try {
      const calls = prepareBuyCalls(listing);
      
      // Create a new paymaster hook instance with the calls
      const paymasterHook = usePaymasterTransaction({
        calls,
        transactionType: "marketplace_buy",
        enabled: true,
      });

      await paymasterHook.executeGasless(gasTokenAddress, maxAmount);
      
      if (paymasterHook.transactionHash) {
        setTransactionHash(paymasterHook.transactionHash);
        toast({
          title: "Gasless Purchase Successful",
          description: "Item purchased successfully using alternative gas token!",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Gasless purchase failed";
      setTransactionError(errorMessage);
      toast({
        title: "Gasless Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [prepareBuyCalls, toast]);

  // Buy item with sponsorship
  const buyItemSponsored = useCallback(async (listing: Listing) => {
    if (!canSponsorBuy) {
      throw new Error("Purchase sponsorship not available");
    }

    setIsProcessing(true);
    setTransactionError(null);
    setTransactionHash(null);

    try {
      const calls = prepareBuyCalls(listing);
      
      const paymasterHook = usePaymasterTransaction({
        calls,
        transactionType: "marketplace_buy",
        enabled: true,
      });

      await paymasterHook.executeSponsored();
      
      if (paymasterHook.transactionHash) {
        setTransactionHash(paymasterHook.transactionHash);
        toast({
          title: "Sponsored Purchase Successful",
          description: "Item purchased successfully with sponsored gas fees!",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sponsored purchase failed";
      setTransactionError(errorMessage);
      toast({
        title: "Sponsored Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [canSponsorBuy, prepareBuyCalls, toast]);

  // Buy item traditional
  const buyItemTraditional = useCallback(async (listing: Listing) => {
    setIsProcessing(true);
    setTransactionError(null);
    setTransactionHash(null);

    try {
      const calls = prepareBuyCalls(listing);
      
      const paymasterHook = usePaymasterTransaction({
        calls,
        transactionType: "marketplace_buy",
        enabled: true,
      });

      await paymasterHook.executeTransaction();
      
      if (paymasterHook.transactionHash) {
        setTransactionHash(paymasterHook.transactionHash);
        toast({
          title: "Traditional Purchase Successful",
          description: "Item purchased successfully with traditional gas payment!",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Traditional purchase failed";
      setTransactionError(errorMessage);
      toast({
        title: "Traditional Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [prepareBuyCalls, toast]);

  // List item with Paymaster (gasless)
  const listItemWithPaymaster = useCallback(async (
    listing: Listing,
    gasTokenAddress?: string,
    maxAmount?: bigint
  ) => {
    if (!gasTokenAddress || !maxAmount) {
      throw new Error("Gas token address and max amount required for gasless listing");
    }

    setIsProcessing(true);
    setTransactionError(null);
    setTransactionHash(null);

    try {
      const calls = prepareListCalls(listing);
      
      const paymasterHook = usePaymasterTransaction({
        calls,
        transactionType: "marketplace_list",
        enabled: true,
      });

      await paymasterHook.executeGasless(gasTokenAddress, maxAmount);
      
      if (paymasterHook.transactionHash) {
        setTransactionHash(paymasterHook.transactionHash);
        toast({
          title: "Gasless Listing Successful",
          description: "Item listed successfully using alternative gas token!",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Gasless listing failed";
      setTransactionError(errorMessage);
      toast({
        title: "Gasless Listing Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [prepareListCalls, toast]);

  // List item with sponsorship
  const listItemSponsored = useCallback(async (listing: Listing) => {
    if (!canSponsorList) {
      throw new Error("Listing sponsorship not available");
    }

    setIsProcessing(true);
    setTransactionError(null);
    setTransactionHash(null);

    try {
      const calls = prepareListCalls(listing);
      
      const paymasterHook = usePaymasterTransaction({
        calls,
        transactionType: "marketplace_list",
        enabled: true,
      });

      await paymasterHook.executeSponsored();
      
      if (paymasterHook.transactionHash) {
        setTransactionHash(paymasterHook.transactionHash);
        toast({
          title: "Sponsored Listing Successful",
          description: "Item listed successfully with sponsored gas fees!",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sponsored listing failed";
      setTransactionError(errorMessage);
      toast({
        title: "Sponsored Listing Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [canSponsorList, prepareListCalls, toast]);

  // List item traditional
  const listItemTraditional = useCallback(async (listing: Listing) => {
    setIsProcessing(true);
    setTransactionError(null);
    setTransactionHash(null);

    try {
      const calls = prepareListCalls(listing);
      
      const paymasterHook = usePaymasterTransaction({
        calls,
        transactionType: "marketplace_list",
        enabled: true,
      });

      await paymasterHook.executeTransaction();
      
      if (paymasterHook.transactionHash) {
        setTransactionHash(paymasterHook.transactionHash);
        toast({
          title: "Traditional Listing Successful",
          description: "Item listed successfully with traditional gas payment!",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Traditional listing failed";
      setTransactionError(errorMessage);
      toast({
        title: "Traditional Listing Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [prepareListCalls, toast]);

  // Determine if we can sponsor marketplace transactions
  const canSponsorMarketplace = canSponsorBuy || canSponsorList;

  return {
    // Marketplace functions
    buyItemWithPaymaster,
    buyItemSponsored,
    buyItemTraditional,
    listItemWithPaymaster,
    listItemSponsored,
    listItemTraditional,
    
    // State
    isProcessing: isProcessing || isBuyLoading || isListLoading,
    transactionHash: transactionHash || buyHash || listHash,
    transactionError: transactionError || buyError || listError,
    canSponsorMarketplace,
    
    // Paymaster state
    isGaslessCompatible,
    gasTokenPrices,
    
    // Utilities
    refreshGasPrices,
    resetTransactionState,
  };
}
