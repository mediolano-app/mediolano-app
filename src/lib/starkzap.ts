/**
 * StarkZap SDK integration for Mediolano IP Creator
 *
 * Provides a singleton StarkZap SDK instance, token presets, and shared helpers
 * used by hooks for transaction monitoring, ERC20 balances, and STRK staking.
 *
 * Version note: StarkZap bundles starknet v9 internally while the app uses starknet v8
 * via starknet-react. These two stacks coexist: primitives (addresses, tx hashes)
 * are shared as plain strings; starknet.js Account objects are NOT mixed across stacks.
 */

import { StarkZap, ChainId, getStakingPreset, fromAddress } from "starkzap";
import type { Token } from "starkzap";

// ---------------------------------------------------------------------------
// Network resolution
// ---------------------------------------------------------------------------

const NETWORK_ENV = process.env.NEXT_PUBLIC_STARKNET_NETWORK;
const IS_SEPOLIA = NETWORK_ENV === "sepolia";

export const APP_CHAIN_ID: ChainId = IS_SEPOLIA
  ? ChainId.SEPOLIA
  : ChainId.MAINNET;

// ---------------------------------------------------------------------------
// SDK singleton
// ---------------------------------------------------------------------------

let _sdk: StarkZap | null = null;

/**
 * Returns a shared StarkZap SDK instance configured for the app's network.
 * Uses the app's custom RPC URL if set, otherwise falls back to StarkZap's
 * default Cartridge RPC endpoint for the selected network.
 */
export function getStarkZapSdk(): StarkZap {
  if (_sdk) return _sdk;

  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
  const avnuApiKey = process.env.NEXT_PUBLIC_AVNU_PAYMASTER_API_KEY;

  // Pass the AVNU API key so sponsored (feeMode: "sponsored") deployments
  // and transactions are accepted by the paymaster.
  const paymaster = avnuApiKey
    ? { headers: { "x-paymaster-api-key": avnuApiKey } }
    : undefined;

  _sdk = rpcUrl
    ? new StarkZap({ rpcUrl, chainId: APP_CHAIN_ID, paymaster })
    : new StarkZap({ network: IS_SEPOLIA ? "sepolia" : "mainnet", paymaster });

  return _sdk;
}

// ---------------------------------------------------------------------------
// Staking config helper
// ---------------------------------------------------------------------------

/**
 * Returns the staking contract config for the current chain using
 * StarkZap's built-in presets (no hardcoded addresses needed).
 */
export function getAppStakingConfig() {
  return getStakingPreset(APP_CHAIN_ID);
}

// ---------------------------------------------------------------------------
// Token presets
// ---------------------------------------------------------------------------

/**
 * Common Starknet ERC20 token definitions.
 * Addresses match the existing AVNU paymaster config in constants.ts.
 */
export const STARKZAP_TOKENS = {
  STRK: {
    name: "Starknet Token",
    symbol: "STRK",
    address: fromAddress(
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
    ),
    decimals: 18,
  },
  ETH: {
    name: "Ether",
    symbol: "ETH",
    address: fromAddress(
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
    ),
    decimals: 18,
  },
  USDC: {
    name: "USD Coin",
    symbol: "USDC",
    address: fromAddress(
      "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"
    ),
    decimals: 6,
  },
  USDT: {
    name: "Tether USD",
    symbol: "USDT",
    address: fromAddress(
      "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8"
    ),
    decimals: 6,
  },
} satisfies Record<string, Token>;

export type StarkZapTokenKey = keyof typeof STARKZAP_TOKENS;

// Re-export commonly used StarkZap types for convenience
export { Amount, Tx, Erc20, fromAddress } from "starkzap";
export type { Token, Address } from "starkzap";
