"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  publicProvider,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";
import { RpcProvider, constants } from "starknet";
import { NETWORK_CONFIG, NetworkType } from "@/lib/constants";

interface NetworkContextType {
  currentNetwork: NetworkType;
  switchNetwork: (network: NetworkType) => Promise<void>;
  networkConfig: {
    chainId: string;
    name: string;
    explorerUrl: string;
  };
  isNetworkSupported: boolean;
  networkError: string | null;
  isNetworkSwitching: boolean;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within StarknetProvider');
  }
  return context;
};

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const [currentNetwork, setCurrentNetwork] = useState<NetworkType>('sepolia');
  const [isNetworkSwitching, setIsNetworkSwitching] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "alphabetical",
  });

  // Get network configuration from constants
  const networkConfig = NETWORK_CONFIG[currentNetwork];

  // Check if network is supported (has required configuration)
  const isNetworkSupported = useCallback(() => {
    const config = NETWORK_CONFIG[currentNetwork];
    return !!(config && config.rpcUrl && config.chainId);
  }, [currentNetwork]);

  // Enhanced network switching with validation and error handling
  const switchNetwork = useCallback(async (network: NetworkType) => {
    if (network === currentNetwork) {
      return;
    }

    setIsNetworkSwitching(true);
    setNetworkError(null);

    try {
      // Validate network configuration
      const targetConfig = NETWORK_CONFIG[network];
      if (!targetConfig) {
        throw new Error(`Network ${network} is not supported`);
      }

      if (!targetConfig.rpcUrl) {
        throw new Error(`RPC URL not configured for ${network}`);
      }

      // Test RPC connectivity (optional)
      try {
        const testProvider = new RpcProvider({
          nodeUrl: targetConfig.rpcUrl,
          chainId: targetConfig.chainId as constants.StarknetChainId
        });

        // Quick connectivity test with timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('RPC timeout')), 5000)
        );

        await Promise.race([
          testProvider.getChainId(),
          timeoutPromise
        ]);
      } catch (rpcError) {
        console.warn(`RPC test failed for ${network}:`, rpcError);
        // Don't block network switch on RPC test failure, just warn
      }

      // Switch network
      setCurrentNetwork(network);

      // Store preference in localStorage
      localStorage.setItem('mediolano-preferred-network', network);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch network';
      setNetworkError(errorMessage);
      console.error('Network switch failed:', error);
      throw error;
    } finally {
      setIsNetworkSwitching(false);
    }
  }, [currentNetwork]);

  // Load preferred network from localStorage on mount
  useEffect(() => {
    const savedNetwork = localStorage.getItem('mediolano-preferred-network') as NetworkType;
    if (savedNetwork && (savedNetwork === 'mainnet' || savedNetwork === 'sepolia')) {
      setCurrentNetwork(savedNetwork);
    }
  }, []);

  // Network-aware RPC provider factory
  const providerFactory = useCallback((chain: any) => {
    const config = NETWORK_CONFIG[currentNetwork];
    const rpcUrl = config?.rpcUrl || process.env.NEXT_PUBLIC_RPC_URL || "";

    if (!rpcUrl) {
      console.warn(`No RPC URL configured for ${currentNetwork}, using fallback`);
    }

    return new RpcProvider({
      nodeUrl: rpcUrl,
      chainId: config?.chainId as constants.StarknetChainId,
      headers: JSON.parse(process.env.NEXT_PUBLIC_RPC_HEADERS || "{}")
    });
  }, [currentNetwork]);

  // Clear network error when network changes successfully
  useEffect(() => {
    if (networkError && isNetworkSupported()) {
      setNetworkError(null);
    }
  }, [currentNetwork, networkError, isNetworkSupported]);

  return (
    <NetworkContext.Provider value={{
      currentNetwork,
      switchNetwork,
      networkConfig: {
        chainId: networkConfig.chainId,
        name: networkConfig.name,
        explorerUrl: networkConfig.explorerUrl,
      },
      isNetworkSupported: isNetworkSupported(),
      networkError,
      isNetworkSwitching
    }}>
      <StarknetConfig
        chains={[sepolia, mainnet]}
        provider={providerFactory}
        connectors={connectors}
        explorer={voyager}
        defaultChainId={currentNetwork === 'mainnet' ? mainnet.id : sepolia.id}
        autoConnect={true}
      >
        {children}
      </StarknetConfig>
    </NetworkContext.Provider>
  );
}
