"use client";
import React, { useEffect, useState } from "react";
import { RpcProvider, Contract } from "starknet";
import CryptoJS from "crypto-js"; // Install with `npm install crypto-js`
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function AllTokenURIsPage() {
  const [tokenData, setTokenData] = useState<
    { tokenId: number; uri: string; metadata: any; hash: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllTokenData = async () => {
      try {
        const customRpcUrl = process.env.NEXT_PUBLIC_RPC_URL; // Replace with your RPC URL
        const CONTRACT_ADDRESS = "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0"; // Replace with your contract address
       

        // Initialize provider
        const provider = new RpcProvider({ nodeUrl: customRpcUrl });

        // Fetch the ABI dynamically
        const { abi } = await provider.getClassAt(CONTRACT_ADDRESS);
        if (!abi) {
          throw new Error("Failed to fetch ABI for the contract.");
        } 

        // Initialize the contract
        const contract = new Contract(abi, CONTRACT_ADDRESS, provider);
        const totalSupplyResult = await contract.total_supply(); // Replace with the actual function name if different
        const TOTAL_SUPPLY = parseInt(totalSupplyResult.toString(), 10); // Convert BigInt to number

        // Fetch token URIs and their metadata
        const data: { tokenId: number; uri: string; metadata: any; hash: string }[] = [];
        for (let tokenId = 1; tokenId <= TOTAL_SUPPLY; tokenId++) {
          try {
            const uri = await contract.token_uri(tokenId.toString());

            // Fetch metadata from the URI
            const response = await fetch(uri);
            if (!response.ok) {
              throw new Error(`Failed to fetch metadata for token ID ${tokenId}`);
            }
            const metadata = await response.json();

            // Hash the metadata
            const metadataString = JSON.stringify(metadata);
            const hash = CryptoJS.SHA256(metadataString).toString();

            // Store the token data
            data.push({ tokenId, uri, metadata, hash });
          } catch (err) {
            console.error(`Error fetching data for token ID ${tokenId}:`, err);
          }
        }

        // Update state with the fetched data
        setTokenData(data);
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
    // Implement search logic here
  };

  return (
    <div>
          <h1>Transfer History</h1>
      <SearchAndFilter onSearch={handleSearch} />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : tokenData.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokenData.map((data) => {
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

export function TransferHistoryPage() {
  const [filteredHistory, setFilteredHistory] = useState([]);

  const handleSearch = (query: string) => {
    // Filter the transfer history based on the query
    setFilteredHistory((prevHistory) =>
      prevHistory.filter(
        (tx) =>
          tx.transactionHash.includes(query) ||
          tx.from.includes(query) ||
          tx.to.includes(query)
      )
    );
  };

  return (
    <div>
      <h1>Transfer History</h1>
      <SearchAndFilter onSearch={handleSearch} />
      <TransferHistory tokenId="1" />
    </div>
  );
}

export function SearchAndFilter({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search by NFT ID, Wallet Address, or Transaction Hash"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 w-full"
      />
      <button
        onClick={handleSearch}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>
    </div>
  );
}

export function TransferHistory({ tokenId }: { tokenId: string }) {
  const [transferHistory, setTransferHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransferHistory = async () => {
      try {
        const customRpcUrl = process.env.NEXT_PUBLIC_RPC_URL; // Replace with your RPC URL
        const CONTRACT_ADDRESS = "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0"; // Replace with your contract address

        // Initialize provider
        const provider = new RpcProvider({ nodeUrl: customRpcUrl });

        // Fetch transfer events for the specific token ID
        const events = await provider.getEvents({
          address: CONTRACT_ADDRESS,
          keys: [], // Add specific event keys if needed
          chunk_size: 50, // Fetch in chunks for large histories
        });

        // Filter events for the specific token ID
        const filteredEvents = events.events.filter((event) =>
          event.data.includes(tokenId)
        );

        // Format the data
        const history = filteredEvents.map((event) => ({
          transactionHash: event.transaction_hash,
          from: event.from_address,
          to: event.to_address,
          timestamp: new Date(event.timestamp * 1000).toLocaleString(),
        }));

        setTransferHistory(history);
      } catch (err) {
        console.error("Error fetching transfer history:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransferHistory();
  }, [tokenId]);

  return (
    <div>
      <h2>Transfer History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : transferHistory.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Transaction Hash</th>
              <th className="border border-gray-300 px-4 py-2">From</th>
              <th className="border border-gray-300 px-4 py-2">To</th>
              <th className="border border-gray-300 px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transferHistory.map((tx, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{tx.transactionHash}</td>
                <td className="border border-gray-300 px-4 py-2">{tx.from}</td>
                <td className="border border-gray-300 px-4 py-2">{tx.to}</td>
                <td className="border border-gray-300 px-4 py-2">{tx.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transfer history found.</p>
      )}
    </div>
  );
}