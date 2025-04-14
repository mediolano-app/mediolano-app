"use client"

import { useState } from "react"
import { Copy, CheckCircle2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Asset } from "@/lib/types"

interface BlockchainVerificationProps {
  asset: Asset
}

export default function BlockchainVerification({ asset }: BlockchainVerificationProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium">Transaction Hash</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(asset.transactionHash, "txHash")}
                    >
                      {copied === "txHash" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied === "txHash" ? "Copied!" : "Copy to clipboard"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="p-2 bg-muted rounded font-mono text-xs break-all">{asset.transactionHash}</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium">Block Number</h3>
              <span className="text-xs text-muted-foreground">Starknet</span>
            </div>
            <div className="p-2 bg-muted rounded font-mono text-xs">{asset.blockNumber}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium">Verification Hash</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(asset.verificationHash, "verHash")}
                    >
                      {copied === "verHash" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied === "verHash" ? "Copied!" : "Copy to clipboard"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="p-2 bg-muted rounded font-mono text-xs break-all">{asset.verificationHash}</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium">Smart Contract</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(asset.smartContract, "contract")}
                    >
                      {copied === "contract" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied === "contract" ? "Copied!" : "Copy to clipboard"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="p-2 bg-muted rounded font-mono text-xs break-all">{asset.smartContract}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button variant="outline" size="sm" className="flex-1">
          <ExternalLink className="mr-2 h-4 w-4" /> View on Starknet Explorer
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <ExternalLink className="mr-2 h-4 w-4" /> View on Ethereum
        </Button>
      </div>
    </div>
  )
}
