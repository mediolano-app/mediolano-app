// Test runner to demonstrate all tests pass
import { createdAssetsTests } from './components/created-assets.test';
import { useCreatedAssetsTests } from './hooks/useCreatedAssets.test';

// Simple test results interface
interface TestResult {
	name: string;
	passed: boolean;
	message: string;
}

interface TestSuite {
	suiteName: string;
	passed: number;
	failed: number;
	total: number;
	results: TestResult[];
}

// Run all test suites
export function runAllTests(): {
	totalPassed: number;
	totalFailed: number;
	totalTests: number;
	suites: TestSuite[];
} {
	console.log('🧪 Running Created Assets Test Suite...\n');

	// Run component tests
	const componentTestResults = createdAssetsTests.runAllTests();
	const componentSuite: TestSuite = {
		suiteName: 'CreatedAssets Component',
		...componentTestResults,
	};

	// Run hook tests
	const hookTestResults = useCreatedAssetsTests.runAllTests();
	const hookSuite: TestSuite = {
		suiteName: 'useCreatedAssets Hook',
		...hookTestResults,
	};

	const suites = [componentSuite, hookSuite];

	// Calculate totals
	const totalPassed = suites.reduce((sum, suite) => sum + suite.passed, 0);
	const totalFailed = suites.reduce((sum, suite) => sum + suite.failed, 0);
	const totalTests = suites.reduce((sum, suite) => sum + suite.total, 0);

	// Print results
	suites.forEach((suite) => {
		console.log(`📝 ${suite.suiteName}:`);
		console.log(`   ✅ Passed: ${suite.passed}`);
		console.log(`   ❌ Failed: ${suite.failed}`);
		console.log(`   📊 Total: ${suite.total}\n`);

		suite.results.forEach((result) => {
			const icon = result.passed ? '✅' : '❌';
			console.log(`   ${icon} ${result.name}: ${result.message}`);
		});
		console.log('');
	});

	console.log(`🎯 Overall Results:`);
	console.log(`   ✅ Total Passed: ${totalPassed}`);
	console.log(`   ❌ Total Failed: ${totalFailed}`);
	console.log(`   📊 Total Tests: ${totalTests}`);
	console.log(
		`   📈 Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%\n`
	);

	return {
		totalPassed,
		totalFailed,
		totalTests,
		suites,
	};
}

// Export individual test runners for selective testing
export { createdAssetsTests, useCreatedAssetsTests };

// Run tests if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
	runAllTests();
}
