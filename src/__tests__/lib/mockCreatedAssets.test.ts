import {
	mockCreatedAssets,
	mockCreatedAssetsStats,
} from '@/lib/mockCreatedAssets';

// Simple validation tests for mock data
export const mockDataTests = {
	// Test mock assets structure
	testMockAssetsStructure: (): { passed: boolean; message: string } => {
		try {
			const isArray = Array.isArray(mockCreatedAssets);
			const hasAssets = mockCreatedAssets.length > 0;

			if (!isArray || !hasAssets) {
				return {
					passed: false,
					message: 'Mock assets should be a non-empty array',
				};
			}

			// Check each asset has required properties
			const requiredFields = [
				'id',
				'tokenId',
				'name',
				'description',
				'image',
				'assetType',
				'createdAt',
				'contractAddress',
				'blockchain',
				'tokenStandard',
				'isActive',
			];

			for (const asset of mockCreatedAssets) {
				for (const field of requiredFields) {
					if (!(field in asset)) {
						return {
							passed: false,
							message: `Asset missing required field: ${field}`,
						};
					}
				}

				if (asset.blockchain !== 'Starknet') {
					return {
						passed: false,
						message: 'All assets should be on Starknet blockchain',
					};
				}
			}

			return {
				passed: true,
				message: `${mockCreatedAssets.length} mock assets have valid structure`,
			};
		} catch (error) {
			return {
				passed: false,
				message: `Error validating mock assets structure: ${error}`,
			};
		}
	},

	// Test asset type diversity
	testAssetTypeDiversity: (): { passed: boolean; message: string } => {
		try {
			const assetTypes = mockCreatedAssets.map((asset) => asset.assetType);
			const uniqueTypes = [...new Set(assetTypes)];

			const hasDiversity = uniqueTypes.length > 1;
			const hasIPToken = uniqueTypes.includes('IP Token');
			const hasArtwork = uniqueTypes.includes('Artwork');

			return {
				passed: hasDiversity && hasIPToken && hasArtwork,
				message: hasDiversity
					? `Mock data contains ${uniqueTypes.length} different asset types`
					: 'Mock data lacks asset type diversity',
			};
		} catch (error) {
			return {
				passed: false,
				message: `Error testing asset type diversity: ${error}`,
			};
		}
	},

	// Test token standards validity
	testTokenStandards: (): { passed: boolean; message: string } => {
		try {
			const validStandards = ['ERC721', 'ERC1155', 'ERC20'];

			for (const asset of mockCreatedAssets) {
				if (!validStandards.includes(asset.tokenStandard)) {
					return {
						passed: false,
						message: `Invalid token standard found: ${asset.tokenStandard}`,
					};
				}
			}

			return {
				passed: true,
				message: 'All assets have valid token standards',
			};
		} catch (error) {
			return {
				passed: false,
				message: `Error validating token standards: ${error}`,
			};
		}
	},

	// Test creation dates validity
	testCreationDates: (): { passed: boolean; message: string } => {
		try {
			for (const asset of mockCreatedAssets) {
				const date = new Date(asset.createdAt);

				if (date.toString() === 'Invalid Date') {
					return {
						passed: false,
						message: `Invalid creation date found: ${asset.createdAt}`,
					};
				}

				if (date.getTime() > Date.now()) {
					return {
						passed: false,
						message: 'Creation date cannot be in the future',
					};
				}
			}

			return {
				passed: true,
				message: 'All creation dates are valid',
			};
		} catch (error) {
			return {
				passed: false,
				message: `Error validating creation dates: ${error}`,
			};
		}
	},

	// Test stats structure
	testStatsStructure: (): { passed: boolean; message: string } => {
		try {
			const requiredFields = [
				'totalAssets',
				'uniqueTypes',
				'mostRecentAsset',
				'activeAssets',
				'assetsByType',
			];

			for (const field of requiredFields) {
				if (!(field in mockCreatedAssetsStats)) {
					return {
						passed: false,
						message: `Stats missing required field: ${field}`,
					};
				}
			}

			const totalAssetsValid =
				typeof mockCreatedAssetsStats.totalAssets === 'number';
			const uniqueTypesValid =
				typeof mockCreatedAssetsStats.uniqueTypes === 'number';
			const activeAssetsValid =
				typeof mockCreatedAssetsStats.activeAssets === 'number';
			const assetsByTypeValid =
				typeof mockCreatedAssetsStats.assetsByType === 'object';

			const allValid =
				totalAssetsValid &&
				uniqueTypesValid &&
				activeAssetsValid &&
				assetsByTypeValid;

			return {
				passed: allValid,
				message: allValid
					? 'Stats structure is valid'
					: 'Stats structure has type issues',
			};
		} catch (error) {
			return {
				passed: false,
				message: `Error validating stats structure: ${error}`,
			};
		}
	},

	// Test stats consistency
	testStatsConsistency: (): { passed: boolean; message: string } => {
		try {
			// Total assets should match array length
			const totalMatches =
				mockCreatedAssetsStats.totalAssets === mockCreatedAssets.length;

			// Asset type counts should sum to total
			const assetsByType = mockCreatedAssetsStats.assetsByType;
			const totalFromTypes = Object.values(assetsByType).reduce(
				(sum, count) => sum + count,
				0
			);
			const typeCountsMatch =
				totalFromTypes === mockCreatedAssetsStats.totalAssets;

			// Active assets count should match filtered array
			const activeCount = mockCreatedAssets.filter(
				(asset) => asset.isActive
			).length;
			const activeCountMatches =
				mockCreatedAssetsStats.activeAssets === activeCount;

			const allConsistent =
				totalMatches && typeCountsMatch && activeCountMatches;

			return {
				passed: allConsistent,
				message: allConsistent
					? 'Stats are consistent with mock data'
					: 'Stats inconsistencies found',
			};
		} catch (error) {
			return {
				passed: false,
				message: `Error testing stats consistency: ${error}`,
			};
		}
	},

	// Run all mock data tests
	runAllTests: (): {
		passed: number;
		failed: number;
		total: number;
		results: Array<{ name: string; passed: boolean; message: string }>;
	} => {
		const tests = [
			{
				name: 'Mock Assets Structure',
				test: mockDataTests.testMockAssetsStructure,
			},
			{
				name: 'Asset Type Diversity',
				test: mockDataTests.testAssetTypeDiversity,
			},
			{ name: 'Token Standards', test: mockDataTests.testTokenStandards },
			{ name: 'Creation Dates', test: mockDataTests.testCreationDates },
			{ name: 'Stats Structure', test: mockDataTests.testStatsStructure },
			{ name: 'Stats Consistency', test: mockDataTests.testStatsConsistency },
		];

		const results = tests.map(({ name, test }) => {
			const result = test();
			return {
				name,
				...result,
			};
		});

		const passed = results.filter((r) => r.passed).length;
		const failed = results.filter((r) => !r.passed).length;

		return {
			passed,
			failed,
			total: results.length,
			results,
		};
	},
};

export default mockDataTests;
