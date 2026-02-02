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
import {
  MoreVertical,
  ExternalLink,
  Share2,
  Flag,
  Send,
  GitBranch,
  Shield,
  Check,
} from "lucide-react";
import { LazyImage } from "@/components/ui/lazy-image";
import Link from "next/link";
import { TransferAssetDialog } from "@/components/transfer-asset-dialog";
import { ReportAssetDialog } from "@/components/report-asset-dialog";
import type { Asset } from "@/types/asset";
import { useAccount } from "@starknet-react/core";

interface NFTCardProps {
  asset: Asset;
  view?: "grid" | "list";
}

function formatAddress(address: string) {
  if (!address) return "Unknown";
  if (address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
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
                  <LazyImage
                    src={asset.image}
                    fallbackSrc="/placeholder.svg"
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
                      <Link href={`/creator/${asset.creator}`} className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline font-mono">
                        {formatAddress(asset.creator)}
                      </Link>

                      <Link
                        href={`/proof-of-ownership/${asset.id}`}
                        className="text-muted-foreground hover:text-blue-500 transition-colors"
                        title="View Proof of Ownership"
                      >
                        <Shield className="h-4 w-4" />
                      </Link>
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
              <LazyImage
                src={asset.image}
                fallbackSrc="/placeholder.svg"
                alt={asset.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
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
              <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                {asset.description || "No description provided."}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Creator</span>
                    <Link href={`/creator/${asset.creator}`} className="text-sm text-foreground truncate hover:text-primary transition-colors hover:underline font-mono">
                      {formatAddress(asset.creator)}
                    </Link>
                  </div>
                </div>
                <Link
                  href={`/proof-of-ownership/${asset.id}`}
                  className="text-blue-500 hover:text-blue-600 transition-colors bg-blue-500/10 p-1.5 rounded-full"
                  title="View Proof of Ownership"
                >
                  <Shield className="h-4 w-4" />
                </Link>
              </div>
            </div>


            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs text-muted-foreground bg-secondary/50 hover:bg-secondary/70 transition-colors">
                  {asset.type}
                </Badge>
              </div>
              {asset.licenseType && (
                <Badge variant="secondary" className="text-xs text-muted-foreground bg-secondary/50 hover:bg-secondary/70 transition-colors">
                  {asset.licenseType}
                </Badge>
              )}
            </div>


            <div className="flex gap-2 pt-2 border-t mt-3">
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
