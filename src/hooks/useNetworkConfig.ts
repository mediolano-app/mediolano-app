"use client";

import { useMemo } from 'react';
import { useNetwork } from '@/components/starknet-provider';
import { getContractAddresses, NETWORK_CONFIG, AVNU_PAYMASTER_CONFIG, NetworkType } from '@/lib/constants';

export interface NetworkContractAddresses {
  MIP_CONTRACT: string;
  COLLECTION_CONTRACT: string;
  REVENUE_CONTRACT: string;
  AGREEMENT_FACTORY: string;
  USER_SETTINGS: string;
  LICENSING_CONTRACT: string;
  MARKETPLACE_ADDRESS: string;
  LISTING_CONTRACT: string;
}

export interface NetworkConfiguration {
  chainId: string;
  name: string;
  explorerUrl: string;
  rpcUrl: string;
  faucetUrl: string | null;
}

export interface NetworkValidationResult {
  isValid: boolean;
  missingContracts: string[];
  warnings: string[];
}

/**
 * Hook that provides network-aware configuration including contract addresses,
 * RPC settings, and validation utilities
 */
export function useNetworkConfig() {
  const { currentNetwork, networkConfig } = useNetwork();

  // Get contract addresses for current network
  const contractAddresses = useMemo(() => {
    return getContractAddresses(currentNetwork);
  }, [currentNetwork]);

  // Get network configuration
  const networkConfiguration = useMemo(() => {
    return NETWORK_CONFIG[currentNetwork];
  }, [currentNetwork]);

  // Get supported gas tokens for current network
  const supportedGasTokens = useMemo(() => {
    return AVNU_PAYMASTER_CONFIG.SUPPORTED_GAS_TOKENS[currentNetwork] || [];
  }, [currentNetwork]);

  // Validate network configuration
  const validateNetwork = useMemo((): NetworkValidationResult => {
    const contracts = contractAddresses;
    const missingContracts: string[] = [];
    const warnings: string[] = [];

    // Check for missing critical contracts
    if (!contracts.MIP_CONTRACT) {
      missingContracts.push('MIP_CONTRACT');
    }
    if (!contracts.COLLECTION_CONTRACT) {
      missingContracts.push('COLLECTION_CONTRACT');
    }

    // Check for missing optional contracts (warnings only)
    if (!contracts.LICENSING_CONTRACT) {
      warnings.push('LICENSING_CONTRACT not configured');
    }
    if (!contracts.MARKETPLACE_ADDRESS) {
      warnings.push('MARKETPLACE_ADDRESS not configured');
    }
    if (!contracts.LISTING_CONTRACT) {
      warnings.push('LISTING_CONTRACT not configured');
    }

    // Special validation for mainnet
    if (currentNetwork === 'mainnet') {
      if (missingContracts.length > 0) {
        warnings.push('Mainnet contracts not fully deployed. Consider using Sepolia testnet for testing.');
      }
    }

    return {
      isValid: missingContracts.length === 0,
      missingContracts,
      warnings
    };
  }, [contractAddresses, currentNetwork]);

  // Helper function to get explorer URL for transaction
  const getTransactionUrl = (txHash: string) => {
    return `${networkConfiguration.explorerUrl}/tx/${txHash}`;
  };

  // Helper function to get explorer URL for contract
  const getContractUrl = (contractAddress: string) => {
    return `${networkConfiguration.explorerUrl}/contract/${contractAddress}`;
  };

  // Helper function to get explorer URL for address
  const getAddressUrl = (address: string) => {
    return `${networkConfiguration.explorerUrl}/contract/${address}`;
  };

  // Check if network is supported for production use
  const isProductionReady = useMemo(() => {
    if (currentNetwork === 'sepolia') {
      return true; // Testnet is always ready for testing
    }
    
    // For mainnet, check if critical contracts are deployed
    return validateNetwork.isValid;
  }, [currentNetwork, validateNetwork]);

  // Get appropriate network for user guidance
  const getRecommendedNetwork = (): NetworkType => {
    if (currentNetwork === 'mainnet' && !isProductionReady) {
      return 'sepolia'; // Recommend testnet if mainnet not ready
    }
    return currentNetwork;
  };

  return {
    // Current network info
    currentNetwork,
    networkConfig,
    networkConfiguration,
    
    // Contract addresses
    contractAddresses,
    
    // Gas tokens
    supportedGasTokens,
    
    // Validation
    validation: validateNetwork,
    isProductionReady,
    
    // Helper functions
    getTransactionUrl,
    getContractUrl,
    getAddressUrl,
    getRecommendedNetwork,
    
    // Network status
    isMainnet: currentNetwork === 'mainnet',
    isSepolia: currentNetwork === 'sepolia',
    
    // Quick access to critical contracts
    mipContract: contractAddresses.MIP_CONTRACT,
    collectionContract: contractAddresses.COLLECTION_CONTRACT,
    revenueContract: contractAddresses.REVENUE_CONTRACT,
  };
}

/**
 * Hook specifically for contract interactions that need network-aware addresses
 */
export function useNetworkContracts() {
  const { contractAddresses, validation, currentNetwork } = useNetworkConfig();

  // Throw error if critical contracts are missing
  if (!validation.isValid) {
    throw new Error(
      `Critical contracts missing for ${currentNetwork}: ${validation.missingContracts.join(', ')}`
    );
  }

  return contractAddresses;
}

/**
 * Hook for getting network-specific RPC provider configuration
 */
export function useNetworkRPC() {
  const { networkConfiguration, currentNetwork } = useNetworkConfig();

  return {
    rpcUrl: networkConfiguration.rpcUrl,
    chainId: networkConfiguration.chainId,
    network: currentNetwork,
    headers: JSON.parse(process.env.NEXT_PUBLIC_RPC_HEADERS || "{}"),
  };
}
