import { ethers } from 'ethers';
import axios from 'axios';
import NFTContract from '../contracts/NFT.json';

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.REACT_APP_PINATA_SECRET_KEY;
const NFT_CONTRACT_ADDRESS = process.env.REACT_APP_NFT_CONTRACT_ADDRESS;

export const mintService = {
  // Upload metadata to IPFS via Pinata
  uploadToIPFS: async (metadata) => {
    try {
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
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error('Failed to upload to IPFS');
    }
  },
  
  // Mint NFT with the provided metadata
  mintNFT: async (metadata) => {
    try {
      // First, upload metadata to IPFS
      const metadataURI = await mintService.uploadToIPFS(metadata);
      
      // Connect to MetaMask
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Connect to the NFT contract
      const contract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFTContract.abi,
        signer
      );
      
      // Mint the NFT
      const tx = await contract.mint(await signer.getAddress(), metadataURI);
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
