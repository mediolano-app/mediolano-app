import { useAccount, useContract, useReadContract } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { abi } from "@/abis/abi";
import { type Abi } from "starknet";
import { CONTRACT_ADDRESS } from "@/lib/constants";
import { pinataClient } from "@/utils/pinataClient";

export function useMIP() {
  const { address } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP;

  const [balance, setBalance] = useState<BigInt>(BigInt(0));
  const [tBalance, setTBalance] = useState<number>(0);
  const [tokenIds, setTokenIds] = useState<BigInt[]>([]);
  const [tokenIdsError, setTokenIdsError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { contract } = useContract({
    abi: abi as Abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`,
  });

  const {
    data: myTotalBalance,
    error: balanceError,
    isError,
  } = useReadContract({
    abi: abi as Abi,
    functionName: "balance_of",
    address: contractAddress as `0x${string}`,
    args: [address],
    watch: false,
  });

  useEffect(() => {
    if (myTotalBalance) {
      const totalBalance = parseInt(myTotalBalance.toString());
      const newBalance = BigInt(totalBalance.toString());
      setTBalance(totalBalance);
      setBalance(newBalance);
    }
  }, [myTotalBalance]);

  async function getTokenId(tokenIndex: number) {
    if (!contract || !address) {
      console.warn("Contract or address is not available.");
      return null;
    }
    try {
      const tokenId = await contract.token_of_owner_by_index(
        address,
        tokenIndex
      );
      console.log("Token ID:", tokenId);
      return tokenId;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  useEffect(() => {
    console.log(isError, "isError", balanceError);
    if (isError) return;
    if (tBalance > 0) {
      const fetchTokenIds = async () => {
        setIsLoading(true);
        const fetchedTokenIds: BigInt[] = []; // Changed type from BigInt[] to number[]

        // Use Promise.all to resolve all token ID promises concurrently
        const tokenIdPromises = Array.from(
          { length: tBalance },
          (_, tokenIndex) => getTokenId(tokenIndex) // Ensure getTokenId returns a promise resolving to a number
        );

        try {
          const resolvedTokenIds = await Promise.all(tokenIdPromises);

          resolvedTokenIds.forEach((tokenId) => {
            if (typeof tokenId === "bigint") {
              fetchedTokenIds.push(tokenId); // only push if tokenId is a valid number
            } else {
              console.warn("Unexpected tokenId type:", typeof tokenId);
            }
          });

          setTokenIds(fetchedTokenIds); // update state with the fetched token IDs
        } catch (e) {
          const errorMessage = e instanceof Error ? e : new Error(String(e));
          setTokenIdsError(errorMessage);
          console.error("Error fetching token IDs:", errorMessage);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTokenIds(); // Execute the async function
    }
  }, [tBalance, address, isError]);

  return {
    address,
    balance,
    balanceError,
    tokenIds,
    tokenIdsError,
    isLoading,
  };
}

type SortOption =
  | "price-high"
  | "price-low"
  | "name-asc"
  | "name-desc"
  | "date-new"
  | "date-old";

export interface IP {
  tokenId: number;
  name: string;
  description: string;
  external_url: string;
  image: string;
  attributes: any[];
}

export function useCreatorNFTPortfolio() {
  const { address } = useAccount();
  const [loading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<IP[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("price-high");
  
  const { contract } = useContract({ 
    abi: abi as Abi, 
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}` 
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
              const tokenData = await contract.call("get_token", [String(id)], {
                parseRequest: true,
                parseResponse: true,
              });

              if (!tokenData || !tokenData.metadata_uri) {
                throw new Error(`No metadata URI found for token ${id}`);
              }

              const metadataUri = tokenData.metadata_uri;
              let ipfsHash = metadataUri;
              
                // Handle different URI formats
                if (metadataUri.startsWith('ipfs://')) {
                  ipfsHash = metadataUri.replace('ipfs://', '');
                } else if (metadataUri.startsWith('https://')) {
                  // Extract hash from URL if it's a gateway URL
                  const urlParts = metadataUri.split('/');
                  ipfsHash = urlParts[urlParts.length - 1];
                }
              

              // Fetch metadata from IPFS
              const response = await pinataClient.gateways.get(ipfsHash);

              if (!response || !response.data) {
                throw new Error(`No data received for token ${id}`);
              }

              const parsed =
                typeof response.data === "string"
                  ? JSON.parse(response.data)
                  : response.data;

              return { tokenId: id, ...parsed };
            } catch (error) {
              console.error(`Failed to fetch metadata for token ${id}:`, error);
              return {
                tokenId: id,
                error: error instanceof Error ? error.message : String(error),
              };
            }
          })
        );

        const successfulResults = allMeta
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value)
          .filter((result) => !result.error); // Filter out results with errors

        const failedResults = allMeta
          .filter((result) => result.status === "rejected")
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
