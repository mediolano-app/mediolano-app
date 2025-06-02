/**
 * Enhanced transaction hook with AVNU Paymaster support
 */

import { useState, useEffect, useCallback } from "react";
import { useAccount, useSendTransaction } from "@starknet-react/core";
import { Call } from "starknet";
import { 
  executeGaslessTransaction,
  buildSponsoredTypedData,
  executeSponsoredTransaction,
  shouldSponsorTransaction,
  getGasTokenPrices,
  checkAccountCompatibility
} from "@/utils/paymaster";
import { 
  PaymasterOptions, 
  PaymasterResponse, 
  TransactionType,
  GasTokenPrice,
  AccountCompatibility
} from "@/types/paymaster";
import { useToast } from "@/components/ui/use-toast";

interface UsePaymasterTransactionProps {
  calls?: Call[];
  transactionType?: TransactionType;
  enabled?: boolean;
}

interface UsePaymasterTransactionReturn {
  // Transaction execution
  executeTransaction: () => Promise<void>;
  executeGasless: (gasTokenAddress: string, maxAmount: bigint) => Promise<void>;
  executeSponsored: () => Promise<void>;
  
  // State
  isLoading: boolean;
  isGaslessCompatible: boolean;
  gasTokenPrices: GasTokenPrice[];
  transactionHash: string | null;
  error: string | null;
  
  // Configuration
  canSponsor: boolean;
  paymasterOptions: PaymasterOptions;
  setPaymasterOptions: (options: Partial<PaymasterOptions>) => void;
  
  // Utilities
  refreshGasPrices: () => Promise<void>;
  checkCompatibility: () => Promise<void>;
}

export function usePaymasterTransaction({
  calls = [],
  transactionType,
  enabled = true,
}: UsePaymasterTransactionProps): UsePaymasterTransactionReturn {
  const { account, address } = useAccount();
  const { toast } = useToast();
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isGaslessCompatible, setIsGaslessCompatible] = useState(false);
  const [gasTokenPrices, setGasTokenPrices] = useState<GasTokenPrice[]>([]);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymasterOptions, setPaymasterOptionsState] = useState<PaymasterOptions>({
    sponsored: false,
  });

  // Traditional transaction fallback
  const { send: sendTraditional, error: traditionalError } = useSendTransaction({
    calls: calls.length > 0 ? calls : undefined,
  });

  // Check if transaction can be sponsored
  const canSponsor = transactionType ? shouldSponsorTransaction(transactionType) : false;

  // Set paymaster options
  const setPaymasterOptions = useCallback((options: Partial<PaymasterOptions>) => {
    setPaymasterOptionsState(prev => ({ ...prev, ...options }));
  }, []);

  // Check account compatibility
  const checkCompatibility = useCallback(async () => {
    if (!address || !enabled) return;

    try {
      const compatibility = await checkAccountCompatibility(address);
      setIsGaslessCompatible(compatibility.isCompatible);
      
      if (!compatibility.isCompatible && compatibility.reason) {
        console.warn("Account not compatible with gasless transactions:", compatibility.reason);
      }
    } catch (error) {
      console.error("Error checking compatibility:", error);
      setIsGaslessCompatible(false);
    }
  }, [address, enabled]);

  // Refresh gas token prices
  const refreshGasPrices = useCallback(async () => {
    if (!enabled) return;

    try {
      const prices = await getGasTokenPrices();
      setGasTokenPrices(prices);
    } catch (error) {
      console.error("Error fetching gas prices:", error);
      toast({
        title: "Warning",
        description: "Could not fetch gas token prices. Gasless transactions may not be available.",
        variant: "destructive",
      });
    }
  }, [enabled, toast]);

  // Execute traditional transaction
  const executeTransaction = useCallback(async () => {
    if (!account || calls.length === 0) {
      setError("Account not connected or no calls provided");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTransactionHash(null);

    try {
      await sendTraditional();
      toast({
        title: "Transaction Submitted",
        description: "Your transaction has been submitted to the network.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Transaction failed";
      setError(errorMessage);
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [account, calls, sendTraditional, toast]);

  // Execute gasless transaction (user pays with alternative token)
  const executeGasless = useCallback(async (gasTokenAddress: string, maxAmount: bigint) => {
    if (!account || calls.length === 0) {
      setError("Account not connected or no calls provided");
      return;
    }

    if (!isGaslessCompatible) {
      setError("Account not compatible with gasless transactions");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTransactionHash(null);

    try {
      const options: PaymasterOptions = {
        gasTokenAddress,
        maxGasTokenAmount: maxAmount,
        gasTokenPrices,
        ...paymasterOptions,
      };

      const response = await executeGaslessTransaction(account, calls, options);
      
      if (response.success) {
        setTransactionHash(response.transactionHash);
        toast({
          title: "Gasless Transaction Submitted",
          description: "Your transaction has been submitted without ETH gas fees.",
        });
      } else {
        throw new Error(response.error || "Gasless transaction failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Gasless transaction failed";
      setError(errorMessage);
      toast({
        title: "Gasless Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [account, calls, isGaslessCompatible, gasTokenPrices, paymasterOptions, toast]);

  // Execute sponsored transaction
  const executeSponsored = useCallback(async () => {
    if (!account || !address || calls.length === 0) {
      setError("Account not connected or no calls provided");
      return;
    }

    if (!canSponsor) {
      setError("Transaction type not eligible for sponsorship");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTransactionHash(null);

    try {
      // Build typed data for sponsored transaction
      const typedData = await buildSponsoredTypedData(address, calls);
      
      // Sign the typed data
      const signature = await account.signMessage(typedData);
      
      // Execute sponsored transaction
      const response = await executeSponsoredTransaction({
        userAddress: address,
        typedData,
        signature: Array.isArray(signature) ? signature : [signature],
      });

      if (response.success) {
        setTransactionHash(response.transactionHash);
        toast({
          title: "Sponsored Transaction Submitted",
          description: "Your transaction has been sponsored by Mediolano. No gas fees required!",
        });
      } else {
        throw new Error(response.error || "Sponsored transaction failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sponsored transaction failed";
      setError(errorMessage);
      toast({
        title: "Sponsored Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [account, address, calls, canSponsor, toast]);

  // Initialize on mount
  useEffect(() => {
    if (enabled) {
      checkCompatibility();
      refreshGasPrices();
    }
  }, [enabled, checkCompatibility, refreshGasPrices]);

  // Handle traditional transaction errors
  useEffect(() => {
    if (traditionalError) {
      setError(traditionalError.message);
    }
  }, [traditionalError]);

  return {
    // Transaction execution
    executeTransaction,
    executeGasless,
    executeSponsored,
    
    // State
    isLoading,
    isGaslessCompatible,
    gasTokenPrices,
    transactionHash,
    error,
    
    // Configuration
    canSponsor,
    paymasterOptions,
    setPaymasterOptions,
    
    // Utilities
    refreshGasPrices,
    checkCompatibility,
  };
}
