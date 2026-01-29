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
} from "lucide-react";
import { useNetwork } from "@/components/starknet-provider";
import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";

export function WalletConnect() {
  const { connectAsync, connectors } = useConnect();
  const { address, isConnected } = useAccount();
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

  if (isConnected) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full glass">
            <Wallet className="h-4 w-4 mr-2" />
            {displayAddress?.slice(0, 6)}
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
