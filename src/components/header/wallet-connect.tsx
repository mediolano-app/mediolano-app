"use client";

import React, { useState } from "react";
import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Wallet, LogOut, AlertCircle, Gamepad2, Mail } from "lucide-react";
import { useNetwork } from "@/components/starknet-provider";
import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";
import { useStarkZapWallet } from "@/contexts/starkzap-wallet-context";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function truncate(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

type WalletBadge = {
  label: string;
  icon: React.ReactNode;
  className: string;
};

function getBadge(
  walletType: "injected" | "cartridge" | "privy" | null
): WalletBadge | null {
  if (walletType === "cartridge") {
    return {
      label: "Cartridge",
      icon: <Gamepad2 className="h-3 w-3" />,
      className: "bg-purple-500/20 text-purple-400 border-purple-500/40",
    };
  }
  if (walletType === "privy") {
    return {
      label: "Privy",
      icon: <Mail className="h-3 w-3" />,
      className: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    };
  }
  if (walletType === "injected") {
    return {
      label: "Browser Wallet",
      icon: <Wallet className="h-3 w-3" />,
      className: "bg-green-500/20 text-green-400 border-green-500/40",
    };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function WalletConnect() {
  const { connectAsync, connectors } = useConnect();
  const {
    address: injectedAddress,
    isConnected: injectedConnected,
    chainId,
  } = useAccount();
  const { disconnect: injectedDisconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const { currentNetwork, networkConfig } = useNetwork();

  const {
    address: szAddress,
    walletType: szType,
    isConnecting,
    error: szError,
    connectCartridge,
    connectPrivy,
    disconnect: szDisconnect,
  } = useStarkZapWallet();

  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
    modalTheme: "dark",
  });

  // ---------------------------------------------------------------------------
  // Unified state
  // ---------------------------------------------------------------------------

  const hasStarkZap = szAddress !== null;
  const isConnected = hasStarkZap || injectedConnected;
  const displayAddress = hasStarkZap ? szAddress : injectedAddress;
  const activeWalletType = hasStarkZap
    ? (szType as "cartridge" | "privy")
    : injectedConnected
      ? "injected"
      : null;

  const isWrongNetwork =
    injectedConnected &&
    !hasStarkZap &&
    chainId &&
    BigInt(chainId).toString() !== networkConfig.chainId;

  const badge = getBadge(activeWalletType);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleBrowserConnect = async () => {
    try {
      const { connector } = await starknetkitConnectModal();
      if (!connector) return;
      await connectAsync({ connector });
      setOpen(false);
    } catch (err) {
      console.error("Failed to connect browser wallet", err);
    }
  };

  const handleCartridgeConnect = async () => {
    try {
      await connectCartridge();
      setOpen(false);
    } catch {
      // error shown in context
    }
  };

  const handlePrivyConnect = () => {
    connectPrivy();
    setOpen(false);
  };

  const handleDisconnect = () => {
    if (hasStarkZap) {
      szDisconnect();
    } else {
      injectedDisconnect();
    }
    setOpen(false);
  };

  // ---------------------------------------------------------------------------
  // Connected state
  // ---------------------------------------------------------------------------

  if (isConnected && displayAddress) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={isWrongNetwork ? "destructive" : "outline"}
            className={`w-full glass ${
              isWrongNetwork
                ? "bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30"
                : ""
            }`}
          >
            <Wallet className="h-4 w-4 mr-2" />
            {isWrongNetwork ? "Wrong Network" : truncate(displayAddress)}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Account</DialogTitle>
            <DialogDescription className="text-sm text-blue-500">
              Connected: {truncate(displayAddress)} on {networkConfig.name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Wallet type badge */}
            {badge && (
              <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs w-fit ${badge.className}`}
              >
                {badge.icon}
                <span>{badge.label}</span>
                {activeWalletType === "cartridge" && (
                  <span className="ml-1 opacity-75">· Auto-gasless</span>
                )}
              </div>
            )}

            {/* Wrong network warning */}
            {isWrongNetwork && (
              <div className="alert alert-error bg-red-900/20 border-red-900 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm font-semibold">Wrong Network Detected</p>
                <p className="text-xs">
                  Please switch your wallet to{" "}
                  <span className="font-bold">{networkConfig.name}</span> to
                  continue.
                </p>
              </div>
            )}

            <Button
              variant="destructive"
              onClick={handleDisconnect}
              className="flex items-center w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </Button>

            <div className="alert alert-warning">
              <p className="text-sm">
                * IP Creator is under development, use for testing purposes
                only.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ---------------------------------------------------------------------------
  // Not connected — connection modal
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full glass">
          <Wallet className="h-4 w-4 mr-2" />
          Connect
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose how you want to connect to IP Creator.
          </DialogDescription>
        </DialogHeader>

        {szError && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-900/40 rounded p-2">
            {szError}
          </p>
        )}

        <div className="grid gap-5 pt-1">
          {/* ── Browser Wallets ────────────────────────────────── */}
          <section>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Browser Wallets
            </p>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={handleBrowserConnect}
            >
              <Wallet className="h-4 w-4 shrink-0" />
              <span>
                Argent / Braavos{" "}
                <span className="text-muted-foreground text-xs">
                  · via starknetkit
                </span>
              </span>
            </Button>
          </section>

          <div className="border-t border-border/50" />

          {/* ── Cartridge ─────────────────────────────────────── */}
          <section>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Cartridge Controller
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              Gaming wallet · auto-gasless transactions
            </p>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={handleCartridgeConnect}
              disabled={isConnecting}
            >
              <Gamepad2 className="h-4 w-4 shrink-0 text-purple-400" />
              <span>
                {isConnecting ? "Connecting…" : "Connect with Cartridge"}
              </span>
            </Button>
          </section>

          <div className="border-t border-border/50" />

          {/* ── Privy ─────────────────────────────────────────── */}
          <section>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Privy — Email / Social
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              No seed phrase · managed keys
            </p>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={handlePrivyConnect}
              disabled={isConnecting}
            >
              <Mail className="h-4 w-4 shrink-0 text-blue-400" />
              <span>
                {isConnecting ? "Connecting…" : "Continue with Email / Social"}
              </span>
            </Button>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
