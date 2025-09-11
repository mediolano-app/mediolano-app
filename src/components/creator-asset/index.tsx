"use client";

import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPTypeInfo } from "@/components/ip-type-info";
import { OverviewTab } from "@/components/asset/overview-tab";
import { LicenseTab } from "@/components/asset/license-tab";
import { OwnerTab } from "@/components/asset/owner-tab";
import { AssetTimelineTab } from "./creator-asset-timeline-tab";
import { useAsset } from "@/hooks/use-asset";
import { useGetAllCollections } from "@/hooks/use-collection";
import { AssetLoadingState } from "@/components/asset/asset-loading-state";
import { AssetErrorBoundary } from "@/components/asset/asset-error-boundary";
import { normalizeStarknetAddress } from "@/lib/utils";

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
  const [nftAddress, tokenIdStr] = decodedSlug.split("-");
  const router = useRouter();

  const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://sepolia.voyager.online";
  const tokenId = Number(tokenIdStr);

  const { displayAsset: asset, loading, loadingState, error, uiState, showSkeleton, notFound } = useAsset(
    nftAddress as `0x${string}`,
    Number.isFinite(tokenId) ? tokenId : undefined
  );
  const { collections } = useGetAllCollections();
  const matchedCollection = useMemo(() => {
    if (!collections || !nftAddress) return undefined;
    const target = String(nftAddress).toLowerCase();
    return collections.find(c => normalizeStarknetAddress(String(c.nftAddress || "")) === target);
  }, [collections, nftAddress]);


  return (
    <AssetErrorBoundary onRetry={reload}>
      <div className="min-h-screen bg-background/70 text-foreground pb-20">
        <main className="container mx-auto p-4 py-8 ">
          <Link href="/portfolio">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Portfolio
            </Button>
          </Link>

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
                  <div className="relative overflow-hidden rounded-xl border bg-muted/20 ">
                    <Image
                      src={(asset?.image as string) || "/background.jpg"}
                      alt={asset?.name as string}
                      width={600}
                      height={600}
                      className="w-full h-auto object-contain"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      priority
                    />
                    <div className="absolute top-3 left-3">
                      {(matchedCollection?.name || asset.collection) &&
                        <Badge className="bg-primary/90 text-primary-foreground">
                          {matchedCollection?.name ? `${matchedCollection.symbol ? ` (${matchedCollection.symbol})` : ''}` : asset.collection}
                        </Badge>
                      }
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {asset.tags && asset.tags.length > 0 && asset.tags.map((tag, index) => (
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
                      <h1 className="text-3xl font-bold text-clip">{asset?.name}</h1>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="overview" className="mt-8">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="license">License</TabsTrigger>
                    <TabsTrigger value="owner">Owner</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <OverviewTab asset={asset!} />
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-4">
                    <AssetTimelineTab tokenId={String(tokenId)} />
                  </TabsContent>

                  <TabsContent value="license" className="mt-6">
                    <LicenseTab asset={asset!} />
                  </TabsContent>

                  <TabsContent value="owner" className="mt-6">
                    <OwnerTab asset={asset!} />
                  </TabsContent>
                </Tabs>

                <div className="mt-6 flex flex-wrap gap-4">
                  <Button disabled variant="outline" className="flex-1">
                    Share
                  </Button>
                  <Link
                    className="flex-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${EXPLORER_URL}/nft/${nftAddress}/${tokenId}`}
                  >
                    <Button variant="outline" className="w-full">
                      View on Explorer
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </AssetErrorBoundary>
  );
}
