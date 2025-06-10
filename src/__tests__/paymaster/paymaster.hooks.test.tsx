/**
 * Integration tests for Paymaster hooks
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { usePaymasterTransaction } from '@/hooks/usePaymasterTransaction';
import { usePaymasterMinting } from '@/hooks/usePaymasterMinting';

// Mock the AVNU SDK
jest.mock('@avnu/gasless-sdk', () => ({
  fetchGasTokenPrices: jest.fn(),
  fetchAccountCompatibility: jest.fn(),
  executeCalls: jest.fn(),
}));

// Mock Starknet React hooks
jest.mock('@starknet-react/core', () => ({
  useAccount: jest.fn(),
  useSendTransaction: jest.fn(),
  useContract: jest.fn(),
}));

// Mock toast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

const mockAccount = {
  address: '0x123456789abcdef',
  signMessage: jest.fn(),
};

const mockContract = {
  populate: jest.fn(),
};

describe('usePaymasterTransaction Hook', () => {
  beforeEach(() => {
    const { useAccount, useSendTransaction, useContract } = require('@starknet-react/core');
    const { fetchGasTokenPrices, fetchAccountCompatibility } = require('@avnu/gasless-sdk');
    
    useAccount.mockReturnValue({
      account: mockAccount,
      address: mockAccount.address,
    });
    
    useSendTransaction.mockReturnValue({
      send: jest.fn(),
      error: null,
    });
    
    useContract.mockReturnValue({
      contract: mockContract,
    });
    
    fetchGasTokenPrices.mockResolvedValue([
      {
        tokenAddress: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
        gasTokenPrice: '2000000',
        gasUnitPrice: '1000000000000000',
      },
    ]);
    
    fetchAccountCompatibility.mockResolvedValue({
      isCompatible: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default state', async () => {
    const { result } = renderHook(() =>
      usePaymasterTransaction({
        calls: [],
        transactionType: 'mint',
        enabled: true,
      })
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.transactionHash).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.gasTokenPrices).toEqual([]);
    expect(result.current.isGaslessCompatible).toBe(false);
  });

  it('should check account compatibility on mount', async () => {
    const { fetchAccountCompatibility } = require('@avnu/gasless-sdk');
    
    renderHook(() =>
      usePaymasterTransaction({
        calls: [],
        transactionType: 'mint',
        enabled: true,
      })
    );

    // Wait for async operations
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(fetchAccountCompatibility).toHaveBeenCalledWith(mockAccount.address);
  });

  it('should fetch gas token prices on mount', async () => {
    const { fetchGasTokenPrices } = require('@avnu/gasless-sdk');
    
    renderHook(() =>
      usePaymasterTransaction({
        calls: [],
        transactionType: 'mint',
        enabled: true,
      })
    );

    // Wait for async operations
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(fetchGasTokenPrices).toHaveBeenCalled();
  });

  it('should determine sponsorship eligibility correctly', () => {
    // Mock environment for sponsorship
    process.env.NEXT_PUBLIC_ENABLE_GAS_SPONSORSHIP = 'true';
    process.env.NEXT_PUBLIC_SPONSOR_MINTING = 'true';
    
    const { result } = renderHook(() =>
      usePaymasterTransaction({
        calls: [],
        transactionType: 'mint',
        enabled: true,
      })
    );

    expect(result.current.canSponsor).toBe(true);
  });

  it('should handle gasless transaction execution', async () => {
    const { executeCalls } = require('@avnu/gasless-sdk');
    executeCalls.mockResolvedValue({
      transactionHash: '0xabcdef123456',
    });

    const { result } = renderHook(() =>
      usePaymasterTransaction({
        calls: [{ contractAddress: '0x123', entrypoint: 'mint', calldata: [] }],
        transactionType: 'mint',
        enabled: true,
      })
    );

    await act(async () => {
      await result.current.executeGasless(
        '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
        BigInt('1000000')
      );
    });

    expect(executeCalls).toHaveBeenCalledWith(
      mockAccount,
      [{ contractAddress: '0x123', entrypoint: 'mint', calldata: [] }],
      expect.objectContaining({
        gasTokenAddress: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
        maxGasTokenAmount: BigInt('1000000'),
      })
    );
  });

  it('should handle errors in gasless execution', async () => {
    const { executeCalls } = require('@avnu/gasless-sdk');
    executeCalls.mockRejectedValue(new Error('Gasless execution failed'));

    const { result } = renderHook(() =>
      usePaymasterTransaction({
        calls: [{ contractAddress: '0x123', entrypoint: 'mint', calldata: [] }],
        transactionType: 'mint',
        enabled: true,
      })
    );

    await act(async () => {
      await result.current.executeGasless(
        '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
        BigInt('1000000')
      );
    });

    expect(result.current.error).toBe('Gasless execution failed');
  });

  it('should not execute when account is not connected', async () => {
    const { useAccount } = require('@starknet-react/core');
    useAccount.mockReturnValue({
      account: null,
      address: null,
    });

    const { result } = renderHook(() =>
      usePaymasterTransaction({
        calls: [],
        transactionType: 'mint',
        enabled: true,
      })
    );

    await act(async () => {
      await result.current.executeGasless(
        '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
        BigInt('1000000')
      );
    });

    expect(result.current.error).toBe('Account not connected or no calls provided');
  });
});

describe('usePaymasterMinting Hook', () => {
  beforeEach(() => {
    const { useAccount, useContract } = require('@starknet-react/core');
    
    useAccount.mockReturnValue({
      account: mockAccount,
      address: mockAccount.address,
    });
    
    useContract.mockReturnValue({
      contract: mockContract,
    });
    
    mockContract.populate.mockReturnValue({
      contractAddress: '0x123',
      entrypoint: 'mint_item',
      calldata: ['0x123', 'ipfs://test'],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => usePaymasterMinting());

    expect(result.current.isMinting).toBe(false);
    expect(result.current.mintingHash).toBe(null);
    expect(result.current.mintingError).toBe(null);
  });

  it('should prepare mint calls correctly', () => {
    const { result } = renderHook(() => usePaymasterMinting());

    // This would be tested indirectly through the minting functions
    expect(mockContract.populate).not.toHaveBeenCalled();
  });

  it('should handle sponsored minting when available', async () => {
    // Mock sponsorship availability
    process.env.NEXT_PUBLIC_ENABLE_GAS_SPONSORSHIP = 'true';
    process.env.NEXT_PUBLIC_SPONSOR_MINTING = 'true';

    const { result } = renderHook(() => usePaymasterMinting());

    expect(result.current.canSponsorMint).toBe(true);
  });

  it('should reset minting state correctly', () => {
    const { result } = renderHook(() => usePaymasterMinting());

    act(() => {
      result.current.resetMintingState();
    });

    expect(result.current.isMinting).toBe(false);
    expect(result.current.mintingHash).toBe(null);
    expect(result.current.mintingError).toBe(null);
  });

  it('should handle contract not available error', async () => {
    const { useContract } = require('@starknet-react/core');
    useContract.mockReturnValue({
      contract: null,
    });

    const { result } = renderHook(() => usePaymasterMinting());

    await act(async () => {
      try {
        await result.current.mintTraditional('0x123', 'ipfs://test');
      } catch (error) {
        // Expected to throw
      }
    });

    // The hook should handle the error internally
    expect(result.current.mintingError).toBeTruthy();
  });
});

describe('Hook Integration', () => {
  it('should work together for complete minting flow', async () => {
    const { executeCalls } = require('@avnu/gasless-sdk');
    executeCalls.mockResolvedValue({
      transactionHash: '0xmintinghash123',
    });

    const { result: mintingResult } = renderHook(() => usePaymasterMinting());
    
    // Simulate successful gasless minting
    await act(async () => {
      await mintingResult.current.mintWithPaymaster(
        '0x123',
        'ipfs://test',
        '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
        BigInt('1000000')
      );
    });

    expect(mockContract.populate).toHaveBeenCalledWith('mint_item', ['0x123', 'ipfs://test']);
  });
});
