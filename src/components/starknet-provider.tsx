"use client";
import React from "react";
import { sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";
import { RpcProvider } from "starknet"; 

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "alphabetical",
  });

  // Retrieve your custom RPC URL from environment variables
  const customRpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

  
  const providerFactory = (chain: any) => new RpcProvider({ nodeUrl: customRpcUrl || "" });

  return (
    <StarknetConfig
      chains={[sepolia, mainnet ]}
      provider={providerFactory}
      connectors={connectors}
      explorer={voyager}
      defaultChainId={sepolia.id} // default chain for testing
      autoConnect={true} // Enable auto-connect
    >
      {children}
    </StarknetConfig>
  );
}
