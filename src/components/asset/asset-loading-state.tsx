"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { LoadingState } from "@/hooks/use-asset";

interface AssetLoadingStateProps {
  loadingState: LoadingState;
  error?: string | null;
  onRetry?: () => void;
}

export function AssetLoadingState({ loadingState, error }: AssetLoadingStateProps) {
  const { isInitializing, isFetchingOnchainData, isFetchingMetadata, currentStep } = loadingState;

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <div className="text-center space-y-2">
          <div className="text-lg font-semibold">Unable to load asset</div>
          <div className="text-sm text-muted-foreground max-w-md">
            {error?.includes("Connection timeout") 
              ? "Please check your internet connection and try again."
              : error?.includes("Unable to load asset details")
              ? "Asset loaded with limited information."
              : "Something went wrong. Please try again."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
      {/* Left column - Image skeleton with loading indicator */}
      <div className="lg:col-span-3 space-y-4">
        <div className="relative overflow-hidden rounded-xl border bg-muted/20 p-4">
          <Skeleton className="h-[360px] w-full" />
          {(isInitializing || isFetchingOnchainData || isFetchingMetadata) && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <div className="text-center text-sm text-muted-foreground">
                {currentStep || (isInitializing ? "Establishing connection..." : isFetchingOnchainData ? "Fetching onchain data..." : "Fetching metadata...")}
              </div>
            </div>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          {currentStep || (isInitializing ? "Establishing connection..." : isFetchingOnchainData ? "Fetching onchain data..." : isFetchingMetadata ? "Fetching metadata..." : "Preparing your asset…")}
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>

      {/* Right column - Content skeleton */}
      <div className="lg:col-span-3 space-y-4">
        <Skeleton className="h-8 w-64" />
        
        {/* Loading state for different sections */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-18" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </div>

        {/* Tab skeleton */}
        <div className="space-y-4">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
}

export function AssetLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
      <div className="lg:col-span-3 space-y-4">
        <div className="relative overflow-hidden rounded-xl border bg-muted/20 p-4">
          <Skeleton className="h-[360px] w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
      <div className="lg:col-span-3 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
