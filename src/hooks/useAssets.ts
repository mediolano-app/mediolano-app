import { useAccount, useContract } from '@starknet-react/core';
import { useCallback, useState, useEffect } from 'react';
import { Contract } from 'starknet';

// Import the contract ABI type from starknet
import type { Abi } from 'starknet';
import { abi as contractAbi } from '@/abis/abi';

// Hardcoded contract address for development
const CONTRACT_ADDRESS = '0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0' as `0x${string}`;
const abi = contractAbi as Abi;

// Test data for preview
const TEST_ASSETS = [
    {
        id: "1",
        uri: "https://picsum.photos/400/400?random=1",
        owner: "0x123...abc",
        name: "Test IP Asset #1",
        description: "A sample intellectual property asset"
    },
    {
        id: "2",
        uri: "https://picsum.photos/400/400?random=2",
        owner: "0x456...def",
        name: "Test IP Asset #2",
        description: "Another sample IP asset"
    },
    {
        id: "3",
        uri: "https://picsum.photos/400/400?random=3",
        owner: "0x789...ghi",
        name: "Test IP Asset #3",
        description: "Yet another sample IP asset"
    }
];

export interface Asset {
    id: string;
    uri: string;
    owner: string;
    name: string;
    description?: string;
}

interface UseAssetsOptions {
    pageSize?: number;
    useTestData?: boolean;
    pollingInterval?: number; // Interval in ms for polling updates
}

interface UseAssetsReturn {
    assets: Asset[];
    loading: boolean;
    error: Error | null;
    totalAssets: number;
    fetchAssets: (page: number) => Promise<void>;
    isTestData: boolean;
    isPolling: boolean;
    startPolling: () => void;
    stopPolling: () => void;
}

interface FetchedAsset {
    id: string;
    uri: string;
    owner: string;
    name: string;
}

/**
 * Hook for managing onchain assets with real-time updates
 * @param options Configuration options for the hook
 * @returns Asset management functions and state
 */
export function useAssets({
    pageSize = 12,
    useTestData = true,
    pollingInterval = 5000 // 5 seconds default polling
}: UseAssetsOptions = {}): UseAssetsReturn {
    const { address } = useAccount();
    const [assets, setAssets] = useState<Asset[]>(TEST_ASSETS); // Initialize with test data
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [totalAssets, setTotalAssets] = useState(TEST_ASSETS.length);
    const [isTestData, setIsTestData] = useState(true);
    const [isPolling, setIsPolling] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { contract } = useContract({
        abi,
        address: CONTRACT_ADDRESS,
    });

    const fetchAssets = useCallback(async (page: number) => {
        // If useTestData is true and no wallet is connected, just use test data
        if (useTestData && !address) {
            setAssets(TEST_ASSETS);
            setTotalAssets(TEST_ASSETS.length);
            setIsTestData(true);
            return;
        }

        setLoading(true);
        setError(null);
        setCurrentPage(page);

        try {
            if (!contract || !address) {
                throw new Error(
                    !contract
                        ? "Smart contract not initialized. Please check your network connection and contract address."
                        : "Wallet not connected. Please connect your wallet to view your assets."
                );
            }

            // Get total assets count with retry mechanism
            const getTotalCount = async (retries = 3): Promise<number> => {
                try {
                    const count = await contract.call('current');
                    return Number(count);
                } catch (err) {
                    if (retries > 0) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        return getTotalCount(retries - 1);
                    }
                    throw err;
                }
            };

            const totalCount = await getTotalCount();
            setTotalAssets(totalCount);

            // If no assets found and test data is enabled, use test data
            if (totalCount === 0 && useTestData) {
                setAssets(TEST_ASSETS);
                setTotalAssets(TEST_ASSETS.length);
                setIsTestData(true);
                return;
            }

            // Calculate pagination
            const startIndex = (page - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalCount);

            const fetchPromises = [];
            for (let i = startIndex; i < endIndex; i++) {
                const tokenId = i + 1;
                fetchPromises.push(
                    Promise.all([
                        contract.call('token_uri', [tokenId]),
                        contract.call('ownerOf', [tokenId])
                    ]).then(([uri, owner]) => ({
                        id: tokenId.toString(),
                        uri: uri as string,
                        owner: owner as string,
                        name: `IP Asset #${tokenId}`
                    } as FetchedAsset)).catch(error => {
                        console.error(`Error fetching token ${tokenId}:`, error);
                        return null;
                    })
                );
            }

            const fetchedAssets = (await Promise.all(fetchPromises))
                .filter((asset): asset is FetchedAsset => asset !== null)
                .map(asset => ({
                    ...asset,
                    name: asset.name || `Asset #${asset.id}` // Ensure name is always present
                }));

            if (fetchedAssets.length === 0 && useTestData) {
                setAssets(TEST_ASSETS);
                setTotalAssets(TEST_ASSETS.length);
                setIsTestData(true);
            } else {
                setAssets(fetchedAssets);
                setIsTestData(false);
            }
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Failed to fetch assets. Please check your connection and try again.';
            setError(new Error(errorMessage));
            console.error('Error fetching assets:', err);

            if (useTestData) {
                setAssets(TEST_ASSETS);
                setTotalAssets(TEST_ASSETS.length);
                setIsTestData(true);
            }
        } finally {
            setLoading(false);
        }
    }, [address, contract, pageSize, useTestData]);

    // Polling mechanism for real-time updates
    const startPolling = useCallback(() => {
        setIsPolling(true);
    }, []);

    const stopPolling = useCallback(() => {
        setIsPolling(false);
    }, []);

    // Effect for polling
    useEffect(() => {
        if (!isPolling || isTestData) return;

        const pollInterval = setInterval(() => {
            fetchAssets(currentPage);
        }, pollingInterval);

        return () => clearInterval(pollInterval);
    }, [isPolling, fetchAssets, currentPage, pollingInterval, isTestData]);

    // Auto-start polling when connected
    useEffect(() => {
        if (address && !isTestData) {
            startPolling();
        }
        return () => stopPolling();
    }, [address, isTestData]);

    return {
        assets,
        loading,
        error,
        totalAssets,
        fetchAssets,
        isTestData,
        isPolling,
        startPolling,
        stopPolling
    };
} 