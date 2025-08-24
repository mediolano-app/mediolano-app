"use client";

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Wifi, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NetworkErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

interface NetworkErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

export class NetworkErrorBoundary extends Component<NetworkErrorBoundaryProps, NetworkErrorBoundaryState> {
  constructor(props: NetworkErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): NetworkErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console
    console.error('Network Error Boundary caught an error:', error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  isNetworkError(error: Error): boolean {
    const networkErrorPatterns = [
      /network/i,
      /rpc/i,
      /connection/i,
      /timeout/i,
      /contract.*not.*configured/i,
      /contract.*not.*deployed/i,
      /chain.*not.*supported/i
    ];

    return networkErrorPatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.name)
    );
  }

  getErrorType(error: Error): 'network' | 'contract' | 'generic' {
    if (this.isNetworkError(error)) {
      return 'network';
    }
    if (error.message.includes('contract')) {
      return 'contract';
    }
    return 'generic';
  }

  renderNetworkError() {
    const { error } = this.state;
    if (!error) return null;

    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <Wifi className="h-5 w-5" />
            Network Connection Error
          </CardTitle>
          <CardDescription className="text-red-700 dark:text-red-300">
            Unable to connect to the Starknet network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Failed</AlertTitle>
            <AlertDescription>
              {error.message}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
              Troubleshooting Steps
            </h4>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
              <li>Check your internet connection</li>
              <li>Try switching to a different network (Sepolia/Mainnet)</li>
              <li>Refresh the page and try again</li>
              <li>Check if the RPC endpoint is accessible</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={this.handleRetry} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Connection
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  renderContractError() {
    const { error } = this.state;
    if (!error) return null;

    return (
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <AlertTriangle className="h-5 w-5" />
            Contract Configuration Error
          </CardTitle>
          <CardDescription className="text-yellow-700 dark:text-yellow-300">
            Smart contract is not properly configured for this network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Configuration Issue</AlertTitle>
            <AlertDescription>
              {error.message}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Possible Solutions
            </h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
              <li>Switch to Sepolia testnet for testing</li>
              <li>Wait for mainnet contracts to be deployed</li>
              <li>Check environment configuration</li>
              <li>Contact support if the issue persists</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={this.handleRetry} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://docs.starknet.io/', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  renderGenericError() {
    const { error } = this.state;
    if (!error) return null;

    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertTriangle className="h-5 w-5" />
            Application Error
          </CardTitle>
          <CardDescription className="text-red-700 dark:text-red-300">
            Something went wrong with the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription>
              {error.message}
            </AlertDescription>
          </Alert>

          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs text-red-600 dark:text-red-400">
              <summary className="cursor-pointer font-medium">
                Stack Trace (Development)
              </summary>
              <pre className="mt-2 whitespace-pre-wrap">
                {error.stack}
              </pre>
            </details>
          )}

          <div className="flex gap-2">
            <Button onClick={this.handleRetry} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error } = this.state;
      if (!error) return null;

      const errorType = this.getErrorType(error);

      switch (errorType) {
        case 'network':
          return this.renderNetworkError();
        case 'contract':
          return this.renderContractError();
        default:
          return this.renderGenericError();
      }
    }

    return this.props.children;
  }
}
