"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card"
import type { ClaimableRevenueItem } from "@/app/services/revenue-sharing/lib/types"
import { Check, AlertCircle, Info, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  Abi, 
  useAccount, 
  useContract, 
  useSendTransaction, 
  useTransactionReceipt 
} from "@starknet-react/core"
import { ip_revenue_abi } from "@/abis/ip_revenue";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ClaimableRevenueProps {
  data: ClaimableRevenueItem[]
}

export default function ClaimableRevenue({ data }: ClaimableRevenueProps) {
  const [claiming, setClaiming] = useState<string | null>(null)
  const [claimed, setClaimed] = useState<string[]>([])
  const [selectedItem, setSelectedItem] = useState<ClaimableRevenueItem | null>(null)
  const [showDialog, setShowDialog] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const {status, address} = useAccount();

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS as `0x${string}`;
  const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL;
  
  const { contract } = useContract({
    abi: ip_revenue_abi as Abi,
    address: CONTRACT_ADDRESS,
  });
  
  const getCalls = () => {
    if (!address || !contract || !selectedItem) {
      return undefined;
    }
    console.log( selectedItem.nftContract, selectedItem.id)
    return [
      contract.populate("claim_royalty", [
        selectedItem.nftContract,
        selectedItem.id,
      ]),
    ];
  }

  const { sendAsync, data: claimData, isPending: isClaimingRevenue, error: sendError } = useSendTransaction({
    calls: getCalls(),
  });

  const { data: waitData, status: waitStatus, isPending: isClaimPending, error: waitError } = useTransactionReceipt({ 
    watch: true, 
    hash: transactionHash
  });

  // Handle transaction status changes
  useEffect(() => {
    if (transactionHash && waitStatus === 'success') {
      // Transaction confirmed successfully
      if (claiming) {
        setClaimed(prev => [...prev, claiming]);
        setClaiming(null);
        toast({
          title: "Transaction Confirmed",
          description: "Revenue claim was successful!",
        });
      }
    } else if (waitStatus === 'error' && waitError) {
      setClaiming(null);
      toast({
        title: "Transaction Failed",
        description: waitError.message || "Transaction failed on the blockchain",
        variant: "destructive",
      });
    }
  }, [waitStatus, waitError, transactionHash, claiming]);

  // Handle send errors
  useEffect(() => {
    if (sendError) {
      setClaiming(null);
      toast({
        title: "Failed to Submit Transaction",
        description: sendError.message || "Could not submit the transaction",
        variant: "destructive",
      });
    }
  }, [sendError]);

  // Update transaction hash when claim data is available
  useEffect(() => {
    if (claimData?.hash) {
      setTransactionHash(claimData.hash);
    }
  }, [claimData]);

  const handleClaim = async (item: ClaimableRevenueItem) => {
    if (status === "disconnected") {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (claimed.includes(item.id)) {
      toast({
        title: "Already Claimed",
        description: "This revenue has already been claimed.",
      });
      return;
    }

    setSelectedItem(item);
    setClaiming(item.id);
    
    try {
      await sendAsync();
      toast({
        title: "Transaction Submitted",
        description: "Your claim is being processed on the blockchain.",
      });
    } catch (err) {
      console.error("Submission error:", err);
      setClaiming(null);
      toast({
        title: "Failed to claim revenue",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  }

  const openClaimDialog = (item: ClaimableRevenueItem) => {
    setSelectedItem(item);
    setShowDialog(true);
  }

  const getExplorerLink = (hash: string) => {
    return `${EXPLORER_URL}/tx/${hash}`;
  }

  // Format date with time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if a date is approaching expiry (within 7 days)
  const isApproachingExpiry = (dateString: string) => {
    if (!dateString) return false;
    const expiryDate = new Date(dateString);
    const now = new Date();
    const differenceInDays = (expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return differenceInDays <= 7 && differenceInDays > 0;
  };

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const isClaimable = !claimed.includes(item.id);
        const isCurrentlyClaiming = claiming === item.id;
        const hasExpiryWarning = item.expiresAt && isApproachingExpiry(item.expiresAt);

        return (
          <Card key={item.id} className={`overflow-hidden ${hasExpiryWarning ? 'border-amber-300' : ''}`}>
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row sm:items-center p-4">
                <div className="flex-1 mb-4 sm:mb-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{item.assetName}</h3>
                    {claimed.includes(item.id) && (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="mr-1 h-3 w-3" />
                        Claimed
                      </Badge>
                    )}
                    {isCurrentlyClaiming && isClaimPending && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Processing
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">{item.amount} ETH</span>
                    <span className="text-gray-500"> • From {item.source}</span>
                  </div>

                  {item.expiresAt && (
                    <div className={`flex items-center gap-1 mt-2 text-xs ${hasExpiryWarning ? 'text-red-600 font-medium' : 'text-amber-600'}`}>
                      <Info className="h-3 w-3" />
                      {hasExpiryWarning ? 'Expiring soon:' : 'Expires on'} {new Date(item.expiresAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => openClaimDialog(item)}>
                          Details
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View full revenue details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    onClick={() => handleClaim(item)}
                    disabled={!isClaimable || isCurrentlyClaiming}
                    size="sm"
                    className={isClaimable ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-300"}
                  >
                    {isCurrentlyClaiming && isClaimingRevenue ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Claiming...
                      </span>
                    ) : isClaimable ? (
                      "Claim"
                    ) : (
                      "Claimed"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {data.length === 0 && (
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No claimable revenue</h3>
          <p className="mt-1 text-sm text-gray-500">You don't have any claimable revenue at the moment.</p>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Revenue Details</DialogTitle>
            <DialogDescription>Details about this revenue and claiming process</DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm text-gray-500">Asset</div>
                <div className="col-span-2 font-medium">{selectedItem.assetName}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm text-gray-500">Amount</div>
                <div className="col-span-2 font-medium">{selectedItem.amount} ETH</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm text-gray-500">Source</div>
                <div className="col-span-2 font-medium">{selectedItem.source}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm text-gray-500">Description</div>
                <div className="col-span-2">{selectedItem.description}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm text-gray-500">Generated On</div>
                <div className="col-span-2">
                  {selectedItem.generatedAt ? formatDateTime(selectedItem.generatedAt) : "N/A"}
                </div>
              </div>

              {selectedItem.expiresAt && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-sm text-gray-500">Expires On</div>
                  <div className={`col-span-2 ${isApproachingExpiry(selectedItem.expiresAt) ? 'text-red-600 font-medium' : 'text-amber-600'}`}>
                    {formatDateTime(selectedItem.expiresAt)}
                    {isApproachingExpiry(selectedItem.expiresAt) && (
                      <span className="ml-2 text-xs font-bold">SOON</span>
                    )}
                  </div>
                </div>
              )}

              {selectedItem.nftContract && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-sm text-gray-500">NFT Contract</div>
                  <div className="col-span-2 text-xs font-mono text-gray-600">
                    {selectedItem.nftContract}
                  </div>
                </div>
              )}

              {transactionHash && claiming === selectedItem.id && (
                <div className="bg-blue-50 p-4 rounded-md mt-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    Transaction In Progress
                    <svg className="animate-spin ml-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Your transaction is being processed on the Starknet blockchain.
                  </p>
                  <a 
                    href={getExplorerLink(transactionHash)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs flex items-center text-blue-600 hover:underline"
                  >
                    View on Explorer <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-md mt-4">
                <h4 className="font-medium mb-2">Claiming Process</h4>
                <p className="text-sm text-gray-600">
                  When you claim this revenue, it will be transferred to your connected wallet 
                  ({address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}). 
                  The transaction will be processed on the Starknet blockchain and may take a few minutes to complete.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedItem) {
                  handleClaim(selectedItem);
                  setShowDialog(false);
                }
              }}
              disabled={
                selectedItem ? 
                claimed.includes(selectedItem.id) || 
                claiming === selectedItem.id : 
                true
              }
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {selectedItem && claiming === selectedItem.id ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                selectedItem && claimed.includes(selectedItem.id) ? "Already Claimed" : "Claim Now"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}