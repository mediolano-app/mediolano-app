"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Network, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  Coins,
  FileText,
  Zap
} from 'lucide-react';

import { useNetworkConfig } from '@/hooks/useNetworkConfig';
import { useNetwork } from '@/components/starknet-provider';
import { useAccount } from '@starknet-react/core';
import { NetworkStatus } from '@/components/network/network-status';
import { NetworkWarning } from '@/components/network/network-warning';
import { TokenizationService } from '@/services/tokenization';

/**
 * Demo component showcasing multi-network functionality
 * This demonstrates all the features implemented for network detection and switching
 */
export function MultiNetworkDemo() {
  const { currentNetwork, switchNetwork, isNetworkSwitching } = useNetwork();
  const { 
    validation, 
    isProductionReady, 
    contractAddresses,
    getTransactionUrl,
    getContractUrl 
  } = useNetworkConfig();
  const { address, isConnected } = useAccount();
  const [activeDemo, setActiveDemo] = useState<string>('overview');

  const handleNetworkSwitch = async (network: 'mainnet' | 'sepolia') => {
    try {
      await switchNetwork(network);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const networkValidation = TokenizationService.validateNetwork(currentNetwork);
  const recommendedNetwork = TokenizationService.getRecommendedNetwork(currentNetwork);
  const isGasSponsorshipAvailable = TokenizationService.isGasSponsorshipAvailable(currentNetwork);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-6 w-6" />
            Multi-Network Integration Demo
          </CardTitle>
          <CardDescription>
            Demonstration of Starknet Sepolia Testnet and Mainnet integration with 
            smart contract deployment, network detection, and seamless switching.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={currentNetwork === 'sepolia' ? 'default' : 'secondary'}>
              Current: {currentNetwork === 'sepolia' ? 'Sepolia Testnet' : 'Mainnet'}
            </Badge>
            <Badge variant={validation.isValid ? 'default' : 'destructive'}>
              {validation.isValid ? 'Ready' : 'Not Ready'}
            </Badge>
            {isConnected && (
              <Badge variant="outline">
                Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Network Warning */}
      <NetworkWarning onNetworkSwitch={handleNetworkSwitch} />

      {/* Demo Tabs */}
      <Tabs value={activeDemo} onValueChange={setActiveDemo}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="switching">Network Switching</TabsTrigger>
          <TabsTrigger value="contracts">Contract Status</TabsTrigger>
          <TabsTrigger value="tokenization">Tokenization</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NetworkStatus showDetails={true} />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Implementation Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Network detection and switching</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Dynamic contract address management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Network-aware tokenization workflows</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Comprehensive error handling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">User-friendly network status UI</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Fallback handling for unsupported networks</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Network Switching Tab */}
        <TabsContent value="switching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Switching Demo</CardTitle>
              <CardDescription>
                Test the network switching functionality between Sepolia and Mainnet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className={currentNetwork === 'sepolia' ? 'border-blue-500' : ''}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Network className="h-5 w-5" />
                      Sepolia Testnet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Free test tokens available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Gas sponsorship enabled</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Full contract deployment</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleNetworkSwitch('sepolia')}
                      disabled={currentNetwork === 'sepolia' || isNetworkSwitching}
                      className="w-full"
                    >
                      {currentNetwork === 'sepolia' ? 'Current Network' : 'Switch to Sepolia'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className={currentNetwork === 'mainnet' ? 'border-blue-500' : ''}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Network className="h-5 w-5" />
                      Mainnet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {isProductionReady ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="text-sm">Production environment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Real tokens required</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {validation.isValid ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm">
                          {validation.isValid ? 'Contracts deployed' : 'Contracts pending'}
                        </span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleNetworkSwitch('mainnet')}
                      disabled={currentNetwork === 'mainnet' || isNetworkSwitching}
                      className="w-full"
                      variant={isProductionReady ? 'default' : 'outline'}
                    >
                      {currentNetwork === 'mainnet' ? 'Current Network' : 'Switch to Mainnet'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {recommendedNetwork !== currentNetwork && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Recommendation</AlertTitle>
                  <AlertDescription>
                    For optimal functionality, consider switching to {recommendedNetwork}.
                    <Button 
                      variant="link" 
                      className="p-0 h-auto ml-2"
                      onClick={() => handleNetworkSwitch(recommendedNetwork)}
                    >
                      Switch now
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contract Status Tab */}
        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Contract Status</CardTitle>
              <CardDescription>
                View the deployment status of smart contracts on the current network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(contractAddresses).map(([name, address]) => (
                  <div key={name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {address ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-medium">{name}</span>
                      </div>
                      {address && (
                        <Badge variant="outline" className="font-mono text-xs">
                          {address.slice(0, 6)}...{address.slice(-4)}
                        </Badge>
                      )}
                    </div>
                    {address && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(getContractUrl(address), '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tokenization Tab */}
        <TabsContent value="tokenization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tokenization Capabilities</CardTitle>
              <CardDescription>
                Available features for content tokenization on the current network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Content Tokenization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {networkValidation.isValid ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {networkValidation.isValid ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Gas Sponsorship
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {isGasSponsorshipAvailable ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-sm">
                        {isGasSponsorshipAvailable ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Coins className="h-5 w-5" />
                      Test Tokens
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {currentNetwork === 'sepolia' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-sm">
                        {currentNetwork === 'sepolia' ? 'Free Faucet' : 'Real Tokens Required'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {currentNetwork === 'sepolia' && (
                <Alert>
                  <Coins className="h-4 w-4" />
                  <AlertTitle>Get Test Tokens</AlertTitle>
                  <AlertDescription>
                    You can get free test tokens for Sepolia testnet to try tokenization features.
                    <Button 
                      variant="link" 
                      className="p-0 h-auto ml-2"
                      onClick={() => window.open('https://starknet-faucet.vercel.app/', '_blank')}
                    >
                      Get tokens
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
