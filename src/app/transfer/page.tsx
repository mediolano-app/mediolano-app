"use client";

import React, { useState, useEffect } from "react";
import {
  useContract,
  useSendTransaction,
  useAccount,
} from "@starknet-react/core";
import { RpcProvider, Contract } from "starknet";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { abi } from "@/abis/abi";
import { Abi } from "starknet";
import { useMIP } from "@/hooks/useMIP";

export default function TransferNFTPage() {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const { toast } = useToast();

  const { tokenIds } = useMIP();
  console.log("Token IDs:", tokenIds);

  const { address } = useAccount();
  console.log("User Address:", address);

  const { contract } = useContract({
    abi: abi as Abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`,
  });

  // const handleTransfer = async () => {
  //   console.log("To:", recipientAddress); // Must be 0xdef...
  //   console.log("Token:", BigInt(tokenId));
  //   if (!recipientAddress || !tokenId || !contract || !address) {
  //     toast({
  //       title: "Error",
  //       description: "Please fill in all fields.",
  //     });
  //     return;
  //   }

  //   try {
  //     // Note: call 'safe_transfer_from' instead of transfer_ownership
  //     const tx_hash = await contract.safe_transfer_from(
  //       address as `0x${string}`,
  //       recipientAddress as `0x${string}`,
  //       BigInt(tokenId),
  //       [] // data parameter: empty array
  //     );
  //     console.log("Transaction hash:", tx_hash);
  //     toast({
  //       title: "Success",
  //       description: "NFT Transfer Transaction Sent.",
  //     });
  //   } catch (error) {
  //     console.error("Transfer error", error);
  //     toast({
  //       title: "Error",
  //       description: "NFT transfer failed.",
  //     });
  //   }
  // };

  const { send, error: transferError } = useSendTransaction({
    calls:
      contract && address && recipientAddress && tokenId
        ? [
            contract.populate("safe_transfer_from", [
              address,
              recipientAddress,
              BigInt(tokenId),
              [], // data parameter
            ]),
          ]
        : undefined,
  });

  const handleTransfer = async () => {
    try {
      send();
      toast({
        title: "Success",
        description: "NFT Transfer Transaction Sent.",
      });
    } catch (transferError) {
      console.error("Transfer error", transferError);
      toast({
        title: "Error",
        description: "NFT transfer failed.",
      });
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
          <Button
            onClick={() => {
              console.log("Transfer button clicked");
              handleTransfer();
            }}
            className="w-full"
          >
            Transfer NFT
          </Button>

          {/* Verify Ownership Button */}
          {/*
            <Button
              onClick={verifyOwnership}
              className="w-full"
              disabled={verifying}
            >
              {verifying ? "Verifying..." : "Verify Ownership"}
            </Button>
          */}

          {/* Display Current Owner */}
          {/* {ownerAddress && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <strong>Current Owner:</strong> {ownerAddress}
              </p>
            </div>
          )} */}
        </div>
      </Card>
    </div>
  );
}
