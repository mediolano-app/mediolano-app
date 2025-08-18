"use client";

import React from 'react';
import { AlertTriangle, ExternalLink, RefreshCw, Wifi } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNetworkConfig } from '@/hooks/useNetworkConfig';
import { useNetwork } from '@/components/starknet-provider';
import { TokenizationService } from '@/services/tokenization';

interface NetworkWarningProps {
  onNetworkSwitch?: (network: 'mainnet' | 'sepolia') => void;
  className?: string;
}

export function NetworkWarning({ onNetworkSwitch, className }: NetworkWarningProps) {
  const { currentNetwork, validation, isProductionReady } = useNetworkConfig();
  const { switchNetwork, isNetworkSwitching } = useNetwork();
  
  const networkValidation = TokenizationService.validateNetwork(currentNetwork);
  const recommendedNetwork = TokenizationService.getRecommendedNetwork(currentNetwork);

  // Don't show warning if network is fully functional
  if (validation.isValid && isProductionReady && networkValidation.isValid) {
    return null;
  }

  const handleSwitchToRecommended = async () => {
    try {
      await switchNetwork(recommendedNetwork);
      onNetworkSwitch?.(recommendedNetwork);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const getWarningLevel = () => {
    if (!validation.isValid || networkValidation.errors.length > 0) {
      return 'error';
    }
    if (validation.warnings.length > 0 || networkValidation.warnings.length > 0) {
      return 'warning';
    }
    return 'info';
  };

  const getWarningTitle = () => {
    const level = getWarningLevel();
    switch (level) {
      case 'error':
        return 'Network Not Supported';
      case 'warning':
        return 'Limited Network Support';
      default:
        return 'Network Information';
    }
  };

  const getWarningDescription = () => {
    const issues = [
      ...validation.missingContracts.map(contract => `Missing ${contract}`),
      ...networkValidation.errors,
      ...validation.warnings,
      ...networkValidation.warnings
    ];

    if (issues.length === 0) {
      return 'Network is functional but may have limited features.';
    }

    return issues.join(', ');
  };

  return (
    <Card className={`border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
          <AlertTriangle className="h-5 w-5" />
          {getWarningTitle()}
        </CardTitle>
        <CardDescription className="text-yellow-700 dark:text-yellow-300">
          {getWarningDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Network Issues */}
        {(validation.missingContracts.length > 0 || networkValidation.errors.length > 0) && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Critical Issues</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validation.missingContracts.map((contract, index) => (
                  <li key={index} className="text-sm">
                    {contract} contract not configured for {currentNetwork}
                  </li>
                ))}
                {networkValidation.errors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Warnings */}
        {(validation.warnings.length > 0 || networkValidation.warnings.length > 0) && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warnings</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validation.warnings.map((warning, index) => (
                  <li key={index} className="text-sm">{warning}</li>
                ))}
                {networkValidation.warnings.map((warning, index) => (
                  <li key={index} className="text-sm">{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Recommendations */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Recommended Actions
          </h4>
          
          {recommendedNetwork !== currentNetwork && (
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center gap-3">
                <Wifi className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">
                    Switch to {recommendedNetwork === 'sepolia' ? 'Sepolia Testnet' : 'Mainnet'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Better contract support and functionality
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={handleSwitchToRecommended}
                disabled={isNetworkSwitching}
              >
                {isNetworkSwitching ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  'Switch Network'
                )}
              </Button>
            </div>
          )}

          {currentNetwork === 'mainnet' && !isProductionReady && (
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Use Testnet for Testing</p>
                  <p className="text-xs text-muted-foreground">
                    Mainnet contracts are not fully deployed yet
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => switchNetwork('sepolia')}
                disabled={isNetworkSwitching}
              >
                Use Testnet
              </Button>
            </div>
          )}

          {currentNetwork === 'sepolia' && (
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Get Test Tokens</p>
                  <p className="text-xs text-muted-foreground">
                    Get free tokens for testing on Sepolia
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open('https://starknet-faucet.vercel.app/', '_blank')}
              >
                Get Tokens
              </Button>
            </div>
          )}
        </div>

        {/* What You Can Do */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            What You Can Do
          </h4>
          <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            {validation.isValid ? (
              <p>✓ Basic tokenization and contract interactions are available</p>
            ) : (
              <p>✗ Tokenization is not available on this network</p>
            )}
            {TokenizationService.isGasSponsorshipAvailable(currentNetwork) ? (
              <p>✓ Gas sponsorship is available for some transactions</p>
            ) : (
              <p>✗ Gas sponsorship is not available</p>
            )}
            {currentNetwork === 'sepolia' ? (
              <p>✓ Free test tokens are available from the faucet</p>
            ) : (
              <p>⚠ Real tokens required for transactions</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
