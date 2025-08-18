"use client";

import React from 'react';
import { AlertTriangle, CheckCircle, Clock, ExternalLink, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNetworkConfig } from '@/hooks/useNetworkConfig';
import { TokenizationService } from '@/services/tokenization';

interface NetworkStatusProps {
  showDetails?: boolean;
  className?: string;
}

export function NetworkStatus({ showDetails = false, className }: NetworkStatusProps) {
  const { 
    currentNetwork, 
    networkConfiguration, 
    validation, 
    isProductionReady,
    contractAddresses 
  } = useNetworkConfig();

  const networkValidation = TokenizationService.validateNetwork(currentNetwork);
  const recommendedNetwork = TokenizationService.getRecommendedNetwork(currentNetwork);
  const isGasSponsorshipAvailable = TokenizationService.isGasSponsorshipAvailable(currentNetwork);

  const getStatusIcon = () => {
    if (validation.isValid && isProductionReady) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (validation.warnings.length > 0) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
    return <WifiOff className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = () => {
    if (validation.isValid && isProductionReady) return 'green';
    if (validation.warnings.length > 0) return 'yellow';
    return 'red';
  };

  const getStatusText = () => {
    if (validation.isValid && isProductionReady) return 'Ready';
    if (validation.warnings.length > 0) return 'Limited';
    return 'Not Ready';
  };

  if (!showDetails) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {getStatusIcon()}
        <Badge variant={getStatusColor() === 'green' ? 'default' : 'secondary'}>
          {networkConfiguration.name}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {getStatusText()}
        </span>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Network Status
        </CardTitle>
        <CardDescription>
          Current network configuration and contract availability
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Network Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">{networkConfiguration.name}</span>
            <Badge variant={getStatusColor() === 'green' ? 'default' : 'secondary'}>
              {getStatusText()}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(networkConfiguration.explorerUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Explorer
          </Button>
        </div>

        {/* Network Warnings */}
        {validation.warnings.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Network Warnings</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validation.warnings.map((warning, index) => (
                  <li key={index} className="text-sm">{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Network Errors */}
        {!validation.isValid && (
          <Alert variant="destructive">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>Network Configuration Issues</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validation.missingContracts.map((contract, index) => (
                  <li key={index} className="text-sm">Missing: {contract}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Recommendation */}
        {recommendedNetwork !== currentNetwork && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>Recommendation</AlertTitle>
            <AlertDescription>
              Consider switching to {recommendedNetwork} for better functionality.
            </AlertDescription>
          </Alert>
        )}

        {/* Contract Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Contract Status</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {Object.entries(contractAddresses).map(([name, address]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="text-muted-foreground">{name}</span>
                <div className="flex items-center gap-2">
                  {address ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="font-mono text-xs">
                        {address.slice(0, 6)}...{address.slice(-4)}
                      </span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 text-red-500" />
                      <span className="text-red-500">Not configured</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Available Features</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant={validation.isValid ? 'default' : 'secondary'}>
              Tokenization {validation.isValid ? '✓' : '✗'}
            </Badge>
            <Badge variant={isGasSponsorshipAvailable ? 'default' : 'secondary'}>
              Gas Sponsorship {isGasSponsorshipAvailable ? '✓' : '✗'}
            </Badge>
            <Badge variant={currentNetwork === 'sepolia' ? 'default' : 'secondary'}>
              Testnet Faucet {currentNetwork === 'sepolia' ? '✓' : '✗'}
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          {networkConfiguration.faucetUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(networkConfiguration.faucetUrl!, '_blank')}
            >
              Get Test Tokens
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(networkConfiguration.explorerUrl, '_blank')}
          >
            View Explorer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
