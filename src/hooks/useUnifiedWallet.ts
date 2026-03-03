"use client";

/**
 * useUnifiedWallet — single hook that normalises across all wallet types:
 *   • starknet-react injected wallets (Argent, Braavos)
 *   • StarkZap Cartridge wallet
 *   • StarkZap Privy wallet
 *
 * Priority: StarkZap wallet (Cartridge / Privy) > starknet-react injected.
 *
 * @example
 * ```tsx
 * const { address, isConnected, walletType, execute } = useUnifiedWallet();
 *
 * const txHash = await execute([{ contractAddress, entrypoint, calldata }]);
 * // feed into useTxTracker(txHash)
 * ```
 */

import { useCallback } from "react";
import { useAccount, useDisconnect } from "@starknet-react/core";
import type { Call } from "starknet";
import { useStarkZapWallet } from "@/contexts/starkzap-wallet-context";

export type UnifiedWalletType = "injected" | "cartridge" | "privy" | null;

export interface UnifiedWallet {
  /** Connected address (hex string) or undefined */
  address: string | undefined;
  isConnected: boolean;
  /** Which wallet stack provided the connection */
  walletType: UnifiedWalletType;
  /**
   * Execute contract calls.
   * Returns the transaction hash so callers can pass it to useTxTracker().
   */
  execute: (calls: Call[]) => Promise<string>;
  /** Disconnect / clear the active wallet */
  disconnect: () => void;
}

export function useUnifiedWallet(): UnifiedWallet {
  // StarkZap context (Cartridge / Privy)
  const {
    wallet: szWallet,
    walletType: szType,
    address: szAddress,
    disconnect: szDisconnect,
  } = useStarkZapWallet();

  // starknet-react injected (Argent / Braavos)
  const {
    account,
    address: injectedAddress,
    isConnected: injectedConnectedRaw,
  } = useAccount();
  const { disconnect: injectedDisconnect } = useDisconnect();
  const injectedConnected = injectedConnectedRaw ?? false;

  // StarkZap wallet takes priority
  const hasStarkZap = szWallet !== null && szAddress !== null;

  const address = hasStarkZap
    ? (szAddress ?? undefined)
    : injectedConnected
      ? injectedAddress
      : undefined;

  const isConnected = hasStarkZap || injectedConnected;

  const walletType: UnifiedWalletType = hasStarkZap
    ? (szType as UnifiedWalletType)
    : injectedConnected
      ? "injected"
      : null;

  const execute = useCallback(
    async (calls: Call[]): Promise<string> => {
      if (hasStarkZap && szWallet) {
        const tx = await szWallet.execute(calls);
        return tx.hash;
      }
      if (account) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await account.execute(calls as any);
        return response.transaction_hash;
      }
      throw new Error("No wallet connected");
    },
    [hasStarkZap, szWallet, account]
  );

  const disconnect = useCallback(() => {
    if (hasStarkZap) {
      szDisconnect();
    } else if (injectedConnected) {
      injectedDisconnect();
    }
  }, [hasStarkZap, szDisconnect, injectedConnected, injectedDisconnect]);

  return {
    address,
    isConnected,
    walletType,
    execute,
    disconnect,
  };
}
