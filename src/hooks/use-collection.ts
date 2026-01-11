import { useState, useCallback, useEffect } from "react";
import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { Abi } from "starknet";
import { ipCollectionAbi } from "@/abis/ip_collection";
import { COLLECTION_CONTRACT_ADDRESS } from "@/services/constants";
import { fetchOneByOne } from "@/lib/utils";
import { isCollectionReported } from "@/lib/reported-content";

import { fetchIPFSMetadata, processIPFSHashToUrl } from "@/utils/ipfs";
import { Collection, CollectionValidator } from "@/lib/types";

export interface ICreateCollection {
  name: string;
  symbol: string;
  base_uri: string;
}

export interface CollectionFormData {
  name: string;
  symbol: string;
  description: string;
  type: string;
  visibility: string;
  coverImage?: string;
  enableVersioning: boolean;
  allowComments: boolean;
  requireApproval: boolean;
}

export interface CollectionMetadata {
  id: string;
  name: string;
  symbol: string;
  base_uri: string;
  owner: string;
  ip_nft: string;
  is_active: boolean;
  total_minted: string;
  total_burned: string;
  total_transfers: string;
  last_mint_time: string;
  last_burn_time: string;
  last_transfer_time: string;
}



export interface UseCollectionReturn {
  createCollection: (formData: ICreateCollection) => Promise<void>;
  isCreating: boolean;
  error: string | null;
}

const COLLECTION_CONTRACT_ABI = ipCollectionAbi as Abi;

// function to process collection metadata with validation
async function processCollectionMetadata(
  id: string,
  metadata: CollectionMetadata
): Promise<Collection> {
  let baseUri = metadata.base_uri;
  let nftAddress = metadata.ip_nft;
  if (nftAddress && nftAddress !== "0" && nftAddress !== "0x0") {
    try {
      // Convert decimal string to hex if needed
      if (!String(nftAddress).startsWith("0x")) {
        nftAddress = `0x${BigInt(nftAddress).toString(16)}`;
      }
    } catch (e) {
      console.warn(`Error formatting address for collection ${id}:`, e);
    }
  } else {
    nftAddress = "";
  }
  let isValidIPFS = false;

  if (typeof baseUri === 'string') {
    // Process baseUri
    const processedBaseUri = processIPFSHashToUrl(baseUri, '/placeholder.svg');
    // Check if the processed URL is valid for IPFS metadata fetching
    if (processedBaseUri && processedBaseUri.includes('/ipfs/')) {
      baseUri = processedBaseUri;
      isValidIPFS = true;
    }
  }

  // Fetch IPFS metadata if available
  let ipfsMetadata = null;
  try {
    if (isValidIPFS && baseUri && baseUri.includes('/ipfs/')) {
      const cidMatch = baseUri.match(/\/ipfs\/([a-zA-Z0-9]{46,})/);
      if (cidMatch) {
        const cid = cidMatch[1];
        if (cid.length >= 46) {
          ipfsMetadata = await fetchIPFSMetadata(cid);
        }
      }
    }
  } catch (error) {
    console.warn(`Failed to fetch IPFS metadata for collection ${id}:`, error);
    ipfsMetadata = null;
  }

  // Clean the name - remove null bytes and trim
  let cleanName = metadata.name;
  if (typeof cleanName === 'string') {
    cleanName = cleanName.replace(/\0/g, '').trim();
  }

  // Use total_minted for total supply 
  const totalSupply = parseInt(metadata.total_minted) || 0;

  // Process image with priority: IPFS metadata > valid IPFS URL > placeholder
  let image = '/placeholder.svg';
  if (ipfsMetadata?.coverImage) {
    image = processIPFSHashToUrl(ipfsMetadata.coverImage as string, '/placeholder.svg');
  } else if (ipfsMetadata?.image) {
    image = processIPFSHashToUrl(ipfsMetadata.image as string, '/placeholder.svg');
  } else if (isValidIPFS && baseUri) {
    image = baseUri;
  }

  // Additional check: if the IPFS metadata itself has "undefined/" prefix, handle it
  if (ipfsMetadata && typeof ipfsMetadata === 'object') {
    // Check if any field in the metadata has "undefined/" prefix
    Object.keys(ipfsMetadata).forEach(key => {
      const value = ipfsMetadata[key];
      if (typeof value === 'string' && value.startsWith('undefined/')) {
        const cid = value.replace('undefined/', '');
        if (cid.match(/^[a-zA-Z0-9]{34,}$/)) {
          ipfsMetadata[key] = `https://gateway.pinata.cloud/ipfs/${cid}`;
        }
      }
    });
  }

  // Create the collection object
  const collection: Collection = {
    id: id,
    name: cleanName || 'MIP Collection',
    description: ipfsMetadata?.description || 'Programmable Intellectual Property Collection',
    image: image,
    nftAddress: nftAddress,

    owner: metadata.owner && metadata.owner !== "0" && metadata.owner !== "0x0" ? `0x${BigInt(metadata.owner).toString(16)}` : "",

    isActive: metadata.is_active,
    totalMinted: parseInt(metadata.total_minted) || 0,
    totalBurned: parseInt(metadata.total_burned) || 0,
    totalTransfers: parseInt(metadata.total_transfers) || 0,
    lastMintTime: metadata.last_mint_time,
    lastBurnTime: metadata.last_burn_time,
    lastTransferTime: metadata.last_transfer_time,
    itemCount: (parseInt(metadata.total_minted) || 0) - (parseInt(metadata.total_burned) || 0),
    totalSupply: totalSupply,
    baseUri: baseUri,
    symbol: metadata.symbol,
    type: typeof ipfsMetadata?.type === 'string' ? ipfsMetadata.type : undefined,
    visibility: typeof ipfsMetadata?.visibility === 'string' ? ipfsMetadata.visibility : undefined,
    enableVersioning: typeof ipfsMetadata?.enableVersioning === 'boolean' ? ipfsMetadata.enableVersioning : undefined,
    allowComments: typeof ipfsMetadata?.allowComments === 'boolean' ? ipfsMetadata.allowComments : undefined,
    requireApproval: typeof ipfsMetadata?.requireApproval === 'boolean' ? ipfsMetadata.requireApproval : undefined,
  };

  // Validate and normalize the collection
  const validatedCollection = CollectionValidator.validateAndNormalize(collection);
  if (!validatedCollection) {
    // Return a minimal valid collection as fallback
    return {
      id: id,
      name: 'Invalid Collection',
      description: 'This collection has invalid data',
      image: '/placeholder.svg',
      nftAddress: '',
      owner: '',
      isActive: false,
      totalMinted: 0,
      totalBurned: 0,
      totalTransfers: 0,
      lastMintTime: '',
      lastBurnTime: '',
      lastTransferTime: '',
      itemCount: 0,
      totalSupply: 0,
      baseUri: '',
    };
  }

  return validatedCollection;
}

export function useCollection(): UseCollectionReturn {
  const { address } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: COLLECTION_CONTRACT_ABI as Abi,
    address: COLLECTION_CONTRACT_ADDRESS as `0x${string}`,
  });

  const { sendAsync: createCollectionSend } = useSendTransaction({
    calls: [],
  });

  const createCollection = useCallback(
    async (formData: ICreateCollection) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      if (!contract) {
        throw new Error("Contract not available");
      }

      setIsCreating(true);
      setError(null);

      try {
        // Clean and uppercase the name (remove non-alphanumeric chars)
        const cleanName = (formData.symbol || "")
          .replace(/[^a-zA-Z0-9]/g, "")
          .toUpperCase();

        // Use up to 6 characters, or the full cleanName if it's shorter, fallback to 'COLL' if empty
        const symbol = cleanName || "COLL";

        // Prepare contract call - pass strings directly as ByteArray parameters
        const contractCall = contract.populate("create_collection", [
          formData.name, // name as ByteArray
          symbol, // symbol as ByteArray
          formData.base_uri, // base_uri as ByteArray
        ]);

        // Execute the transaction
        await createCollectionSend([contractCall]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create collection";
        setError(errorMessage);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [address, contract, createCollectionSend]
  );

  return {
    createCollection,
    isCreating,
    error,
  };
}

interface UseGetAllCollectionsReturn {
  collections: Collection[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useGetAllCollections(): UseGetAllCollectionsReturn {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: COLLECTION_CONTRACT_ABI as Abi,
    address: COLLECTION_CONTRACT_ADDRESS as `0x${string}`,
  });

  const loadCollections = useCallback(async () => {
    if (!contract) {
      setLoading(false);
      setError("Contract not ready");
      return;
    }
    setLoading(true);
    setError(null);


    try {
      const collections: number[] = [];
      for (let i = 0; i < 12; i++) {
        const isValid = await contract.call("is_valid_collection", [i]);
        if (isValid && !isCollectionReported(i.toString())) {
          collections.push(i);
        }
      }

      const collectionsData = await Promise.all(
        collections.map(async (id) => {
          const collection = await contract.call("get_collection", [id.toString()]);
          const collectionStat = await contract.call("get_collection_stats", [id.toString()]);
          const metadata = { id, ...collection, ...collectionStat } as CollectionMetadata;


          return await processCollectionMetadata(id.toString(), metadata);
        })
      );
      setCollections(collectionsData);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch collections");
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  return { collections, loading, error, reload: loadCollections };
}

interface UseGetCollectionReturn {
  fetchCollection: (id: string) => Promise<Collection>;
}

export function useGetCollection(): UseGetCollectionReturn {
  const { contract } = useContract({
    abi: COLLECTION_CONTRACT_ABI as Abi,
    address: COLLECTION_CONTRACT_ADDRESS as `0x${string}`,
  });

  const fetchCollection = useCallback(
    async (id: string): Promise<Collection> => {
      if (!contract) throw new Error("Contract not ready");

      try {
        // Get collection data
        const collection = await contract.call("get_collection", [String(id)]);
        const collectionStat = await contract.call("get_collection_stats", [String(id)]);
        const metadata = { id, ...collection, ...collectionStat } as CollectionMetadata;

        return await processCollectionMetadata(id, metadata);

      } catch (error) {
        console.error(`Error fetching collection ${id}:`, error);
        throw error;
      }
    },
    [contract]
  );

  return { fetchCollection };
}

interface UseGetCollectionsReturn {
  collections: Collection[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useGetCollections(walletAddress?: `0x${string}`): UseGetCollectionsReturn {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: COLLECTION_CONTRACT_ABI as Abi,
    address: COLLECTION_CONTRACT_ADDRESS as `0x${string}`,
  });

  const { fetchCollection } = useGetCollection();

  const loadCollections = useCallback(async () => {
    if (!contract || !walletAddress) return;
    setLoading(true);
    setError(null);

    try {
      const ids: string[] = await contract.call(
        "list_user_collections",
        [walletAddress],
        {
          parseRequest: true,
          parseResponse: true,
        }
      );

      const filteredIds = ids.filter(id => !isCollectionReported(id));

      const results = await fetchOneByOne(
        filteredIds.map((id) => () => fetchCollection(id)),
        700
      );

      setCollections(results);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch collections"
      );
    } finally {
      setLoading(false);
    }
  }, [contract, walletAddress, fetchCollection]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  return { collections, loading, error, reload: loadCollections };
}

export function useIsCollectionOwner() {
  const { contract } = useContract({
    abi: COLLECTION_CONTRACT_ABI as Abi,
    address: COLLECTION_CONTRACT_ADDRESS as `0x${string}`,
  });

  const checkOwnership = useCallback(
    async (collectionId: string, owner: string): Promise<boolean> => {
      if (!contract) throw new Error("Contract not available");

      return await contract.call("is_collection_owner", [collectionId, owner]);
    },
    [contract]
  );

  return { checkOwnership };
}
