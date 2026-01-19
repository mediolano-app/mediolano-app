"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, CheckCircle2, ArrowRight, Info, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { useSendTransaction } from "@starknet-react/core"
import { COLLECTION_NFT_ABI } from "@/abis/ip_nft"
import { shortenAddress } from "@/lib/utils"
import { EXPLORER_URL } from "@/services/constants"

export interface TransferableAsset {
  id: string
  name: string
  nftAddress: string
  collectionName?: string
}

interface TransferAssetDialogProps {
  assets: TransferableAsset[]
  currentOwner: string
  isOpen: boolean
  onClose: () => void
  onTransferComplete: (newOwnerAddress: string, memo?: string) => void
}

// Local storage key for recent addresses
const RECENT_ADDRESSES_KEY = "mediolano_recent_transfer_addresses"

interface RecentAddress {
  address: string
  name: string
  lastUsed: string
}

export function TransferAssetDialog({
  assets,
  currentOwner,
  isOpen,
  onClose,
  onTransferComplete,
}: TransferAssetDialogProps) {
  const [step, setStep] = useState<"details" | "confirm" | "processing" | "success">("details")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [memo, setMemo] = useState("")
  const [recentAddresses, setRecentAddresses] = useState<RecentAddress[]>([])

  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [selectedTab, setSelectedTab] = useState<"manual" | "recent">("manual")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const { toast } = useToast()

  // Load recent addresses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_ADDRESSES_KEY)
    if (saved) {
      try {
        setRecentAddresses(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load recent addresses", e)
      }
    } else {
      // Default burn address if empty
      setRecentAddresses([
        { address: "0x000000000000000000000000000000000000000000000000000000000000001", name: "Burn Address", lastUsed: "Never" }
      ])
    }
  }, [isOpen])

  const saveRecentAddress = (address: string) => {
    const newRecent = [
      { address, name: shortenAddress(address), lastUsed: new Date().toLocaleDateString() },
      ...recentAddresses.filter(a => a.address.toLowerCase() !== address.toLowerCase())
    ].slice(0, 5)

    setRecentAddresses(newRecent)
    localStorage.setItem(RECENT_ADDRESSES_KEY, JSON.stringify(newRecent))
  }

  // Derived Values
  const assetName = assets.length === 1 ? assets[0].name : `${assets.length} Assets`
  const assetIdDisplay = assets.length === 1 ? `#${assets[0].id}` : `Batch (${assets.length})`

  // Build Calls
  const calls = useMemo(() => {
    if (!recipientAddress || !assets.length) return undefined

    return assets.map(asset => ({
      contractAddress: asset.nftAddress,
      entrypoint: "transfer_from",
      calldata: [currentOwner, recipientAddress, asset.id, "0"]
    }))
  }, [assets, currentOwner, recipientAddress])

  const { sendAsync, isPending } = useSendTransaction({
    calls
  })

  // Recipient preview data
  const recipientItem = recentAddresses.find(a => a.address.toLowerCase() === recipientAddress.toLowerCase())
  const recipientPreview = recipientAddress
    ? {
      name: recipientItem?.name || (recipientAddress.startsWith("0x") ? shortenAddress(recipientAddress) : recipientAddress),
      address: recipientAddress,
      isRecent: !!recipientItem
    }
    : null

  // estimated
  const transactionFee = {
    amount: "< 0.001 STRK", // Lower fee for L2
    usdValue: "< $0.001",
    estimatedTime: "< 5 seconds",
  }

  const validateAddress = (address: string) => {
    // Basic validation - in a real app, you'd have more sophisticated validation
    if (!address.trim()) {
      return "Recipient address is required"
    }

    // Check if it's a valid format (simplified for demo)
    if (!address.startsWith("0x") || address.length < 10) {
      return "Invalid wallet address format"
    }

    // Check if it's the same as current owner
    if (address.toLowerCase() === currentOwner.toLowerCase()) {
      return "Cannot transfer to the current owner"
    }

    return null
  }

  const handleContinue = () => {
    // Validate the address
    const validationError = validateAddress(recipientAddress)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setStep("confirm")
  }

  const handleTransfer = async () => {
    setStep("processing")
    setProgress(10)

    try {
      if (!sendAsync) {
        throw new Error("Wallet not connected or invalid parameters")
      }

      setProgress(30)
      const tx = await sendAsync()
      setProgress(80)

      // We could wait for transaction receipt here if we want to show strict success
      // But typically we show success after submission hash is received

      setTxHash(tx.transaction_hash)
      saveRecentAddress(recipientAddress)
      setProgress(100)
      setStep("success")

      toast({
        title: "Transfer Submitted",
        description: `Tx Hash: ${shortenAddress(tx.transaction_hash)}`,
      })
    } catch (err) {
      console.error(err)
      setError("Failed to transfer asset. Please try again.")
      setStep("details") // Go back on error? or stay on confirm?

      // If user rejected, it's a specific error

      toast({
        variant: "destructive",
        title: "Transfer failed",
        description: "There was an error transferring your asset.",
      })
    }
  }

  const handleComplete = () => {
    onTransferComplete(recipientAddress, memo)
    handleReset()
    onClose()
  }

  const handleReset = () => {
    setStep("details")
    setRecipientAddress("")
    setMemo("")
    setError(null)
    setProgress(0)
    setAgreeToTerms(false)
  }

  const handleClose = () => {
    if (step === "processing" && isPending) {
      return // Prevent closing during processing
    }
    handleReset()
    onClose()
  }

  const selectRecentAddress = (address: string) => {
    setRecipientAddress(address)
    setSelectedTab("manual") // Switch back to manual tab to show the selected address
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {step === "details" && (
          <>
            <DialogHeader>
              <DialogTitle>Transfer Asset</DialogTitle>
              <DialogDescription>Transfer ownership of {assetName} to another wallet address.</DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as "manual" | "recent")}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="recent">Recent Addresses</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-sm font-medium">
                      Recipient Address
                    </Label>
                    <Input
                      id="recipient"
                      placeholder="0x..."
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                    />
                  </div>

                  {recipientPreview && recipientAddress.length > 20 && (
                    <Card className="border-dashed bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 bg-primary/10">
                              <AvatarFallback>
                                {recipientPreview.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{recipientPreview.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {recipientPreview.isRecent ? "Recent recipient" : "External wallet address"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="memo" className="text-sm font-medium">
                      Memo (Optional)
                    </Label>
                    <Textarea
                      id="memo"
                      placeholder="Add a note about this transfer"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      This memo will be stored with the transfer record and visible to the recipient.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="recent">
                  <div className="space-y-2">
                    {recentAddresses.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 cursor-pointer"
                        onClick={() => selectRecentAddress(item.address)}
                      >
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs font-mono text-muted-foreground truncate max-w-[250px]">
                            {item.address}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">{item.lastUsed}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 rounded-md bg-muted p-3 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <Info className="h-4 w-4" />
                  <p>Transaction Details</p>
                </div>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li className="flex justify-between">
                    <span>Estimated Fee:</span>
                    <span className="font-medium text-foreground">{transactionFee.amount}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>USD Value:</span>
                    <span>{transactionFee.usdValue}</span>
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
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm font-normal">
                  I understand that this transfer will change ownership of the asset and all associated rights and
                  licenses. This action cannot be undone.
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleContinue} disabled={!agreeToTerms || !recipientAddress}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Transfer</DialogTitle>
              <DialogDescription>Please review the transfer details before proceeding.</DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                {assets.length > 1 ? (
                  // Batch transfer view
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Batch Transfer</h3>
                      <Badge variant="outline">{assets.length} Assets</Badge>
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1 mb-2">
                      {assets.map(a => (
                        <div key={a.id} className="text-xs text-muted-foreground flex justify-between">
                          <span>{a.name}</span>
                          <span>#{a.id}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">From</h3>
                      <p className="font-mono text-sm truncate max-w-[250px]">{shortenAddress(currentOwner)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">To</h3>
                      <p className="font-mono text-sm truncate max-w-[250px]">{shortenAddress(recipientAddress)}</p>
                    </div>
                  </>
                ) : (
                  // Single asset transfer view
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Asset</h3>
                      <p>{assets[0]?.name}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Asset ID</h3>
                      <p>#{assets[0]?.id}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">From</h3>
                      <p className="font-mono text-sm truncate max-w-[250px]">{shortenAddress(currentOwner)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">To</h3>
                      <p className="font-mono text-sm truncate max-w-[250px]">{shortenAddress(recipientAddress)}</p>
                    </div>
                  </>
                )}
                {memo && (
                  <div className="pt-2 border-t">
                    <h3 className="font-medium mb-1">Memo</h3>
                    <p className="text-sm text-muted-foreground">{memo}</p>
                  </div>
                )}
              </div>

              <Alert className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  {assets.length > 1
                    ? "This batch transfer cannot be reversed once confirmed. All selected assets will be transferred."
                    : "Once confirmed, this transfer cannot be reversed. Please ensure all details are correct."}
                </AlertDescription>
              </Alert>

              <div className="rounded-md bg-muted p-3 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <Shield className="h-4 w-4" />
                  <p>Security Verification</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  For your security, this transaction will be processed on the blockchain and may require wallet
                  confirmation.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("details")}>
                Back
              </Button>
              <Button onClick={handleTransfer}>Confirm Transfer</Button>
            </DialogFooter>
          </>
        )}

        {step === "processing" && (
          <>
            <DialogHeader>
              <DialogTitle>Processing Transfer</DialogTitle>
              <DialogDescription>Please wait while we process your transfer.</DialogDescription>
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
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-lg font-medium">Transferring Asset</p>
                <p className="text-sm text-muted-foreground">
                  {progress < 30
                    ? "Preparing transaction..."
                    : progress < 60
                      ? "Submitting to blockchain..."
                      : progress < 90
                        ? "Waiting for confirmation..."
                        : "Finalizing transfer..."}
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
              <DialogTitle>Transfer Complete</DialogTitle>
              <DialogDescription>
                {assets.length > 1
                  ? "Your assets have been successfully transferred."
                  : "Your asset has been successfully transferred."}
              </DialogDescription>
            </DialogHeader>

            <div className="py-8 flex flex-col items-center justify-center space-y-6">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-300" />
              </div>

              <div className="space-y-2 text-center">
                <p className="text-lg font-medium">Transfer Successful!</p>
                <p className="text-sm text-muted-foreground">
                  {assets.length > 1
                    ? `${assetName} have been transferred to `
                    : `${assetName} has been transferred to `}
                  <span className="font-mono">
                    {recipientAddress.substring(0, 6)}...{recipientAddress.substring(recipientAddress.length - 4)}
                  </span>
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
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Fee:</span>
                    <span>{transactionFee.amount}</span>
                  </div>
                  {assets.length > 1 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assets Transferred:</span>
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
