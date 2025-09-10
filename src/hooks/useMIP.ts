import { useAccount, useContract } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Abi } from "starknet";
import { abi } from "@/abis/abi";

export function useMIP() {
  const { address } = useAccount();
  const [tokenIds, setTokenIds] = useState<bigint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: abi as Abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`,
  });

  useEffect(() => {
    const fetchTokenIds = async () => {
      if (!contract || !address) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user collections
        const collections = await contract.call("list_user_collections", [address], {
          parseRequest: true,
          parseResponse: true,
        });

        if (!collections) {
          setTokenIds([]);
          return;
        }

        // Fetch tokens for each collection
        const allTokenIds = await Promise.all(
          collections.map(async (collectionId: bigint) => {
            const tokens = await contract.call("list_user_tokens_per_collection", [
              collectionId.toString(),
              address,
            ], { parseRequest: true, parseResponse: true });
            return tokens || [];
          })
        );

        setTokenIds(allTokenIds.flat());
      } catch (err) {
        console.error("Error fetching token IDs:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch token IDs");
      } finally {
        setLoading(false);
      }
    };

    fetchTokenIds();
  }, [contract, address]);

  return { tokenIds, loading, error };
}