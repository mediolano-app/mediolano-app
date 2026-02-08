/**
 * Transfer Example
 * 
 * Template script demonstrating how to transfer an IP asset.
 * 
 * NOTE: This script is a TEMPLATE. Copy the logic to your project and adjust
 * the import path based on your project structure.
 * 
 * Prerequisites:
 * - Set environment variables
 * - Have STRK for gas fees
 * - Own the token you're transferring
 */

import { Account, RpcProvider } from 'starknet';
// Adjust this import path based on your project structure:
// import { getSDK } from '@/sdk';  // For Next.js app
// import { getSDK } from './src/sdk';  // For standalone scripts
import { getSDK } from '@/sdk';

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // RPC endpoint
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || '',

    // Account credentials (NEVER commit these!)
    accountAddress: process.env.STARKNET_ACCOUNT_ADDRESS || '',
    privateKey: process.env.STARKNET_PRIVATE_KEY || '',

    // Transfer parameters
    transfer: {
        token: 'tokenIdentifier',  // Token identifier string (get from getUserTokensPerCollection)
        to: '0xRecipientAddress',  // Replace with recipient
    },
};

// ============================================
// MAIN FUNCTION
// ============================================

async function main() {
    console.log('\n🔄 Mediolano IP Transfer Example\n');
    console.log('='.repeat(50));

    // Validate configuration
    if (!CONFIG.rpcUrl || !CONFIG.accountAddress || !CONFIG.privateKey) {
        console.error('❌ Missing required environment variables');
        process.exit(1);
    }

    if (!CONFIG.transfer.to || CONFIG.transfer.to === '0xRecipientAddress') {
        console.error('❌ Please set a valid recipient address');
        process.exit(1);
    }

    if (!CONFIG.transfer.token || CONFIG.transfer.token === 'tokenIdentifier') {
        console.error('❌ Please set a valid token identifier');
        console.error('   Get token IDs from sdk.assets.getUserTokensPerCollection()');
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

    try {
        const chainId = await provider.getChainId();
        console.log(`   Chain ID: ${chainId}`);
    } catch (error) {
        console.error('❌ Failed to connect:', error);
        process.exit(1);
    }

    // Initialize SDK
    console.log('\n🔧 Initializing SDK...');
    const sdk = getSDK();

    // Display token info
    console.log(`\n📦 Token Details:`);
    console.log(`   Token: ${CONFIG.transfer.token}`);

    // Verify token is valid
    console.log('\n🔍 Verifying token...');
    try {
        const isValid = await sdk.assets.isValidToken(CONFIG.transfer.token);
        if (!isValid) {
            console.error('❌ Token is not valid');
            process.exit(1);
        }
        console.log('   Token is valid ✅');
    } catch (error) {
        console.error('❌ Failed to verify token:', error);
        process.exit(1);
    }

    // Build transfer transaction
    console.log('\n🔨 Building transfer transaction...');
    const transferCall = sdk.assets.buildTransferCall({
        from: CONFIG.accountAddress as `0x${string}`,
        to: CONFIG.transfer.to as `0x${string}`,
        token: CONFIG.transfer.token,
    });

    console.log(`   From: ${CONFIG.accountAddress.slice(0, 16)}...`);
    console.log(`   To: ${CONFIG.transfer.to.slice(0, 16)}...`);
    console.log(`   Token: ${CONFIG.transfer.token}`);

    // Execute transaction
    console.log('\n⛓️  Executing transfer...');
    try {
        const result = await account.execute([{
            contractAddress: transferCall.contractAddress,
            entrypoint: transferCall.entrypoint,
            calldata: transferCall.calldata,
        }]);

        console.log(`   Transaction hash: ${result.transaction_hash}`);
        console.log('\n⏳ Waiting for confirmation...');

        const receipt = await provider.waitForTransaction(result.transaction_hash);

        if (receipt.execution_status === 'SUCCEEDED') {
            console.log('\n🎉 Transfer successful!');
            console.log(`   View on Voyager: https://voyager.online/tx/${result.transaction_hash}`);
        } else {
            console.log('\n❌ Transfer failed!');
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
