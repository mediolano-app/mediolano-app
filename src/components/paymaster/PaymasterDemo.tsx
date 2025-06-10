/**
 * Comprehensive Paymaster Demo Component
 * Demonstrates all Paymaster features including gasless and sponsored transactions
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Coins, 
  Gift, 
  ShoppingCart, 
  Upload,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";
import { useAccount } from "@starknet-react/core";
import { GasTokenSelector } from "./GasTokenSelector";
import { TransactionStatus } from "./TransactionStatus";
import { usePaymasterMinting } from "@/hooks/usePaymasterMinting";
import { usePaymasterMarketplace } from "@/hooks/usePaymasterMarketplace";
import { useToast } from "@/components/ui/use-toast";

export function PaymasterDemo() {
  const { address, status } = useAccount();
  const { toast } = useToast();
  
  // Local state
  const [activeTab, setActiveTab] = useState("minting");
  const [mintRecipient, setMintRecipient] = useState("");
  const [mintTokenURI, setMintTokenURI] = useState("");
  const [selectedGasToken, setSelectedGasToken] = useState<string>("");
  const [maxGasAmount, setMaxGasAmount] = useState<bigint>(BigInt(0));

  // Paymaster hooks
  const {
    mintWithPaymaster,
    mintSponsored,
    mintTraditional,
    isMinting,
    mintingHash,
    mintingError,
    canSponsorMint,
    isGaslessCompatible,
    gasTokenPrices,
    refreshGasPrices,
    resetMintingState,
  } = usePaymasterMinting();

  const {
    buyItemWithPaymaster,
    buyItemSponsored,
    buyItemTraditional,
    isProcessing,
    transactionHash: marketplaceHash,
    transactionError: marketplaceError,
    canSponsorMarketplace,
  } = usePaymasterMarketplace();

  // Handle gas token selection
  const handleGasTokenSelect = (tokenAddress: string, maxAmount: bigint) => {
    setSelectedGasToken(tokenAddress);
    setMaxGasAmount(maxAmount);
  };

  // Handle sponsored transaction
  const handleSponsoredTransaction = async () => {
    if (activeTab === "minting") {
      if (!mintRecipient || !mintTokenURI) {
        toast({
          title: "Missing Information",
          description: "Please provide recipient address and token URI",
          variant: "destructive",
        });
        return;
      }
      await mintSponsored(mintRecipient, mintTokenURI);
    }
  };

  // Handle gasless transaction
  const handleGaslessTransaction = async () => {
    if (!selectedGasToken || maxGasAmount === BigInt(0)) {
      toast({
        title: "Gas Token Required",
        description: "Please select a gas token and amount",
        variant: "destructive",
      });
      return;
    }

    if (activeTab === "minting") {
      if (!mintRecipient || !mintTokenURI) {
        toast({
          title: "Missing Information",
          description: "Please provide recipient address and token URI",
          variant: "destructive",
        });
        return;
      }
      await mintWithPaymaster(mintRecipient, mintTokenURI, selectedGasToken, maxGasAmount);
    }
  };

  // Handle traditional transaction
  const handleTraditionalTransaction = async () => {
    if (activeTab === "minting") {
      if (!mintRecipient || !mintTokenURI) {
        toast({
          title: "Missing Information",
          description: "Please provide recipient address and token URI",
          variant: "destructive",
        });
        return;
      }
      await mintTraditional(mintRecipient, mintTokenURI);
    }
  };

  if (status === "disconnected") {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Wallet className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="text-lg font-medium">Wallet Not Connected</h3>
            <p className="text-gray-600">
              Please connect your wallet to try the Paymaster features.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-6 w-6" />
            AVNU Paymaster Integration Demo
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant={isGaslessCompatible ? "default" : "secondary"}>
              {isGaslessCompatible ? "Gasless Compatible" : "Gasless Not Available"}
            </Badge>
            <Badge variant={canSponsorMint ? "default" : "secondary"}>
              {canSponsorMint ? "Sponsorship Available" : "Sponsorship Not Available"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-green-600" />
              <span>Sponsored Transactions</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-blue-600" />
              <span>Gasless Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-gray-600" />
              <span>Traditional Fallback</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Demo Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Configuration */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="minting">NFT Minting</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            </TabsList>
            
            <TabsContent value="minting" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Mint NFT with Paymaster
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      value={mintRecipient}
                      onChange={(e) => setMintRecipient(e.target.value)}
                      placeholder={address || "Enter recipient address"}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tokenuri">Token URI</Label>
                    <Input
                      id="tokenuri"
                      value={mintTokenURI}
                      onChange={(e) => setMintTokenURI(e.target.value)}
                      placeholder="ipfs://... or https://..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setMintRecipient(address || "")}
                      variant="outline"
                      size="sm"
                    >
                      Use My Address
                    </Button>
                    <Button
                      onClick={() => setMintTokenURI("ipfs://QmExample123...")}
                      variant="outline"
                      size="sm"
                    >
                      Use Example URI
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="marketplace" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Marketplace with Paymaster
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
                    <p>Marketplace demo coming soon...</p>
                    <p className="text-sm">Will demonstrate gasless buying and listing</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Gas Token Selector */}
          <GasTokenSelector
            gasTokenPrices={gasTokenPrices}
            canSponsor={canSponsorMint}
            isLoading={isMinting}
            onTokenSelect={handleGasTokenSelect}
            onSponsoredSelect={handleSponsoredTransaction}
            onRefreshPrices={refreshGasPrices}
          />
        </div>

        {/* Transaction Status and Actions */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Execute Transaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {canSponsorMint && (
                <Button
                  onClick={handleSponsoredTransaction}
                  disabled={isMinting || isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Execute Sponsored (FREE)
                </Button>
              )}
              
              <Button
                onClick={handleGaslessTransaction}
                disabled={isMinting || isProcessing || !isGaslessCompatible}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Coins className="h-4 w-4 mr-2" />
                Execute Gasless
              </Button>
              
              <Button
                onClick={handleTraditionalTransaction}
                disabled={isMinting || isProcessing}
                variant="outline"
                className="w-full"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Execute Traditional
              </Button>
            </CardContent>
          </Card>

          {/* Transaction Status */}
          <TransactionStatus
            transactionHash={mintingHash || marketplaceHash}
            status={
              isMinting || isProcessing 
                ? "pending" 
                : mintingHash || marketplaceHash 
                  ? "success" 
                  : mintingError || marketplaceError 
                    ? "failed" 
                    : "idle"
            }
            error={mintingError || marketplaceError}
            isSponsored={canSponsorMint}
            transactionType={activeTab}
            onRetry={() => {
              resetMintingState();
              // Reset marketplace state if needed
            }}
          />

          {/* Information Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Gift className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <strong>Sponsored:</strong> Mediolano covers all gas fees. Perfect for onboarding new users.
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Coins className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <strong>Gasless:</strong> Pay gas fees with USDC, USDT, or other tokens instead of ETH/STRK.
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Wallet className="h-4 w-4 text-gray-600 mt-0.5" />
                <div>
                  <strong>Traditional:</strong> Standard transaction with ETH/STRK gas fees.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
