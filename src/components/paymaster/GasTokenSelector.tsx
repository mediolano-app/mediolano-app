/**
 * Gas Token Selector Component for AVNU Paymaster
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Fuel, Gift, AlertCircle, RefreshCw } from "lucide-react";
import { AVNU_PAYMASTER_CONFIG } from "@/lib/constants";
import { GasTokenPrice } from "@/types/paymaster";
import { formatGasTokenAmount, calculateGasCostInToken } from "@/utils/paymaster";

interface GasTokenSelectorProps {
  gasTokenPrices: GasTokenPrice[];
  estimatedGasFees?: bigint;
  selectedToken?: string;
  maxAmount?: string;
  canSponsor?: boolean;
  isLoading?: boolean;
  onTokenSelect: (tokenAddress: string, maxAmount: bigint) => void;
  onSponsoredSelect: () => void;
  onRefreshPrices: () => void;
}

export function GasTokenSelector({
  gasTokenPrices,
  estimatedGasFees,
  selectedToken,
  maxAmount,
  canSponsor = false,
  isLoading = false,
  onTokenSelect,
  onSponsoredSelect,
  onRefreshPrices,
}: GasTokenSelectorProps) {
  const [selectedGasToken, setSelectedGasToken] = useState<string>("");
  const [customMaxAmount, setCustomMaxAmount] = useState<string>("");
  const [paymentMode, setPaymentMode] = useState<"sponsored" | "gasless" | "traditional">("traditional");

  // Get token info from supported tokens
  const getTokenInfo = (address: string) => {
    return AVNU_PAYMASTER_CONFIG.SUPPORTED_GAS_TOKENS.find(
      token => token.address === address
    );
  };

  // Calculate gas cost in selected token
  const calculateTokenCost = (tokenAddress: string) => {
    if (!estimatedGasFees) return null;
    
    const priceData = gasTokenPrices.find(p => p.tokenAddress === tokenAddress);
    const tokenInfo = getTokenInfo(tokenAddress);
    
    if (!priceData || !tokenInfo) return null;
    
    const cost = calculateGasCostInToken(
      estimatedGasFees,
      priceData.gasTokenPrice,
      tokenInfo.decimals
    );
    
    return formatGasTokenAmount(cost.toString(), tokenInfo.decimals, tokenInfo.symbol);
  };

  // Handle token selection
  const handleTokenSelect = (tokenAddress: string) => {
    setSelectedGasToken(tokenAddress);
    const tokenInfo = getTokenInfo(tokenAddress);
    
    if (tokenInfo && estimatedGasFees) {
      const priceData = gasTokenPrices.find(p => p.tokenAddress === tokenAddress);
      if (priceData) {
        const cost = calculateGasCostInToken(
          estimatedGasFees,
          priceData.gasTokenPrice,
          tokenInfo.decimals
        );
        // Add 10% buffer for gas estimation
        const maxAmountWithBuffer = cost + (cost / BigInt(10));
        setCustomMaxAmount(maxAmountWithBuffer.toString());
      }
    }
  };

  // Handle payment mode change
  const handlePaymentModeChange = (mode: "sponsored" | "gasless" | "traditional") => {
    setPaymentMode(mode);
    
    if (mode === "sponsored" && canSponsor) {
      onSponsoredSelect();
    }
  };

  // Handle gasless transaction execution
  const handleGaslessExecution = () => {
    if (selectedGasToken && customMaxAmount) {
      onTokenSelect(selectedGasToken, BigInt(customMaxAmount));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="h-5 w-5" />
          Gas Payment Options
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefreshPrices}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Mode Selection */}
        <div className="space-y-3">
          <Label>Payment Method</Label>
          
          {/* Sponsored Option */}
          {canSponsor && (
            <Card 
              className={`cursor-pointer transition-colors ${
                paymentMode === "sponsored" ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-gray-50"
              }`}
              onClick={() => handlePaymentModeChange("sponsored")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Gift className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Sponsored by Mediolano</h4>
                      <p className="text-sm text-gray-600">No gas fees required</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    FREE
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gasless Option */}
          <Card 
            className={`cursor-pointer transition-colors ${
              paymentMode === "gasless" ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
            }`}
            onClick={() => handlePaymentModeChange("gasless")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Fuel className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">Pay with Alternative Token</h4>
                    <p className="text-sm text-gray-600">Use USDC, USDT, or other tokens</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  GASLESS
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Traditional Option */}
          <Card 
            className={`cursor-pointer transition-colors ${
              paymentMode === "traditional" ? "ring-2 ring-gray-500 bg-gray-50" : "hover:bg-gray-50"
            }`}
            onClick={() => handlePaymentModeChange("traditional")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium">Traditional (ETH/STRK)</h4>
                    <p className="text-sm text-gray-600">Pay gas fees with ETH or STRK</p>
                  </div>
                </div>
                <Badge variant="outline">
                  STANDARD
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gasless Token Selection */}
        {paymentMode === "gasless" && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gas-token">Select Gas Token</Label>
                <Select value={selectedGasToken} onValueChange={handleTokenSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a token to pay gas fees" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVNU_PAYMASTER_CONFIG.SUPPORTED_GAS_TOKENS.map((token) => {
                      const priceData = gasTokenPrices.find(p => p.tokenAddress === token.address);
                      const cost = calculateTokenCost(token.address);
                      
                      return (
                        <SelectItem key={token.address} value={token.address}>
                          <div className="flex items-center justify-between w-full">
                            <span>{token.symbol}</span>
                            {cost && (
                              <span className="text-sm text-gray-500 ml-2">
                                ~{cost}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {selectedGasToken && (
                <div className="space-y-2">
                  <Label htmlFor="max-amount">Maximum Amount</Label>
                  <Input
                    id="max-amount"
                    type="text"
                    value={customMaxAmount}
                    onChange={(e) => setCustomMaxAmount(e.target.value)}
                    placeholder="Enter maximum token amount"
                  />
                  {selectedGasToken && customMaxAmount && (
                    <p className="text-sm text-gray-600">
                      You authorize up to {formatGasTokenAmount(
                        customMaxAmount,
                        getTokenInfo(selectedGasToken)?.decimals || 18,
                        getTokenInfo(selectedGasToken)?.symbol || "TOKEN"
                      )} for gas fees
                    </p>
                  )}
                </div>
              )}

              <Button 
                onClick={handleGaslessExecution}
                disabled={!selectedGasToken || !customMaxAmount || isLoading}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Execute Gasless Transaction
              </Button>
            </div>
          </>
        )}

        {/* Gas Price Information */}
        {gasTokenPrices.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label>Current Gas Token Prices</Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {gasTokenPrices.map((price) => {
                  const tokenInfo = getTokenInfo(price.tokenAddress);
                  return (
                    <div key={price.tokenAddress} className="flex justify-between">
                      <span>{tokenInfo?.symbol || "Unknown"}</span>
                      <span className="text-gray-600">
                        {(parseInt(price.gasTokenPrice) / Math.pow(10, tokenInfo?.decimals || 18)).toFixed(6)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
