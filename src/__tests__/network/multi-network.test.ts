import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { getContractAddresses, NETWORK_CONFIG, NetworkType } from '@/lib/constants';
import { TokenizationService } from '@/services/tokenization';

// Mock environment variables
const mockEnvVars = {
  NEXT_PUBLIC_CONTRACT_ADDRESS_MIP_SEPOLIA: '0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0',
  NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS_SEPOLIA: '0x00d2583f8b3159ee0cda451c26096a819308f1cb921ad206f9ecf6839dc5b0e3',
  NEXT_PUBLIC_CONTRACT_ADDRESS_MIP_MAINNET: '0x1234567890abcdef1234567890abcdef12345678',
  NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS_MAINNET: '0xabcdef1234567890abcdef1234567890abcdef12',
};

describe('Multi-Network Configuration', () => {
  beforeEach(() => {
    // Mock process.env
    Object.assign(process.env, mockEnvVars);
  });

  describe('Network Contract Configuration', () => {
    it('should return correct contract addresses for Sepolia', () => {
      const contracts = getContractAddresses('sepolia');
      
      expect(contracts.MIP_CONTRACT).toBe(mockEnvVars.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP_SEPOLIA);
      expect(contracts.COLLECTION_CONTRACT).toBe(mockEnvVars.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS_SEPOLIA);
    });

    it('should return correct contract addresses for Mainnet', () => {
      const contracts = getContractAddresses('mainnet');
      
      expect(contracts.MIP_CONTRACT).toBe(mockEnvVars.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP_MAINNET);
      expect(contracts.COLLECTION_CONTRACT).toBe(mockEnvVars.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS_MAINNET);
    });

    it('should handle missing contract addresses gracefully', () => {
      // Clear environment variables
      delete process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP_MAINNET;
      
      const contracts = getContractAddresses('mainnet');
      expect(contracts.MIP_CONTRACT).toBe('');
    });
  });

  describe('Network Configuration', () => {
    it('should have correct configuration for Sepolia', () => {
      const config = NETWORK_CONFIG.sepolia;
      
      expect(config.name).toBe('Starknet Sepolia');
      expect(config.explorerUrl).toBe('https://sepolia.starkscan.co');
      expect(config.faucetUrl).toBeTruthy();
    });

    it('should have correct configuration for Mainnet', () => {
      const config = NETWORK_CONFIG.mainnet;
      
      expect(config.name).toBe('Starknet Mainnet');
      expect(config.explorerUrl).toBe('https://starkscan.co');
      expect(config.faucetUrl).toBeNull();
    });
  });

  describe('TokenizationService', () => {
    describe('validateNetwork', () => {
      it('should validate Sepolia network correctly', () => {
        const validation = TokenizationService.validateNetwork('sepolia');
        
        expect(validation.isValid).toBe(true);
        expect(validation.errors).toHaveLength(0);
      });

      it('should validate Mainnet network correctly', () => {
        const validation = TokenizationService.validateNetwork('mainnet');
        
        expect(validation.isValid).toBe(true);
        expect(validation.errors).toHaveLength(0);
      });

      it('should detect missing contracts', () => {
        // Clear contract addresses
        delete process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP_SEPOLIA;
        delete process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS_SEPOLIA;
        
        const validation = TokenizationService.validateNetwork('sepolia');
        
        expect(validation.isValid).toBe(false);
        expect(validation.errors.length).toBeGreaterThan(0);
      });
    });

    describe('getRecommendedNetwork', () => {
      it('should recommend current network if valid', () => {
        const recommended = TokenizationService.getRecommendedNetwork('sepolia');
        expect(recommended).toBe('sepolia');
      });

      it('should recommend Sepolia for invalid Mainnet', () => {
        // Clear mainnet contracts
        delete process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP_MAINNET;
        delete process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS_MAINNET;
        
        const recommended = TokenizationService.getRecommendedNetwork('mainnet');
        expect(recommended).toBe('sepolia');
      });
    });

    describe('isGasSponsorshipAvailable', () => {
      it('should return true for Sepolia', () => {
        expect(TokenizationService.isGasSponsorshipAvailable('sepolia')).toBe(true);
      });

      it('should return false for Mainnet', () => {
        expect(TokenizationService.isGasSponsorshipAvailable('mainnet')).toBe(false);
      });
    });

    describe('getExplorerUrl', () => {
      it('should generate correct Sepolia explorer URL', () => {
        const txHash = '0x1234567890abcdef';
        const url = TokenizationService.getExplorerUrl(txHash, 'sepolia');
        
        expect(url).toBe(`https://sepolia.starkscan.co/tx/${txHash}`);
      });

      it('should generate correct Mainnet explorer URL', () => {
        const txHash = '0x1234567890abcdef';
        const url = TokenizationService.getExplorerUrl(txHash, 'mainnet');
        
        expect(url).toBe(`https://starkscan.co/tx/${txHash}`);
      });
    });

    describe('getContractUrl', () => {
      it('should generate correct contract URLs', () => {
        const contractAddress = '0x1234567890abcdef';
        
        const sepoliaUrl = TokenizationService.getContractUrl(contractAddress, 'sepolia');
        expect(sepoliaUrl).toBe(`https://sepolia.starkscan.co/contract/${contractAddress}`);
        
        const mainnetUrl = TokenizationService.getContractUrl(contractAddress, 'mainnet');
        expect(mainnetUrl).toBe(`https://starkscan.co/contract/${contractAddress}`);
      });
    });
  });
});

describe('Network Error Scenarios', () => {
  it('should handle missing environment variables', () => {
    // Clear all environment variables
    const originalEnv = process.env;
    process.env = {};
    
    const contracts = getContractAddresses('sepolia');
    expect(contracts.MIP_CONTRACT).toBe('');
    expect(contracts.COLLECTION_CONTRACT).toBe('');
    
    // Restore environment
    process.env = originalEnv;
  });

  it('should handle invalid network types', () => {
    // This should be caught by TypeScript, but test runtime behavior
    const contracts = getContractAddresses('invalid' as NetworkType);
    expect(contracts).toBeUndefined();
  });
});

describe('Network Switching Scenarios', () => {
  it('should maintain contract consistency across networks', () => {
    const sepoliaContracts = getContractAddresses('sepolia');
    const mainnetContracts = getContractAddresses('mainnet');
    
    // Both networks should have the same contract types
    expect(Object.keys(sepoliaContracts)).toEqual(Object.keys(mainnetContracts));
  });

  it('should provide different RPC URLs for different networks', () => {
    const sepoliaConfig = NETWORK_CONFIG.sepolia;
    const mainnetConfig = NETWORK_CONFIG.mainnet;
    
    expect(sepoliaConfig.rpcUrl).not.toBe(mainnetConfig.rpcUrl);
    expect(sepoliaConfig.chainId).not.toBe(mainnetConfig.chainId);
  });
});

describe('Integration Test Scenarios', () => {
  it('should support complete tokenization workflow on Sepolia', async () => {
    const validation = TokenizationService.validateNetwork('sepolia');
    expect(validation.isValid).toBe(true);
    
    const isGasSponsorshipAvailable = TokenizationService.isGasSponsorshipAvailable('sepolia');
    expect(isGasSponsorshipAvailable).toBe(true);
    
    const cost = await TokenizationService.estimateTokenizationCost('sepolia');
    expect(cost.estimatedFee).toBeDefined();
    expect(cost.currency).toBe('ETH');
  });

  it('should support complete tokenization workflow on Mainnet', async () => {
    const validation = TokenizationService.validateNetwork('mainnet');
    
    if (validation.isValid) {
      const cost = await TokenizationService.estimateTokenizationCost('mainnet');
      expect(cost.estimatedFee).toBeDefined();
      expect(cost.currency).toBe('ETH');
      
      // Mainnet should have higher fees
      const sepoliaCost = await TokenizationService.estimateTokenizationCost('sepolia');
      expect(parseFloat(cost.estimatedFee)).toBeGreaterThan(parseFloat(sepoliaCost.estimatedFee));
    }
  });
});

describe('Performance and Reliability', () => {
  it('should handle rapid network switching', () => {
    const networks: NetworkType[] = ['sepolia', 'mainnet', 'sepolia', 'mainnet'];
    
    networks.forEach(network => {
      const contracts = getContractAddresses(network);
      const config = NETWORK_CONFIG[network];
      
      expect(contracts).toBeDefined();
      expect(config).toBeDefined();
    });
  });

  it('should cache network configurations efficiently', () => {
    const start = performance.now();
    
    // Multiple calls should be fast (cached)
    for (let i = 0; i < 100; i++) {
      getContractAddresses('sepolia');
      getContractAddresses('mainnet');
    }
    
    const end = performance.now();
    expect(end - start).toBeLessThan(100); // Should complete in under 100ms
  });
});
