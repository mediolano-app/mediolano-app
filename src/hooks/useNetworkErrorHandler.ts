"use client";

import { useCallback, useState } from 'react';
import { useToast } from './use-toast';
import { useNetworkConfig } from './useNetworkConfig';
import { useNetwork } from '@/components/starknet-provider';

export interface NetworkError {
  code: string;
  message: string;
  network?: string;
  details?: any;
  recoverable?: boolean;
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  autoRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Hook for handling network-related errors with user-friendly messages and recovery options
 */
export function useNetworkErrorHandler() {
  const { toast } = useToast();
  const { currentNetwork, switchNetwork } = useNetwork();
  const { validation, getRecommendedNetwork } = useNetworkConfig();
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});

  const classifyError = useCallback((error: any): NetworkError => {
    const message = error?.message || error?.toString() || 'Unknown error';
    
    // Network connectivity errors
    if (message.includes('fetch') || message.includes('network') || message.includes('timeout')) {
      return {
        code: 'NETWORK_CONNECTIVITY',
        message: 'Network connection failed. Please check your internet connection.',
        recoverable: true
      };
    }

    // RPC errors
    if (message.includes('rpc') || message.includes('provider')) {
      return {
        code: 'RPC_ERROR',
        message: 'RPC endpoint is not responding. Try switching networks or refreshing.',
        recoverable: true
      };
    }

    // Contract not found/configured
    if (message.includes('contract') && (message.includes('not configured') || message.includes('not deployed'))) {
      return {
        code: 'CONTRACT_NOT_CONFIGURED',
        message: `Smart contracts are not configured for ${currentNetwork}. Try switching to a supported network.`,
        network: currentNetwork,
        recoverable: true
      };
    }

    // Chain/network not supported
    if (message.includes('chain') || message.includes('network')) {
      return {
        code: 'UNSUPPORTED_NETWORK',
        message: `Current network (${currentNetwork}) is not fully supported.`,
        network: currentNetwork,
        recoverable: true
      };
    }

    // Transaction errors
    if (message.includes('transaction') || message.includes('tx')) {
      return {
        code: 'TRANSACTION_ERROR',
        message: 'Transaction failed. Please try again or check your wallet.',
        recoverable: true
      };
    }

    // Wallet errors
    if (message.includes('wallet') || message.includes('account')) {
      return {
        code: 'WALLET_ERROR',
        message: 'Wallet connection issue. Please reconnect your wallet.',
        recoverable: true
      };
    }

    // Gas/fee errors
    if (message.includes('gas') || message.includes('fee') || message.includes('insufficient')) {
      return {
        code: 'INSUFFICIENT_FUNDS',
        message: 'Insufficient funds for transaction. Please add funds to your wallet.',
        recoverable: false
      };
    }

    // Generic error
    return {
      code: 'GENERIC_ERROR',
      message: message.length > 100 ? message.substring(0, 100) + '...' : message,
      details: error,
      recoverable: false
    };
  }, [currentNetwork]);

  const getRecoveryActions = useCallback((networkError: NetworkError) => {
    const actions: Array<{
      label: string;
      action: () => Promise<void> | void;
      primary?: boolean;
    }> = [];

    switch (networkError.code) {
      case 'NETWORK_CONNECTIVITY':
        actions.push(
          { label: 'Retry', action: () => window.location.reload(), primary: true },
          { label: 'Check Connection', action: () => window.open('https://www.google.com', '_blank') }
        );
        break;

      case 'RPC_ERROR':
        actions.push(
          { label: 'Retry', action: () => window.location.reload(), primary: true },
          { label: 'Switch Network', action: async () => {
            const recommended = getRecommendedNetwork();
            if (recommended !== currentNetwork) {
              await switchNetwork(recommended);
            }
          }}
        );
        break;

      case 'CONTRACT_NOT_CONFIGURED':
      case 'UNSUPPORTED_NETWORK':
        const recommended = getRecommendedNetwork();
        if (recommended !== currentNetwork) {
          actions.push({
            label: `Switch to ${recommended === 'sepolia' ? 'Sepolia' : 'Mainnet'}`,
            action: async () => await switchNetwork(recommended),
            primary: true
          });
        }
        actions.push(
          { label: 'Refresh', action: () => window.location.reload() }
        );
        break;

      case 'WALLET_ERROR':
        actions.push(
          { label: 'Reconnect Wallet', action: () => window.location.reload(), primary: true }
        );
        break;

      case 'INSUFFICIENT_FUNDS':
        if (currentNetwork === 'sepolia') {
          actions.push({
            label: 'Get Test Tokens',
            action: () => window.open('https://starknet-faucet.vercel.app/', '_blank'),
            primary: true
          });
        }
        break;

      default:
        actions.push(
          { label: 'Retry', action: () => window.location.reload(), primary: true }
        );
    }

    return actions;
  }, [currentNetwork, getRecommendedNetwork, switchNetwork]);

  const handleError = useCallback(async (
    error: any,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      autoRetry = false,
      maxRetries = 3,
      retryDelay = 1000
    } = options;

    const networkError = classifyError(error);
    const errorKey = `${networkError.code}_${currentNetwork}`;
    const currentRetries = retryCount[errorKey] || 0;

    console.error('Network error handled:', networkError, error);

    // Show toast notification
    if (showToast) {
      const recoveryActions = getRecoveryActions(networkError);
      
      toast({
        title: "Network Error",
        description: networkError.message,
        variant: "destructive",
        action: recoveryActions.length > 0 ? (
          <button
            onClick={recoveryActions[0].action}
            className="text-sm underline"
          >
            {recoveryActions[0].label}
          </button>
        ) : undefined,
      });
    }

    // Auto retry for recoverable errors
    if (autoRetry && networkError.recoverable && currentRetries < maxRetries) {
      setRetryCount(prev => ({
        ...prev,
        [errorKey]: currentRetries + 1
      }));

      setTimeout(() => {
        window.location.reload();
      }, retryDelay * (currentRetries + 1)); // Exponential backoff
    }

    return {
      networkError,
      recoveryActions: getRecoveryActions(networkError),
      canRetry: networkError.recoverable && currentRetries < maxRetries
    };
  }, [classifyError, getRecoveryActions, retryCount, currentNetwork, toast]);

  const clearRetryCount = useCallback((errorCode?: string) => {
    if (errorCode) {
      const errorKey = `${errorCode}_${currentNetwork}`;
      setRetryCount(prev => {
        const newCount = { ...prev };
        delete newCount[errorKey];
        return newCount;
      });
    } else {
      setRetryCount({});
    }
  }, [currentNetwork]);

  return {
    handleError,
    classifyError,
    getRecoveryActions,
    clearRetryCount,
    retryCount
  };
}
