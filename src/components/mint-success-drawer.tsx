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
import { CheckCircle2, Sparkles, ExternalLink, FolderOpen, Share2, Trophy, ArrowRight } from "lucide-react"
import type { IMintResult } from "@/hooks/use-create-asset"

interface MintSuccessDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  mintResult: IMintResult
  assetTitle: string
  assetDescription?: string
  assetType?: string
}

export function MintSuccessDrawer({
  isOpen,
  onOpenChange,
  mintResult,
  assetTitle,
  assetDescription,
  assetType,
}: MintSuccessDrawerProps) {
  const [showCelebration, setShowCelebration] = useState(false)

  // Trigger celebration animation when drawer opens
  useEffect(() => {
    if (isOpen) {
      setShowCelebration(true)
      // Auto-hide celebration after animation
      const timer = setTimeout(() => setShowCelebration(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] overflow-hidden">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="text-center pb-4 px-6">
            {/* Celebration Icon with Animation */}
            <div className="mx-auto mb-3 relative">
              <div
                className={`
                w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 
                rounded-full flex items-center justify-center shadow-lg
                transition-all duration-700 ease-out
                ${showCelebration ? "animate-bounce scale-110" : "scale-100"}
              `}
              >
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>

              {/* Sparkles Animation */}
              {showCelebration && (
                <>
                  <Sparkles
                    className={`
                    absolute -top-2 -right-2 h-5 w-5 text-yellow-400
                    animate-pulse transition-all duration-1000
                  `}
                  />
                  <Sparkles
                    className={`
                    absolute -bottom-1 -left-2 h-4 w-4 text-yellow-400
                    animate-pulse transition-all duration-1000 delay-300
                  `}
                  />
                  <Sparkles
                    className={`
                    absolute top-1 -left-3 h-3 w-3 text-yellow-400
                    animate-pulse transition-all duration-1000 delay-500
                  `}
                  />
                </>
              )}
            </div>

            <DrawerTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              🎉 Asset Minted Successfully!
            </DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground px-2">
              Your Programmable IP has been registered on the blockchain with immutable proof of ownership.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-6 pb-4 space-y-4 overflow-y-auto max-h-[50vh]">
            {/* Asset Details Card */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <h3 className="font-semibold text-base">Your New Asset</h3>
              </div>

              <div className="space-y-2">
                <div>
                  <h4 className="font-medium text-base text-foreground">{assetTitle}</h4>
                  {assetDescription && <p className="text-xs text-muted-foreground mt-1">{assetDescription}</p>}
                </div>

                <div className="flex flex-wrap gap-1">
                  {assetType && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                      {assetType}
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 text-xs">
                    Confirmed
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Blockchain Info */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Token ID:</span>
                  <span className="font-mono">#{mintResult.tokenId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Collection:</span>
                  <span className="font-mono text-xs">{mintResult.collectionId.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network:</span>
                  <span className="font-medium text-blue-600">Starknet</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-2">
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                <Link href={`/asset/${mintResult.assetSlug}`}>
                  <ExternalLink className="h-3 w-3 mr-2" />
                  View Your Asset
                </Link>
              </Button>

              <Button asChild variant="outline" size="sm">
                <Link href="/portfolio">
                  <FolderOpen className="h-3 w-3 mr-2" />
                  Go to Portfolio
                </Link>
              </Button>
            </div>

            {/* Additional Actions */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const url = `${window.location.origin}/asset/${mintResult.assetSlug}`
                  navigator.clipboard.writeText(url)
                }}
              >
                <Share2 className="h-3 w-3 mr-2" />
                Copy Asset Link
              </Button>
            </div>

            {/* Success Message */}
            <div className="text-center bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                🛡️ Your intellectual property is now protected under The Berne Convention in 181 countries
              </p>
            </div>
          </div>

          <DrawerFooter className="border-t pt-3 px-6">
            <DrawerClose asChild>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <ArrowRight className="h-3 w-3 mr-2" />
                Continue Creating
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
