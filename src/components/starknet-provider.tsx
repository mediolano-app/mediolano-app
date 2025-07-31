"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";
import { RpcProvider } from "starknet"; 

interface NetworkContextType {
  currentNetwork: 'mainnet' | 'sepolia';
  switchNetwork: (network: 'mainnet' | 'sepolia') => void;
  networkConfig: {
    chainId: string;
    name: string;
    explorerUrl: string;
  };
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
  const [currentNetwork, setCurrentNetwork] = useState<'mainnet' | 'sepolia'>('mainnet');
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "alphabetical",
  });

  const networkConfigs = {
    mainnet: {
      chainId: mainnet.id.toString(),
      name: 'Starknet Mainnet',
      explorerUrl: 'https://starkscan.co'
    },
    sepolia: {
      chainId: sepolia.id.toString(),
      name: 'Starknet Sepolia',
      explorerUrl: 'https://sepolia.starkscan.co'
    }
  };
  
  // Switch network function
  const switchNetwork = (network: 'mainnet' | 'sepolia') => {
    setCurrentNetwork(network);
  };
  
  // Get current network config
  const networkConfig = networkConfigs[currentNetwork];

  // Retrieve your custom RPC URL from environment variables
  const customRpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

  const providerFactory = (chain: any) => new RpcProvider({ nodeUrl: customRpcUrl || "" });

  return (
    <NetworkContext.Provider value={{
      currentNetwork,
      switchNetwork,
      networkConfig
    }}>
      <StarknetConfig
        chains={[sepolia, mainnet ]}
        provider={providerFactory}
        connectors={connectors}
        explorer={voyager}
        defaultChainId={currentNetwork === 'mainnet' ? mainnet.id : sepolia.id} // default chain for testing
        autoConnect={true} // Enable auto-connect
      >
        {children}
      </StarknetConfig>
    </NetworkContext.Provider>
  );
}
