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
  

  const { contract } = useContract({
    abi: COLLECTION_NFT_ABI as unknown as Abi,
    address: (nftAddress as `0x${string}`) || undefined,
  });
  const load = useCallback(async () => {
    if (!nftAddress || !contract) {
      setAssets([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // derive total supply if not provided
      let supply = options.totalSupply ?? 0;
      if (!supply) {
        try {
          const res: unknown = await (contract as unknown as { get_total_supply?: () => Promise<unknown> }).get_total_supply?.();
          if (res !== undefined) supply = parseInt((res as { toString?: () => string } | string)?.toString?.() ?? String(res));
        } catch (e) {
          try {
            const res2: unknown = await (contract as unknown as { total_supply?: () => Promise<unknown> }).total_supply?.();
            if (res2 !== undefined) supply = parseInt((res2 as { toString?: () => string } | string)?.toString?.() ?? String(res2));
          } catch (e2) {
            supply = 0;
          }
        }
      }

      let maxCount = options.limit ?? (supply || 0);
      
      // If we don't have a total supply, try to discover tokens by checking a reasonable range
      if (!maxCount || maxCount <= 0) {
        maxCount = 10; // Check first 10 token IDs as a fallback
      }

      const collected: CollectionAsset[] = [];
      
      // Try to fetch tokens starting from ID 0 up to the total supply
      // This handles cases where tokens might not be minted sequentially
      for (let tokenId = 0; tokenId < maxCount; tokenId++) {
        
        try {   
          // First check if the token exists by trying to get its owner
          let ownerExists = false;
          try {
            // Try different possible function names for getting token owner
            let ownerRaw;
            try {
              // ownerOf expects u256 parameter - format tokenId as felt252 array
              ownerRaw = await contract.call("ownerOf", [tokenId]);
            } catch (e1) {
              try {
                ownerRaw = await contract.call("get_token_owner", [tokenId]);
              } catch (e2) {
                try {
                  ownerRaw = await contract.call("get_owner", [tokenId]);
                } catch (e3) {
                  console.log(`All owner functions failed for token ${tokenId}:`, { e1, e2, e3 });
                  continue;
                }
              }
            }
            
            // If we get an owner (not zero address), the token exists
            if (ownerRaw && ownerRaw !== "0x0" && ownerRaw !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
              ownerExists = true;
            }
          } catch (ownerError) {
            // If getting owner fails, the token might not exist
            continue;
          }

          if (!ownerExists) {
            continue;
          }

          // Token exists, now fetch its metadata
          let tokenUri = "";
          try {
            // Try different possible function names for getting token URI
            let tokenUriRaw;
            try {
              // token_uri expects u256 parameter - format tokenId as felt252
              tokenUriRaw = await contract.call("token_uri", [tokenId]);
            } catch (e1) {
              try {
                tokenUriRaw = await contract.call("tokenURI", [tokenId]);
              } catch (e2) {
                try {
                  tokenUriRaw = await contract.call("get_token_uri", [tokenId]);
                } catch (e3) {
                  // Continue with default values if all URI functions fail
                }
              }
            }
            tokenUri = String(tokenUriRaw || "");
          } catch (uriError) {
            console.log(`Failed to get token URI for ${tokenId}:`, uriError);
            // Continue with default name if URI fetch fails
          }

          let name = `#${tokenId}`;
          let image: string | undefined;
          
          if (tokenUri) {
            const match = tokenUri.match(/\/ipfs\/([a-zA-Z0-9]+)/);
            if (match) {
              try {
                const meta = await fetchIPFSMetadata(match[1]);
                name = (meta?.name as string) || name;
                image = processIPFSHashToUrl((meta?.image as string) || "", "/placeholder.svg");
              } catch (metaError) {
                // Continue with default values if metadata fetch fails
              }
            }
          }

          collected.push({ id: `${nftAddress}-${tokenId}`, tokenId, name, image, tokenUri });

          // opportunistic streaming every 12 items
          if (collected.length % 12 === 0) {
            setAssets((prev) => {
              const map = new Map(prev.map((a) => [a.id, a] as const));
              for (const a of collected) map.set(a.id, a);
              return Array.from(map.values());
            });
          }
        } catch (tokenError) {
          console.log(`Failed to process token ${tokenId}:`, tokenError);
          // Continue to next token instead of stopping
          continue;
        }
      }

      setAssets((prev) => {
        const map = new Map(prev.map((a) => [a.id, a] as const));
        for (const a of collected) map.set(a.id, a);
        return Array.from(map.values());
      });
      
      
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [nftAddress, options.totalSupply, options.limit, contract]);

  useEffect(() => {
    setAssets([]);
    load();
  }, [load]);

  return useMemo(
    () => ({ assets, loading, error, reload: load }),
    [assets, loading, error, load]
  );
}


