/**
 * Mint Example
 * 
 * Runnable example demonstrating how to mint an IP asset into a collection.
 * 
 * Usage:
 *   npx ts-node scripts/mint-example.ts
 * 
 * Prerequisites:
 * - Set environment variables (see .env.example)
 * - Have STRK for gas fees
 * - Know the collection ID to mint into
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

    // Mint parameters
    collectionId: '1',  // Replace with your collection ID
    tokenUri: 'ipfs://QmYourMetadataCid',  // Replace with your IPFS CID
};

// ============================================
// MAIN FUNCTION
// ============================================

async function main() {
    console.log('\n🎨 Mediolano IP Minting Example\n');
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
        console.log(`   Chain ID: ${chainId}`);
        console.log(`   Account: ${CONFIG.accountAddress.slice(0, 10)}...`);
    } catch (error) {
        console.error('❌ Failed to connect:', error);
        process.exit(1);
    }

    // Initialize SDK
    console.log('\n🔧 Initializing SDK...');
    const sdk = getSDK();

    // Verify collection exists
    console.log(`\n📋 Checking collection ${CONFIG.collectionId}...`);
    try {
        const isValid = await sdk.collections.isValidCollection(CONFIG.collectionId);
        if (!isValid) {
            console.error(`❌ Collection ${CONFIG.collectionId} does not exist`);
            process.exit(1);
        }

        const collection = await sdk.collections.getCollection(CONFIG.collectionId);
        console.log(`   Name: ${collection.name}`);
        console.log(`   Items: ${collection.itemCount}`);
        console.log(`   NFT Contract: ${collection.nftAddress.slice(0, 16)}...`);
    } catch (error) {
        console.error('❌ Failed to fetch collection:', error);
        process.exit(1);
    }

    // Build mint transaction
    console.log('\n🔨 Building mint transaction...');
    const mintCall = sdk.collections.buildMintCall({
        collectionId: CONFIG.collectionId,
        recipient: CONFIG.accountAddress as `0x${string}`,
        tokenUri: CONFIG.tokenUri,
    });

    console.log(`   Collection: ${CONFIG.collectionId}`);
    console.log(`   Recipient: ${CONFIG.accountAddress.slice(0, 16)}...`);
    console.log(`   Token URI: ${CONFIG.tokenUri}`);

    // Execute transaction
    console.log('\n⛓️  Executing transaction...');
    try {
        const result = await account.execute([{
            contractAddress: mintCall.contractAddress,
            entrypoint: mintCall.entrypoint,
            calldata: mintCall.calldata,
        }]);

        console.log(`   Transaction hash: ${result.transaction_hash}`);
        console.log('\n⏳ Waiting for confirmation...');

        // Wait for transaction
        const receipt = await provider.waitForTransaction(result.transaction_hash);

        if (receipt.execution_status === 'SUCCEEDED') {
            console.log('\n🎉 Mint successful!');
            console.log(`   View on Voyager: https://voyager.online/tx/${result.transaction_hash}`);
        } else {
            console.log('\n❌ Mint failed!');
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
