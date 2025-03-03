import { ethers } from 'ethers';
import axios from 'axios';
import { pinataClient } from '../utils/pinataClient';
import NFTContract from '../contracts/NFT.json';
import { ToShortAddress } from '../utils/utils';

interface NFTAttribute {
  trait_type: string;
  value: string | number | Date;
}

export interface NFTMetadata {
  name: string;
  description: string;
  external_url?: string;
  image?: string;
  attributes?: NFTAttribute[];
}

interface MintResult {
  success: boolean;
  txHash: string;
  metadataURI: string;
}

export const mintService = {
  // Upload metadata to IPFS via Pinata
  uploadToIPFS: async (metadata: NFTMetadata): Promise<string> => {
    try {
      // Using the pinataClient from utils
      const response = await pinataClient.pinJSON(metadata);
      
      return `ipfs://${response.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      
      // Fallback to API key method if client fails
      try {
        const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
        const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
        
        const response = await axios.post(
          'https://api.pinata.cloud/pinning/pinJSONToIPFS',
          metadata,
          {
            headers: {
              'Content-Type': 'application/json',
              'pinata_api_key': PINATA_API_KEY,
              'pinata_secret_api_key': PINATA_SECRET_KEY
            }
          }
        );
        
        return `ipfs://${response.data.IpfsHash}`;
      } catch (fallbackError) {
        console.error('Fallback IPFS upload failed:', fallbackError);
        throw new Error('Failed to upload to IPFS');
      }
    }
  },
  
  // Mint NFT with the provided metadata
  mintNFT: async (metadata: NFTMetadata): Promise<MintResult> => {
    try {
      const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
      
      // First, upload metadata to IPFS
      const metadataURI = await mintService.uploadToIPFS(metadata);
      
      // Connect to MetaMask
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const userAddress = await signer.getAddress();
      console.log(`Minting NFT for address: ${ToShortAddress(userAddress)}`);
      
      // Connect to the NFT contract
      const contract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS as string,
        NFTContract.abi,
        signer
      );
      
      // Mint the NFT
      const tx = await contract.mint(userAddress, metadataURI);
      await tx.wait();
      
      return {
        success: true,
        txHash: tx.hash,
        metadataURI
      };
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }
};

export default mintService;
