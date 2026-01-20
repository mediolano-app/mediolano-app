"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreVertical,
  ExternalLink,
  Share2,
  Flag,
  Send,
  CheckCircle,
  GitBranch,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TransferAssetDialog } from "@/components/transfer-asset-dialog";
import { ReportAssetDialog } from "@/components/report-asset-dialog";
import { RemixButton } from "@/components/remix/remix-button";
import type { Asset } from "@/types/asset";
import { useAccount } from "@starknet-react/core";

interface NFTCardProps {
  asset: Asset;
  view?: "grid" | "list";
}

function NFTCard({ asset, view = "grid" }: NFTCardProps) {
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { address } = useAccount();

  const handleShare = async () => {
    const url = `${window.location.origin}/asset/${asset.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: asset.name,
          text: asset.description,
          url: url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        // You could add a toast notification here
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  if (view === "list") {
    return (
      <>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex gap-4">
              {/* Asset Image */}
              <Link href={`/asset/${asset.id}`} className="flex-shrink-0">
                <div className="relative w-20 h-20 bg-gradient-to-br from-muted/50 to-muted rounded-lg overflow-hidden">
                  <Image
                    src={asset.image || "/placeholder.svg"}
                    alt={asset.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              </Link>

              {/* Asset Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <Link href={`/asset/${asset.id}`}>
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors truncate">
                        {asset.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={`/placeholder-40x40.png?text=${asset.creator.substring(0, 2)}`}
                          alt={asset.creator}
                        />
                        <AvatarFallback className="text-xs">
                          {asset.creator.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {asset.creator}
                      </span>
                      {asset.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {asset.description}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/asset/${asset.id}`}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/create/remix?asset=${asset.id}`}>
                          <GitBranch className="h-4 w-4 mr-2" />
                          Create Remix
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/proof-of-ownership/${asset.id}`}>
                          <Shield className="h-4 w-4 mr-2" />
                          Proof of Ownership
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsTransferOpen(true)}>
                        <Send className="h-4 w-4 mr-2" />
                        Transfer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setIsReportOpen(true)}>
                        <Flag className="h-4 w-4 mr-2" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {asset.type}
                    </Badge>
                    {asset.collection && (
                      <Badge variant="secondary" className="text-xs">
                        {asset.collection}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {asset.registrationDate}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <TransferAssetDialog
          assets={[{
            id: asset.id,
            name: asset.name,
            nftAddress: typeof asset.collection === 'string' ? asset.collection : "", // Assuming collection field holds address or name. Might need improvement.
            collectionName: typeof asset.collection === 'string' ? asset.collection : undefined
          }]}
          currentOwner={address || ""}
          isOpen={isTransferOpen}
          onClose={() => setIsTransferOpen(false)}
          onTransferComplete={() => setIsTransferOpen(false)}
        />

        <ReportAssetDialog
          contentId={asset.id}
          contentName={asset.name}
          contentCreator={asset.creator}
          contentType="asset"
          open={isReportOpen}
          onOpenChange={setIsReportOpen}
        />
      </>
    );
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200">
        <CardContent className="p-0">
          {/* Asset Image */}
          <Link href={`/asset/${asset.id}`}>
            <div className="relative aspect-square bg-gradient-to-br from-muted/50 to-muted overflow-hidden rounded-t-lg">
              <Image
                src={asset.image || "/placeholder.svg"}
                alt={asset.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-3 left-3">
                {/* 
                <Badge variant="secondary" className="bg-white/90 text-black">
                  {asset.type}
                </Badge>
                 */}
              </div>

            </div>
          </Link>

          {/* Asset Info */}
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <Link href={`/asset/${asset.id}`}>
                <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                  {asset.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={`/placeholder-40x40.png?text=${asset.creator.substring(0, 2)}`}
                    alt={asset.creator}
                  />
                  <AvatarFallback className="text-xs">
                    {asset.creator.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-sm text-muted-foreground truncate">
                    {asset.creator}
                  </span>
                  {asset.verified && (
                    <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {asset.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  {asset.type}
                </Badge>
                {asset.collection && (
                  <Badge variant="secondary" className="text-xs">
                    {asset.collection.substring(0, 6)}...
                    {asset.collection.substring(asset.collection.length - 3)}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {asset.registrationDate}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <Link href={`/asset/${asset.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  View
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/asset/${asset.id}`}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    {/* Using direct link as requested to replace previous RemixButton component behavior */}
                    <Link href={`/create/remix?asset=${asset.id}`}>
                      <GitBranch className="h-4 w-4 mr-2" />
                      Create Remix
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/proof-of-ownership/${asset.id}`}>
                      <Shield className="h-4 w-4 mr-2" />
                      Proof of Ownership
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>

                  {address && asset.owner && BigInt(address).toString() === BigInt(asset.owner).toString() && (
                    <DropdownMenuItem onClick={() => setIsTransferOpen(true)}>
                      <Send className="h-4 w-4 mr-2" />
                      Transfer
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsReportOpen(true)}>
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <TransferAssetDialog
        assets={[{
          id: asset.id,
          name: asset.name,
          nftAddress: typeof asset.collection === 'string' ? asset.collection : "",
          collectionName: typeof asset.collection === 'string' ? asset.collection : undefined
        }]}
        currentOwner={address || ""}
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onTransferComplete={() => setIsTransferOpen(false)}
      />

      <ReportAssetDialog
        contentId={asset.id}
        contentName={asset.name}
        contentCreator={asset.creator}
        contentType="asset"
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
      />
    </>
  );
}

export default NFTCard;
