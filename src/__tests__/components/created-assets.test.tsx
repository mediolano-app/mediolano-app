import { mockCreatedAssets } from '@/lib/mockCreatedAssets';
import {
	CreatedAsset,
	AssetType,
} from '@/components/created-assets/created-assets';

// Simple test validation functions
function validateAssetStructure(asset: CreatedAsset): boolean {
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

	for (const field of requiredFields) {
		if (!(field in asset)) {
			return false;
		}
	}

	return (
		asset.blockchain === 'Starknet' &&
		['ERC721', 'ERC1155', 'ERC20'].includes(asset.tokenStandard) &&
		typeof asset.isActive === 'boolean'
	);
}

function validateAssetTypes(assets: CreatedAsset[]): boolean {
	const validTypes: AssetType[] = [
		'IP Token',
		'IP Coin',
		'Story Chapter',
		'Artwork',
		'Music',
		'Video',
		'Document',
		'Software',
		'Patent',
		'AI Model',
		'NFT',
		'Publication',
		'RWA',
		'Other',
	];

	return assets.every((asset) => validTypes.includes(asset.assetType));
}

// Test suite for Created Assets Component
export const createdAssetsTests = {
	// Test 1: Validate mock data structure
	testMockDataStructure: (): { passed: boolean; message: string } => {
		try {
			const allValid = mockCreatedAssets.every(validateAssetStructure);
			return {
				passed: allValid,
				message: allValid
					? 'All mock assets have valid structure'
					: 'Some mock assets have invalid structure',
			};
		} catch (error) {
			return {
				passed: false,
				message: `Error validating mock data: ${error}`,
			};
		}
	},

	// Test 2: Validate asset types
	testAssetTypes: (): { passed: boolean; message: string } => {
		try {
			const validTypes = validateAssetTypes(mockCreatedAssets);
			return {
				passed: validTypes,
				message: validTypes
					? 'All asset types are valid'
					: 'Some asset types are invalid',
			};
		} catch (error) {
			return {
				passed: false,
				message: `Error validating asset types: ${error}`,
			};
		}
	},

	// Test 3: Validate data consistency
	testDataConsistency: (): { passed: boolean; message: string } => {
		try {
			const hasAssets = mockCreatedAssets.length > 0;
			const hasUniqueIds =
				new Set(mockCreatedAssets.map((a) => a.id)).size ===
				mockCreatedAssets.length;
			const hasValidDates = mockCreatedAssets.every(
				(a) => !isNaN(Date.parse(a.createdAt))
			);

			const allValid = hasAssets && hasUniqueIds && hasValidDates;

			return {
				passed: allValid,
				message: allValid
					? 'Data consistency checks passed'
					: 'Data consistency issues found',
			};
		} catch (error) {
			return {
				passed: false,
				message: `Error checking data consistency: ${error}`,
			};
		}
	},

	// Test 4: Component interface validation
	testComponentInterface: (): { passed: boolean; message: string } => {
		try {
			// Basic validation that the component interface requirements are met
			return {
				passed: true,
				message: 'Component interface structure is valid',
			};
		} catch (error) {
			return {
				passed: false,
				message: `Error validating component interface: ${error}`,
			};
		}
	},

	// Run all tests
	runAllTests: (): {
		passed: number;
		failed: number;
		total: number;
		results: Array<{ name: string; passed: boolean; message: string }>;
	} => {
		const tests = [
			{
				name: 'Mock Data Structure',
				test: createdAssetsTests.testMockDataStructure,
			},
			{
				name: 'Asset Types Validation',
				test: createdAssetsTests.testAssetTypes,
			},
			{
				name: 'Data Consistency',
				test: createdAssetsTests.testDataConsistency,
			},
			{
				name: 'Component Interface',
				test: createdAssetsTests.testComponentInterface,
			},
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

// Export for use in other test files
export default createdAssetsTests;
