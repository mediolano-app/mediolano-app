import { useState, useCallback } from "react";
import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { Abi } from "starknet";
import { IPFSMetadata } from "@/utils/ipfs";
import { ipCollectionAbi } from "@/abis/ip_collection";

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

export interface CollectionMetadata extends IPFSMetadata {
  name: string;
  description: string;
  type: string;
  visibility: string;
  coverImage?: string;
  enableVersioning: boolean;
  allowComments: boolean;
  requireApproval: boolean;
  creator: string;
  createdAt: string;
}

export interface UseCollectionReturn {
  createCollection: (formData: CollectionFormData) => Promise<void>;
  isCreating: boolean;
  error: string | null;
  uploadMetadataToIPFS: (metadata: CollectionMetadata) => Promise<string>;
  isUploading: boolean;
}

const COLLECTION_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_COLLECTION_CONTRACT_HASH as `0x${string}`;
const COLLECTION_CONTRACT_ABI = ipCollectionAbi as Abi;

export function useCollection(): UseCollectionReturn {
  const { address } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: COLLECTION_CONTRACT_ABI as Abi,
    address: COLLECTION_CONTRACT_ADDRESS,
  });

  const { sendAsync: createCollectionSend } = useSendTransaction({
    calls: [],
  });

  const uploadMetadataToIPFS = useCallback(
    async (metadata: CollectionMetadata): Promise<string> => {
      setIsUploading(true);
      setError(null);

      try {
        // Clean up metadata to ensure all values are JSON serializable
        const cleanMetadata = {
          ...metadata,
          // Ensure all values are defined and serializable
          coverImage: metadata.coverImage || null,
          enableVersioning: Boolean(metadata.enableVersioning),
          allowComments: Boolean(metadata.allowComments),
          requireApproval: Boolean(metadata.requireApproval),
        };

        console.log("Uploading collection metadata to IPFS:", cleanMetadata);

        // Upload metadata to IPFS via existing uploadmeta endpoint
        const response = await fetch("/api/uploadmeta", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cleanMetadata),
        });

        if (!response.ok) {
          // Get the error details from the response
          const errorData = await response
            .json()
            .catch(() => ({ error: "Unknown server error" }));
          throw new Error(
            errorData.error || "Failed to upload metadata to IPFS"
          );
        }

        const { ipfsUri } = await response.json();
        // Extract hash from ipfs:// URI
        const ipfsHash = ipfsUri.replace("ipfs://", "");
        return ipfsHash;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to upload to IPFS";
        setError(errorMessage);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const createCollection = useCallback(
    async (formData: CollectionFormData) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      if (!contract) {
        throw new Error("Contract not available");
      }

      setIsCreating(true);
      setError(null);

      try {
        // Prepare collection metadata
        const metadata: CollectionMetadata = {
          name: formData.name,
          description: formData.description,
          type: formData.type,
          visibility: formData.visibility,
          coverImage: formData.coverImage,
          enableVersioning: formData.enableVersioning,
          allowComments: formData.allowComments,
          requireApproval: formData.requireApproval,
          creator: address,
          createdAt: new Date().toISOString(),
        };

        // Upload metadata to IPFS
        const ipfsHash = await uploadMetadataToIPFS(metadata);
        const baseUri = `ipfs://${ipfsHash}`;

        // Create collection symbol from name (first 6 chars, uppercase)
        const symbol =
          formData.name
            .replace(/[^a-zA-Z0-9]/g, "")
            .substring(0, 6)
            .toUpperCase() || "COLL";

        // Prepare contract call - pass strings directly as ByteArray parameters
        const contractCall = contract.populate("create_collection", [
          formData.name, // name as ByteArray
          symbol, // symbol as ByteArray
          baseUri, // base_uri as ByteArray
        ]);

        // Execute the transaction
        await createCollectionSend([contractCall]);

        console.log("Collection created successfully:", {
          name: formData.name,
          symbol: symbol,
          baseUri: baseUri,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create collection";
        setError(errorMessage);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [address, contract, createCollectionSend, uploadMetadataToIPFS]
  );

  return {
    createCollection,
    isCreating,
    error,
    uploadMetadataToIPFS,
    isUploading,
  };
}
