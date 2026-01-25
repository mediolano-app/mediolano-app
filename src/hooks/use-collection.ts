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
  createCollection: (formData: ICreateCollection) => Promise<string>;
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

      // Validate required parameters
      if (!formData.name || formData.name.trim() === "") {
        throw new Error("Collection name is required");
      }

      if (!formData.base_uri || formData.base_uri.trim() === "") {
        throw new Error("Base URI is required");
      }

      setIsCreating(true);
      setError(null);

      try {
        // Clean and uppercase the symbol (remove non-alphanumeric chars)
        const cleanSymbol = (formData.symbol || "")
          .replace(/[^a-zA-Z0-9]/g, "")
          .toUpperCase();

        // Use up to 31 characters, or the full cleanSymbol if it's shorter, fallback to 'COLL' if empty
        const symbol = cleanSymbol || "COLL";

        console.log("Creating collection with params:", {
          name: formData.name,
          symbol: symbol,
          base_uri: formData.base_uri,
        });

        // Prepare contract call - pass strings directly as ByteArray parameters
        const contractCall = contract.populate("create_collection", [
          formData.name, // name as ByteArray
          symbol, // symbol as ByteArray
          formData.base_uri, // base_uri as ByteArray
        ]);

        console.log("Contract call prepared:", contractCall);

        // Execute the transaction
        const response = await createCollectionSend([contractCall]);
        return response.transaction_hash;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create collection";
        setError(errorMessage);
        console.error("Create collection error:", err);
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
      for (let i = 0; i < 50; i++) {
        try {
          const isValid = await contract.call("is_valid_collection", [i]);
          if (isValid && !isCollectionReported(i.toString())) {
            collections.push(i);
          }
        } catch (e) {
          // If we hit an error, we might have hit the end of the collection IDs
          break;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: COLLECTION_CONTRACT_ABI as Abi,
    address: COLLECTION_CONTRACT_ADDRESS as `0x${string}`,
  });

  const { fetchCollection } = useGetCollection();

  const loadCollections = useCallback(async () => {
    if (!contract || !walletAddress) {
      setLoading(false);
      return;
    }
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

export interface UsePaginatedCollectionsReturn {
  collections: Collection[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  reload: () => void;
}

export function usePaginatedCollections(pageSize: number = 12): UsePaginatedCollectionsReturn {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextId, setNextId] = useState<number | null>(null); // Start with null until we find max
  const [hasMore, setHasMore] = useState(true);

  const { contract } = useContract({
    abi: COLLECTION_CONTRACT_ABI as Abi,
    address: COLLECTION_CONTRACT_ADDRESS as `0x${string}`,
  });

  // Helper to find the highest valid collection ID
  const findMaxCollectionId = useCallback(async () => {
    if (!contract) return 0;
    try {
      let low = 0;
      let startFound = false;

      // 1. Initial Scan: Handle cases where ID 0 is burned or list starts at 1
      // Check first 10 IDs to find a valid anchor
      for (let i = 0; i < 10; i++) {
        try {
          const isValid = await contract.call("is_valid_collection", [i.toString()]);
          if (isValid) {
            low = i;
            startFound = true;
          }
        } catch (e) { }
      }

      if (!startFound) {
        // If we didn't find any valid ID in 0-9, verify one last time with a higher probe just in case (e.g. 10)
        // or assume empty. Let's assume empty to avoid long waits.
        return -1;
      }

      // 2. Exponential Probe upwards from our found `low`
      let high = Math.max(low + 1, 1);
      let maxFound = false;

      while (!maxFound && high < 1000000) {
        try {
          const isValid = await contract.call("is_valid_collection", [high.toString()]);
          if (isValid) {
            low = high;
            high = high * 2;
          } else {
            maxFound = true;
          }
        } catch (e) {
          maxFound = true;
        }
      }

      // 3. Binary Search between low (valid) and high (invalid)
      let ans = low;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        try {
          const isValid = await contract.call("is_valid_collection", [mid.toString()]);
          if (isValid) {
            ans = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        } catch (e) {
          high = mid - 1;
        }
      }
      return ans;
    } catch (e) {
      console.error("Error finding max collection ID:", e);
      return 0; // Fallback
    }
  }, [contract]);

  const fetchBatch = useCallback(async (startId: number, count: number) => {
    if (!contract) return { data: [], nextStartId: startId };

    const newCollections: Collection[] = [];
    let currentId = startId;

    // Scan BACKWARDS from startId
    // Use parallel scanning for speed with a larger window
    const SCAN_WINDOW = 50; // Check 50 items in parallel
    const MAX_TOTAL_SCAN = 500; // Limit total items checked per user action to avoid timeout
    let totalScanned = 0;

    // Continue until we find enough items or exhaust our scan limit/ID range
    while (newCollections.length < count && currentId >= 0 && totalScanned < MAX_TOTAL_SCAN) {
      // Determine batch range
      // e.g. if currentId is 100, and SCAN_WINDOW is 50, we want to check 100, 99, ... 51
      const batchSize = Math.min(SCAN_WINDOW, currentId + 1);
      const batchIds: number[] = [];

      for (let i = 0; i < batchSize; i++) {
        batchIds.push(currentId - i);
      }

      try {
        // Parallel check validity
        const validityResults = await Promise.all(
          batchIds.map(id =>
            contract!.call("is_valid_collection", [id.toString()])
              .then(valid => ({ id, valid }))
              .catch(() => ({ id, valid: false }))
          )
        );

        // Filter valid IDs that are not reported
        const validIds = validityResults
          .filter(r => r.valid && !isCollectionReported(r.id.toString()))
          .map(r => r.id);

        if (validIds.length > 0) {
          // Fetch details for found valid IDs in parallel
          // Limit concurrency if needed but usually okay for small N
          const details = await Promise.all(
            validIds.map(async (id) => {
              try {
                const collection = await contract!.call("get_collection", [id.toString()]);
                const collectionStat = await contract!.call("get_collection_stats", [id.toString()]);
                const metadata = { id: id.toString(), ...collection, ...collectionStat } as CollectionMetadata;
                return await processCollectionMetadata(id.toString(), metadata);
              } catch (e) {
                return null;
              }
            })
          );

          // Sort by ID descending to maintain order (since Promise.all waits for all)
          // and add to list
          const validDetails = details.filter(c => c !== null) as Collection[];
          // validDetails might be out of order due to async if mapped, but here we mapped validIds which are sorted desc (100, 99, 98)
          // But Promise.all preserves order of input array! 
          // So they are already in desc order of ID.

          newCollections.push(...validDetails);
        }

      } catch (e) {
        console.warn("Error scanning batch:", e);
      }

      // Move pointer past this batch
      currentId -= batchSize;
      totalScanned += batchSize;

      // If we have filled our quota, we might have extra valid items in this batch that we added.
      // That's fine, returning more than 'count' is allowed/better.
    }

    return { data: newCollections, nextStartId: currentId };

  }, [contract]);

  const loadMore = useCallback(async () => {
    if (!contract || !hasMore || loadingMore || nextId === null) return;
    setLoadingMore(true);

    try {
      const { data, nextStartId } = await fetchBatch(nextId, pageSize);

      if (data.length > 0) {
        setCollections(prev => [...prev, ...data]);
        setNextId(nextStartId);
      }

      // If we hit bottom (less than 0), stop.
      if (nextStartId < 0) {
        setHasMore(false);
      } else if (data.length === 0 && nextStartId >= 0) {
        // If we didn't find any data but still have IDs to scan, update nextId
        // logic in fetchBatch returns nextStartId as the last checked - 1.
        // If we scanned MAX_SCAN and found nothing, we should update nextId to continue from there next time.
        setNextId(nextStartId);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more collections");
    } finally {
      setLoadingMore(false);
    }
  }, [contract, nextId, pageSize, hasMore, loadingMore, fetchBatch]);

  // Initial load
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!contract) return;
      setLoading(true);

      const maxId = await findMaxCollectionId();
      console.log("Max Collection ID found:", maxId); // Debug

      if (maxId < 0) {
        if (mounted) {
          setCollections([]);
          setLoading(false);
          setHasMore(false);
        }
        return;
      }

      const { data, nextStartId } = await fetchBatch(maxId, pageSize);

      if (mounted) {
        setCollections(data);
        setNextId(nextStartId);
        setLoading(false);
        if (nextStartId < 0) setHasMore(false);
      }
    };

    if (loading && contract) {
      init();
    }

    return () => { mounted = false; };
  }, [contract, loading, findMaxCollectionId, fetchBatch, pageSize]);

  const reload = useCallback(() => {
    setCollections([]);
    setNextId(null);
    setHasMore(true);
    setLoading(true);
    setError(null);
  }, []);

  return { collections, loading, loadingMore, error, hasMore, loadMore, reload };
}


export function useFeaturedCollections(featuredIds: number[] = []): UseGetAllCollectionsReturn {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: COLLECTION_CONTRACT_ABI as Abi,
    address: COLLECTION_CONTRACT_ADDRESS as `0x${string}`,
  });

  // Create a stable key for the dependency array
  const idsKey = featuredIds.join(',');

  const loadCollections = useCallback(async () => {
    if (!contract) {
      setLoading(false);
      setError("Contract not ready");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const promises = featuredIds.map(async (id) => {
        try {
          const isValid = await contract.call("is_valid_collection", [id.toString()]);
          if (isValid && !isCollectionReported(id.toString())) {
            const collection = await contract.call("get_collection", [id.toString()]);
            const collectionStat = await contract.call("get_collection_stats", [id.toString()]);
            const metadata = { id, ...collection, ...collectionStat } as CollectionMetadata;

            return await processCollectionMetadata(id.toString(), metadata);
          }
        } catch (e) {
          console.warn(`Error fetching featured collection ${id}`, e);
        }
        return null;
      });

      const results = await Promise.all(promises);
      const validCollections = results.filter((c): c is Collection => c !== null);

      setCollections(validCollections);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch featured collections");
    } finally {
      setLoading(false);
    }
  }, [contract, idsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  return { collections, loading, error, reload: loadCollections };
}


