import { useAccount, useContract } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Abi } from "starknet";
import { abi } from "@/abis/abi";
import { pinataClient } from "@/utils/pinataClient";
import { useMIP } from "./useMIP";

export type SortOption =
  | "price-high"
  | "price-low"
  | "name-asc"
  | "name-desc"
  | "date-new"
  | "date-old";

export interface IP {
  tokenId: string;
  name: string;
  description: string;
  external_url: string;
  image: string;
  attributes: any[];
  collection: string;
}

export function useCreatorNFTPortfolio() {
  const { address } = useAccount();
  const [loading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<IP[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("price-high");

  const { contract } = useContract({
    abi: abi as Abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`,
  });
  const { tokenIds } = useMIP();

  useEffect(() => {
    const fetchAllMetadata = async () => {
      if (!contract || !tokenIds.length || !address) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const allMeta = await Promise.allSettled(
          tokenIds.map(async (id) => {
            try {
              const tokenIdStr = id.toString();
              const tokenData = await contract.call("get_token", [tokenIdStr], {
                parseRequest: true,
                parseResponse: true,
              });

              if (!tokenData || !tokenData.metadata_uri) {
                throw new Error(`No metadata URI found for token ${id}`);
              }

              const collectionId = tokenData.collection_id.toString();
              const collectionData = await contract.call("get_collection", [collectionId], {
                parseRequest: true,
                parseResponse: true,
              });
              const collectionName = collectionData?.name?.toString() || "Unknown Collection";

              let ipfsHash = tokenData.metadata_uri.toString();
              if (ipfsHash.startsWith('ipfs://')) {
                ipfsHash = ipfsHash.replace('ipfs://', '');
              } else if (ipfsHash.startsWith('https://')) {
                const urlParts = ipfsHash.split('/');
                ipfsHash = urlParts[urlParts.length - 1];
              }

              const response = await pinataClient.gateways.get(ipfsHash);

              if (!response || !response.data) {
                throw new Error(`No data received for token ${id}`);
              }

              const parsed =
                typeof response.data === "string"
                  ? JSON.parse(response.data)
                  : response.data;

              return { tokenId: tokenIdStr, collection: collectionName, ...parsed } as IP;
            } catch (error) {
              console.error(`Failed to fetch metadata for token ${id}:`, error);
              return {
                tokenId: id.toString(),
                error: error instanceof Error ? error.message : String(error),
              };
            }
          })
        );

        const successfulResults = allMeta
          .filter((result): result is PromiseFulfilledResult<IP | { tokenId: string; error: string }> => result.status === "fulfilled")
          .map((result) => result.value)
          .filter((result): result is IP => !('error' in result));

        const failedResults = allMeta
          .filter((result): result is PromiseRejectedResult => result.status === "rejected")
          .map((result) => result.reason);

        if (failedResults.length > 0) {
          console.warn(
            `Failed to fetch ${failedResults.length} token(s):`,
            failedResults
          );
        }

        setMetadata(successfulResults);
      } catch (err) {
        console.error("Metadata fetch failed:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch metadata"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMetadata();
  }, [tokenIds, contract, address]);

  return {
    metadata,
    setMetadata,
    sortOption,
    setSortOption,
    tokenIds,
    error,
    loading,
  };
}