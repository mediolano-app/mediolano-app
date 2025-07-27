'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from '@starknet-react/core';
import { Contract, Abi } from 'starknet';
import { abi } from '@/abis/abi';
import {
	CreatedAsset,
	AssetType,
} from '@/components/created-assets/created-assets';
import {
	mockCreatedAssets,
	mockCreatedAssetsStats,
} from '@/lib/mockCreatedAssets';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP || '';

// Development mode flag - can be toggled for testing
const DEVELOPMENT_MODE =
	process.env.NODE_ENV === 'development' &&
	process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export interface CreatedAssetsStats {
	totalAssets: number;
	uniqueTypes: number;
	mostRecentAsset: string | null;
	activeAssets: number;
	assetsByType: Record<AssetType, number>;
}

export function useCreatedAssets(walletAddress?: string) {
	const { account } = useAccount();

	const [assets, setAssets] = useState<CreatedAsset[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [stats, setStats] = useState<CreatedAssetsStats | null>(null);
	const [userTokens, setUserTokens] = useState<string[]>([]);
	const [contract, setContract] = useState<Contract | null>(null);

	// Determine asset type from metadata with enhanced detection
	const determineAssetType = useCallback(
		(metadata: Record<string, unknown>): AssetType => {
			if (!metadata) return 'Other';

			const name = (metadata.name as string)?.toLowerCase() || '';
			const type = (metadata.type as string)?.toLowerCase() || '';
			const assetType = (metadata.asset_type as string)?.toLowerCase() || '';
			const category = (metadata.category as string)?.toLowerCase() || '';
			const tags = Array.isArray(metadata.tags)
				? metadata.tags.map((tag: unknown) => String(tag).toLowerCase())
				: [];
			const allText = `${name} ${type} ${assetType} ${category} ${tags.join(
				' '
			)}`;

			// Enhanced asset type detection with priority order

			// AI Models (high priority)
			if (
				allText.includes('ai model') ||
				allText.includes('machine learning') ||
				allText.includes('neural network') ||
				allText.includes('artificial intelligence') ||
				category === 'ai' ||
				type === 'ai_model'
			) {
				return 'AI Model';
			}

			// IP Tokens and Coins
			if (
				allText.includes('ip token') ||
				metadata.token_standard === 'ERC20' ||
				metadata.is_fungible === true
			) {
				if (allText.includes('coin')) return 'IP Coin';
				return 'IP Token';
			}

			// Story Chapters and Publications
			if (
				allText.includes('story') ||
				allText.includes('chapter') ||
				allText.includes('narrative') ||
				category === 'story'
			) {
				return 'Story Chapter';
			}

			if (
				allText.includes('publication') ||
				allText.includes('book') ||
				allText.includes('paper') ||
				allText.includes('article') ||
				category === 'publication'
			) {
				return 'Publication';
			}

			// Creative Assets
			if (
				allText.includes('artwork') ||
				allText.includes('painting') ||
				allText.includes('drawing') ||
				allText.includes('visual art') ||
				category === 'art' ||
				category === 'artwork'
			) {
				return 'Artwork';
			}

			if (
				allText.includes('music') ||
				allText.includes('audio') ||
				allText.includes('song') ||
				allText.includes('sound') ||
				category === 'music' ||
				category === 'audio'
			) {
				return 'Music';
			}

			if (
				allText.includes('video') ||
				allText.includes('film') ||
				allText.includes('movie') ||
				allText.includes('animation') ||
				category === 'video' ||
				category === 'film'
			) {
				return 'Video';
			}

			// Technical Assets
			if (
				allText.includes('software') ||
				allText.includes('code') ||
				allText.includes('application') ||
				allText.includes('program') ||
				category === 'software' ||
				type === 'software'
			) {
				return 'Software';
			}

			if (
				allText.includes('patent') ||
				allText.includes('invention') ||
				category === 'patent' ||
				type === 'patent'
			) {
				return 'Patent';
			}

			// Real World Assets
			if (
				allText.includes('rwa') ||
				allText.includes('real world asset') ||
				allText.includes('physical asset') ||
				category === 'rwa' ||
				type === 'rwa'
			) {
				return 'RWA';
			}

			// Documents
			if (
				allText.includes('document') ||
				allText.includes('pdf') ||
				allText.includes('text') ||
				allText.includes('contract') ||
				category === 'document'
			) {
				return 'Document';
			}

			// NFTs (general)
			if (
				allText.includes('nft') ||
				allText.includes('non-fungible') ||
				metadata.token_standard === 'ERC721' ||
				metadata.token_standard === 'ERC1155'
			) {
				return 'NFT';
			}

			return 'Other';
		},
		[]
	);

	// Determine token standard from metadata
	const determineTokenStandard = useCallback(
		(metadata: Record<string, unknown>): 'ERC721' | 'ERC1155' | 'ERC20' => {
			if (metadata?.token_standard) {
				return metadata.token_standard as 'ERC721' | 'ERC1155' | 'ERC20';
			}

			// Default based on asset type
			if (
				metadata?.asset_type?.toString().includes('coin') ||
				metadata?.symbol
			) {
				return 'ERC20';
			}

			return 'ERC721';
		},
		[]
	);

	// Calculate comprehensive stats from assets
	const calculateStats = useCallback(
		(assets: CreatedAsset[]): CreatedAssetsStats => {
			const assetsByType: Record<AssetType, number> = {
				'IP Token': 0,
				'IP Coin': 0,
				'Story Chapter': 0,
				Artwork: 0,
				Music: 0,
				Video: 0,
				Document: 0,
				Software: 0,
				Patent: 0,
				'AI Model': 0,
				NFT: 0,
				Publication: 0,
				RWA: 0,
				Other: 0,
			};

			assets.forEach((asset) => {
				assetsByType[asset.assetType]++;
			});

			const uniqueTypes = Object.values(assetsByType).filter(
				(count) => count > 0
			).length;
			const activeAssets = assets.filter((asset) => asset.isActive).length;

			// Find most recent asset
			const sortedByDate = [...assets].sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
			const mostRecentAsset =
				sortedByDate.length > 0 ? sortedByDate[0].name : null;

			return {
				totalAssets: assets.length,
				uniqueTypes,
				mostRecentAsset,
				activeAssets,
				assetsByType,
			};
		},
		[]
	);

	// Fetch token metadata from IPFS with proper error handling
	const fetchTokenMetadata = useCallback(
		async (tokenId: string): Promise<Record<string, unknown> | null> => {
			if (!contract) return null;

			try {
				// Get tokenURI from contract
				const tokenUri = await contract.call('tokenURI', [tokenId]);
				if (!tokenUri || typeof tokenUri !== 'string') return null;

				// Handle IPFS URLs
				let metadataUrl = tokenUri.toString();
				if (metadataUrl.startsWith('ipfs://')) {
					metadataUrl = metadataUrl.replace(
						'ipfs://',
						'https://gateway.pinata.cloud/ipfs/'
					);
				}

				// Fetch metadata with timeout
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

				const response = await fetch(metadataUrl, {
					signal: controller.signal,
				});
				clearTimeout(timeoutId);

				if (!response.ok) return null;

				const metadata = await response.json();
				return metadata;
			} catch (err) {
				console.error(`Error fetching metadata for token ${tokenId}:`, err);
				return null;
			}
		},
		[contract]
	);

	// Handle development mode with mock data
	useEffect(() => {
		if (DEVELOPMENT_MODE) {
			setIsLoading(true);
			// Simulate loading delay
			setTimeout(() => {
				setAssets(mockCreatedAssets);
				setStats(mockCreatedAssetsStats);
				setIsLoading(false);
				setError(null);
			}, 1000);
			return;
		}
	}, []);

	// Initialize contract for production mode
	useEffect(() => {
		if (DEVELOPMENT_MODE) return;

		if (account && contractAddress) {
			try {
				const newContract = new Contract(
					abi as unknown as Abi,
					contractAddress,
					account
				);
				setContract(newContract);
			} catch (err) {
				console.error('Error initializing contract:', err);
				setError('Failed to initialize contract');
				setIsLoading(false);
			}
		}
	}, [account]);

	// Fetch user tokens when contract or wallet changes
	useEffect(() => {
		if (DEVELOPMENT_MODE) return;

		if (account && contract && walletAddress) {
			setIsLoading(true);
			setError(null);

			contract
				.call('list_user_tokens', [walletAddress])
				.then((result: unknown) => {
					const tokens = Array.isArray(result)
						? result.map((token: unknown) => String(token))
						: [];
					setUserTokens(tokens);
				})
				.catch((err: Error) => {
					console.error('Error fetching user tokens:', err);
					setError('Failed to fetch assets from blockchain');
					setIsLoading(false);
				});
		}
	}, [account, contract, walletAddress]);

	// Process tokens into assets
	useEffect(() => {
		if (DEVELOPMENT_MODE) return;

		if (userTokens.length > 0 && contract && walletAddress) {
			const processTokens = async () => {
				try {
					const assetPromises = userTokens.map(async (tokenId) => {
						try {
							const metadata = await fetchTokenMetadata(tokenId);
							if (!metadata) return null;

							const asset: CreatedAsset = {
								id: tokenId,
								tokenId,
								name: (metadata.name as string) || `Asset #${tokenId}`,
								description:
									(metadata.description as string) ||
									'No description available',
								image: (metadata.image as string) || '',
								assetType: determineAssetType(metadata),
								tokenStandard: determineTokenStandard(metadata),
								contractAddress,
								createdAt: new Date().toISOString(), // In real implementation, this would come from blockchain events
								blockchain: 'Starknet' as const,
								isActive: true,
								metadata,
							};

							return asset;
						} catch (error) {
							console.error(`Error processing token ${tokenId}:`, error);
							return null;
						}
					});

					const processedAssets = await Promise.all(assetPromises);
					const validAssets = processedAssets.filter(
						(asset): asset is CreatedAsset => asset !== null
					);

					setAssets(validAssets);
					setStats(calculateStats(validAssets));
					setIsLoading(false);
				} catch (err) {
					console.error('Error processing tokens:', err);
					setError('Failed to process assets');
					setIsLoading(false);
				}
			};

			processTokens();
		} else if (userTokens.length === 0 && contract && walletAddress) {
			setAssets([]);
			setStats(calculateStats([]));
			setIsLoading(false);
		}
	}, [
		userTokens,
		contract,
		walletAddress,
		fetchTokenMetadata,
		determineAssetType,
		determineTokenStandard,
		calculateStats,
		isLoading,
	]);

	// Refetch function for manual refresh
	const refetch = useCallback(() => {
		if (DEVELOPMENT_MODE) {
			setIsLoading(true);
			setTimeout(() => {
				setAssets(mockCreatedAssets);
				setStats(mockCreatedAssetsStats);
				setIsLoading(false);
			}, 500);
			return;
		}

		if (account && contract && walletAddress) {
			setIsLoading(true);
			setError(null);

			// Refetch user tokens
			contract
				.call('list_user_tokens', [walletAddress])
				.then((result: unknown) => {
					const tokens = Array.isArray(result)
						? result.map((token: unknown) => String(token))
						: [];
					setUserTokens(tokens);
				})
				.catch((err: Error) => {
					console.error('Error refetching user tokens:', err);
					setError('Failed to refetch assets');
					setIsLoading(false);
				});
		}
	}, [account, contract, walletAddress]);

	return {
		assets,
		isLoading,
		error,
		stats,
		refetch,
	};
}
