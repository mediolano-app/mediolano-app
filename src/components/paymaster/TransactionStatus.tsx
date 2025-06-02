/**
 * Transaction Status Component with Paymaster Information
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Gift, 
  Fuel,
  AlertCircle,
  Copy
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TransactionStatusProps {
  transactionHash?: string | null;
  status: "pending" | "success" | "failed" | "idle";
  error?: string | null;
  isSponsored?: boolean;
  gasToken?: {
    symbol: string;
    amount: string;
  };
  transactionType?: string;
  onRetry?: () => void;
  onClose?: () => void;
}

export function TransactionStatus({
  transactionHash,
  status,
  error,
  isSponsored = false,
  gasToken,
  transactionType,
  onRetry,
  onClose,
}: TransactionStatusProps) {
  const { toast } = useToast();

  // Copy transaction hash to clipboard
  const copyTransactionHash = () => {
    if (transactionHash) {
      navigator.clipboard.writeText(transactionHash);
      toast({
        title: "Copied",
        description: "Transaction hash copied to clipboard",
      });
    }
  };

  // Open transaction in explorer
  const openInExplorer = () => {
    if (transactionHash) {
      const explorerUrl = `https://sepolia.starkscan.co/tx/${transactionHash}`;
      window.open(explorerUrl, "_blank");
    }
  };

  // Get status icon and color
  const getStatusDisplay = () => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-5 w-5 animate-pulse" />,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          title: "Transaction Pending",
          description: "Your transaction is being processed...",
        };
      case "success":
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          title: "Transaction Successful",
          description: "Your transaction has been confirmed on the blockchain.",
        };
      case "failed":
        return {
          icon: <XCircle className="h-5 w-5" />,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          title: "Transaction Failed",
          description: error || "Your transaction could not be processed.",
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          title: "Ready to Transact",
          description: "Configure your transaction settings above.",
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  if (status === "idle") {
    return null;
  }

  return (
    <Card className={`w-full ${statusDisplay.borderColor} ${statusDisplay.bgColor}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${statusDisplay.color}`}>
          {statusDisplay.icon}
          {statusDisplay.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Description */}
        <p className="text-sm text-gray-600">
          {statusDisplay.description}
        </p>

        {/* Payment Method Badge */}
        <div className="flex flex-wrap gap-2">
          {isSponsored && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Gift className="h-3 w-3 mr-1" />
              Sponsored by Mediolano
            </Badge>
          )}
          
          {gasToken && !isSponsored && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Fuel className="h-3 w-3 mr-1" />
              Paid with {gasToken.symbol}
            </Badge>
          )}
          
          {transactionType && (
            <Badge variant="outline">
              {transactionType}
            </Badge>
          )}
        </div>

        {/* Transaction Hash */}
        {transactionHash && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Transaction Hash</h4>
              <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
                <code className="text-xs font-mono flex-1 truncate">
                  {transactionHash}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyTransactionHash}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openInExplorer}
                  className="h-6 w-6 p-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Gas Payment Details */}
        {gasToken && !isSponsored && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Gas Payment</h4>
              <div className="text-sm text-gray-600">
                <p>Token: {gasToken.symbol}</p>
                <p>Amount: {gasToken.amount}</p>
              </div>
            </div>
          </>
        )}

        {/* Sponsorship Details */}
        {isSponsored && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Sponsorship Details</h4>
              <div className="text-sm text-gray-600">
                <p>Gas fees covered by Mediolano Protocol</p>
                <p>No tokens deducted from your wallet</p>
              </div>
            </div>
          </>
        )}

        {/* Error Details */}
        {status === "failed" && error && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-red-600">Error Details</h4>
              <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {status === "failed" && onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              Retry Transaction
            </Button>
          )}
          
          {transactionHash && (
            <Button onClick={openInExplorer} variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-1" />
              View in Explorer
            </Button>
          )}
          
          {onClose && (
            <Button onClick={onClose} variant="ghost" size="sm" className="ml-auto">
              Close
            </Button>
          )}
        </div>

        {/* Success Message for Sponsored Transactions */}
        {status === "success" && isSponsored && (
          <div className="p-3 bg-green-100 border border-green-200 rounded-md">
            <p className="text-sm text-green-800 font-medium">
              🎉 Congratulations! Your transaction was completed without any gas fees thanks to Mediolano's sponsorship program.
            </p>
          </div>
        )}

        {/* Success Message for Gasless Transactions */}
        {status === "success" && gasToken && !isSponsored && (
          <div className="p-3 bg-blue-100 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800 font-medium">
              ✨ Transaction completed using {gasToken.symbol} for gas fees. No ETH or STRK required!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
