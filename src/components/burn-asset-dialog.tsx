"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, CheckCircle2, Flame, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"

import { useSendTransaction, useAccount, useProvider } from "@starknet-react/core"
import { type Abi, CallData, cairo, shortString } from "starknet"
import { ipCollectionAbi } from "@/abis/ip_collection"
import { COLLECTION_CONTRACT_ADDRESS, EXPLORER_URL } from "@/lib/constants"
import { shortenAddress } from "@/lib/utils"

export interface BurnableAsset {
  id: string
  name: string
  nftAddress: string
  collectionName?: string
}

interface BurnAssetDialogProps {
  assets: BurnableAsset[]
  isOpen: boolean
  onClose: () => void
  onBurnComplete: (txHash: string) => void
}

export function BurnAssetDialog({
  assets,
  isOpen,
  onClose,
  onBurnComplete,
}: BurnAssetDialogProps) {

  const { address } = useAccount()
  const { provider } = useProvider()

  const [step, setStep] = useState<"details" | "confirm" | "processing" | "success">("details")
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const { toast } = useToast()

  // Derived Values
  const assetName = assets.length === 1 ? assets[0].name : `${assets.length} Assets`

  // Build Calls
  // We use the Manager contract's burn function which takes a token identifier (ByteArray)
  // We rely on starknet.js to encode the string ID into ByteArray
  // Build Calls
  // We use the Manager contract's burn function which takes a token identifier (ByteArray)
  // We rely on starknet.js to encode the string ID into ByteArray
  const calls = useMemo(() => {
    if (!assets.length || !address) return undefined

    // Flatten logic: for each asset, we need TWO calls:
    // 1. Approve the Manager contract to spend the token (on the NFT contract)
    // 2. Call burn on the Manager contract
    return assets.flatMap(asset => {
      const tokenIdUint256 = cairo.uint256(asset.id)

      // Manual ByteArray construction since cairo.byteArray might not be available
      // For short strings (id is decimal string), it fits in pending_word
      const idString = asset.id
      const pendingWord = shortString.encodeShortString(idString)
      const tokenIdByteArray = {
        data: [],
        pending_word: pendingWord,
        pending_word_len: idString.length
      }

      // 1. Approve Logic
      const approveCall = {
        contractAddress: asset.nftAddress,
        entrypoint: "approve",
        calldata: CallData.compile([
          COLLECTION_CONTRACT_ADDRESS, // Spender (Manager Contract)
          tokenIdUint256 // Token ID (u256: low, high)
        ])
      }

      // 2. Burn Logic
      // Explicitly encoding ByteArray to avoid ambiguity in populate
      const burnCall = {
        contractAddress: COLLECTION_CONTRACT_ADDRESS,
        entrypoint: "burn",
        calldata: CallData.compile([
          tokenIdByteArray
        ])
      }

      return [approveCall, burnCall]
    })
  }, [assets, address])

  const { sendAsync, isPending } = useSendTransaction({
    calls
  })

  // estimated
  // Since we are doing 2 txs per asset now, the fee is higher
  const transactionFee = {
    amount: "< 0.002 STRK",
    usdValue: "< $0.002",
    estimatedTime: "< 10 seconds",
  }

  const handleContinue = () => {
    setError(null)
    setStep("confirm")
  }

  const handleBurn = async () => {
    setStep("processing")
    setProgress(10)

    try {
      if (!sendAsync) {
        throw new Error("Wallet not connected or invalid parameters")
      }

      setProgress(30)
      const tx = await sendAsync()
      setProgress(80)

      setTxHash(tx.transaction_hash)
      setProgress(100)
      setStep("success")

      toast({
        title: "Burn Submitted",
        description: `Tx Hash: ${shortenAddress(tx.transaction_hash)}`,
      })
    } catch (err) {
      console.error(err)
      setError("Failed to burn asset. Please try again.")
      setStep("details")

      toast({
        variant: "destructive",
        title: "Burn failed",
        description: "There was an error burning your asset.",
      })
    }
  }

  const handleComplete = () => {
    if (txHash) {
      onBurnComplete(txHash)
    }
    handleReset()
    onClose()
  }

  const handleReset = () => {
    setStep("details")
    setError(null)
    setProgress(0)
    setAgreeToTerms(false)
    setTxHash(null)
  }

  const handleClose = () => {
    if (step === "processing" && isPending) {
      return // Prevent closing during processing
    }
    handleReset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] border-red-900/20">
        {step === "details" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-red-500 flex items-center gap-2">
                <Flame className="h-5 w-5 fill-red-500" />
                Burn Asset
              </DialogTitle>
              <DialogDescription>
                Permanently destroy {assetName}. This action involves an on-chain transaction.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-red-900 dark:text-red-200">Irreversible Action</h4>
                    <p className="text-sm text-red-800 dark:text-red-300">
                      You are about to permanently destroy {assets.length > 1 ? "these assets" : "this asset"}.
                      This will require <strong>{assets.length * 2} transactions</strong> (Approve + Burn) executed as a single batch.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-md bg-muted p-3 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <Shield className="h-4 w-4" />
                  <p>Transaction Details</p>
                </div>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li className="flex justify-between">
                    <span>Estimated Fee:</span>
                    <span className="font-medium text-foreground">{transactionFee.amount}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Estimated Time:</span>
                    <span>{transactionFee.estimatedTime}</span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  className="mt-1 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                  I understand that this action is permanent and cannot be undone.
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!agreeToTerms}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Continue to Burn
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-red-500">Confirm Burn</DialogTitle>
              <DialogDescription>Please review the details before confirming the destruction of your asset.</DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                {assets.length > 1 ? (
                  // Batch burn view
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Batch Burn</h3>
                      <Badge variant="destructive">{assets.length} Assets</Badge>
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1 mb-2">
                      {assets.map(a => (
                        <div key={a.id} className="text-xs text-muted-foreground flex justify-between">
                          <span>{a.name}</span>
                          <span>#{a.id}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  // Single asset burn view
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Asset to Burn</h3>
                      <p>{assets[0]?.name}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Asset ID</h3>
                      <p>#{assets[0]?.id}</p>
                    </div>
                  </>
                )}
              </div>

              <Alert className="border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                <Flame className="h-4 w-4 fill-red-800 dark:fill-red-200" />
                <AlertTitle>Final Warning</AlertTitle>
                <AlertDescription>
                  Confirming this transaction will permanently delete {assets.length > 1 ? "these assets" : "this asset"} from the blockchain.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("details")}>
                Back
              </Button>
              <Button onClick={handleBurn} variant="destructive">Confirm Burn</Button>
            </DialogFooter>
          </>
        )}

        {step === "processing" && (
          <>
            <DialogHeader>
              <DialogTitle>Burning Asset</DialogTitle>
              <DialogDescription>Please wait while we process the burn transaction.</DialogDescription>
            </DialogHeader>

            <div className="py-8 flex flex-col items-center justify-center space-y-6">
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>


              <div className="space-y-2 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto" />
                <p className="text-lg font-medium">Burning Asset</p>
                <p className="text-sm text-muted-foreground">
                  {progress < 30
                    ? "Preparing transaction..."
                    : progress < 60
                      ? "Submitting to blockchain..."
                      : progress < 90
                        ? "Waiting for confirmation..."
                        : "Finalizing..."}
                </p>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>Please do not close this window</p>
                <p>This may take a few moments</p>
              </div>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle>Asset Burned</DialogTitle>
              <DialogDescription>
                The selected {assets.length > 1 ? "assets have" : "asset has"} been permanently destroyed.
              </DialogDescription>
            </DialogHeader>

            <div className="py-8 flex flex-col items-center justify-center space-y-6">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
                <Flame className="h-12 w-12 text-red-600 dark:text-red-300 fill-current" />
              </div>

              <div className="space-y-2 text-center">
                <p className="text-lg font-medium">Burn Successful</p>
                <p className="text-sm text-muted-foreground">
                  The selected {assets.length > 1 ? "assets have" : "asset has"} been permanently destroyed.
                </p>
              </div>

              <div className="w-full rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Transaction Details</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Confirmed
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction Hash:</span>
                    <span className="font-mono text-xs">{txHash ? shortenAddress(txHash) : "Pending..."}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network:</span>
                    <span>Starknet</span>
                  </div>
                  {assets.length > 1 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assets Burned:</span>
                      <span>{assets.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => {
                  if (txHash) {
                    window.open(`${EXPLORER_URL}/tx/${txHash}`, "_blank")
                  }
                }}
              >
                View onchain
              </Button>
              <Button className="w-full sm:w-auto" onClick={handleComplete}>
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
