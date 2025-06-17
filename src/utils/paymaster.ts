/**
 * AVNU Paymaster utility functions
 */

import { 
  fetchGasTokenPrices, 
  fetchAccountCompatibility,
  executeCalls 
} from "@avnu/gasless-sdk";
import axios from "axios";
import { Account, Call } from "starknet";
import { 
  AVNU_PAYMASTER_CONFIG, 
  GAS_SPONSORSHIP_CONFIG 
} from "@/lib/constants";
import { 
  GasTokenPrice, 
  PaymasterOptions, 
  AccountCompatibility,
  PaymasterResponse,
  SponsoredTransactionData,
  PaymasterStatus,
  TransactionType,
  PaymasterError
} from "@/types/paymaster";

/**
 * Check if an account is compatible with gasless transactions
 */
export async function checkAccountCompatibility(
  accountAddress: string
): Promise<AccountCompatibility> {
  try {
    const compatibility = await fetchAccountCompatibility(accountAddress);
    return compatibility;
  } catch (error) {
    console.error("Error checking account compatibility:", error);
    return { isCompatible: false, reason: "Failed to check compatibility" };
  }
}

/**
 * Fetch current gas token prices
 */
export async function getGasTokenPrices(): Promise<GasTokenPrice[]> {
  try {
    const prices = await fetchGasTokenPrices();
    // Map SDK GasTokenPrice to local GasTokenPrice type
    return prices.map((p: any) => ({
      ...p,
      gasTokenPrice: p.gasTokenPrice ?? p.price, // fallback if needed
      gasUnitPrice: p.gasUnitPrice ?? p.unitPrice, // fallback if needed
    }));
  } catch (error) {
    console.error("Error fetching gas token prices:", error);
    throw new Error("Failed to fetch gas token prices");
  }
}

/**
 * Execute gasless transaction with user-paid gas fees
 */
export async function executeGaslessTransaction(
  account: Account,
  calls: Call[],
  options: PaymasterOptions
): Promise<PaymasterResponse> {
  try {
    const response = await executeCalls(account, calls, {
      gasTokenAddress: options.gasTokenAddress,
      maxGasTokenAmount: options.maxGasTokenAmount,
    });

    return {
      transactionHash: response.transactionHash,
      success: true,
    };
  } catch (error) {
    console.error("Error executing gasless transaction:", error);
    return {
      transactionHash: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check Paymaster service status
 */
export async function getPaymasterStatus(): Promise<PaymasterStatus> {
  try {
    const response = await axios.get(
      `${AVNU_PAYMASTER_CONFIG.GASLESS_API_URL}/paymaster/v1/status`
    );
    
    return {
      isActive: response.data.isActive || true,
      supportedTokens: response.data.supportedTokens || [],
      maxGasAmount: response.data.maxGasAmount || "0",
    };
  } catch (error) {
    console.error("Error fetching paymaster status:", error);
    return {
      isActive: false,
      supportedTokens: [],
      maxGasAmount: "0",
    };
  }
}

/**
 * Build typed data for sponsored transactions (requires API key)
 */
export async function buildSponsoredTypedData(
  userAddress: string,
  calls: Call[]
): Promise<any> {
  if (!AVNU_PAYMASTER_CONFIG.API_KEY) {
    throw new Error("API key required for sponsored transactions");
  }

  try {
    const response = await axios.post(
      `${AVNU_PAYMASTER_CONFIG.API_BASE_URL}/build-typed-data`,
      {
        userAddress,
        gasTokenAddress: null, // Sponsored gas
        maxGasTokenAmount: null, // Sponsored gas
        calls,
      },
      {
        headers: { 
          "api-key": AVNU_PAYMASTER_CONFIG.API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error building sponsored typed data:", error);
    throw new Error("Failed to build sponsored transaction data");
  }
}

/**
 * Execute sponsored transaction (requires API key)
 */
export async function executeSponsoredTransaction(
  data: SponsoredTransactionData
): Promise<PaymasterResponse> {
  if (!AVNU_PAYMASTER_CONFIG.API_KEY) {
    throw new Error("API key required for sponsored transactions");
  }

  try {
    const response = await axios.post(
      `${AVNU_PAYMASTER_CONFIG.API_BASE_URL}/execute`,
      {
        userAddress: data.userAddress,
        typedData: data.typedData,
        signature: data.signature,
      },
      {
        headers: { 
          "api-key": AVNU_PAYMASTER_CONFIG.API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      transactionHash: response.data.transactionHash,
      success: true,
    };
  } catch (error) {
    console.error("Error executing sponsored transaction:", error);
    return {
      transactionHash: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check if a transaction type should be sponsored
 */
export function shouldSponsorTransaction(
  transactionType: TransactionType
): boolean {
  if (!GAS_SPONSORSHIP_CONFIG.ENABLED) {
    return false;
  }

  switch (transactionType) {
    case "mint":
      return GAS_SPONSORSHIP_CONFIG.SPONSOR_MINTING;
    case "transfer":
      return GAS_SPONSORSHIP_CONFIG.SPONSOR_TRANSFERS;
    case "marketplace_buy":
    case "marketplace_list":
      return GAS_SPONSORSHIP_CONFIG.SPONSOR_MARKETPLACE;
    default:
      return false;
  }
}

/**
 * Format gas token amount for display
 */
export function formatGasTokenAmount(
  amount: string,
  decimals: number,
  symbol: string
): string {
  const divisor = Math.pow(10, decimals);
  const formatted = (parseInt(amount) / divisor).toFixed(6);
  return `${formatted} ${symbol}`;
}

/**
 * Calculate estimated gas cost in selected token
 */
export function calculateGasCostInToken(
  gasFees: bigint,
  gasTokenPrice: string,
  tokenDecimals: number
): bigint {
  const price = BigInt(gasTokenPrice);
  const decimalsMultiplier = BigInt(Math.pow(10, tokenDecimals));
  
  return (gasFees * price) / decimalsMultiplier;
}
