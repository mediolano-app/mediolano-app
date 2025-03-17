"use client";
import type { NextPage } from "next";
import { useAccount, useCall } from "@starknet-react/core";
import { useState } from "react";
import { useReadContract, useContract} from "@starknet-react/core";
import { type Abi } from "starknet";
import { abi } from '@/abis/abi';
import NFTCard from "@/components/NFTCard";
import { useEffect } from "react";
import { useMIP } from "@/hooks/useMIP";

const MyIPs: NextPage = () => {
  const { address } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`;

  const [tokenIds, setTokenIds] = useState<BigInt[]>([]);

  const { contract } = useContract({ 
    abi: abi as Abi, 
    address: contractAddress as `0x${string}`, 
  }); 

  async function getTokenId(tokenIndex: number){
    try{
      const tokenId = await contract.token_of_owner_by_index(address, tokenIndex);
      return tokenId; //acho que eh isso mas tem que testar
    }
    catch(e) {
      console.log(e);
    }
  }

  const { data: myTotalBalance, error: balanceError } = useReadContract({
    abi: abi as Abi,
    functionName: 'balance_of',
    address: contractAddress as `0x${string}`,
    args: [address],
    watch: false,   
  });
  console.log(myTotalBalance);

  const { data: test, error: testError } = useReadContract({
    abi: abi as Abi, 
    functionName: 'token_of_owner_by_index',
    address: contractAddress as `0x${string}`,
    args: [address, 0],
    watch: false,
  });
  console.log(test);

  const totalBalance = myTotalBalance ? parseInt(myTotalBalance.toString()) : 0;

  const menosUm = totalBalance - 1;
  const TotalBalance = myTotalBalance ? BigInt(menosUm.toString()) : 0n;
  console.log(TotalBalance);

  useEffect(() => {
    if (totalBalance > 0) {
      const fetchTokenIds = async () => {
        const fetchedTokenIds: BigInt[] = [];  // Changed type from BigInt[] to number[]
  
        // Use Promise.all to resolve all token ID promises concurrently
        const tokenIdPromises = Array.from({ length: totalBalance }, (_, tokenIndex) => 
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
          console.error("Error fetching token IDs:", e);
        }
      };
  
      fetchTokenIds(); // Execute the async function
    }
  }, [totalBalance, address]);  

//   const {address, balance, balanceError, tokenIds, tokenIdsError, isLoading} = useMIP();
//   console.log(address);
//   console.log(balance);
//   console.log(tokenIds); 
  return (
    <div className="min-h-screen flex flex-grid">
      <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">My Portfolio</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tokenIds.map((tokenId, index) => (
        <NFTCard key={index} tokenId={tokenId} status={"teste"}/>
      ))}
      </div>
      
      </main>
    </div>
  );
};
export default MyIPs;