"use client";

import React, { useState } from "react";
import { useContract, useSendTransaction, useAccount } from "@starknet-react/core";
import { RpcProvider, Contract } from "starknet";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { abi } from "@/abis/abi";
import { Abi } from "starknet";

export default function TransferNFTPage() {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  const { address } = useAccount();
  const { contract } = useContract({
    abi: abi as Abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`,
  });

  const { send, error: transactionError } = useSendTransaction({
    calls:
      contract && address && recipientAddress && tokenId
        ? [contract.populate("transfer_ownership", [BigInt(tokenId), recipientAddress])]
        : undefined,
  });

  const handleTransfer = async () => {
    if (!recipientAddress || !tokenId) {
      toast({
        title: "Error",
        description: "Please provide both token ID and recipient address.",
      });
      return;
    }

    try {
      await send();
      toast({
        title: "Success",
        description: "NFT Transfer Transaction Sent.",
      });
    } catch {
      console.error("Transfer error", transactionError);
      toast({
        title: "Error",
        description: "NFT transfer failed.",
      });
    }
  };

  const verifyOwnership = async () => {
    if (!tokenId) {
      toast({
        title: "Error",
        description: "Please provide a token ID to verify ownership.",
      });
      return;
    }

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`;
    if (!contractAddress) {
      console.error("Contract address is not defined in the environment variables.");
      toast({
        title: "Error",
        description: "Contract address is not configured. Please check your environment variables.",
      });
      return;
    }

    setVerifying(true);
    try {
      const provider = new RpcProvider({ nodeUrl: process.env.NEXT_PUBLIC_RPC_URL });
      const contract = new Contract(abi, contractAddress, provider);

 
      const owner = await contract.owner_of(BigInt(tokenId));
      setOwnerAddress(owner.toString());

      toast({
        title: "Verification Success",
        description: `The current owner of token ID ${tokenId} is ${owner.toString()}.`,
      });
    } catch (err) {
      console.error("Verification error:", err);
      toast({
        title: "Error",
        description: "Failed to verify ownership. Please try again.",
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <Card className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Transfer Your NFT</h1>

        <div className="space-y-6">
          {/* Recipient Address Input */}
          <div className="space-y-2">
            <Label htmlFor="recipientAddress">Recipient Address</Label>
            <Input
              id="recipientAddress"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="Enter recipient's wallet address"
              required
            />
          </div>

          {/* Token ID Input */}
          <div className="space-y-2">
            <Label htmlFor="tokenId">Token ID</Label>
            <Input
              id="tokenId"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter the token ID"
              required
            />
          </div>

          {/* Transfer Button */}
          <Button onClick={handleTransfer} className="w-full">
            Transfer NFT
          </Button>

          {/* Verify Ownership Button */}
          <Button onClick={verifyOwnership} className="w-full" disabled={verifying}>
            {verifying ? "Verifying..." : "Verify Ownership"}
          </Button>

          {/* Display Current Owner */}
          {ownerAddress && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <strong>Current Owner:</strong> {ownerAddress}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}