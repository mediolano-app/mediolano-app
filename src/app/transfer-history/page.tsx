"use client";
import React, { useEffect, useState, useMemo } from "react";
import { RpcProvider, Contract } from "starknet";
import CryptoJS from "crypto-js";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Loading from "../create/loading";
import { useEvents, useAccount } from "@starknet-react/core";
import { BlockTag } from "starknet";
import stringify from "safe-stable-stringify";
import { Button } from "@/components/ui/button";

function decodeU256(lowHex: string, highHex: string): string {
  const low = BigInt(lowHex);
  const high = BigInt(highHex);
  // Combine the two 128-bit halves into one 256-bit number:
  return ((high << 128n) | low).toString();
}

export function EventsHandler() {
  const eventName = "Transfer";
  const fromBlock = 0;
  const toBlock = BlockTag.LATEST;
  const pageSize = 75;

  const { address } = useAccount();

  const {
    data,
    error: eventError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEvents({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`,
    eventName,
    fromBlock,
    toBlock,
    pageSize,
  });

  const allEvents = data?.pages.flatMap((page) => page.events) || [];
  console.log("All Events:", allEvents);

  // Derive filtered events based on the connected user's address using useMemo.
  // This will update automatically whenever allEvents or address changes.
  const filteredEvents = useMemo(() => {
    if (!address) return [];
    return allEvents.filter(
      (event) => event.keys[1]?.toLowerCase() === address.toLowerCase()
    );
  }, [allEvents, address]);
  console.log("Filtered Events:", filteredEvents);

  // Automatically fetch the next page at set intervals until no more pages exist.
  useEffect(() => {
    // Set an interval to trigger fetchNextPage every 5 seconds
    const interval = setInterval(() => {
      if (hasNextPage && !isFetchingNextPage) {
        console.log("Automatically fetching next page...");
        fetchNextPage();
      } else if (!hasNextPage) {
        // Clear the interval if there are no more pages to fetch
        clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  console.log("All Events:", allEvents);
  console.log(allEvents[71]);
  console.log("event keys 72", allEvents[72]?.keys[1]);
  console.log("address", address);

  useEffect(() => {
    console.log(allEvents[72]?.keys[1] == address);
  }, [allEvents, address]);

  // (Optional) Log filteredEvents once per change
  console.log("Filtered Events:", filteredEvents);

  const response =
    status === "pending" ? (
      <p>Loading first events ...</p>
    ) : status === "error" ? (
      <>
        <p>Error: {eventError?.message}</p>
        <pre>{stringify({ data, eventError }, null, 2)}</pre>
      </>
    ) : (
      <>
        <div>
          <Button
            onClick={() => {
              fetchNextPage();
            }}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? "Loading more events ..."
              : hasNextPage
              ? "Load more events"
              : "No more events to load"}
          </Button>
        </div>

        {/* {data?.pages
          .slice(0)
          .reverse()
          .map((page, i) => (
            <div key={page.continuation_token}>
              <p>Chunk: {data.pages.length - i}</p>
              <pre>{stringify({ page }, null, 2)}</pre>
            </div>
          ))} */}
      </>
    );
  return (
    <div className="flex flex-col gap-4">
      {/* <p>Fetching events for</p>
      <pre>
        {stringify(
          { address, eventName: "Transfer", fromBlock, toBlock, pageSize },
          null,
          2
        )}
      </pre> */}
      {filteredEvents.map((event, idx) => {
        // The 'keys' array typically contains [from, to, token_id].
        // Let's decode them:
        const tokenId = decodeU256(event.keys[3], event.keys[4]);

        return (
          <div key={idx} style={{ marginBottom: "1rem" }}>
            <p>
              <strong>Token ID:</strong> {tokenId}
            </p>
            <hr />
          </div>
        );
      })}
      {response}
    </div>
  );
}

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function SearchAndFilter({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
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
        const CONTRACT_ADDRESS =
          "0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0"; // Replace with your contract address

        const provider = new RpcProvider({ nodeUrl: customRpcUrl });

        const { abi } = await provider.getClassAt(CONTRACT_ADDRESS);
        if (!abi) {
          throw new Error("Failed to fetch ABI for the contract.");
        }

        const contract = new Contract(abi, CONTRACT_ADDRESS, provider);
        const totalSupplyResult = await contract.total_supply();
        const TOTAL_SUPPLY = parseInt(totalSupplyResult.toString(), 10);

        const data: {
          tokenId: number;
          uri: string;
          metadata: any;
          hash: string;
        }[] = [];
        for (let tokenId = 1; tokenId <= TOTAL_SUPPLY; tokenId++) {
          try {
            const uri = await contract.token_uri(tokenId.toString());

            const response = await fetch(uri);
            if (!response.ok) {
              throw new Error(
                `Failed to fetch metadata for token ID ${tokenId}`
              );
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
        (token.metadata.author &&
          token.metadata.author.toLowerCase().includes(lowerCaseQuery)) // Match Metadata Author
    );

    setFilteredTokenData(filtered);
  };

  return (
    <div>
      <EventsHandler />
      <h1 className="text-2xl font-bold tracking-tight text-center p-4">
        Transfer History
      </h1>
      {/* <SearchAndFilter onSearch={handleSearch} /> */}
      {loading ? (
        <Loading />
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : filteredTokenData.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTokenData.map((data) => {
            const metadata = data.metadata || {}; // Fallback to an empty object if metadata is missing
            const imageUrl = isValidUrl(metadata.image)
              ? metadata.image
              : "/background.jpg";

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
                      <AvatarFallback>
                        {metadata.author?.[0] || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {metadata.name || "Unknown Name"}
                    </span>
                    {metadata.verified && (
                      <Badge variant="secondary">Verified</Badge>
                    )}
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
