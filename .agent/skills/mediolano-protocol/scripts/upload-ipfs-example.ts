/**
 * Upload to IPFS Example
 * 
 * Runnable example demonstrating how to upload metadata to IPFS.
 * This is the first step before minting an IP asset.
 * 
 * Usage:
 *   npx ts-node scripts/upload-ipfs-example.ts
 * 
 * Prerequisites:
 * - Set PINATA_JWT environment variable
 */

import { PinataSDK } from 'pinata';

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    pinataJwt: process.env.PINATA_JWT || '',
    pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.pinata.cloud',
};

// ============================================
// EXAMPLE METADATA
// ============================================

const COLLECTION_METADATA = {
    name: 'My Art Collection',
    description: 'A curated collection of digital artwork exploring abstract themes.',
    image: 'ipfs://QmPlaceholderCoverImage',
    coverImage: 'ipfs://QmPlaceholderCoverImage',
    type: 'art',
    visibility: 'public',
    enableVersioning: true,
    allowComments: true,
    requireApproval: false,
    createdAt: new Date().toISOString(),
};

const ASSET_METADATA = {
    name: 'Abstract Sunset #1',
    description: 'A vibrant digital painting capturing the essence of a sunset.',
    image: 'ipfs://QmPlaceholderAssetImage',
    type: 'art',
    registrationDate: new Date().toISOString(),
    licenseType: 'CC-BY-4.0',
    attributes: [
        { trait_type: 'Medium', value: 'Digital Painting' },
        { trait_type: 'Style', value: 'Abstract' },
        { trait_type: 'Year', value: 2024 },
        { trait_type: 'Edition', value: '1 of 1' },
    ],
    tags: ['abstract', 'sunset', 'digital-art', 'colorful'],
    external_url: 'https://example.com/artwork/abstract-sunset-1',
};

// ============================================
// MAIN FUNCTION
// ============================================

async function main() {
    console.log('\n📤 Mediolano IPFS Upload Example\n');
    console.log('='.repeat(50));

    // Validate configuration
    if (!CONFIG.pinataJwt) {
        console.error('❌ Missing PINATA_JWT environment variable');
        console.error('   Get your JWT at https://app.pinata.cloud/developers/api-keys');
        process.exit(1);
    }

    // Initialize Pinata
    console.log('\n🔧 Initializing Pinata SDK...');
    const pinata = new PinataSDK({
        pinataJwt: CONFIG.pinataJwt,
        pinataGateway: CONFIG.pinataGateway.replace(/^https?:\/\//, ''),
    });

    // Test connection
    try {
        const testData = await pinata.testAuthentication();
        console.log('   Connected to Pinata ✅');
    } catch (error) {
        console.error('❌ Failed to authenticate with Pinata:', error);
        process.exit(1);
    }

    // Upload collection metadata
    console.log('\n📋 Uploading collection metadata...');
    console.log(`   Name: ${COLLECTION_METADATA.name}`);
    console.log(`   Type: ${COLLECTION_METADATA.type}`);

    try {
        const collectionResponse = await pinata.upload.json(COLLECTION_METADATA);
        const collectionUri = `ipfs://${collectionResponse.IpfsHash}`;

        console.log(`\n   ✅ Collection metadata uploaded!`);
        console.log(`   IPFS Hash: ${collectionResponse.IpfsHash}`);
        console.log(`   URI: ${collectionUri}`);
        console.log(`   View: ${CONFIG.pinataGateway}/ipfs/${collectionResponse.IpfsHash}`);

        // Upload asset metadata
        console.log('\n🎨 Uploading asset metadata...');
        console.log(`   Name: ${ASSET_METADATA.name}`);
        console.log(`   Type: ${ASSET_METADATA.type}`);
        console.log(`   License: ${ASSET_METADATA.licenseType}`);

        const assetResponse = await pinata.upload.json(ASSET_METADATA);
        const assetUri = `ipfs://${assetResponse.IpfsHash}`;

        console.log(`\n   ✅ Asset metadata uploaded!`);
        console.log(`   IPFS Hash: ${assetResponse.IpfsHash}`);
        console.log(`   URI: ${assetUri}`);
        console.log(`   View: ${CONFIG.pinataGateway}/ipfs/${assetResponse.IpfsHash}`);

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📝 SUMMARY');
        console.log('='.repeat(50));
        console.log('\nUse these URIs in your transactions:\n');
        console.log('Collection baseUri:');
        console.log(`  ${collectionUri}`);
        console.log('\nAsset tokenUri:');
        console.log(`  ${assetUri}`);

        console.log('\n💡 Next Steps:');
        console.log('1. Update the image CIDs with actual artwork');
        console.log('2. Use collection URI in buildCreateCollectionCall()');
        console.log('3. Use asset URI in buildMintCall()');

        return { collectionUri, assetUri };
    } catch (error) {
        console.error('\n❌ Upload failed:', error);
        process.exit(1);
    }
}

// ============================================
// RUN
// ============================================

main()
    .then((result) => {
        console.log('\n✅ Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Error:', error);
        process.exit(1);
    });
