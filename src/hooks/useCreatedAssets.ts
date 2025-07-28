'use client';

import { useState, useEffect, useMemo } from 'react';
import {
	useMIP,
	useCreatorNFTPortfolio,
	type IP,
} from '@/hooks/contracts/use-mip';

export type AssetType =
	| 'IP Token'
	| 'IP Coin'
	| 'Story Chapter'
	| 'Artwork'
	| 'Music'
	| 'Video'
	| 'Document'
	| 'Software'
	| 'Patent'
	| 'AI Model'
	| 'NFT'
	| 'Publication'
	| 'RWA'
	| 'Other';

export interface CreatedAsset {
	id: string;
	tokenId: string;
	name: string;
	description: string;
	image: string;
	assetType: AssetType;
	createdAt: string;
	contractAddress: string;
	blockchain: string;
	tokenStandard: string;
	isActive: boolean;
	external_url?: string;
	attributes?: Array<{
		trait_type: string;
		value: string | number;
	}>;
}

export interface CreatedAssetsStats {
	totalAssets: number;
	uniqueTypes: number;
	mostRecentAsset: CreatedAsset | null;
	activeAssets: number;
	assetsByType: Record<AssetType, number>;
}

export function useCreatedAssets() {
	const [assets, setAssets] = useState<CreatedAsset[]>([]);
	const [error, setError] = useState<string | null>(null);

	// Use the real blockchain hooks
	const { balanceError, tokenIdsError, isLoading: mipLoading } = useMIP();

	const {
		metadata,
		loading: metadataLoading,
		error: metadataError,
	} = useCreatorNFTPortfolio();

	const isLoading = mipLoading || metadataLoading;

	// Determine asset type based on metadata
	const determineAssetType = (ipMetadata: IP): AssetType => {
		const name = ipMetadata.name?.toLowerCase() || '';
		const description = ipMetadata.description?.toLowerCase() || '';
		const attributes = ipMetadata.attributes || [];

		// Check attributes first for more specific classification
		for (const attr of attributes) {
			const traitType = attr.trait_type?.toLowerCase() || '';
			const value = attr.value?.toLowerCase() || '';

			if (traitType.includes('type') || traitType.includes('category')) {
				if (value.includes('ip') && value.includes('token')) return 'IP Token';
				if (value.includes('ip') && value.includes('coin')) return 'IP Coin';
				if (value.includes('story') || value.includes('chapter'))
					return 'Story Chapter';
				if (value.includes('artwork') || value.includes('art'))
					return 'Artwork';
				if (value.includes('music') || value.includes('audio')) return 'Music';
				if (value.includes('video') || value.includes('film')) return 'Video';
				if (value.includes('document') || value.includes('pdf'))
					return 'Document';
				if (value.includes('software') || value.includes('code'))
					return 'Software';
				if (value.includes('patent')) return 'Patent';
				if (value.includes('ai') || value.includes('model')) return 'AI Model';
				if (value.includes('nft')) return 'NFT';
				if (value.includes('publication') || value.includes('book'))
					return 'Publication';
				if (value.includes('rwa') || value.includes('real world')) return 'RWA';
			}
		}

		// Fallback to name/description analysis
		if (
			name.includes('ip') &&
			(name.includes('token') || description.includes('token'))
		)
			return 'IP Token';
		if (name.includes('coin') || name.includes('currency')) return 'IP Coin';
		if (
			name.includes('story') ||
			name.includes('chapter') ||
			description.includes('narrative')
		)
			return 'Story Chapter';
		if (
			name.includes('art') ||
			name.includes('artwork') ||
			name.includes('painting')
		)
			return 'Artwork';
		if (
			name.includes('music') ||
			name.includes('song') ||
			name.includes('audio')
		)
			return 'Music';
		if (
			name.includes('video') ||
			name.includes('film') ||
			name.includes('movie')
		)
			return 'Video';
		if (
			name.includes('document') ||
			name.includes('pdf') ||
			name.includes('paper')
		)
			return 'Document';
		if (
			name.includes('software') ||
			name.includes('app') ||
			name.includes('code')
		)
			return 'Software';
		if (name.includes('patent') || description.includes('invention'))
			return 'Patent';
		if (
			name.includes('ai') ||
			name.includes('model') ||
			name.includes('algorithm')
		)
			return 'AI Model';
		if (name.includes('nft') || name.includes('collectible')) return 'NFT';
		if (
			name.includes('publication') ||
			name.includes('book') ||
			name.includes('article')
		)
			return 'Publication';
		if (
			name.includes('rwa') ||
			name.includes('real world') ||
			name.includes('physical')
		)
			return 'RWA';

		return 'Other';
	};

	// Convert blockchain data to CreatedAsset format
	useEffect(() => {
		if (metadataError || balanceError || tokenIdsError) {
			setError(
				metadataError ||
					balanceError?.message ||
					tokenIdsError?.message ||
					'Failed to fetch assets'
			);
			return;
		}

		if (!metadata || metadata.length === 0) {
			setAssets([]);
			return;
		}

		try {
			const convertedAssets: CreatedAsset[] = metadata.map((ipData) => ({
				id: `asset-${ipData.tokenId}`,
				tokenId: ipData.tokenId.toString(),
				name: ipData.name || `Programmable IP #${ipData.tokenId}`,
				description: ipData.description || 'No description available',
				image: ipData.image || '/placeholder.svg',
				assetType: determineAssetType(ipData),
				createdAt: new Date().toISOString(), // Real creation date would come from blockchain events
				contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP || '',
				blockchain: 'Starknet',
				tokenStandard: 'ERC721', // Based on the MIP contract structure
				isActive: true, // Assume all fetched assets are active
				external_url: ipData.external_url,
				attributes: ipData.attributes,
			}));

			setAssets(convertedAssets);
			setError(null);
		} catch (err) {
			console.error('Error converting blockchain data to assets:', err);
			setError('Failed to process asset data');
		}
	}, [metadata, metadataError, balanceError, tokenIdsError]);

	// Calculate statistics
	const stats: CreatedAssetsStats = useMemo(() => {
		if (assets.length === 0) {
			return {
				totalAssets: 0,
				uniqueTypes: 0,
				mostRecentAsset: null,
				activeAssets: 0,
				assetsByType: {} as Record<AssetType, number>,
			};
		}

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
		const mostRecentAsset = assets.length > 0 ? assets[0] : null; // Assuming first is most recent

		return {
			totalAssets: assets.length,
			uniqueTypes,
			mostRecentAsset,
			activeAssets,
			assetsByType,
		};
	}, [assets]);

	const refetch = () => {
		// The underlying hooks will handle refetching
		window.location.reload();
	};

	return {
		assets,
		isLoading,
		error,
		stats,
		refetch,
	};
}
