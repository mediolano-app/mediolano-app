"use client";

/**
 * useTokenBalance — ERC20 token balance queries via StarkZap's Erc20 class.
 *
 * Fetches and formats a wallet's balance for STRK, ETH, USDC, or USDT.
 * Uses StarkZap's Erc20 helper which handles both snake_case and camelCase
 * entrypoint variants for maximum contract compatibility.
 *
 * @example
 * ```tsx
 * const { formatted, isLoading, refresh } = useTokenBalance("STRK", address);
 * return <span>{isLoading ? "…" : formatted}</span>;
 * // "42.5 STRK"
 *
 * // Fetch multiple balances in parallel
 * const strk = useTokenBalance("STRK", address);
 * const eth  = useTokenBalance("ETH",  address);
 * ```
 */

import { useState, useEffect, useCallback } from "react";
import { Erc20 } from "starkzap";
import type { Amount, WalletInterface } from "starkzap";
import {
  getStarkZapSdk,
  STARKZAP_TOKENS,
  fromAddress,
  type StarkZapTokenKey,
} from "@/lib/starkzap";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TokenBalanceResult {
  /** Raw Amount object from StarkZap — null until fetched */
  amount: Amount | null;
  /** Human-readable string, e.g. "42.5 STRK" (compressed to 4 dp) */
  formatted: string | null;
  /** Raw bigint value in token base units (wei, fri, etc.) */
  raw: bigint | null;
  isLoading: boolean;
  error: string | null;
  /** Re-fetch the balance on demand */
  refresh: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Fetch the ERC20 balance for a given token and wallet address.
 *
 * @param tokenKey - One of "STRK" | "ETH" | "USDC" | "USDT"
 * @param walletAddress - The Starknet wallet address to query, or undefined
 */
export function useTokenBalance(
  tokenKey: StarkZapTokenKey,
  walletAddress: string | undefined
): TokenBalanceResult {
  const [amount, setAmount] = useState<Amount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!walletAddress) {
      setAmount(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const sdk = getStarkZapSdk();
      // Get provider from StarkZap's own SDK (starknet v9 internally)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = sdk.getProvider() as any;

      const token = STARKZAP_TOKENS[tokenKey];
      const erc20 = new Erc20(token, provider);

      // Erc20.balanceOf() only reads wallet.address at runtime,
      // so a minimal stub satisfies the WalletInterface contract.
      // fromAddress converts the plain string to StarkZap's branded Address type.
      const walletStub = { address: fromAddress(walletAddress) } as unknown as WalletInterface;
      const result = await erc20.balanceOf(walletStub);

      setAmount(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch balance");
    } finally {
      setIsLoading(false);
    }
  }, [tokenKey, walletAddress]);

  // Initial fetch + refetch when address or token changes
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    amount,
    formatted: amount?.toFormatted(true) ?? null,
    raw: amount?.toBase() ?? null,
    isLoading,
    error,
    refresh: fetchBalance,
  };
}

// ---------------------------------------------------------------------------
// Multi-token convenience hook
// ---------------------------------------------------------------------------

export interface MultiTokenBalances {
  STRK: TokenBalanceResult;
  ETH: TokenBalanceResult;
  USDC: TokenBalanceResult;
  USDT: TokenBalanceResult;
  /** Refresh all balances at once */
  refreshAll: () => void;
}

/**
 * Fetch balances for all supported tokens in parallel.
 *
 * @example
 * ```tsx
 * const balances = useAllTokenBalances(address);
 * return (
 *   <>
 *     <p>STRK: {balances.STRK.formatted}</p>
 *     <p>ETH:  {balances.ETH.formatted}</p>
 *   </>
 * );
 * ```
 */
export function useAllTokenBalances(
  walletAddress: string | undefined
): MultiTokenBalances {
  const strk = useTokenBalance("STRK", walletAddress);
  const eth = useTokenBalance("ETH", walletAddress);
  const usdc = useTokenBalance("USDC", walletAddress);
  const usdt = useTokenBalance("USDT", walletAddress);

  const refreshAll = useCallback(() => {
    strk.refresh();
    eth.refresh();
    usdc.refresh();
    usdt.refresh();
  }, [strk, eth, usdc, usdt]);

  return { STRK: strk, ETH: eth, USDC: usdc, USDT: usdt, refreshAll };
}
