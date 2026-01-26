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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section Skeleton */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left: Image */}
        <div className="w-full lg:w-[450px] flex-shrink-0">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-muted/10">
            <Skeleton className="h-full w-full" />

            {/* Loading Overlay */}
            {(isInitializing || isFetchingOnchainData || isFetchingMetadata) && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center text-sm font-medium text-foreground bg-background/80 px-4 py-2 rounded-full border shadow-sm">
                  {currentStep || (isInitializing ? "Connecting..." : isFetchingOnchainData ? "Loading data..." : "Fetching metadata...")}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex-1 space-y-6 py-2">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" /> {/* Collection Badge */}
            <Skeleton className="h-12 w-3/4" /> {/* Title */}
            <Skeleton className="h-20 w-full" /> {/* Description */}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Skeleton className="h-11 w-32 rounded-md" />
            <Skeleton className="h-11 w-32 rounded-md" />
            <Skeleton className="h-11 w-32 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-4 rounded-xl border border-white/10 bg-muted/5 h-24 flex flex-col justify-center space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-8 space-y-6">
        <Skeleton className="h-10 w-full max-w-md rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AssetLoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-[450px] flex-shrink-0">
          <Skeleton className="aspect-square rounded-2xl w-full" />
        </div>
        <div className="flex-1 space-y-6 py-2">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Skeleton className="h-11 w-32 rounded-md" />
            <Skeleton className="h-11 w-32 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-4 rounded-xl border border-white/10 h-24 flex flex-col justify-center space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
      <div className="mt-8 space-y-6">
        <Skeleton className="h-10 w-full max-w-md rounded-lg" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}
