import { useState, useCallback } from "react";
import {
  useAccount,
  useContract,
  useSendTransaction,
  useProvider,
} from "@starknet-react/core";
import { Abi } from "starknet";
import { ipCollectionAbi } from "@/abis/ip_collection";
import {
  COLLECTION_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { useToast } from "./use-toast";

export interface ICreateAsset {
  collection_id: string;
  collection_nft_address: string;
  recipient: string;
  token_uri: string;
}

export interface IMintResult {
  transactionHash: string;
  tokenId: string;
  collectionId: string;
  assetSlug: string; // format: {collection_id}-{token_id}
}

export interface IMintReturnType {
  createAsset: (formData: ICreateAsset) => Promise<IMintResult>;
  isCreating: boolean;
  error: string | null;
}

const COLLECTION_CONTRACT_ABI = ipCollectionAbi as Abi;

export function useCreateAsset(): IMintReturnType {
  const { address } = useAccount();
  const { provider } = useProvider();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: COLLECTION_CONTRACT_ABI as Abi,
    address: COLLECTION_CONTRACT_ADDRESS as `0x${string}`,
  });

  const { sendAsync: mintAsset } = useSendTransaction({
    calls: [],
  });

  const createAsset = useCallback(
    async (formData: ICreateAsset): Promise<IMintResult> => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      if (!contract) {
        throw new Error("Contract not available");
      }

      if (!provider) {
        throw new Error("Provider not available");
      }

      setIsCreating(true);
      setError(null);

      try {
        // Show initial toast
        toast({
          title: "Transaction Submitted!",
          description: "Your mint transaction has been submitted. Waiting for confirmation...",
        });

        // Prepare contract call - pass strings directly as ByteArray parameters
        const contractCall = contract.populate("mint", [
          formData.collection_id,
          formData.recipient,
          formData.token_uri,
        ]);

        // Execute the transaction
        const tx = await mintAsset([contractCall]);

        // Wait for transaction confirmation using existing pattern
        await provider.waitForTransaction(tx.transaction_hash);

        const receipt = await provider.getTransactionReceipt(tx.transaction_hash);

        let tokenId = "0";
        // @ts-expect-error receipt is has events
        if (receipt.events) {
          // @ts-expect-error receipt is has events
          const tokenMintedEvent = receipt.events.find((event: any) =>
            event.keys?.[0] === "0x18e1d8b2def1e40ffa4a5ca6e6bfa43f3c0b5c4a4e0b24b3e6c5db55d7a7e7c" ||
            event.keys?.[0] === "0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9" // TokenMinted event selector
          );

          if (tokenMintedEvent && tokenMintedEvent.keys?.[3]) {
            const rawTokenId = tokenMintedEvent.keys[3];

            // parse tokenId
            tokenId = parseInt(rawTokenId, 16).toString();

          }

        }

        // Create asset slug in format: {collection_id}-{token_id}
        const assetSlug = `${formData.collection_nft_address}-${tokenId}`;

        const result: IMintResult = {
          transactionHash: tx.transaction_hash,
          tokenId: tokenId,
          collectionId: formData.collection_id,
          assetSlug: assetSlug,
        };

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to mint Programmable IP";

        console.error("Mint Error:", err);

        setError(errorMessage);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [address, contract, mintAsset, provider, toast]
  );

  return {
    createAsset,
    isCreating,
    error,
  };
}
