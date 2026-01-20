"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, DollarSign, Zap, BarChart3, Share2, Download, Edit, ArrowRightLeft, Flag, ExternalLink, Sparkles } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ShareButton } from "@/components/share-button"
import { TransferAssetDialog } from "@/components/transfer-asset-dialog"
import { RemixAssetDialog } from "@/components/remix/remix-asset-dialog"
import { ReportAssetDialog } from "@/components/report-asset-dialog"
import { useAccount } from "@starknet-react/core"
import { NFTData } from "@/hooks/useNFTDetails"
import { Asset } from "@/types/asset"
import { EXPLORER_URL } from "@/services/constants"

interface ActionButtonsProps {
  nftData: NFTData
}

export function ActionButtons({ nftData }: ActionButtonsProps) {
  const { address } = useAccount()
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [isRemixOpen, setIsRemixOpen] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)

  const isOwner = address && nftData.owner && address.toLowerCase() === nftData.owner.toLowerCase()

  // Map NFTData to Asset for Remix
  const assetForRemix: Asset = {
    id: nftData.tokenId,
    name: nftData.title,
    creator: nftData.creator,
    owner: nftData.owner,
    image: nftData.imageUrl,
    description: nftData.description,
    type: "NFT", // Default or map from metadata
    licenseType: "Creative Commons", // Default
    collection: nftData.collection,
    metadata: {
      address: nftData.contractAddress
      // Add other metadata if needed
    }
  }

  // Map for Transfer
  const assetsForTransfer = [{
    id: nftData.tokenId,
    name: nftData.title,
    nftAddress: nftData.contractAddress,
    collectionName: nftData.collection
  }]

  const handleRemixCreated = (newAsset: Asset) => {
    // Optional: Refresh or redirect
    console.log("Remix created", newAsset)
  }

  const handleTransferComplete = (newOwner: string) => {
    // Optional: Refresh data
    console.log("Transfer complete to", newOwner)
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4 mb-6">

        {/* Remix Action - Gradient */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsRemixOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-2 sm:px-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-none"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline text-xs sm:text-sm font-semibold">Remix</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create a remix of this asset</p>
          </TooltipContent>
        </Tooltip>

        {/* Transfer Action - Gradient (Owner only) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsTransferOpen(true)}
              disabled={!isOwner}
              className={`w-full flex items-center justify-center gap-2 px-2 sm:px-4 ${isOwner ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-none' : ''}`}
              variant={isOwner ? "default" : "outline"}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-xs sm:text-sm font-semibold">Transfer</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isOwner ? "Transfer ownership" : "Only owner can transfer"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Share Action - using fixed ShareButton */}
        <div className="w-full">
          <ShareButton />
        </div>

        {/* Explorer Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => window.open(`${EXPLORER_URL}/contract/${nftData.contractAddress}`, "_blank")}
              className="w-full flex items-center justify-center gap-2 px-2 sm:px-4"
              variant="outline"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">Explorer</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View on Block Explorer</p>
          </TooltipContent>
        </Tooltip>

        {/* Report Action */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsReportOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-2 sm:px-4 text-destructive hover:text-destructive"
              variant="outline"
            >
              <Flag className="w-4 h-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">Report</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Report this asset</p>
          </TooltipContent>
        </Tooltip>

        {/* Placeholder for other actions to keep grid alignment if needed */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button disabled className="w-full flex items-center justify-center gap-2 px-2 sm:px-4" variant="outline">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">Download</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Coming Soon</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button disabled className="w-full flex items-center justify-center gap-2 px-2 sm:px-4" variant="outline">
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">Edit</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Coming Soon</p>
          </TooltipContent>
        </Tooltip>

      </div>

      {/* Dialogs */}
      <RemixAssetDialog
        open={isRemixOpen}
        onOpenChange={setIsRemixOpen}
        originalAsset={assetForRemix}
        onRemixCreated={handleRemixCreated}
      />

      <TransferAssetDialog
        assets={assetsForTransfer}
        currentOwner={nftData.owner}
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onTransferComplete={handleTransferComplete}
      />

      <ReportAssetDialog
        assetId={nftData.tokenId}
        collectionAddress={nftData.contractAddress}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

    </TooltipProvider>
  )
}
