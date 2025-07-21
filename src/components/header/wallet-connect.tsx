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
import {
  Wallet,
  User,
  Gift,
  Settings,
  LogOut,
  Rocket,
  Box,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { RpcProvider, constants } from "starknet";
import type {
  ArgentWebWallet,
  SessionAccountInterface,
} from "@argent/invisible-sdk";

export function WalletConnect() {
  const { connect, connectors } = useConnect();
  const { account, address } = useAccount();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = React.useState(false);
  const envName = process.env.NEXT_PUBLIC_ENV_NAME as "mainnet" | "sepolia";
  const isMainnet = envName === "mainnet";
  const chainId = isMainnet
    ? constants.StarknetChainId.SN_MAIN
    : constants.StarknetChainId.SN_SEPOLIA;

  const ARGENT_DUMMY_CONTRACT_ADDRESS = isMainnet
    ? "0x001c515f991f706039696a54f6f33730e9b0e8cc5d04187b13c2c714401acfd4"
    : "0x07557a2fbe051e6327ab603c6d1713a91d2cfba5382ac6ca7de884d3278636d7";
  const ARGENT_DUMMY_CONTRACT_ENTRYPOINT = "increase_number";

  const paymasterParams = !process.env.NEXT_PUBLIC_AVNU_PAYMASTER_API_KEY
    ? undefined
    : {
        apiKey: process.env.NEXT_PUBLIC_AVNU_PAYMASTER_API_KEY,
      };

  const [invisibleAccount, setInvisibleAccount] = useState<any>(undefined);
  const [withApproval, setWithApproval] = useState<boolean>(true);
  const [connectStatus, setConnectStatus] = useState<
    "Connect" | "Connecting" | "Deploying account"
  >("Connect");
  const [isLoading, setIsLoading] = useState(false);
  const [argentWebWallet, setArgentWebWallet] =
    useState<ArgentWebWallet | null>(null);

  // Initialize RPC Provider
  const provider = React.useMemo(() => {
    if (typeof window === "undefined") return null;

    return new RpcProvider({
      chainId: chainId,
      nodeUrl: process.env.NEXT_PUBLIC_RPC_URL,
      headers: JSON.parse(process.env.NEXT_PUBLIC_RPC_HEADERS || "{}"),
    });
  }, []);

  // Initialize Argent Web Wallet on client side only
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeArgentWallet = async () => {
      try {
        const { ArgentWebWallet } = await import("@argent/invisible-sdk");

        const wallet = ArgentWebWallet.init({
          appName: "Mediolano Dapp",
          environment: envName || "sepolia",
          sessionParams: {
            allowedMethods: [
              {
                contract: ARGENT_DUMMY_CONTRACT_ADDRESS,
                selector: ARGENT_DUMMY_CONTRACT_ENTRYPOINT,
              },
            ],
            validityDays:
              Number(process.env.NEXT_PUBLIC_VALIDITY_DAYS) || undefined,
          },
          paymasterParams,
        });

        setArgentWebWallet(wallet);
      } catch (error) {
        console.error("Failed to initialize Argent Web Wallet:", error);
      }
    };

    initializeArgentWallet();
  }, []);

  // Auto-connect on component mount
  useEffect(() => {
    if (!argentWebWallet || !provider) {
      return;
    }

    argentWebWallet
      .connect()
      .then(async (res) => {
        if (!res) {
          console.log("Not connected to Argent Invisible Wallet");
          return;
        }

        console.log("Connected to ArgentWebWallet", res);
        const { account, callbackData, approvalTransactionHash } = res;

        if (account.getSessionStatus() !== "VALID") {
          console.log("Session is not valid");
          return;
        }

        console.log("Approval transaction hash", approvalTransactionHash);
        console.log("Callback data", callbackData);

        if (approvalTransactionHash && provider) {
          console.log("Waiting for approval");
          await provider.waitForTransaction(approvalTransactionHash);
        }

        setInvisibleAccount(account);
      })
      .catch((err) => {
        console.error("Failed to connect to ArgentWebWallet", err);
      });
  }, [argentWebWallet, provider]);

  // Handle Argent Invisible Wallet connection
  const handleInvisibleWalletConnect = async () => {
    try {
      console.log(
        "Start connect to Argent Invisible Wallet, with approval requests: ",
        withApproval
      );

      if (!provider || !argentWebWallet) {
        throw new Error("Provider or Argent wallet not initialized");
      }

      setConnectStatus("Connecting");
      setIsLoading(true);

      const response = await argentWebWallet.requestConnection({
        callbackData: "mediolano_dapp_callback",
        approvalRequests: withApproval
          ? [
              {
                tokenAddress:
                  "0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7",
                amount: BigInt("100000000000000000").toString(),
                spender:
                  "0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a",
              },
            ]
          : undefined,
      });

      if (response) {
        const { account: sessionAccount } = response;
        const isDeployed = await sessionAccount.isDeployed();

        if (
          response.deploymentPayload &&
          !isDeployed &&
          response.approvalRequestsCalls &&
          paymasterParams
        ) {
          console.log("Deploying an account");
          setConnectStatus("Deploying account");

          const { deployAndExecuteWithPaymaster } = await import(
            "@argent/invisible-sdk"
          );
          const resp = await deployAndExecuteWithPaymaster(
            sessionAccount,
            paymasterParams,
            response.deploymentPayload,
            response.approvalRequestsCalls
          );

          if (resp) {
            console.log("Deployment hash: ", resp.transaction_hash);
            await provider.waitForTransaction(resp.transaction_hash);
            console.log("Account deployed");
          }
        } else if (response.approvalRequestsCalls) {
          console.log("Sending Approvals");
          const { transaction_hash } = await sessionAccount.execute(
            response.approvalRequestsCalls
          );
          console.log("Approvals hash: ", transaction_hash);
          await provider.waitForTransaction(transaction_hash);
          console.log("Approvals minted", transaction_hash);
        }

        if (response.approvalTransactionHash) {
          console.log("Waiting for approval", response.approvalTransactionHash);
          await provider.waitForTransaction(response.approvalTransactionHash);
          console.log("Approvals minted", response.approvalTransactionHash);
        }

        setInvisibleAccount(sessionAccount);
        setConnectStatus("Connect");
        setOpen(false); // Close dialog on successful connection
      } else {
        console.log("requestConnection response is undefined");
      }
    } catch (err: any) {
      console.error("Error connecting to Argent Invisible Wallet:", err);
      setConnectStatus("Connect");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle disconnect for invisible wallet
  const handleDisconnect = () => {
    if (invisibleAccount) {
      setInvisibleAccount(undefined);
    } else {
      disconnect();
    }
  };

  React.useEffect(() => {
    if (account || invisibleAccount) {
      setOpen(false);
    }
  }, [account, invisibleAccount]);

  const currentAddress = invisibleAccount?.address || address;
  const isConnected = !!currentAddress;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Wallet className="h-4 w-4" />{" "}
          {isConnected ? currentAddress?.slice(0, 6) : "Connect"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isConnected ? "Account" : "Connect"}</DialogTitle>
          <DialogDescription className="text-sm text-blue-500">
            {isConnected
              ? `Connected: ${currentAddress?.slice(
                  0,
                  6
                )}...${currentAddress?.slice(-4)}`
              : "Please connect to Starknet Sepolia *"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          
          
          {isConnected ? (
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

              {/* Account Menu
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
               */}
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                className="justify-start"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                >
                  Connect with {connector.name}
                </Button>
              ))}
              <div className="border-t pt-4">
                <label className="flex items-center text-sm mb-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={withApproval}
                    onChange={(e) => setWithApproval(e.target.checked)}
                    className="mr-2"
                  />
                  With approval requests
                </label>

                <Button
                  onClick={handleInvisibleWalletConnect}
                  className="bg-blue-500 text-white w-full"
                  disabled={
                    connectStatus !== "Connect" || isLoading || !argentWebWallet
                  }
                >
                  {!argentWebWallet
                    ? "Initializing..."
                    : connectStatus === "Connecting"
                    ? "Connecting..."
                    : connectStatus === "Deploying account"
                    ? "Deploying Account..."
                    : "Connect with Argent Invisible Wallet"}
                </Button>
              </div>

              <div className="alert alert-warning">
                <p className="text-sm">
                  * Mediolano Dapp is under development and connected to the testnet. Please make sure your wallet is connect on{" "}
                  <strong>Starknet Sepolia</strong> to interact.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
