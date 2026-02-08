/**
 * Fetch Collections Example
 * 
 * Runnable example demonstrating how to fetch and display collections.
 * This is a read-only script that doesn't require private keys.
 * 
 * Usage:
 *   npx ts-node scripts/fetch-collections-example.ts
 */

import { getSDK } from '../../../src/sdk';

// ============================================
// MAIN FUNCTION
// ============================================

async function main() {
    console.log('\n📚 Mediolano Collections Viewer\n');
    console.log('='.repeat(60));

    // Initialize SDK
    console.log('\n🔧 Initializing SDK...');
    const sdk = getSDK();

    // Check SDK status
    try {
        const status = await sdk.getStatus();
        console.log(`   Connected: ${status.connected ? '✅' : '❌'}`);
        console.log(`   Chain: ${status.chainId}`);
        console.log(`   Block: ${status.blockNumber}`);
        console.log(`   Latency: ${status.latency}ms`);
    } catch (error) {
        console.error('❌ Failed to connect to Starknet');
        process.exit(1);
    }

    // Fetch all collections
    console.log('\n📋 Fetching all collections...');
    const collections = await sdk.collections.getAllCollections();
    console.log(`   Found ${collections.length} collections\n`);

    // Display collections table
    console.log('='.repeat(90));
    console.log(
        'ID'.padEnd(6) +
        'Name'.padEnd(30) +
        'Owner'.padEnd(18) +
        'Items'.padEnd(8) +
        'Type'.padEnd(12) +
        'Active'
    );
    console.log('-'.repeat(90));

    collections.slice(0, 20).forEach(collection => {
        const shortOwner = collection.owner
            ? `${collection.owner.slice(0, 8)}...${collection.owner.slice(-4)}`
            : 'Unknown';

        console.log(
            collection.id.padEnd(6) +
            collection.name.slice(0, 28).padEnd(30) +
            shortOwner.padEnd(18) +
            String(collection.itemCount).padEnd(8) +
            (collection.type || 'general').slice(0, 10).padEnd(12) +
            (collection.isActive ? '✅' : '❌')
        );
    });

    console.log('='.repeat(90));

    if (collections.length > 20) {
        console.log(`   ... and ${collections.length - 20} more collections`);
    }

    // Show statistics
    console.log('\n📊 Statistics:');
    const totalItems = collections.reduce((sum, c) => sum + c.itemCount, 0);
    const activeCount = collections.filter(c => c.isActive).length;
    const typeStats: Record<string, number> = {};

    collections.forEach(c => {
        const type = c.type || 'general';
        typeStats[type] = (typeStats[type] || 0) + 1;
    });

    console.log(`   Total Collections: ${collections.length}`);
    console.log(`   Active Collections: ${activeCount}`);
    console.log(`   Total Items: ${totalItems}`);
    console.log('\n   By Type:');
    Object.entries(typeStats)
        .sort((a, b) => b[1] - a[1])
        .forEach(([type, count]) => {
            console.log(`     ${type}: ${count}`);
        });

    // Show sample collection details
    if (collections.length > 0) {
        const sample = collections[0];
        console.log('\n📌 Sample Collection Details:');
        console.log(`   ID: ${sample.id}`);
        console.log(`   Name: ${sample.name}`);
        console.log(`   Symbol: ${sample.symbol}`);
        console.log(`   Description: ${sample.description?.slice(0, 80)}...`);
        console.log(`   Owner: ${sample.owner}`);
        console.log(`   NFT Contract: ${sample.nftAddress}`);
        console.log(`   Base URI: ${sample.baseUri}`);
        console.log(`   Total Minted: ${sample.totalMinted}`);
        console.log(`   Total Burned: ${sample.totalBurned}`);
        console.log(`   Current Items: ${sample.itemCount}`);

        // Get stats for sample collection
        console.log('\n   Stats:');
        const stats = await sdk.collections.getCollectionStats(sample.id);
        console.log(`     Transfers: ${stats.totalTransfers}`);
        console.log(`     Last Mint: ${stats.lastMintTime || 'Never'}`);
    }

    console.log('\n✅ Done!');
}

// ============================================
// RUN
// ============================================

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('\n❌ Error:', error);
        process.exit(1);
    });
