"use client";
import React, { useEffect, useState } from "react";
import { RpcProvider, Contract } from "starknet";
import CryptoJS from "crypto-js"; 
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Loading from "../create/loading";

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function AllTokenURIsPage() {
  const [allTokenData, setAllTokenData] = useState<
    { tokenId: number; uri: string; metadata: any; hash: string }[]
  >([]);
  const [filteredTokenData, setFilteredTokenData] = useState<
    { tokenId: number; uri: string; metadata: any; hash: string }[]
  >([]); 
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllTokenData = async () => {
      try {
        const customRpcUrl = process.env.NEXT_PUBLIC_RPC_URL; 
        const CONTRACT_ADDRESS = "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0"; // Replace with your contract address

        
        const provider = new RpcProvider({ nodeUrl: customRpcUrl });

       
        const { abi } = await provider.getClassAt(CONTRACT_ADDRESS);
        if (!abi) {
          throw new Error("Failed to fetch ABI for the contract.");
        }

       
        const contract = new Contract(abi, CONTRACT_ADDRESS, provider);
        const totalSupplyResult = await contract.total_supply();
        const TOTAL_SUPPLY = parseInt(totalSupplyResult.toString(), 10); 

        
        const data: { tokenId: number; uri: string; metadata: any; hash: string }[] = [];
        for (let tokenId = 1; tokenId <= TOTAL_SUPPLY; tokenId++) {
          try {
            const uri = await contract.token_uri(tokenId.toString());

           
            const response = await fetch(uri);
            if (!response.ok) {
              throw new Error(`Failed to fetch metadata for token ID ${tokenId}`);
            }
            const metadata = await response.json();

           
            const metadataString = JSON.stringify(metadata);
            const hash = CryptoJS.SHA256(metadataString).toString();

           
            data.push({ tokenId, uri, metadata, hash });
          } catch (err) {
            console.error(`Error fetching data for token ID ${tokenId}:`, err);
          }
        }

       
        setAllTokenData(data);
        setFilteredTokenData(data); 
      } catch (err) {
        console.error("Error fetching token data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTokenData();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredTokenData(allTokenData); 
      return;
    }

    const lowerCaseQuery = query.toLowerCase();

    const filtered = allTokenData.filter(
      (token) =>
        token.tokenId.toString().includes(lowerCaseQuery) || 
        token.hash.toLowerCase().includes(lowerCaseQuery) || 
        (token.metadata.author && token.metadata.author.toLowerCase().includes(lowerCaseQuery)) // Match Metadata Author
    );

    setFilteredTokenData(filtered);
  };

  return (
    <div>
      <h1>Transfer History</h1>
      <SearchAndFilter onSearch={handleSearch} />
      {loading ? (
       <Loading />
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : filteredTokenData.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTokenData.map((data) => {
            const metadata = data.metadata || {}; // Fallback to an empty object if metadata is missing
            const imageUrl = isValidUrl(metadata.image) ? metadata.image : "/background.jpg";

            return (
              <Card key={data.tokenId} className="overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={imageUrl}
                    alt={metadata.name || "Default Name"}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={metadata.authorAvatar || ""} />
                      <AvatarFallback>{metadata.author?.[0] || "A"}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{metadata.name || "Unknown Name"}</span>
                    {metadata.verified && <Badge variant="secondary">Verified</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {metadata.description || "No description available."}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Token ID</p>
                      <p className="font-medium">{data.tokenId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Hash</p>
                      <p className="font-medium">{data.hash.slice(0, 10)}...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <p>No token data found.</p>
      )}
    </div>
  );
}

export function SearchAndFilter({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query); // Trigger search dynamically as the user types
  };

  return (
    <div className="mb-8 flex justify-center">
      <input
        type="text"
        placeholder="Search by Token ID, Hash, or Metadata Author"
        value={searchQuery}
        onChange={handleInputChange}
        className="border border-gray-300 rounded-full px-6 py-3 w-3/4 max-w-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
