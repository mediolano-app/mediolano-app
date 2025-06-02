/**
 * Types for AVNU Paymaster integration
 */

import { Call } from "starknet";

export interface GasToken {
  symbol: string;
  address: string;
  decimals: number;
  balance?: string;
  price?: string;
}

export interface GasTokenPrice {
  tokenAddress: string;
  gasTokenPrice: string;
  gasUnitPrice: string;
}

export interface PaymasterOptions {
  gasTokenAddress?: string;
  maxGasTokenAmount?: bigint;
  gasTokenPrices?: GasTokenPrice[];
  estimatedGasFees?: bigint;
  sponsored?: boolean;
}

export interface PaymasterTransaction {
  calls: Call[];
  options: PaymasterOptions;
  userAddress: string;
}

export interface PaymasterResponse {
  transactionHash: string;
  success: boolean;
  error?: string;
}

export interface AccountCompatibility {
  isCompatible: boolean;
  reason?: string;
}

export interface SponsoredTransactionData {
  userAddress: string;
  typedData: any;
  signature: string[];
}

export interface PaymasterStatus {
  isActive: boolean;
  supportedTokens: string[];
  maxGasAmount: string;
}

export type TransactionType = 
  | "mint"
  | "transfer" 
  | "marketplace_buy"
  | "marketplace_list"
  | "revenue_claim"
  | "license_create"
  | "agreement_create";

export interface TransactionSponsorshipRule {
  type: TransactionType;
  enabled: boolean;
  maxAmount?: string;
  conditions?: Record<string, any>;
}

export interface PaymasterError extends Error {
  code: string;
  details?: any;
}
