"use client"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContract, useSendTransaction, useAccount } from "@starknet-react/core";
import { Abi } from "starknet";
// import { abi } from "@/abis/abi";
import { useToast } from "@/hooks/use-toast";
import { Card } from '@/components/ui/card';

export default function NFTTransferPage() {
  const abi = [
    {
      type: "function",
      name: "transfer",
      state_mutability: "external",
      inputs: [
        {
          name: "recipient",
          type: "core::starknet::contract_address::ContractAddress",
        },
        {
          name: "amount",
          type: "core::integer::u256",
        },
      ],
      outputs: [],
    },
  ] as const satisfies Abi;
  const [recipientAddress, setRecipientAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const { toast } = useToast();
  
  const { address } = useAccount(); 
  const { contract } = useContract({
    abi: abi as Abi,
    address: "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0", 
  });
  
  const { send, error: transactionError } = useSendTransaction({
    calls: contract && address && recipientAddress && tokenId
      ? [contract.populate("transfer", [BigInt(tokenId), recipientAddress])]
      : undefined,
  });

  const handleTransfer = async () => {
    if (!recipientAddress || !tokenId) {
      toast({
        title: "Error",
        description: "Please provide both token ID and recipient address",
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

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">

  
    <Card className='container mx-auto px-4 py-10 max-w-2xl'>
      <h1 className="text-3xl font-bold">Transfer Your NFT</h1>
      
      <div className="space-y-6">
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

        <div className="space-y-2">
          <Label htmlFor="tokenId">Token ID</Label>
          <Input
            id="tokenId"
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="Enter the token ID of the NFT"
            required
          />
        </div>

        <Button onClick={handleTransfer} className="w-full">
          Transfer NFT
        </Button>
      </div>
    </Card>

    </div>
  );
}
