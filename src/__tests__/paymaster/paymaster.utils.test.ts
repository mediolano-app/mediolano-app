/**
 * Unit tests for Paymaster utility functions
 */

import { 
  shouldSponsorTransaction,
  formatGasTokenAmount,
  calculateGasCostInToken
} from '@/utils/paymaster';
import { TransactionType } from '@/types/paymaster';

// Mock environment variables
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('Paymaster Utilities', () => {
  describe('shouldSponsorTransaction', () => {
    it('should return false when sponsorship is disabled', () => {
      process.env.NEXT_PUBLIC_ENABLE_GAS_SPONSORSHIP = 'false';
      
      const result = shouldSponsorTransaction('mint' as TransactionType);
      expect(result).toBe(false);
    });

    it('should return true for mint when minting sponsorship is enabled', () => {
      process.env.NEXT_PUBLIC_ENABLE_GAS_SPONSORSHIP = 'true';
      process.env.NEXT_PUBLIC_SPONSOR_MINTING = 'true';
      
      const result = shouldSponsorTransaction('mint' as TransactionType);
      expect(result).toBe(true);
    });

    it('should return false for mint when minting sponsorship is disabled', () => {
      process.env.NEXT_PUBLIC_ENABLE_GAS_SPONSORSHIP = 'true';
      process.env.NEXT_PUBLIC_SPONSOR_MINTING = 'false';
      
      const result = shouldSponsorTransaction('mint' as TransactionType);
      expect(result).toBe(false);
    });

    it('should return true for marketplace transactions when enabled', () => {
      process.env.NEXT_PUBLIC_ENABLE_GAS_SPONSORSHIP = 'true';
      process.env.NEXT_PUBLIC_SPONSOR_MARKETPLACE = 'true';
      
      expect(shouldSponsorTransaction('marketplace_buy' as TransactionType)).toBe(true);
      expect(shouldSponsorTransaction('marketplace_list' as TransactionType)).toBe(true);
    });

    it('should return true for transfers when enabled', () => {
      process.env.NEXT_PUBLIC_ENABLE_GAS_SPONSORSHIP = 'true';
      process.env.NEXT_PUBLIC_SPONSOR_TRANSFERS = 'true';
      
      const result = shouldSponsorTransaction('transfer' as TransactionType);
      expect(result).toBe(true);
    });

    it('should return false for unknown transaction types', () => {
      process.env.NEXT_PUBLIC_ENABLE_GAS_SPONSORSHIP = 'true';
      
      const result = shouldSponsorTransaction('unknown' as TransactionType);
      expect(result).toBe(false);
    });
  });

  describe('formatGasTokenAmount', () => {
    it('should format USDC amount correctly', () => {
      const amount = "1000000"; // 1 USDC (6 decimals)
      const result = formatGasTokenAmount(amount, 6, "USDC");
      expect(result).toBe("1.000000 USDC");
    });

    it('should format ETH amount correctly', () => {
      const amount = "1000000000000000000"; // 1 ETH (18 decimals)
      const result = formatGasTokenAmount(amount, 18, "ETH");
      expect(result).toBe("1.000000 ETH");
    });

    it('should format small amounts correctly', () => {
      const amount = "1000"; // 0.001 USDC
      const result = formatGasTokenAmount(amount, 6, "USDC");
      expect(result).toBe("0.001000 USDC");
    });

    it('should handle zero amount', () => {
      const amount = "0";
      const result = formatGasTokenAmount(amount, 6, "USDC");
      expect(result).toBe("0.000000 USDC");
    });
  });

  describe('calculateGasCostInToken', () => {
    it('should calculate gas cost in USDC correctly', () => {
      const gasFees = BigInt("1000000000000000"); // 0.001 ETH
      const gasTokenPrice = "2000000"; // Price in token units
      const tokenDecimals = 6; // USDC decimals
      
      const result = calculateGasCostInToken(gasFees, gasTokenPrice, tokenDecimals);
      
      // Expected: (1000000000000000 * 2000000) / 10^6
      const expected = BigInt("2000000000000000");
      expect(result).toBe(expected);
    });

    it('should handle different token decimals', () => {
      const gasFees = BigInt("1000000000000000000"); // 1 ETH
      const gasTokenPrice = "1000000000000000000"; // 1:1 price
      const tokenDecimals = 18; // ETH decimals
      
      const result = calculateGasCostInToken(gasFees, gasTokenPrice, tokenDecimals);
      
      // Expected: (1000000000000000000 * 1000000000000000000) / 10^18
      const expected = BigInt("1000000000000000000");
      expect(result).toBe(expected);
    });

    it('should handle zero gas fees', () => {
      const gasFees = BigInt("0");
      const gasTokenPrice = "2000000";
      const tokenDecimals = 6;
      
      const result = calculateGasCostInToken(gasFees, gasTokenPrice, tokenDecimals);
      expect(result).toBe(BigInt("0"));
    });

    it('should handle zero price', () => {
      const gasFees = BigInt("1000000000000000");
      const gasTokenPrice = "0";
      const tokenDecimals = 6;
      
      const result = calculateGasCostInToken(gasFees, gasTokenPrice, tokenDecimals);
      expect(result).toBe(BigInt("0"));
    });
  });
});

describe('Paymaster Constants', () => {
  it('should have correct supported gas tokens', () => {
    const { AVNU_PAYMASTER_CONFIG } = require('@/lib/constants');
    
    expect(AVNU_PAYMASTER_CONFIG.SUPPORTED_GAS_TOKENS).toHaveLength(4);
    
    const symbols = AVNU_PAYMASTER_CONFIG.SUPPORTED_GAS_TOKENS.map((token: any) => token.symbol);
    expect(symbols).toContain('USDC');
    expect(symbols).toContain('USDT');
    expect(symbols).toContain('ETH');
    expect(symbols).toContain('STRK');
  });

  it('should have correct USDC configuration', () => {
    const { AVNU_PAYMASTER_CONFIG } = require('@/lib/constants');
    
    const usdc = AVNU_PAYMASTER_CONFIG.SUPPORTED_GAS_TOKENS.find(
      (token: any) => token.symbol === 'USDC'
    );
    
    expect(usdc).toBeDefined();
    expect(usdc.decimals).toBe(6);
    expect(usdc.address).toMatch(/^0x[a-fA-F0-9]+$/);
  });

  it('should have correct API configuration', () => {
    const { AVNU_PAYMASTER_CONFIG } = require('@/lib/constants');
    
    expect(AVNU_PAYMASTER_CONFIG.API_BASE_URL).toBe('https://starknet.api.avnu.fi/paymaster/v1');
    expect(AVNU_PAYMASTER_CONFIG.GASLESS_API_URL).toBe('https://starknet.api.avnu.fi');
  });
});

describe('Gas Sponsorship Configuration', () => {
  it('should read sponsorship settings from environment', () => {
    process.env.NEXT_PUBLIC_ENABLE_GAS_SPONSORSHIP = 'true';
    process.env.NEXT_PUBLIC_SPONSOR_MINTING = 'true';
    process.env.NEXT_PUBLIC_SPONSOR_TRANSFERS = 'false';
    process.env.NEXT_PUBLIC_SPONSOR_MARKETPLACE = 'true';
    process.env.NEXT_PUBLIC_MAX_SPONSORED_AMOUNT = '5000000000000000';
    
    const { GAS_SPONSORSHIP_CONFIG } = require('@/lib/constants');
    
    expect(GAS_SPONSORSHIP_CONFIG.ENABLED).toBe(true);
    expect(GAS_SPONSORSHIP_CONFIG.SPONSOR_MINTING).toBe(true);
    expect(GAS_SPONSORSHIP_CONFIG.SPONSOR_TRANSFERS).toBe(false);
    expect(GAS_SPONSORSHIP_CONFIG.SPONSOR_MARKETPLACE).toBe(true);
    expect(GAS_SPONSORSHIP_CONFIG.MAX_SPONSORED_AMOUNT).toBe('5000000000000000');
  });

  it('should have default values when environment variables are not set', () => {
    delete process.env.NEXT_PUBLIC_ENABLE_GAS_SPONSORSHIP;
    delete process.env.NEXT_PUBLIC_SPONSOR_MINTING;
    delete process.env.NEXT_PUBLIC_MAX_SPONSORED_AMOUNT;
    
    const { GAS_SPONSORSHIP_CONFIG } = require('@/lib/constants');
    
    expect(GAS_SPONSORSHIP_CONFIG.ENABLED).toBe(false);
    expect(GAS_SPONSORSHIP_CONFIG.SPONSOR_MINTING).toBe(false);
    expect(GAS_SPONSORSHIP_CONFIG.MAX_SPONSORED_AMOUNT).toBe('1000000000000000');
  });
});
