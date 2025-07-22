import { useState, useCallback, useEffect } from "react";
import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { Abi } from "starknet";
import { ipCollectionAbi } from "@/abis/ip_collection";
import { COLLECTION_CONTRACT_ADDRESS } from "@/services/constants";
import { fetchInBatches, withRetry } from "@/lib/utils";

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

interface CollectionMetadata {
  id: string;
  [key: string]: any;
}

export interface UseCollectionReturn {
  createCollection: (formData: ICreateCollection) => Promise<void>;
  isCreating: boolean;
  error: string | null;
}

const COLLECTION_CONTRACT_ABI = ipCollectionAbi as Abi;

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

export function useGetCollection() {
  const { contract } = useContract({
    abi: COLLECTION_CONTRACT_ABI as Abi,
    address: COLLECTION_CONTRACT_ADDRESS as `0x${string}`,
  });

  const fetchCollection = useCallback(
    async (id: string) => {
      if (!contract) throw new Error("Contract not ready");
      const data = (await withRetry(() =>
        contract.call("get_collection", [String(id)])
      )) as any;
      return { id, ...data };
    },
    [contract]
  );

  return { fetchCollection };
}

export function useGetCollections(walletAddress?: `0x${string}`) {
  const [collections, setCollections] = useState<CollectionMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: COLLECTION_CONTRACT_ABI as Abi,
    address: COLLECTION_CONTRACT_ADDRESS as `0x${string}`,
  });

  const { fetchCollection } = useGetCollection();

  useEffect(() => {
    const loadCollections = async () => {
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

        const results = await fetchInBatches(
          ids.map((id) => () => fetchCollection(id)),
          5,
          300
        );

        setCollections(results);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch collections"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCollections();
  }, [contract, walletAddress, fetchCollection]);

  return { collections, loading, error };
}
