"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import { OnboardStrategy } from "starkzap";
import type { WalletInterface } from "starkzap";
import { getStarkZapSdk } from "@/lib/starkzap";

// ---------------------------------------------------------------------------
// Cartridge session policies
// ---------------------------------------------------------------------------

const CONTRACT = process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS;
const LISTING = process.env.NEXT_PUBLIC_LISTING_CONTRACT_ADDRESS;

const CARTRIDGE_POLICIES = [
  CONTRACT && { target: CONTRACT, method: "mint" },
  CONTRACT && { target: CONTRACT, method: "create_collection" },
  CONTRACT && { target: CONTRACT, method: "burn" },
  CONTRACT && { target: CONTRACT, method: "transfer_token" },
  LISTING && { target: LISTING, method: "create_listing" },
].filter(Boolean) as { target: string; method: string }[];

// ---------------------------------------------------------------------------
// Context types
// ---------------------------------------------------------------------------

export type StarkZapWalletType = "cartridge" | "privy";

export interface StarkZapWalletCtx {
  wallet: WalletInterface | null;
  walletType: StarkZapWalletType | null;
  /** Address as a plain string (never Address branded type) */
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  connectCartridge: () => Promise<void>;
  connectPrivy: () => void;
  disconnect: () => void;
}

const StarkZapWalletContext = createContext<StarkZapWalletCtx | undefined>(
  undefined
);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function StarkZapWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authenticated, getAccessToken } = usePrivy();

  const [wallet, setWallet] = useState<WalletInterface | null>(null);
  const [walletType, setWalletType] = useState<StarkZapWalletType | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track whether we should complete a Privy wallet connection after login
  const pendingPrivyConnect = useRef(false);

  // ---------------------------------------------------------------------------
  // Privy login with onComplete
  // ---------------------------------------------------------------------------

  const { login: privyLogin } = useLogin({
    onComplete: () => {
      pendingPrivyConnect.current = true;
    },
    onError: (err) => {
      setError(typeof err === "string" ? err : "Privy login failed");
      setIsConnecting(false);
    },
  });

  // ---------------------------------------------------------------------------
  // Connect Starknet wallet via Privy after authentication
  // ---------------------------------------------------------------------------

  const connectPrivyWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const sdk = getStarkZapSdk();

      // Fetch the Privy wallet info once and reuse it across retries.
      let cachedWallet: { id: string; publicKey: string } | null = null;
      const resolve = async () => {
        if (!cachedWallet) {
          const token = await getAccessToken();
          if (!token) throw new Error("No Privy access token");

          const res = await fetch("/api/wallet/starknet", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(
              (body as { error?: string }).error ?? "Failed to get wallet"
            );
          }
          const { wallet: w } = (await res.json()) as {
            wallet: { id: string; publicKey: string };
          };
          cachedWallet = w;
        }

        // PrivySigner requires a fully-qualified URL, not a relative path
        const signUrl = `${window.location.origin}/api/wallet/sign`;
        return {
          walletId: cachedWallet.id,
          publicKey: cachedWallet.publicKey,
          serverUrl: signUrl,
          headers: async (): Promise<Record<string, string>> => {
            const t = await getAccessToken();
            return t ? { Authorization: `Bearer ${t}` } : {};
          },
        };
      };

      const onboardOpts = {
        strategy: OnboardStrategy.Privy,
        accountPreset: "argentXV050",
        privy: { resolve },
      } as const;

      let result;
      try {
        result = await sdk.onboard({
          ...onboardOpts,
          deploy: "if_needed",
          feeMode: "sponsored",
        });
      } catch (deployErr) {
        // The contract may already be deployed on-chain even though
        // isDeployed() returned false (e.g. prior session, Privy infra).
        // Retry without deploying so the wallet still connects.
        if (String(deployErr).includes("already deployed")) {
          result = await sdk.onboard({ ...onboardOpts, deploy: "never" });
        } else {
          throw deployErr;
        }
      }

      setWallet(result.wallet);
      setWalletType("privy");
      setAddress(result.wallet.address as unknown as string);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect Privy wallet"
      );
    } finally {
      setIsConnecting(false);
    }
  }, [getAccessToken]);

  // Fire wallet connection after Privy login completes
  useEffect(() => {
    if (pendingPrivyConnect.current && authenticated) {
      pendingPrivyConnect.current = false;
      connectPrivyWallet();
    }
  }, [authenticated, connectPrivyWallet]);

  // ---------------------------------------------------------------------------
  // Connect Privy (triggers login modal, wallet connected in effect above)
  // ---------------------------------------------------------------------------

  const connectPrivy = useCallback(() => {
    if (authenticated) {
      // Already logged in — connect wallet directly
      connectPrivyWallet();
    } else {
      setIsConnecting(true);
      privyLogin();
    }
  }, [authenticated, connectPrivyWallet, privyLogin]);

  // ---------------------------------------------------------------------------
  // Connect Cartridge
  // ---------------------------------------------------------------------------

  const connectCartridge = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const sdk = getStarkZapSdk();
      const result = await sdk.onboard({
        strategy: OnboardStrategy.Cartridge,
        cartridge: {
          policies: CARTRIDGE_POLICIES,
        },
        deploy: "if_needed",
      });

      setWallet(result.wallet);
      setWalletType("cartridge");
      setAddress(result.wallet.address as unknown as string);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect Cartridge"
      );
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Disconnect
  // ---------------------------------------------------------------------------

  const disconnect = useCallback(() => {
    setWallet(null);
    setWalletType(null);
    setAddress(null);
    setError(null);
  }, []);

  return (
    <StarkZapWalletContext.Provider
      value={{
        wallet,
        walletType,
        address,
        isConnecting,
        error,
        connectCartridge,
        connectPrivy,
        disconnect,
      }}
    >
      {children}
    </StarkZapWalletContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useStarkZapWallet(): StarkZapWalletCtx {
  const ctx = useContext(StarkZapWalletContext);
  if (!ctx) {
    throw new Error(
      "useStarkZapWallet must be used within StarkZapWalletProvider"
    );
  }
  return ctx;
}
