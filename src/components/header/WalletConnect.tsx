"use client";

import * as React from "react";
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
import { Wallet, User, Gift, Settings, LogOut } from "lucide-react";

export function WalletConnect() {
  const { connect, connectors } = useConnect();
  const { account, address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Wallet className="h-4 w-4" /> {account ? address?.slice(0, 6) : "Connect"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{account ? "Account" : "Connect"}</DialogTitle>
          <DialogDescription>
            {account
              ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`
              : "Sign in wth your wallet on SEPOLIA TESTNET."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">

          {account ? (
            <div className="grid gap-4">
              <Button variant="outline" className="justify-start">
                <User className="mr-2 h-4 w-4" />
                My Account
              </Button>
              <Button variant="outline" className="justify-start">
                <Gift className="mr-2 h-4 w-4" />
                Rewards
              </Button>
              <Button variant="outline" className="justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="destructive" onClick={disconnect} className="justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
            
          ) : (
            <div className="grid gap-4">
              {connectors.map((connector) => (
                <Button key={connector.id} onClick={() => connect({ connector })}>
                  Connect with {connector.name}
                </Button>
              ))}

          <div className="alert alert-warning">
            <p className="text-sm">
              The dApp is connected to the testnet. Please make sure your wallet is usng Starknet Sepolia to interact.
            </p>
          </div>

            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}