"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AssetRetryMechanismProps {
  onRetry: () => void;
  error?: string | null;
  maxRetries?: number;
  retryDelay?: number;
  className?: string;
}

export function AssetRetryMechanism({
  onRetry,
  error,
  maxRetries = 3,
  retryDelay = 2000,
  className = "",
}: AssetRetryMechanismProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryHistory, setRetryHistory] = useState<Array<{ timestamp: number; success: boolean }>>([]);

  const handleRetry = async () => {
    if (retryCount >= maxRetries) {
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Add retry attempt to history
    setRetryHistory(prev => [...prev, { timestamp: Date.now(), success: false }]);

    try {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      await onRetry();
      
      // Mark as successful if no error occurs
      setRetryHistory(prev => 
        prev.map((item, index) => 
          index === prev.length - 1 ? { ...item, success: true } : item
        )
      );
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setIsRetrying(false);
    }
  };

  const canRetry = retryCount < maxRetries;
  const lastRetry = retryHistory[retryHistory.length - 1];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Loading issue</span>
          {retryCount > 0 && (
            <Badge variant="outline" className="text-xs">
              Attempt {retryCount} of {maxRetries}
            </Badge>
          )}
        </div>
        
        {lastRetry?.success && (
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs">Retry successful</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {error || "We couldn't load this asset. Please check your connection and try again."}
        </p>
        
        {retryHistory.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Last attempt: {new Date(lastRetry.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleRetry}
          disabled={!canRetry || isRetrying}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          {isRetrying ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              {canRetry ? "Retry" : "Max retries reached"}
            </>
          )}
        </Button>
        
        <Button
          onClick={() => window.location.reload()}
          variant="default"
          size="sm"
          className="flex-1"
        >
          Reload Page
        </Button>
      </div>

    </div>
  );
}

interface NetworkStatusIndicatorProps {
  isOnline: boolean;
  rpcStatus?: 'connected' | 'disconnected' | 'unknown';
  className?: string;
}

export function NetworkStatusIndicator({ 
  isOnline, 
  rpcStatus = 'unknown', 
  className = "" 
}: NetworkStatusIndicatorProps) {
  const getStatusColor = () => {
    if (!isOnline) return "text-destructive";
    if (rpcStatus === 'connected') return "text-green-600";
    if (rpcStatus === 'disconnected') return "text-destructive";
    return "text-yellow-600";
  };

  // Deterministic mapping for background classes with a safe fallback
  const getStatusBgClass = () => {
    if (!isOnline) return "bg-destructive";
    if (rpcStatus === 'connected') return "bg-green-600";
    if (rpcStatus === 'disconnected') return "bg-destructive";
    return "bg-yellow-600";
  };

  const getStatusText = () => {
    if (!isOnline) return "Offline";
    if (rpcStatus === 'connected') return "Connected";
    if (rpcStatus === 'disconnected') return "RPC Disconnected";
    return "Checking...";
  };

  return (
    <div className={`flex items-center space-x-2 text-xs ${className}`}>
      <div className={`h-2 w-2 rounded-full ${getStatusBgClass()}`} />
      <span className={getStatusColor()}>{getStatusText()}</span>
    </div>
  );
}
