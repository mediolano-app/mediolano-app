"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRightLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "@starknet-react/core";
import { TransferAssetDialog, TransferableAsset } from "@/components/transfer-asset-dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPTypeInfo } from "@/components/ip-type-info";
import { OverviewTab } from "@/components/asset/overview-tab";
import { LicenseTab } from "@/components/asset/license-tab";
import { OwnerTab } from "@/components/asset/owner-tab";
import { AssetTimelineTab } from "./creator-asset-timeline-tab";
import { ReportAssetDialog } from "@/components/report-asset-dialog";
import { useAsset } from "@/hooks/use-asset";
import { useGetAllCollections } from "@/hooks/use-collection";
import { AssetLoadingState } from "@/components/asset/asset-loading-state";
import { AssetErrorBoundary } from "@/components/asset/asset-error-boundary";
import { normalizeStarknetAddress } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { isAssetReported } from "@/lib/reported-content"
import { AlertTriangle, ShieldCheck, History, Palette, Share2, ExternalLink } from "lucide-react"
import { SimpleProvenance } from "@/components/asset-provenance/simple-provenance";
import { useAssetProvenanceEvents } from "@/hooks/useEvents";

interface AssetPageProps {
  params: Promise<{
    slug: string;
  }>;
}


function reload(): void {
  if (typeof window !== 'undefined' && typeof window.location?.reload === 'function') {
    window.location.reload();
  }
}

const extractErrorMessage = (error: string): string => {
  if (error.toLowerCase().includes("invalid token id")) {
    return "This asset doesn't exist or has been removed."
  }

  if (error.includes("Contract error")) {
    return "Something went wrong with this asset. Please try again."
  }

  if (error.includes("Connection timeout") || error.includes("RPC:")) {
    return "Unable to connect to the network. Please check your connection and try again."
  }

  return "Something went wrong. Please try again."
}

export default function CreatorAssetPage({ params }: AssetPageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const decodedSlug = decodeURIComponent(slug || "").replace(/%2D/g, "-");
  const [nftAddress, tokenIdStr] = (decodedSlug || "").split("-");
  const router = useRouter();
  const { address } = useAccount();
  const { toast } = useToast();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [copied, setCopied] = useState(false)

  const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://sepolia.voyager.online";
  const tokenId = Number(tokenIdStr?.trim());

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: asset?.name || "Asset",
          text: `Check out ${asset?.name} on Mediolano`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        toast({
          title: "Link Copied",
          description: "Asset link copied to clipboard",
        })
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error("Failed to copy URL:", error)
        toast({
          title: "Error",
          description: "Failed to copy link",
          variant: "destructive",
        })
      }
    }
  }

  const { displayAsset: asset, loading, loadingState, error, uiState, showSkeleton, notFound } = useAsset(
    nftAddress as `0x${string}`,
    Number.isFinite(tokenId) ? tokenId : undefined
  );

  const { events: provenanceEventsData } = useAssetProvenanceEvents(nftAddress || "", tokenIdStr || "");

  const provenanceEvents = useMemo(() => {
    // The hook returns processed events, we just need to ensure they match the interface if needed or just pass them through
    // The hook in useEvents.ts returns objects compatible with SimpleProvenance
    return provenanceEventsData || [];
  }, [provenanceEventsData]);

  const enhancedAsset = useMemo(() => {
    if (!asset) return null;
    const rawAsset = asset as any; // Cast to access properties not in DisplayAsset
    return {
      id: asset.id,
      name: asset.name,
      type: asset.type || "Asset",
      creator: {
        name: rawAsset.collectionName || "Unknown Creator",
        address: rawAsset.properties?.creator as string || "Unknown",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      currentOwner: {
        name: asset.owner ? `${String(asset.owner).substring(0, 6)}...` : "Unknown",
        address: asset.owner ? String(asset.owner) : "0x0",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      creationDate: rawAsset.registrationDate || new Date().toISOString(),
      registrationDate: rawAsset.registrationDate || new Date().toISOString(),
      blockchain: "Starknet",
      contract: rawAsset.nftAddress,
      tokenId: asset.tokenId.toString(),
      image: asset.image || "/placeholder.svg",
      description: asset.description || "",
      fingerprint: asset.ipfsCid ? `ipfs://${asset.ipfsCid}` : `sha256:${Math.random().toString(16).substr(2, 64)}`,
    } as any;
  }, [asset]);

  // Helper to safely compare addresses
  const isOwner = useMemo(() => {
    if (!address || !asset?.owner?.address) return false;
    const addr1 = String(address).toLowerCase();
    const addr2 = String(asset.owner.address).toLowerCase();
    if (addr1 === addr2) return true;
    try {
      return normalizeStarknetAddress(addr1) === normalizeStarknetAddress(addr2);
    } catch (e) {
      return false;
    }
  }, [address, asset?.owner?.address]);
  const { collections } = useGetAllCollections();
  const matchedCollection = useMemo(() => {
    if (!collections || !nftAddress) return undefined;
    const target = String(nftAddress).toLowerCase();
    return collections.find(c => normalizeStarknetAddress(String(c.nftAddress || "")) === target);
  }, [collections, nftAddress]);


  return (
    <AssetErrorBoundary onRetry={reload}>
      <div className="min-h-screen text-foreground">
        <main className="container mx-auto p-8 ">
          {showSkeleton || uiState === 'loading' ? (
            <AssetLoadingState loadingState={loadingState} error={error} onRetry={reload} />
          ) : uiState === 'not_found' || notFound ? (
            <div className="w-full flex flex-col items-center justify-center p-12 space-y-4">
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold">This asset doesn&apos;t exist or has been removed.</div>
              </div>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Go Back
              </button>
            </div>
          ) : uiState === 'error' || error ? (
            (() => {
              const errorMessage = typeof error === 'string' ? error :
                (typeof error === 'object' && error !== null && 'message' in error)
                  ? String((error as { message: unknown }).message)
                  : 'Unknown error occurred'
              const extractedMessage = extractErrorMessage(errorMessage)
              return (
                <div className="w-full flex flex-col items-center justify-center p-12 space-y-4">
                  <div className="text-center space-y-2">
                    <div className="text-lg font-semibold">{extractedMessage}</div>
                  </div>
                  <button
                    onClick={reload}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )
            })()
          ) : !asset && !loading ? (
            <div className="w-full flex items-center justify-center p-12">No asset found</div>
          ) : asset ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
              {/* Left column - Image */}
              <div className="lg:col-span-3">
                <div className="top-24">
                  <div className="relative overflow-hidden glass-card">
                    <Image
                      src={(asset?.image as string) || "/background.jpg"}
                      alt={asset?.name as string}
                      width={0}
                      height={0}
                      className="w-full h-auto object-contain"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      style={{ width: '100%', height: 'auto' }}
                      priority
                    />
                    <div className="absolute top-3 left-3">
                      {(matchedCollection?.name || asset.collection) &&
                        <Badge className="bg-primary/10 text-xs text-primary-foreground">
                          {matchedCollection?.name ? `${matchedCollection.symbol ? ` ${matchedCollection.symbol}` : ''}` : asset.collection}
                        </Badge>
                      }
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {asset.tags && asset.tags.length > 0 && asset.tags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-background capitalize"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <IPTypeInfo
                    asset={{ ...asset, ipfsCid: asset.ipfsCid, contractAddress: nftAddress || undefined }}
                  />
                </div>
              </div>

              {/* Right column - Content */}
              <div className="lg:col-span-3">
                <div className="mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-clip mb-2">{asset?.name}</h1>
                      <p className="text-muted-foreground">{asset?.description}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8 flex flex-wrap gap-2">
                  {isOwner && (
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-700/20 hover:to-indigo-700/20 text-blue-600 hover:text-blue-700 border-blue-600/20 hover:border-blue-700/20 shadow-sm transition-all hover:shadow-md"
                      onClick={() => setIsTransferOpen(true)}
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                      Transfer
                    </Button>
                  )}

                  <Link href={`/create/remix/${decodedSlug}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full gap-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 hover:from-purple-700/20 hover:to-pink-700/20 text-purple-600 hover:text-purple-700 border-purple-600/20 hover:border-purple-700/20 shadow-sm transition-all hover:shadow-md"
                    >
                      <Palette className="h-4 w-4" />
                      Remix
                    </Button>
                  </Link>

                  <Link href={`/proof-of-ownership/${decodedSlug}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border-emerald-500/20 hover:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 transition-all"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Ownership
                    </Button>
                  </Link>

                  <Link href={`/provenance/${decodedSlug}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border-amber-500/20 hover:border-amber-500/30 text-amber-700 dark:text-amber-400 transition-all"
                    >
                      <History className="h-4 w-4" />
                      Provenance
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full gap-2 bg-gradient-to-r from-gray-100/10 to-gray-200/10 dark:from-gray-800/10 dark:to-gray-900/10 border-gray-200/20 dark:border-gray-700/20 hover:border-gray-300/20 dark:hover:border-gray-600/20 transition-all"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                    {copied ? "Copied!" : "Share"}
                  </Button>
                </div>



                {asset && isAssetReported(asset.id) && (
                  <Alert variant="destructive" className="mb-6 border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive/50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Reported Content</AlertTitle>
                    <AlertDescription>
                      This asset has been flagged by the Mediolano Community. Proceed with caution.
                    </AlertDescription>
                  </Alert>
                )}

                <Tabs defaultValue="overview" className="mt-8 glass p-2">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="provenance">Provenance</TabsTrigger>
                    <TabsTrigger value="license">License</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6 bg-card/30">
                    <OverviewTab asset={{
                      ...asset!,
                      collection: matchedCollection?.name
                        ? `${matchedCollection.name}${matchedCollection.symbol ? ` (${matchedCollection.symbol})` : ''}`
                        : asset!.collection,
                      contract: asset!.contract || nftAddress
                    }} />
                  </TabsContent>

                  <TabsContent value="provenance" className="space-y-4 bg-card/30">
                    {enhancedAsset && (
                      <SimpleProvenance
                        events={provenanceEvents}
                        compact={true}
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="license" className="mt-6 space-y-8 bg-card/30">
                    <LicenseTab asset={asset!} />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Ownership</h3>
                      <OwnerTab asset={asset!} />
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            Remix this Asset
                            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200">Creative</Badge>
                          </h3>
                          <p className="text-sm text-muted-foreground max-w-md">
                            Create a derivative work based on this asset's license terms.
                          </p>
                        </div>
                        <Link href={`/create/remix/${decodedSlug}`}>
                          <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-none shadow-md">
                            <Palette className="h-4 w-4" />
                            Start Remix
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-3 mb-8 mt-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-9 text-xs border border-destructive/50 hover:bg-destructive/70"
                    onClick={() => setIsReportOpen(true)}
                  >
                    <AlertTriangle className="h-3 w-3 mr-2" />
                    Report Asset
                  </Button>
                  <Link
                    className="flex-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${EXPLORER_URL}/nft/${nftAddress}/${tokenId}`}
                  >
                    <Button variant="ghost" size="sm" className="w-full h-9 text-xs border border-input hover:bg-accent hover:text-accent-foreground">
                      View on Explorer <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </div>

                {/* Actions moved to top */}
              </div>
            </div>
          ) : null}
        </main>

        <ReportAssetDialog
          contentId={nftAddress || ""}
          contentName={asset?.name || ""}
          contentType="asset"
          open={isReportOpen}
          onOpenChange={setIsReportOpen}
        />

        {asset && (
          <TransferAssetDialog
            assets={[{
              id: String(tokenId),
              name: asset.name,
              nftAddress: nftAddress as string
            }]}
            currentOwner={asset.owner.address}
            isOpen={isTransferOpen}
            onClose={() => setIsTransferOpen(false)}
            onTransferComplete={(newOwner) => {
              setIsTransferOpen(false);
              toast({
                title: "Transfer Complete",
                description: `Asset transferred to ${newOwner.slice(0, 6)}...${newOwner.slice(-4)}`,
              });
              reload();
            }}
          />
        )}
      </div>
    </AssetErrorBoundary>
  );
}
