import { useState, useCallback } from "react";
import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { Abi } from "starknet";
import { ipCollectionAbi } from "@/abis/ip_collection";
import {
  COLLECTION_CONTRACT_ADDRESS,
  EXPLORER_URL,
} from "@/services/constants";
import { useToast } from "./use-toast";

export interface ICreateAsset {
  collection_id: string;
  recipient: string;
  token_uri: string;
}

export interface IMintReturnType {
  createAsset: (formData: ICreateAsset) => Promise<void>;
  isCreating: boolean;
  error: string | null;
}

const COLLECTION_CONTRACT_ABI = ipCollectionAbi as Abi;

export function useCreateAsset(): IMintReturnType {
  const { address } = useAccount();
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
    async (formData: ICreateAsset) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      if (!contract) {
        throw new Error("Contract not available");
      }

      setIsCreating(true);
      setError(null);

      try {
        // Prepare contract call - pass strings directly as ByteArray parameters
        const contractCall = contract.populate("mint", [
          formData.collection_id,
          formData.recipient,
          formData.token_uri,
        ]);

        // Execute the transaction
        const tx = await mintAsset([contractCall]);

        toast({
          title: "Transaction Submitted!",
          description: (
            <div className="text-sm space-y-1">
              <p>Your mint transaction has been submitted successfully.</p>
              <a
                href={`${EXPLORER_URL}/tx/${tx.transaction_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                View on StarkScan ↗
              </a>
            </div>
          ),
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to mint asset";

        console.error("Mint Error:", err);

        setError(errorMessage);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [address, contract, mintAsset]
  );

  return {
    createAsset,
    isCreating,
    error,
  };
}
