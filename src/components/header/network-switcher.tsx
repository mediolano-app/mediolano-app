"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useNetwork } from '@/components/starknet-provider';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from '@starknet-react/core';
import { Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { constants } from "starknet";

export function NetworkSwitcher() {
  const { currentNetwork, networkConfig, switchNetwork } = useNetwork();
  const { address, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();

  // We do not pass params to the hook, but to the function
  const { switchChainAsync, error } = useSwitchChain({});

  const [open, setOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Map network name to Starknet chainId constant
  const networkToChainId = {
    mainnet: constants.StarknetChainId.SN_MAIN,
    sepolia: constants.StarknetChainId.SN_SEPOLIA,
  };

  // Map chainId to network name
  const chainIdToNetwork = {
    [constants.StarknetChainId.SN_MAIN]: 'mainnet',
    [constants.StarknetChainId.SN_SEPOLIA]: 'sepolia',
  };

  // Listen for changes in the account's chainId and update the context if needed
  useEffect(() => {
    // Convert chainId to string for object key lookup, since object keys are strings
    const chainIdKey = chainId?.toString();
    if (
      chainIdKey &&
      (chainIdKey === constants.StarknetChainId.SN_MAIN || chainIdKey === constants.StarknetChainId.SN_SEPOLIA) &&
      currentNetwork !== chainIdToNetwork[chainIdKey as keyof typeof chainIdToNetwork]
    ) {
      // Fix: Ensure type safety by casting to the correct type
      const newNetwork = chainIdToNetwork[chainIdKey as keyof typeof chainIdToNetwork] as 'mainnet' | 'sepolia';
      switchNetwork(newNetwork);
    }
  }, [chainId]);

  const handleNetworkSwitch = async (newNetwork: 'mainnet' | 'sepolia') => {
    if (currentNetwork === newNetwork) {
      setOpen(false);
      return;
    }
    if (address) {
      await disconnect();
    }
    // Use useSwitchChain to switch the chain
    const chainId = networkToChainId[newNetwork];
    if (chainId && switchChainAsync) {
      try {
        await switchChainAsync({ chainId });
        // Update the context so the UI reflects the new network
        switchNetwork(newNetwork);
      } catch (e) {
        // Optionally handle error
      }
    } else {
      // If switchChainAsync is not available, still update context for UI
      switchNetwork(newNetwork);
    }
    setOpen(false);

    // Optionally reconnect wallet after switching
    if (connectors.length > 0) {
      setTimeout(() => connect({ connector: connectors[0] }), 500);
    }
  };

  return (
    <div className="network-switcher relative" ref={switcherRef}>
      <div className="flex items-center gap-3 mx-4">
        <div
          className="flex items-center gap-2 px-3 py-2 border border-blue-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer select-none"
          onClick={() => setOpen((prev) => !prev)}
          tabIndex={0}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              currentNetwork === 'mainnet' ? 'bg-green-500' : 'bg-yellow-500'
            }`}
          />
          <span className="text-xs text-blue-600">
            {networkConfig.name}
          </span>
        </div>
      </div>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 z-50 min-w-[220px] bg-background border border-blue-600 rounded-lg shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              <span className="text-sm font-medium">Network</span>
            </div>
            <div className={`px-2 py-1 rounded text-xs ${
              currentNetwork === 'mainnet' 
                ? 'bg-blue-600 text-white' 
                : 'bg-purple-600 text-shite'
            }`}>
              {networkConfig.name}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={currentNetwork === 'sepolia' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleNetworkSwitch('sepolia')}
              className="flex-1"
            >
              Sepolia
            </Button>
            <Button
              variant={currentNetwork === 'mainnet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleNetworkSwitch('mainnet')}
              className="flex-1"
            >
              Mainnet  
            </Button>
          </div>
          {error && (
            <div className="mt-2 text-xs text-red-500">
              {error.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
