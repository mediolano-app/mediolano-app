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
import { Wallet, User, Gift, Settings, LogOut, Rocket, Box } from "lucide-react";
import Link from "next/link";
import { useArgentWallet } from "@/lib/useArgentWallet"; 

export function WalletConnect() {
  const { connect: connectExternal, connectors } = useConnect();
  const { account: externalAccount, address: externalAddress } = useAccount();
  const { disconnect: disconnectExternal } = useDisconnect();
  const [open, setOpen] = React.useState(false);
  
  
  const { 
    account: invisibleAccount,
    isConnected: isInvisibleConnected,
    isConnecting: isInvisibleConnecting,
    isDeploying: isInvisibleDeploying,
    connect: connectInvisible
  } = useArgentWallet({
    envName: "sepolia",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
    rpcHeaders: process.env.NEXT_PUBLIC_RPC_HEADERS || "{}",
    appName: "Mediolano Dapp",
    validityDays: Number(process.env.NEXT_PUBLIC_VALIDITY_DAYS),
    paymasterApiKey: process.env.NEXT_PUBLIC_AVNU_PAYMASTER_API_KEY,
    allowedContracts: [
      {
        contract: "0x07557a2fbe051e6327ab603c6d1713a91d2cfba5382ac6ca7de884d3278636d7",
        selector: "increase_number",
      },
    ],
  });

  
  const account = externalAccount || invisibleAccount;
  const address = externalAddress || (invisibleAccount ? invisibleAccount.address : undefined);

  
  const disconnect = () => {
    if (externalAccount) {
      disconnectExternal();
    }

    setOpen(false);
  };

  React.useEffect(() => {
    if (account) {
      setOpen(false);
    }
  }, [account]);


  const handleConnectInvisible = async () => {
    console.log("Connecting to Argent Invisible Wallet...");
    await connectInvisible();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Wallet className="h-4 w-4" /> 
          {account ? (address?.slice(0, 6) + "..." + address?.slice(-4)) : "Connect"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{account ? "Account" : "Connect"}</DialogTitle>
          <DialogDescription className="text-sm text-blue-500">
            {account
              ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`
              : "Please connect to Starknet Sepolia *"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">

          {account ? (
            <div className="grid gap-4">

              <Link href="/discover">
                <Button variant="outline" className="justify-start w-full">
                  <Rocket className="mr-2 h-4 w-4" />
                  Discover
                </Button>
              </Link>

              <Link href="/create">
                <Button variant="outline" className="justify-start w-full">
                  <Box className="mr-2 h-4 w-4" />
                  Create
                </Button>
              </Link>

              <Button variant="destructive" onClick={disconnect} className="justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {connectors.map((connector) => (
                <Button key={connector.id} onClick={() => connectExternal({ connector })}>
                  Connect with {connector.name}
                </Button>
              ))}
              <Button 
                onClick={handleConnectInvisible}
                disabled={isInvisibleConnecting || isInvisibleDeploying}
              >
                {isInvisibleConnecting
                  ? "Connecting..."
                  : isInvisibleDeploying
                    ? "Deploying Account..."
                    : "Connect with Argent Invisible Wallet"}
              </Button>
              <div className="alert alert-warning">
                <p className="text-sm">
                  * Mediolano Dapp is under development and connected to the testnet. Please make sure your wallet is connect on <strong>Starknet Sepolia</strong> to interact.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}