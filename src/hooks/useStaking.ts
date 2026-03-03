"use client";

/**
 * useStaking — STRK delegation staking via StarkZap's Staking class.
 *
 * Lets IP holders earn passive income by delegating STRK to a validator pool.
 * Execution is handled by the already-connected Argent/Braavos wallet (starknet-react),
 * while StarkZap supplies the contract call data and provides Tx monitoring.
 *
 * How it works:
 *   1. StarkZap's Staking.fromStaker() creates an instance bound to a validator pool
 *   2. populate*() methods return the raw Call[] without executing anything
 *   3. starknet-react's account.execute() submits those calls via the user's wallet
 *   4. The resulting tx hash is returned so callers can use useTxTracker()
 *
 * @example
 * ```tsx
 * const { stake, position, pools, isLoading } = useStaking(validatorAddress);
 *
 * // Stake 10 STRK with the validator
 * const txHash = await stake("10");
 *
 * // Show the user's current position
 * if (position) {
 *   console.log("Staked:", position.staked.toFormatted());
 *   console.log("Rewards:", position.rewards.toFormatted());
 * }
 * ```
 */

import { useState, useCallback, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import { Staking, Amount } from "starkzap";
import type { PoolMember, Pool } from "starkzap";
import {
  getStarkZapSdk,
  getAppStakingConfig,
  STARKZAP_TOKENS,
  fromAddress,
} from "@/lib/starkzap";
import type { WalletInterface } from "starkzap";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseStakingResult {
  // ----- Read state -----
  /** The user's current staking position in this validator pool, or null */
  position: PoolMember | null;
  /** Whether the user is currently a member of this pool */
  isMember: boolean;
  /** Validator commission as a percentage (e.g. 10 = 10%) */
  commission: number | null;
  /** All pools managed by this validator */
  pools: Pool[];

  // ----- Loading / error -----
  isLoading: boolean;
  error: string | null;

  // ----- Write actions — each returns the tx hash for useTxTracker -----
  /**
   * Stake STRK in the validator pool.
   * Automatically enters the pool if not a member, or adds to the existing stake.
   * @param amountStr - Human-readable STRK amount, e.g. "100" or "0.5"
   */
  stake: (amountStr: string) => Promise<string | null>;

  /**
   * Declare intent to withdraw STRK from the pool.
   * After the exit window passes, call exitPool() to complete.
   * @param amountStr - Human-readable STRK amount to unstake
   */
  exitIntent: (amountStr: string) => Promise<string | null>;

  /**
   * Complete the withdrawal after the exit window has passed.
   */
  exitPool: () => Promise<string | null>;

  /**
   * Claim accumulated staking rewards.
   */
  claimRewards: () => Promise<string | null>;

  /** Refresh all read data (position, commission, pools) */
  refresh: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Helper — minimal WalletInterface stub for read-only calls
// ---------------------------------------------------------------------------

/**
 * Create a minimal object that satisfies WalletInterface for read-only
 * Staking methods that only need `wallet.address` at runtime.
 */
function makeReadOnlyStub(address: string): WalletInterface {
  return { address } as unknown as WalletInterface;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * @param validatorAddress - The staker/validator address whose pool to interact with.
 *                           Set to undefined to skip all network calls.
 */
export function useStaking(
  validatorAddress: string | undefined
): UseStakingResult {
  const { account, address: walletAddress } = useAccount();

  const [position, setPosition] = useState<PoolMember | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [commission, setCommission] = useState<number | null>(null);
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // Internal: get a Staking instance for this validator
  // -------------------------------------------------------------------------

  const getStakingInstance = useCallback(async (): Promise<Staking> => {
    if (!validatorAddress) throw new Error("No validator address provided");

    const sdk = getStarkZapSdk();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = sdk.getProvider() as any;
    const stakingConfig = getAppStakingConfig();

    return Staking.fromStaker(
      fromAddress(validatorAddress),
      STARKZAP_TOKENS.STRK,
      provider,
      stakingConfig
    );
  }, [validatorAddress]);

  // -------------------------------------------------------------------------
  // Refresh — fetch position, commission, pools
  // -------------------------------------------------------------------------

  const refresh = useCallback(async () => {
    if (!validatorAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      const sdk = getStarkZapSdk();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = sdk.getProvider() as any;
      const stakingConfig = getAppStakingConfig();

      // Fetch validator pools (no wallet required)
      const validatorPools = await Staking.getStakerPools(
        provider,
        fromAddress(validatorAddress),
        stakingConfig
      );
      setPools(validatorPools);

      if (!walletAddress) {
        setPosition(null);
        setIsMember(false);
        setCommission(null);
        return;
      }

      const staking = await getStakingInstance();
      const stub = makeReadOnlyStub(walletAddress);

      const [member, pos, comm] = await Promise.all([
        staking.isMember(stub),
        staking.getPosition(stub),
        staking.getCommission(),
      ]);

      setIsMember(member);
      setPosition(pos);
      setCommission(comm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load staking data");
    } finally {
      setIsLoading(false);
    }
  }, [validatorAddress, walletAddress, getStakingInstance]);

  // Auto-fetch on mount and when key dependencies change
  useEffect(() => {
    refresh();
  }, [refresh]);

  // -------------------------------------------------------------------------
  // Internal: execute calls via starknet-react account and return tx hash
  // -------------------------------------------------------------------------

  const executeAndReturn = useCallback(
    async (calls: unknown[]): Promise<string | null> => {
      if (!account) {
        setError("Wallet not connected");
        return null;
      }
      // starkzap Call[] is structurally identical to starknet v8 Call[]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await account.execute(calls as any);
      return response.transaction_hash;
    },
    [account]
  );

  // -------------------------------------------------------------------------
  // Write: stake (enter or add)
  // -------------------------------------------------------------------------

  const stake = useCallback(
    async (amountStr: string): Promise<string | null> => {
      if (!walletAddress) {
        setError("Wallet not connected");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const staking = await getStakingInstance();
        const amount = Amount.parse(amountStr, STARKZAP_TOKENS.STRK.decimals, STARKZAP_TOKENS.STRK.symbol);

        // populateEnter returns Call[] for approve + enter_delegation_pool
        // populateAdd returns Call[] for approve + add_to_delegation_pool
        const calls = isMember
          ? staking.populateAdd(fromAddress(walletAddress), amount)
          : staking.populateEnter(fromAddress(walletAddress), amount);

        const txHash = await executeAndReturn(calls);
        // Refresh position after tx is submitted (optimistic)
        refresh();
        return txHash;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Stake failed");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [walletAddress, getStakingInstance, isMember, executeAndReturn, refresh]
  );

  // -------------------------------------------------------------------------
  // Write: exit intent
  // -------------------------------------------------------------------------

  const exitIntent = useCallback(
    async (amountStr: string): Promise<string | null> => {
      if (!walletAddress) {
        setError("Wallet not connected");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const staking = await getStakingInstance();
        const amount = Amount.parse(amountStr, STARKZAP_TOKENS.STRK.decimals, STARKZAP_TOKENS.STRK.symbol);
        const calls = [staking.populateExitIntent(amount)];
        const txHash = await executeAndReturn(calls);
        refresh();
        return txHash;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Exit intent failed");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [walletAddress, getStakingInstance, executeAndReturn, refresh]
  );

  // -------------------------------------------------------------------------
  // Write: complete exit
  // -------------------------------------------------------------------------

  const exitPool = useCallback(async (): Promise<string | null> => {
    if (!walletAddress) {
      setError("Wallet not connected");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const staking = await getStakingInstance();
      const calls = [staking.populateExit(fromAddress(walletAddress))];
      const txHash = await executeAndReturn(calls);
      refresh();
      return txHash;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Exit pool failed");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, getStakingInstance, executeAndReturn, refresh]);

  // -------------------------------------------------------------------------
  // Write: claim rewards
  // -------------------------------------------------------------------------

  const claimRewards = useCallback(async (): Promise<string | null> => {
    if (!walletAddress) {
      setError("Wallet not connected");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const staking = await getStakingInstance();
      const calls = [staking.populateClaimRewards(fromAddress(walletAddress))];
      const txHash = await executeAndReturn(calls);
      refresh();
      return txHash;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Claim rewards failed");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, getStakingInstance, executeAndReturn, refresh]);

  // -------------------------------------------------------------------------

  return {
    position,
    isMember,
    commission,
    pools,
    isLoading,
    error,
    stake,
    exitIntent,
    exitPool,
    claimRewards,
    refresh,
  };
}
