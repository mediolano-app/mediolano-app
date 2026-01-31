"use client"

import { useState, useEffect } from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Sparkles, ExternalLink, FolderOpen, Share2, ArrowRight, Loader2, Library, Copy, Upload, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { IMintResult } from "@/hooks/use-create-asset"
import { EXPLORER_URL } from "@/lib/constants"
import { shortenAddress } from "@/lib/utils"
import Image from "next/image"

export type MintDrawerStep = "idle" | "uploading" | "processing" | "success"

interface MintSuccessDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  step: MintDrawerStep
  progress: number
  mintResult: IMintResult | null
  assetTitle: string
  assetDescription?: string
  assetType?: string
  error?: string | null
  // New props for Review Flow
  onConfirm?: () => void
  cost?: string
  previewImage?: string | null
  data?: Record<string, string> // Additional data to review (e.g., specific traits)
  basePath?: string
}

export function MintSuccessDrawer({
  isOpen,
  onOpenChange,
  step,
  progress,
  mintResult,
  assetTitle,
  assetDescription,
  assetType,
  error,
  onConfirm,
  cost = "0.001 STRK", // Default estimated cost
  previewImage,
  data,
  ...props
}: MintSuccessDrawerProps) {
  const [showCelebration, setShowCelebration] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Trigger celebration animation when valid success
  useEffect(() => {
    if (step === "success" && isOpen) {
      setShowCelebration(true)
      const timer = setTimeout(() => setShowCelebration(false), 3000)

      // Add a slight delay for confetti effect if we had one (using sparkles for now)
      setShowConfetti(true)
      const timer2 = setTimeout(() => setShowConfetti(false), 4000)

      return () => {
        clearTimeout(timer)
        clearTimeout(timer2)
      }
    } else {
      setShowCelebration(false)
      setShowConfetti(false)
    }
  }, [isOpen, step])

  // Prevent closing during active processing
  const handleOpenChange = (open: boolean) => {
    if (!open && (step === "uploading" || step === "processing") && !error) {
      return
    }
    onOpenChange(open)
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className="w-full max-w-lg mx-auto rounded-t-xl mobile-padding max-h-[90vh] bg-card">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-xl flex items-center justify-center gap-2">
            {step === "idle" && "Review Asset Details"}
            {step === "uploading" && (
              <>
                <Upload className="h-5 w-5 animate-pulse text-foreground" />
                Uploading Assets
              </>
            )}
            {step === "processing" && (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-foreground" />
                Minting Asset
              </>
            )}
            {step === "success" && (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Creation Successful
              </>
            )}
            {error && "Error Creating Asset"}
          </DrawerTitle>
          <DrawerDescription className="text-sm text-center mt-1">
            {step === "idle" && "Please review the details below before confirming the transaction."}
            {step === "uploading" && "Securely storing your metadata and assets on IPFS."}
            {step === "processing" && "Please confirm the transaction in your wallet."}
            {step === "success" && "Your intellectual property is now secured onchain."}
            {error && "There was a problem creating your asset."}
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 sm:p-6 pb-2 overflow-y-auto">
          {/* IDLE / REVIEW STATE */}
          {step === "idle" && (
            <div className="space-y-6">
              {/* Preview Card */}
              <div className="bg-muted/30 rounded-lg p-4 border space-y-4">
                <div className="flex gap-4">
                  {/* Image Preview */}
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-background border flex-shrink-0">
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                        <FolderOpen className="h-8 w-8 opacity-50" />
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate text-base">{assetTitle}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{assetDescription}</p>
                    {assetType && <Badge variant="secondary" className="mt-2 text-xs">{assetType}</Badge>}
                  </div>
                </div>

                {/* Additional Data Grid */}
                {data && Object.keys(data).length > 0 && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {Object.entries(data).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-muted-foreground text-xs uppercase tracking-wider">{key}</div>
                          <div className="font-medium truncate">{value}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Cost Estimation */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 px-4 flex justify-between items-center text-sm">
                <span className="text-blue-700 dark:text-blue-300">Estimated Cost</span>
                <span className="font-bold text-blue-700 dark:text-blue-300 font-mono">{cost}</span>
              </div>
            </div>
          )}

          {/* PROGRESS STATES */}
          {(step === "uploading" || step === "processing") && !error && (
            <div className="flex flex-col items-center justify-center space-y-8 py-4">
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm font-medium text-muted-foreground">
                  <span>
                    {step === "uploading" ? "Uploading to IPFS" : "Waiting for Confirmation"}
                  </span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-4 text-center">
                <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  {step === "uploading" ? <Upload className="h-6 w-6 text-foreground" /> : <Loader2 className="h-6 w-6 text-foreground" />}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                    {step === "uploading"
                      ? "Ensuring your metadata is decentralized and permanent."
                      : "Please check your wallet to sign the transaction."}
                  </p>
                </div>
              </div>

              <div className="text-center text-xs text-muted-foreground/70 bg-muted/50 py-2 px-4 rounded-full">
                <span className="animate-pulse">Do not close this window</span>
              </div>
            </div>
          )}

          {step === "success" && mintResult && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center relative py-4">
                {/* Asset Preview */}
                <div className="mx-auto relative mb-6">
                  {previewImage ? (
                    <div className="relative w-48 h-48 mx-auto rounded-xl overflow-hidden shadow-2xl shadow-green-900/10 border-4 border-background ring-1 ring-border/50">
                      <Image
                        src={previewImage}
                        alt="Minted Asset"
                        fill
                        className="object-cover"
                      />
                      {/* Success Badge Overlay */}
                      <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg animate-in zoom-in duration-500 delay-300">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                      <CheckCircle2 className="h-12 w-12 text-white" />
                    </div>
                  )}

                  {/* Sparkles */}
                  {showConfetti && (
                    <>
                      <Sparkles className="absolute top-0 right-1/4 h-6 w-6 text-yellow-400 animate-pulse" style={{ animationDelay: '0.1s' }} />
                      <Sparkles className="absolute bottom-0 left-1/4 h-4 w-4 text-yellow-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
                      <Sparkles className="absolute top-1/2 -left-2 h-3 w-3 text-green-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <Sparkles className="absolute top-1/2 -right-2 h-5 w-5 text-green-600 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    </>
                  )}
                </div>

                <h3 className="text-2xl font-bold mb-2">
                  {assetTitle}
                </h3>
                <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                  Successfully minted.
                </p>
              </div>

              {/* Asset Details Card */}
              <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                {/* Blockchain Info */}
                <div className="p-4 space-y-3 bg-muted/20">

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Transaction</span>
                    <a
                      href={`${EXPLORER_URL}/tx/${mintResult.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs hover:underline flex items-center text-foreground bg-primary/10 px-2 py-1 rounded hover:bg-primary/20 transition-colors"
                    >
                      {shortenAddress(mintResult.transactionHash)}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center animate-in zoom-in duration-300">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg text-foreground">Transaction Failed</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto bg-muted p-2 rounded border">
                  {error}
                </p>
              </div>
              <Button variant="outline" onClick={() => onConfirm?.()} className="mt-4">
                Retry Transaction
              </Button>
            </div>
          )}
        </div>

        <DrawerFooter className="flex-col sm:flex-row gap-3 px-4 sm:px-6 pb-8 pt-2">
          {step === "idle" && (
            <div className="flex w-full gap-3">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button className="flex-[2] btn-primary-gradient" onClick={onConfirm}>
                Confirm & Mint
              </Button>
            </div>
          )}

          {(step === "uploading" || step === "processing") && !error && (
            <Button variant="outline" className="w-full opacity-50 cursor-not-allowed" disabled>
              Processing...
            </Button>
          )}

          {step === "success" && mintResult && (
            <div className="flex w-full gap-3">
              <Button asChild size="default" variant="outline" className="flex-1">
                <Link href="/portfolio">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Portfolio
                </Link>
              </Button>

            </div>
          )}

          {error && (
            <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
