/**
 * Create Collection Example
 * 
 * Runnable example demonstrating how to create a new IP collection.
 * 
 * Usage:
 *   npx ts-node scripts/create-collection-example.ts
 * 
 * Prerequisites:
 * - Set environment variables
 * - Have STRK for gas fees
 * - Have collection metadata uploaded to IPFS
 */

import { Account, RpcProvider } from 'starknet';
import { getSDK } from '../../../src/sdk';

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // RPC endpoint
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || '',

    // Account credentials (NEVER commit these!)
    accountAddress: process.env.STARKNET_ACCOUNT_ADDRESS || '',
    privateKey: process.env.STARKNET_PRIVATE_KEY || '',

    // Collection parameters
    collection: {
        name: 'My Art Collection',
        symbol: 'MYART',
        baseUri: 'ipfs://QmYourCollectionMetadataCid',  // Replace with your IPFS CID
    },
};

// ============================================
// MAIN FUNCTION
// ============================================

async function main() {
    console.log('\n📚 Mediolano Collection Creation Example\n');
    console.log('='.repeat(50));

    // Validate configuration
    if (!CONFIG.rpcUrl || !CONFIG.accountAddress || !CONFIG.privateKey) {
        console.error('❌ Missing required environment variables:');
        console.error('   - NEXT_PUBLIC_RPC_URL');
        console.error('   - STARKNET_ACCOUNT_ADDRESS');
        console.error('   - STARKNET_PRIVATE_KEY');
        process.exit(1);
    }

    // Initialize provider and account
    console.log('\n📡 Connecting to Starknet...');
    const provider = new RpcProvider({ nodeUrl: CONFIG.rpcUrl });
    const account = new Account(
        provider,
        CONFIG.accountAddress,
        CONFIG.privateKey
    );

    // Verify connection
    try {
        const chainId = await provider.getChainId();
        const blockNumber = await provider.getBlockNumber();
        console.log(`   Chain ID: ${chainId}`);
        console.log(`   Block: ${blockNumber}`);
        console.log(`   Account: ${CONFIG.accountAddress.slice(0, 10)}...`);
    } catch (error) {
        console.error('❌ Failed to connect:', error);
        process.exit(1);
    }

    // Initialize SDK
    console.log('\n🔧 Initializing SDK...');
    const sdk = getSDK();

    // Show current user collections
    console.log('\n📋 Fetching your existing collections...');
    try {
        const existingCollections = await sdk.collections.getUserCollections(
            CONFIG.accountAddress as `0x${string}`
        );
        console.log(`   You own ${existingCollections.length} collection(s)`);
        existingCollections.forEach(c => {
            console.log(`   - ${c.name} (ID: ${c.id})`);
        });
    } catch (error) {
        console.log('   Could not fetch existing collections');
    }

    // Build create collection transaction
    console.log('\n🔨 Building create collection transaction...');
    const createCall = sdk.collections.buildCreateCollectionCall({
        name: CONFIG.collection.name,
        symbol: CONFIG.collection.symbol,
        baseUri: CONFIG.collection.baseUri,
    });

    console.log(`   Name: ${CONFIG.collection.name}`);
    console.log(`   Symbol: ${CONFIG.collection.symbol}`);
    console.log(`   Base URI: ${CONFIG.collection.baseUri}`);

    // Execute transaction
    console.log('\n⛓️  Executing transaction...');
    try {
        const result = await account.execute([{
            contractAddress: createCall.contractAddress,
            entrypoint: createCall.entrypoint,
            calldata: createCall.calldata,
        }]);

        console.log(`   Transaction hash: ${result.transaction_hash}`);
        console.log('\n⏳ Waiting for confirmation...');

        // Wait for transaction
        const receipt = await provider.waitForTransaction(result.transaction_hash);

        if (receipt.execution_status === 'SUCCEEDED') {
            console.log('\n🎉 Collection created successfully!');
            console.log(`   View on Voyager: https://voyager.online/tx/${result.transaction_hash}`);

            // Try to find the new collection
            console.log('\n📋 Fetching updated collections...');
            const updatedCollections = await sdk.collections.getUserCollections(
                CONFIG.accountAddress as `0x${string}`
            );
            const newCollection = updatedCollections.find(
                c => c.name === CONFIG.collection.name
            );
            if (newCollection) {
                console.log(`   New Collection ID: ${newCollection.id}`);
                console.log(`   NFT Contract: ${newCollection.nftAddress}`);
            }
        } else {
            console.log('\n❌ Collection creation failed!');
            console.log(`   Status: ${receipt.execution_status}`);
        }

        return result.transaction_hash;
    } catch (error) {
        console.error('\n❌ Transaction failed:', error);
        process.exit(1);
    }
}

// ============================================
// RUN
// ============================================

main()
    .then((txHash) => {
        console.log('\n✅ Done! Transaction:', txHash);
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Error:', error);
        process.exit(1);
    });
