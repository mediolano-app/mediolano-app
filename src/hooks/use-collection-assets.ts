"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useContract } from "@starknet-react/core";
import type { Abi } from "starknet";
import { COLLECTION_NFT_ABI } from "@/abis/ip_nft";
import { fetchIPFSMetadata, processIPFSHashToUrl } from "@/utils/ipfs";

export type CollectionAsset = {
  id: string;
  tokenId: number;
  name: string;
  image?: string;
  tokenUri?: string;
};

type Options = {
  totalSupply?: number;
  limit?: number;
};

export function useCollectionAssets(
  nftAddress?: `0x${string}`,
  options: Options = {}
) {
  const [assets, setAssets] = useState<CollectionAsset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  const { contract } = useContract({
    abi: COLLECTION_NFT_ABI as unknown as Abi,
    address: (nftAddress as `0x${string}`) || undefined,
  });
  // Helper function to load a single asset
  const loadSingleAsset = useCallback(async (tokenId: number): Promise<CollectionAsset | null> => {
    if (!contract) return null;

    try {
      // Check if token exists by getting owner
      let ownerExists = false;
      try {
        let ownerRaw;
        try {
          ownerRaw = await contract.call("ownerOf", [tokenId]);
        } catch {
          try {
            ownerRaw = await contract.call("get_token_owner", [tokenId]);
          } catch {
            try {
              ownerRaw = await contract.call("get_owner", [tokenId]);
            } catch {
              return null; // Token doesn't exist
            }
          }
        }

        if (
          ownerRaw &&
          ownerRaw !== "0x0" &&
          ownerRaw !== "0x0000000000000000000000000000000000000000000000000000000000000000"
        ) {
          ownerExists = true;
        }
      } catch {
        return null; // Token doesn't exist
      }

      if (!ownerExists) {
        return null;
      }

      // Get token URI
      let tokenUri = "";
      try {
        let tokenUriRaw;
        try {
          tokenUriRaw = await contract.call("token_uri", [tokenId]);
        } catch {
          try {
            tokenUriRaw = await contract.call("tokenURI", [tokenId]);
          } catch {
            try {
              tokenUriRaw = await contract.call("get_token_uri", [tokenId]);
            } catch {
              // Continue with default values
            }
          }
        }
        tokenUri = String(tokenUriRaw || "");
      } catch {
        // Continue with default values
      }

      let name = `#${tokenId}`;
      let image: string | undefined;

      // Load IPFS metadata if available
      if (tokenUri) {
        const match = tokenUri.match(/(?:\/ipfs\/|ipfs:(?:\/\/|ipfs\/))([a-zA-Z0-9]+)/);
        if (match) {
          try {
            const meta = await fetchIPFSMetadata(match[1]);
            name = (meta?.name as string) || name;
            image = processIPFSHashToUrl(
              (meta?.image as string) || "",
              "/placeholder.svg"
            );
          } catch {
            // Continue with default values
          }
        }
      }

      return {
        id: `${nftAddress}-${tokenId}`,
        tokenId,
        name,
        image,
        tokenUri,
      };
    } catch (error) {
      console.log(`Failed to load token ${tokenId}:`, error);
      return null;
    }
  }, [contract, nftAddress]);

  const load = useCallback(async () => {
    if (!nftAddress || !contract) {
      setAssets([]);
      setLoadedCount(0);
      setTotalCount(0);
      return;
    }

    setLoading(true);
    setError(null);
    setAssets([]);
    setLoadedCount(0);

    try {
      // Get total supply
      let supply = options.totalSupply ?? 0;
      if (!supply) {
        try {
          const res: unknown = await (
            contract as unknown as { get_total_supply?: () => Promise<unknown> }
          ).get_total_supply?.();
          if (res !== undefined)
            supply = parseInt(
              (res as { toString?: () => string } | string)?.toString?.() ??
                String(res)
            );
        } catch {
          try {
            const res2: unknown = await (
              contract as unknown as { total_supply?: () => Promise<unknown> }
            ).total_supply?.();
            if (res2 !== undefined)
              supply = parseInt(
                (res2 as { toString?: () => string } | string)?.toString?.() ??
                  String(res2)
              );
          } catch {
            supply = 0;
          }
        }
      }

      const maxCount = options.limit ?? (supply || 10);
      setTotalCount(maxCount);

      // Create array of token IDs to check
      const tokenIds = Array.from({ length: maxCount }, (_, i) => i);
      
      // Process tokens in batches for better performance
      const batchSize = 5; // Load 5 assets at a time
      const batches = [];
      for (let i = 0; i < tokenIds.length; i += batchSize) {
        batches.push(tokenIds.slice(i, i + batchSize));
      }

      // Process each batch
      for (const batch of batches) {
        // Load all tokens in the batch in parallel
        const batchPromises = batch.map(tokenId => loadSingleAsset(tokenId));
        const batchResults = await Promise.allSettled(batchPromises);
        
        // Process results and add valid assets
        const validAssets: CollectionAsset[] = [];
        batchResults.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            validAssets.push(result.value);
          }
        });

        // Update state with new assets
        if (validAssets.length > 0) {
          setAssets(prev => {
            const map = new Map(prev.map(a => [a.id, a]));
            validAssets.forEach(asset => map.set(asset.id, asset));
            return Array.from(map.values()).sort((a, b) => a.tokenId - b.tokenId);
          });
        }

        setLoadedCount(prev => prev + validAssets.length);
        
        // Small delay between batches to prevent overwhelming the RPC
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [nftAddress, options.totalSupply, options.limit, contract, loadSingleAsset]);

  useEffect(() => {
    setAssets([]);
    load();
  }, [load]);

  return useMemo(
    () => ({ assets, loading, error, loadedCount, totalCount, reload: load }),
    [assets, loading, error, loadedCount, totalCount, load]
  );
}
