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
import {
  Wallet,
  LogOut,
  AlertCircle
} from "lucide-react";
import { useNetwork } from "@/components/starknet-provider";
import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";

export function WalletConnect() {
  const { connectAsync, connectors } = useConnect();
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const { currentNetwork, networkConfig } = useNetwork();

  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
    modalTheme: "dark",
  });

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      const { connector } = await starknetkitConnectModal();
      if (!connector) {
        return;
      }
      await connectAsync({ connector });
    } catch (err) {
      console.error("Failed to connect wallet", err);
    }
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    disconnect();
    setOpen(false);
  };

  // Determine display address
  const displayAddress = address;

  // Network check
  const isWrongNetwork = isConnected && chainId && BigInt(chainId).toString() !== networkConfig.chainId;

  if (isConnected) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={isWrongNetwork ? "destructive" : "outline"} className={`w-full glass ${isWrongNetwork ? "bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30" : ""}`}>
            <Wallet className="h-4 w-4 mr-2" />
            {isWrongNetwork ? "Wrong Network" : displayAddress?.slice(0, 6)}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Account</DialogTitle>
            <DialogDescription className="text-sm text-blue-500">
              Connected: {displayAddress?.slice(0, 6)}...{displayAddress?.slice(-4)} on {networkConfig.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {isWrongNetwork && (
              <div className="alert alert-error bg-red-900/20 border-red-900 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm font-semibold">
                  Wrong Network Detected
                </p>
                <p className="text-xs">
                  Please switch your wallet to <span className="font-bold">{networkConfig.name}</span> to continue using the app.
                </p>
              </div>
            )}
            <div className="flex gap-4 items-center justify-between">
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                className="flex items-center w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
            <div className="alert alert-warning">
              <p className="text-sm">
                * IP Creator is under development, use for testing purposes only.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Button variant="outline" className="w-full glass" onClick={handleConnect}>
      <Wallet className="h-4 w-4 mr-2" />
      Connect
    </Button>
  );
}
