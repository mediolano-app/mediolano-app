"use client";

import { Account } from "starknet";
import { NetworkType, getContractAddresses } from "@/lib/constants";
import { mintToken } from "@/utils/starknet";
import { pinataClient } from "@/utils/pinataClient";

export interface TokenizationMetadata {
  name: string;
  description: string;
  image?: string;
  external_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties?: Record<string, any>;
}

export interface TokenizationOptions {
  account: Account;
  network: NetworkType;
  metadata: TokenizationMetadata;
  mediaFile?: File;
  recipient?: string;
}

export interface TokenizationResult {
  transactionHash: string;
  ipfsHash?: string;
  tokenUri: string;
  explorerUrl: string;
  network: NetworkType;
}

export class TokenizationError extends Error {
  constructor(
    message: string,
    public code: string,
    public network?: NetworkType,
    public details?: any
  ) {
    super(message);
    this.name = 'TokenizationError';
  }
}

/**
 * Network-aware content tokenization service
 */
export class TokenizationService {
  /**
   * Tokenize content on the specified network
   */
  static async tokenizeContent(options: TokenizationOptions): Promise<TokenizationResult> {
    const { account, network, metadata, mediaFile, recipient } = options;

    try {
      // Validate network configuration
      const contracts = getContractAddresses(network);
      if (!contracts.COLLECTION_CONTRACT) {
        throw new TokenizationError(
          `Collection contract not deployed on ${network}`,
          'CONTRACT_NOT_DEPLOYED',
          network
        );
      }

      // Upload metadata to IPFS
      let ipfsHash: string | undefined;
      let tokenUri: string;

      try {
        // If media file is provided, upload it first
        if (mediaFile) {
          const mediaUpload = await pinataClient.upload.file(mediaFile);
          metadata.image = `ipfs://${mediaUpload.IpfsHash}`;
        }

        // Upload metadata to IPFS
        const metadataUpload = await pinataClient.upload.json(metadata);
        ipfsHash = metadataUpload.IpfsHash;
        tokenUri = `ipfs://${ipfsHash}`;
      } catch (ipfsError) {
        console.error('IPFS upload failed:', ipfsError);
        
        // For development/testing, create a mock IPFS hash
        if (process.env.NODE_ENV === 'development') {
          ipfsHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
          tokenUri = `ipfs://${ipfsHash}`;
          console.warn('Using mock IPFS hash for development:', ipfsHash);
        } else {
          throw new TokenizationError(
            'Failed to upload metadata to IPFS',
            'IPFS_UPLOAD_FAILED',
            network,
            ipfsError
          );
        }
      }

      // Mint the token on the blockchain
      const transactionHash = await mintToken({
        account,
        network,
        recipient,
        tokenUri
      });

      // Generate explorer URL
      const explorerUrl = TokenizationService.getExplorerUrl(transactionHash, network);

      return {
        transactionHash,
        ipfsHash,
        tokenUri,
        explorerUrl,
        network
      };

    } catch (error) {
      if (error instanceof TokenizationError) {
        throw error;
      }

      // Wrap other errors
      throw new TokenizationError(
        error instanceof Error ? error.message : 'Unknown tokenization error',
        'TOKENIZATION_FAILED',
        network,
        error
      );
    }
  }

  /**
   * Validate if tokenization is possible on the given network
   */
  static validateNetwork(network: NetworkType): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const contracts = getContractAddresses(network);
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check critical contracts
    if (!contracts.COLLECTION_CONTRACT) {
      errors.push('Collection contract not configured');
    }

    if (!contracts.MIP_CONTRACT) {
      errors.push('MIP contract not configured');
    }

    // Check for mainnet readiness
    if (network === 'mainnet') {
      if (errors.length > 0) {
        warnings.push('Mainnet contracts not fully deployed. Consider using Sepolia testnet.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get the appropriate network for tokenization based on current state
   */
  static getRecommendedNetwork(preferredNetwork: NetworkType): NetworkType {
    const validation = TokenizationService.validateNetwork(preferredNetwork);
    
    if (validation.isValid) {
      return preferredNetwork;
    }

    // If preferred network is not valid, recommend testnet
    if (preferredNetwork === 'mainnet') {
      const sepoliaValidation = TokenizationService.validateNetwork('sepolia');
      if (sepoliaValidation.isValid) {
        return 'sepolia';
      }
    }

    return preferredNetwork; // Return original if no better option
  }

  /**
   * Generate explorer URL for transaction
   */
  static getExplorerUrl(transactionHash: string, network: NetworkType): string {
    const baseUrl = network === 'mainnet' 
      ? 'https://starkscan.co'
      : 'https://sepolia.starkscan.co';
    
    return `${baseUrl}/tx/${transactionHash}`;
  }

  /**
   * Generate explorer URL for contract
   */
  static getContractUrl(contractAddress: string, network: NetworkType): string {
    const baseUrl = network === 'mainnet' 
      ? 'https://starkscan.co'
      : 'https://sepolia.starkscan.co';
    
    return `${baseUrl}/contract/${contractAddress}`;
  }

  /**
   * Check if gas sponsorship is available for the network
   */
  static isGasSponsorshipAvailable(network: NetworkType): boolean {
    // Gas sponsorship typically available on testnet
    return network === 'sepolia';
  }

  /**
   * Estimate tokenization cost (placeholder for future implementation)
   */
  static async estimateTokenizationCost(network: NetworkType): Promise<{
    estimatedGas: string;
    estimatedFee: string;
    currency: string;
  }> {
    // This would integrate with actual gas estimation
    return {
      estimatedGas: "0.001",
      estimatedFee: network === 'mainnet' ? "0.001" : "0.0001",
      currency: "ETH"
    };
  }
}

/**
 * Hook-friendly wrapper for tokenization service
 */
export function useTokenization() {
  return {
    tokenizeContent: TokenizationService.tokenizeContent,
    validateNetwork: TokenizationService.validateNetwork,
    getRecommendedNetwork: TokenizationService.getRecommendedNetwork,
    isGasSponsorshipAvailable: TokenizationService.isGasSponsorshipAvailable,
    estimateTokenizationCost: TokenizationService.estimateTokenizationCost,
  };
}
