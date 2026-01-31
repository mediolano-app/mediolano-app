"use client";

import { use, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Added missing import
import { ArrowLeft, ArrowRightLeft } from "lucide-react";
import Image from "next/image";
import { LazyImage } from "@/components/ui/lazy-image";
import Link from "next/link";
import { useAccount } from "@starknet-react/core";
import { TransferAssetDialog, TransferableAsset } from "@/components/transfer-asset-dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPTypeInfo } from "@/components/ip-type-info";
import { Collection } from "@/lib/types";
import { OverviewTab } from "@/components/asset/overview-tab";
import { LicenseTab } from "@/components/asset/license-tab";
import { OwnerTab } from "@/components/asset/owner-tab";
import { AssetTimelineTab } from "./creator-asset-timeline-tab";
import { ReportAssetDialog } from "@/components/report-asset-dialog";
import { useAsset } from "@/hooks/use-asset";
import { useGetCollection } from "@/hooks/use-collection";
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
  const [imageRatio, setImageRatio] = useState<number | null>(null)

  const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://voyager.online";
  const tokenId = Number(tokenIdStr?.trim());

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: asset?.name || "Asset",
          text: `Check out ${asset?.name} on IP Creator`,
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
      type: asset.type || "IP",
      creator: {
        name: rawAsset.collectionName || "Unknown",
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
  /* 
   * Optimization: Fetch only the specific collection instead of scanning all.
   * We get the collectionId (number/string) from the asset hook now.
   */
  const { fetchCollection } = useGetCollection();
  const [matchedCollection, setMatchedCollection] = useState<Collection | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    if (asset?.collectionId) {
      fetchCollection(asset.collectionId)
        .then(col => {
          if (mounted) setMatchedCollection(col);
        })
        .catch(err => {
          console.warn("Failed to fetch collection details:", err);
        });
    } else {
      setMatchedCollection(undefined);
    }
    return () => { mounted = false; };
  }, [asset?.collectionId, fetchCollection]);


  return (
    <AssetErrorBoundary onRetry={reload}>
      <div className="min-h-screen text-foreground bg-background">

        {/* Loading / Error States - Keep existing logic if possible, or wrap them */}
        {showSkeleton || uiState === 'loading' ? (
          <div className="container mx-auto p-8 pt-24">
            <AssetLoadingState loadingState={loadingState} error={error} onRetry={reload} />
          </div>
        ) : uiState === 'not_found' || notFound ? (
          <div className="w-full flex flex-col items-center justify-center p-12 space-y-4 pt-32">
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
          <div className="w-full flex flex-col items-center justify-center p-12 space-y-4 pt-32">
            <div className="text-center space-y-2">
              <div className="text-lg font-semibold">{extractErrorMessage(typeof error === 'string' ? error : (error as any)?.message || 'Error content')}</div>
            </div>
            <button
              onClick={reload}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : !asset && !loading ? (
          <div className="w-full flex items-center justify-center p-12 pt-32">No asset found</div>
        ) : asset ? (
          <>
            {/*  Header */}
            <div className="relative overflow-hidden -mt-[88px] pt-[120px] lg:pt-[150px] pb-12 lg:pb-24 min-h-[450px] lg:min-h-[600px] flex flex-col justify-center">
              {/* Background with gradient and blur */}
              <div className="absolute inset-0">
                {/* Base gradient - Vivid */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-purple-500/20 to-secondary/40 mix-blend-overlay" />

                {/* Asset Image Background */}
                <LazyImage
                  src={asset?.image || "/placeholder.svg"}
                  fallbackSrc="/background.jpg"
                  alt="Background"
                  fill
                  className="object-cover opacity-60 blur-2xl scale-110"
                  priority
                />

                {/*  overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-background/90 backdrop-blur-[2px]" />
              </div>

              <div className="relative z-10 container mx-auto px-4 max-w-7xl">
                {asset && isAssetReported(asset.id) && (
                  <Alert variant="destructive" className="mb-6 lg:mb-8 border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive/50 backdrop-blur-md">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Reported Content</AlertTitle>
                    <AlertDescription>
                      This asset has been flagged by the Mediolano Community. Proceed with caution.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16">
                  {/* Asset Image - Large Glass Card */}
                  <div className="flex-shrink-0 relative group w-full max-w-[320px] lg:max-w-[400px] mx-auto lg:mx-0">
                    <div className="absolute -inset-1 rounded-2xl" />
                    <div
                      className="relative w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ease-in-out border border-white/10 bg-black/20 backdrop-blur-sm"
                      style={{ aspectRatio: imageRatio || "1/1" }}
                    >
                      <LazyImage
                        src={asset?.image || "/placeholder.svg"}
                        fallbackSrc="/background.jpg"
                        alt={asset?.name || "IP Asset"}
                        fill
                        className="object-cover"
                        priority
                        onLoad={(e) => {
                          const img = e.currentTarget;
                          if (img.naturalWidth && img.naturalHeight) {
                            setImageRatio(img.naturalWidth / img.naturalHeight);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Asset Info */}
                  <div className="flex-1 text-white text-center lg:text-left flex flex-col justify-center h-full pt-4">
                    <div className="flex flex-col gap-6">
                      <div>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                          {(matchedCollection?.name || asset.collection) && (
                            <Badge className="bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-md px-3 py-1 text-sm h-7">
                              {matchedCollection?.name ? `${matchedCollection.name}${matchedCollection.symbol ? ` (${matchedCollection.symbol})` : ''}` : asset.collection}
                            </Badge>
                          )}
                          {asset.type && (
                            <Badge variant="outline" className="border-white/30 text-white/90 bg-white/5 backdrop-blur-sm h-7">
                              {asset.type}
                            </Badge>
                          )}
                        </div>

                        <h1 className="text-4xl font-bold drop-shadow-xl tracking-tight leading-tight mb-4 lg:mb-6 break-words text-foreground">{asset.name}</h1>

                        {asset.tags && asset.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                            {asset.tags.map((tag: string, index: number) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-black/30 text-foreground hover:bg-black/40 border-transparent capitalize backdrop-blur-sm"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <p className="text-foreground/90 max-w-2xl leading-relaxed drop-shadow-md font-medium px-4 lg:px-0 mx-auto lg:mx-0 break-words break-all">
                          {asset.description}
                        </p>
                      </div>

                      {/* Action Buttons Panel */}
                      {/* Action Buttons Panel - Optimized for Mobile */}
                      <div className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-2 mt-2 lg:mt-4 w-full px-1">
                        {isOwner && (
                          <Button
                            variant="outline"
                            size="lg"
                            className="flex-1 sm:flex-none glass text-foreground transition-all gap-1.5 min-w-[90px] h-10 lg:h-11 text-xs lg:text-base px-3"
                            onClick={() => setIsTransferOpen(true)}
                          >
                            <ArrowRightLeft className="h-3.5 w-3.5 lg:h-5 lg:w-5" />
                            Transfer
                          </Button>
                        )}

                        <Link href={`/create/remix/${decodedSlug}`} className="flex-1 sm:flex-none">
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-full glass transition-all gap-1.5 min-w-[90px] h-10 lg:h-11 text-xs lg:text-base text-foreground px-3"
                          >
                            <Palette className="h-3.5 w-3.5 lg:h-5 lg:w-5" />
                            Remix
                          </Button>
                        </Link>

                        <Link href={`/provenance/${decodedSlug}`} className="flex-1 sm:flex-none">
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-full glass transition-all gap-1.5 min-w-[90px] h-10 lg:h-11 text-xs lg:text-base text-foreground px-3"
                          >
                            <History className="h-3.5 w-3.5 lg:h-5 lg:w-5" />
                            Provenance
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 glass rounded-full text-foreground"
                          onClick={handleShare}
                        >
                          <Share2 className="h-5 w-5" />
                        </Button>

                        <div className="flex gap-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 glass rounded-full text-foreground"
                            onClick={() => setIsReportOpen(true)}
                            title="Report Asset"
                          >
                            <AlertTriangle className="h-5 w-5" />
                          </Button>

                          <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`${EXPLORER_URL}/nft/${nftAddress}/${tokenId}`}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 glass rounded-full text-foreground"
                              title="View on Explorer"
                            >
                              <ExternalLink className="h-5 w-5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area - Tabs */}
            <div className="container mx-auto px-4 pt-8 pb-16 max-w-7xl relative z-20">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Tabs & Details (Spans 2 cols) */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-12 mb-12 relative z-30">
                    <div className="glass-card p-4 rounded-xl bg-background/50 backdrop-blur-md border border-border/50">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Blockchain</p>
                      <p className="font-bold flex items-center gap-2">Starknet</p>
                    </div>
                    <div className="glass-card p-4 rounded-xl bg-background/50 backdrop-blur-md border border-border/50">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Standard</p>
                      <p className="font-bold">ERC-721</p>
                    </div>
                    <div className="glass-card p-4 rounded-xl bg-background/50 backdrop-blur-md border border-border/50">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">IP Type</p>
                      <p className="font-bold truncate" title={asset?.type}>{asset?.type || "Generic"}</p>
                    </div>
                    <div className="glass-card p-4 rounded-xl bg-background/50 backdrop-blur-md border border-border/50">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                      <Badge variant="secondary" className="text-foreground">Onchain</Badge>
                    </div>
                  </div>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50 rounded-xl">
                      <TabsTrigger value="overview" className="py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
                      <TabsTrigger value="provenance" className="py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Provenance</TabsTrigger>
                      <TabsTrigger value="license" className="py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">License</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6 space-y-6">
                      <Card className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
                        <div className="p-6">
                          <OverviewTab asset={{
                            ...asset!,
                            collection: matchedCollection?.name
                              ? `${matchedCollection.name}${matchedCollection.symbol ? ` (${matchedCollection.symbol})` : ''}`
                              : asset!.collection,
                            contract: asset!.contract || nftAddress
                          }} />
                        </div>
                      </Card>
                      <div className="mt-6">
                        <IPTypeInfo
                          asset={{ ...asset, ipfsCid: asset.ipfsCid, contractAddress: nftAddress || undefined }}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="provenance" className="mt-6">
                      <Card className="border-border/50 bg-background/50 backdrop-blur-sm p-6 min-h-[400px]">
                        {enhancedAsset ? (
                          <SimpleProvenance
                            events={provenanceEvents}
                            compact={true}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-48 text-muted-foreground">
                            No provenance data available
                          </div>
                        )}
                      </Card>
                    </TabsContent>

                    <TabsContent value="license" className="mt-6 space-y-8">
                      <Card className="border-border/50 bg-background/50 backdrop-blur-sm p-6">
                        <LicenseTab asset={asset!} />
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Right Column: Ownership & CTA (Spans 1 col) */}
                <div className="space-y-6 lg:pt-4">
                  <div className="sticky top-24 space-y-6">
                    <Card className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
                      <div className="p-5 border-b border-border/50 bg-muted/20">
                        <h3 className="font-semibold flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          Ownership
                        </h3>
                      </div>
                      <div className="p-5">
                        <OwnerTab asset={asset!} />
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <Link href={`/proof-of-ownership/${decodedSlug}`}>
                            <Button
                              variant="outline"
                              className="w-full justify-between group border-2 border-transparent bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 relative before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r before:from-purple-500 before:to-blue-500 before:content-[''] before:rounded-md before:-z-10 before:mask-linear-gradient"
                              style={{ backgroundClip: 'padding-box, border-box', backgroundOrigin: 'border-box' }}
                            >
                              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 font-semibold">View Proof of Ownership</span>
                              <ArrowRightLeft className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity -rotate-45 text-purple-600 dark:text-purple-400" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>

                    <div className="bg-gradient-to-br from-purple-600/5 to-blue-600/5 p-1 rounded-2xl border border-purple-500/20">
                      <div className="bg-background/80 backdrop-blur-xl rounded-xl p-5">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 mb-2">
                              Remix this IP
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Create a derivative work based on this asset&apos;s license terms and earn royalties.
                            </p>
                          </div>
                          <Link href={`/create/remix/${decodedSlug}`} className="block">
                            <Button size="lg" className="w-full gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/20">
                              <Palette className="h-4 w-4" />
                              Start Remixing
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

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
