"use client";

/**
 * useTxTracker — Real-time transaction monitoring via StarkZap's Tx class.
 *
 * Drop a Starknet transaction hash in, and get back live status updates,
 * a block-explorer URL, and the final receipt — without polling manually.
 *
 * Works with ANY transaction hash produced by the app (starknet-react,
 * AVNU paymaster, or StarkZap) because Tx only needs the hash + an RPC provider.
 *
 * @example
 * ```tsx
 * const { status, explorerUrl, isConfirmed } = useTxTracker(txHash);
 *
 * return (
 *   <a href={explorerUrl ?? "#"}>
 *     {status === "accepted_on_l2" ? "Confirmed ✓" : "Pending…"}
 *   </a>
 * );
 * ```
 */

import { useState, useEffect, useRef } from "react";
import { Tx } from "starkzap";
import { getStarkZapSdk, APP_CHAIN_ID } from "@/lib/starkzap";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TxStatus =
  | "idle"
  | "pending"
  | "accepted_on_l2"
  | "accepted_on_l1"
  | "reverted";

export interface TxTrackerResult {
  /** Current finality status of the transaction */
  status: TxStatus;
  /** Block-explorer URL (Voyager) — available as soon as hash is known */
  explorerUrl: string | null;
  /** True once the tx has been accepted on L2 or L1 */
  isConfirmed: boolean;
  /** True when the tx was reverted on-chain */
  isReverted: boolean;
  /** True while waiting for the first status update */
  isPending: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Monitor a Starknet transaction hash in real-time.
 *
 * @param txHash - The transaction hash to watch, or null/undefined to do nothing.
 */
export function useTxTracker(
  txHash: string | null | undefined
): TxTrackerResult {
  const [status, setStatus] = useState<TxStatus>("idle");
  const [explorerUrl, setExplorerUrl] = useState<string | null>(null);

  // Keep a stable ref to the unsubscribe function so we can clean up on
  // hash change or unmount without stale closures.
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Clean up any previous watcher first
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (!txHash) {
      setStatus("idle");
      setExplorerUrl(null);
      return;
    }

    const sdk = getStarkZapSdk();
    // sdk.getProvider() returns StarkZap's internal RpcProvider (starknet v9).
    // We cast to `any` here to avoid TypeScript rejecting the starknet v8/v9
    // type mismatch — at runtime the JSON-RPC interface is identical.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = sdk.getProvider() as any;

    const tx = new Tx(txHash, provider, APP_CHAIN_ID, { provider: "voyager" });

    setStatus("pending");
    setExplorerUrl(tx.explorerUrl);

    const unsubscribe = tx.watch(({ finality, execution }) => {
      // `finality` is TXN_STATUS: RECEIVED | ACCEPTED_ON_L2 | ACCEPTED_ON_L1 | REJECTED
      // `execution` is TransactionExecutionStatus: SUCCEEDED | REVERTED
      if (execution === "REVERTED") {
        setStatus("reverted");
        return;
      }
      const f = finality as string;
      if (f === "ACCEPTED_ON_L1") {
        setStatus("accepted_on_l1");
      } else if (f === "ACCEPTED_ON_L2") {
        setStatus("accepted_on_l2");
      }
      // RECEIVED / other transient states — keep "pending"
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      unsubscribe();
      unsubscribeRef.current = null;
    };
  }, [txHash]);

  return {
    status,
    explorerUrl,
    isConfirmed: status === "accepted_on_l2" || status === "accepted_on_l1",
    isReverted: status === "reverted",
    isPending: status === "pending",
  };
}
