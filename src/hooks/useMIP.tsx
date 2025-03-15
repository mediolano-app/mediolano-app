import { useAccount, useContract, useReadContract } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { abi } from "@/abis/abi";
import { type Abi } from "starknet";

export function useMIP(){
    const { address } = useAccount();
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP;

    const [balance, setBalance] = useState<BigInt>(0);
    const[tBalance, setTBalance] = useState<number>(0);
    const [tokenIds, setTokenIds] = useState<BigInt[]>([]);
    const [tokenIdsError, setTokenIdsError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false); 

    const { contract } = useContract({ 
      abi: abi as Abi, 
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`, 
    }); 

    const { data: myTotalBalance, error: balanceError } = useReadContract({
        abi: abi as Abi,
        functionName: 'balance_of',
        address: contractAddress as `0x${string}`,
        args: [address],
        watch: false,   
      });

      useEffect(() => {
        if (myTotalBalance) {
          const totalBalance = parseInt(myTotalBalance.toString());
          const menosUm = totalBalance - 1;
          const newBalance = BigInt(menosUm.toString());
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
          const tokenId = await contract.token_of_owner_by_index(address, tokenIndex);
          return tokenId;
        } catch (e) {
          console.error(e);
          return null;
        }
      }
    
      useEffect(() => {
        if (tBalance > 0) {
          const fetchTokenIds = async () => {
            setIsLoading(true);
            const fetchedTokenIds: BigInt[] = [];  // Changed type from BigInt[] to number[]
      
            // Use Promise.all to resolve all token ID promises concurrently
            const tokenIdPromises = Array.from({ length: tBalance }, (_, tokenIndex) => 
              getTokenId(tokenIndex)  // Ensure getTokenId returns a promise resolving to a number
            );
      
            try {
              const resolvedTokenIds = await Promise.all(tokenIdPromises);
              
              resolvedTokenIds.forEach((tokenId) => {
                if (typeof tokenId === "bigint") {
                  fetchedTokenIds.push(tokenId);  // only push if tokenId is a valid number
                } else {
                  console.warn("Unexpected tokenId type:", typeof tokenId);
                }
              });
      
              setTokenIds(fetchedTokenIds);  // update state with the fetched token IDs
            } catch (e) {
              const errorMessage = e instanceof Error ? e : new Error(String(e));
              setTokenIdsError(errorMessage);
              console.error("Error fetching token IDs:", errorMessage);
            }
            finally {
                setIsLoading(false);   
            }
          };
      
          fetchTokenIds(); // Execute the async function
        }
      }, [tBalance, address]); 

    return {
        address,
        balance,
        balanceError,
        tokenIds,
        tokenIdsError,
        isLoading
    }
}