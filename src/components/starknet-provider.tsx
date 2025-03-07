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
import { RpcProvider } from "starknet"; // Import RpcProvider directly from starknet

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "random",
  });

  // Retrieve your custom RPC URL from environment variables.
  const customRpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

  // Create a custom provider factory function
  const providerFactory = (chain: any) => new RpcProvider({ nodeUrl: customRpcUrl || "" });

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={providerFactory}
      connectors={connectors}
      explorer={voyager}
      defaultChainId={sepolia.id} // Set Sepolia as the default chain for testing
    >
      {children}
    </StarknetConfig>
  );
}
