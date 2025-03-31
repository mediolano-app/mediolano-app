import axios from 'axios';
import { uploadMetadataToPinata } from '@/utils/pinataClient';
import { starknetService } from './starknetService';
import { IPAssetData, AssetType, LicenseTerms, TokenizationResult } from '@/types/starknet';
import * as crypto from 'crypto';

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  external_url?: string;
  image?: string;
  attributes?: NFTAttribute[];
  asset_type?: string;
  license_terms?: string;
  source_platform?: string;
  source_id?: string;
  creator_address?: string;
}

export const mintService = {
  uploadToIPFS: async (metadata: NFTMetadata): Promise<string> => {
    try {
      // Using the uploadMetadataToPinata function from utils
      return await uploadMetadataToPinata(metadata);
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      
      // Fallback to API key method if client fails
      try {
        const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
        const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
        
        const response = await axios.post(
          'https://uploads.pinata.cloud/v3/files',
          metadata,
          {
            headers: {
              'Content-Type': 'application/json',
              'pinata_api_key': PINATA_API_KEY,
              'pinata_secret_api_key': PINATA_SECRET_KEY
            }
          }
        );
        
        return `ipfs://${response.data.cid}`;
      } catch (fallbackError) {
        console.error('Fallback IPFS upload failed:', fallbackError);
        throw new Error('Failed to upload to IPFS');
      }
    }
  },
  
  // Generate metadata hash for verification
  generateMetadataHash: (metadata: NFTMetadata): string => {
    const metadataString = JSON.stringify(metadata);
    return crypto.createHash('sha256').update(metadataString).digest('hex');
  },
  
  // Convert from NFTMetadata to IPAssetData
  prepareAssetData: async (metadata: NFTMetadata, userAddress: string): Promise<IPAssetData> => {
    // Upload metadata to IPFS
    const metadataURI = await mintService.uploadToIPFS(metadata);
    
    // Generate hash for verification
    const metadataHash = mintService.generateMetadataHash(metadata);
    
    // Map asset type from metadata (default to Copyright for social media content)
    let assetType = AssetType.Copyright;
    if (metadata.asset_type) {
      switch (metadata.asset_type.toLowerCase()) {
        case 'patent': assetType = AssetType.Patent; break;
        case 'trademark': assetType = AssetType.Trademark; break;
        case 'tradesecret': assetType = AssetType.TradeSecret; break;
      }
    }
    
    // Map license terms from metadata (default to Standard)
    let licenseTerms = LicenseTerms.Standard;
    if (metadata.license_terms) {
      switch (metadata.license_terms.toLowerCase()) {
        case 'premium': licenseTerms = LicenseTerms.Premium; break;
        case 'exclusive': licenseTerms = LicenseTerms.Exclusive; break;
        case 'custom': licenseTerms = LicenseTerms.Custom; break;
      }
    }
    
    // Calculate default expiry date (50 years from now)
    const expiryDate = BigInt(Math.floor(Date.now() / 1000) + 50 * 365 * 24 * 60 * 60);
    
    return {
      metadata_uri: metadataURI,
      metadata_hash: metadataHash,
      owner: userAddress,
      asset_type: assetType,
      license_terms: licenseTerms,
      expiry_date: expiryDate
    };
  },
  
  tokenizeTwitterPost: async (
    tweetData: any, 
    userAddress: string, 
    licenseTerms: LicenseTerms = LicenseTerms.Standard
  ): Promise<TokenizationResult> => {
    try {
      // Prepare metadata from tweet
      const metadata: NFTMetadata = {
        name: `Tweet by @${tweetData.username || 'user'}`,
        description: tweetData.text,
        external_url: `https://x.com/user/status/${tweetData.id}`,
        source_platform: 'twitter/x',
        source_id: tweetData.id,
        creator_address: userAddress,
        license_terms: LicenseTerms[licenseTerms].toLowerCase(),
        asset_type: 'copyright',
        attributes: [
          { trait_type: 'Platform', value: 'Twitter' },
          { trait_type: 'Created At', value: tweetData.created_at || new Date().toISOString() },
          { trait_type: 'Likes', value: tweetData.public_metrics?.like_count || 0 },
          { trait_type: 'Retweets', value: tweetData.public_metrics?.retweet_count || 0 }
        ]
      };
      
      // Add image if available
      if (tweetData.media && tweetData.media.length > 0) {
        metadata.image = tweetData.media[0].url;
      }
      
      // Convert to IPAssetData
      const assetData = await mintService.prepareAssetData(metadata, userAddress);
      
      // Tokenize the asset using Starknet
      const tokenId = await starknetService.tokenizeAsset(assetData);
      
      return {
        success: true,
        tokenIds: [tokenId],
        txHash: 'tx_hash', // Should be obtained from the tokenization result
        metadataURIs: [assetData.metadata_uri]
      };
    } catch (error: any) {
      console.error('Error minting Twitter NFT:', error);
      throw new Error(`Failed to mint Twitter NFT: ${error.message}`);
    }
  }
};
