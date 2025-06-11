import { useState, useEffect, useCallback } from 'react';
import { Contract, RpcProvider } from 'starknet';
import { STARKNET_NETWORKS, StarknetConfig } from '@/types/myasset';

// Type definitions
interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  [key: string]: any;
}

interface NFTAsset {
  tokenId: string;
  contractAddress: string;
  name: string;
  description: string;
  imageUrl: string;
  attributes: NFTAttribute[];
  owner: string;
  createdAt: number;
  lastTransferred: number;
  metadata: NFTMetadata;
}

export const useStarknetIntegration = (
  contractAddress: string, 
  config: StarknetConfig = { network: 'goerli' }
) => {
  const [provider, setProvider] = useState<RpcProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    const initProvider = async () => {
      try {
       
        const nodeUrl = config.rpcUrl || STARKNET_NETWORKS[config.network];
        
        const starknetProvider = new RpcProvider({
          nodeUrl
        });
        
        setProvider(starknetProvider);

        
        if (contractAddress) {
          const contractInstance = new Contract(
            [], 
            contractAddress,
            starknetProvider
          );
          setContract(contractInstance);
        }
      } catch (error) {
        console.error('Failed to initialize Starknet provider:', error);
      }
    };

    initProvider();
  }, [contractAddress, config.network, config.rpcUrl]);

  const fetchUserAssets = useCallback(async (userAddress: string): Promise<NFTAsset[]> => {
    if (!contract || !provider) {
      throw new Error('Starknet integration not initialized');
    }

    try {
     
      const balanceResult = await contract.call('balance_of', [userAddress]);
      const balance = parseInt(balanceResult.toString());
      
      if (balance === 0) {
        return [];
      }

      
      const tokenIds: string[] = [];
      for (let i = 0; i < balance; i++) {
        try {
          const tokenResult = await contract.call('token_of_owner_by_index', [userAddress, i]);
          tokenIds.push(tokenResult.toString());
        } catch (error) {
          console.warn(`Failed to get token at index ${i}:`, error);
        }
      }
      
      // Transform the result into NFTAsset format
      const assets: NFTAsset[] = await Promise.all(
        tokenIds.map(async (tokenId: string) => {
          try {
            const tokenUriResult = await contract.call('token_uri', [tokenId]);
            const metadata = await fetchMetadata(tokenUriResult.toString());
            
            return {
              tokenId,
              contractAddress,
              name: metadata.name || `Token #${tokenId}`,
              description: metadata.description || 'No description available',
              imageUrl: metadata.image || '',
              attributes: metadata.attributes || [],
              owner: userAddress,
              createdAt: Date.now(), 
              lastTransferred: Date.now(), 
              metadata
            };
          } catch (error) {
            console.warn(`Failed to fetch metadata for token ${tokenId}:`, error);
            // Return a basic asset structure if metadata fails
            return {
              tokenId,
              contractAddress,
              name: `Token #${tokenId}`,
              description: 'Metadata unavailable',
              imageUrl: '',
              attributes: [],
              owner: userAddress,
              createdAt: Date.now(),
              lastTransferred: Date.now(),
              metadata: {
                name: `Token #${tokenId}`,
                description: 'Metadata unavailable',
                image: '',
                attributes: []
              }
            };
          }
        })
      );

      return assets.filter(asset => asset !== null);
    } catch (error) {
      console.error('Error fetching user assets:', error);
      throw error;
    }
  }, [contract, provider, contractAddress]);

  const fetchMetadata = async (uri: string): Promise<NFTMetadata> => {
    try {
      const response = await fetch(uri);
      return await response.json();
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return {
        name: 'Unknown',
        description: 'Metadata unavailable',
        image: '',
        attributes: []
      };
    }
  };

  return {
    provider,
    contract,
    fetchUserAssets,
    isReady: !!provider && !!contract
  };
};