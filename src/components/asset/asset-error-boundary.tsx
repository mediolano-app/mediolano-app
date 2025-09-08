"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssetErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

interface AssetErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onRetry?: () => void;
  maxRetries?: number;
}

export class AssetErrorBoundary extends React.Component<
  AssetErrorBoundaryProps,
  AssetErrorBoundaryState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: AssetErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): AssetErrorBoundaryState {
    return {
      hasError: true,
      error,
      retryCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Asset Error Boundary caught an error:", error, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    const { onRetry, maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      console.warn("Maximum retry attempts reached");
      return;
    }

    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      retryCount: prevState.retryCount + 1,
    }));

    // Call the onRetry callback if provided
    if (onRetry) {
      onRetry();
    }
  };

  render() {
    const { hasError, error, retryCount } = this.state;
    const { children, fallback: Fallback, maxRetries = 3 } = this.props;

    if (hasError) {
      if (Fallback && error) {
        return <Fallback error={error} retry={this.handleRetry} />;
      }

      return (
        <div className="w-full flex flex-col items-center justify-center p-12 space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <div className="text-center space-y-2">
              <div className="text-lg font-semibold">
                Oops! Something went wrong
              </div>
              <div className="text-sm text-muted-foreground max-w-md">
                We couldn&apos;t load this asset. Please try again.
              </div>
            {retryCount > 0 && (
              <div className="text-xs text-muted-foreground">
                Retry attempt {retryCount} of {maxRetries}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={this.handleRetry}
              disabled={retryCount >= maxRetries}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {retryCount >= maxRetries ? "Max retries reached" : "Try Again"}
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="default"
              size="sm"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return children;
  }
}

// Default fallback component
export function DefaultAssetErrorFallback({ error: _, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 space-y-4">
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <div className="text-center space-y-2">
          <div className="text-lg font-semibold">
            Unable to load asset
          </div>
          <div className="text-sm text-muted-foreground max-w-md">
            Please try again or refresh the page.
          </div>
        </div>
      <Button onClick={retry} variant="outline">
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
