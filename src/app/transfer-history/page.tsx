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

// Helper: combine two U256 halves into one BigInt as string.
function decodeU256(lowHex: string, highHex: string): string {
  const low = BigInt(lowHex);
  const high = BigInt(highHex);
  return ((high << 128n) | low).toString();
}

// Helper: Insert a "0" after "0x" if needed.
function fixAddress(addr: string) {
  if (!addr) return addr;
  const lower = addr.toLowerCase();
  if (lower.startsWith("0x") && lower.length > 2 && lower[2] !== "0") {
    return "0x0" + lower.slice(2);
  }
  return lower;
}

export function EventsHandler() {
  const eventName = "Transfer";
  const fromBlock = 0;
  const toBlock = BlockTag.LATEST;
  const pageSize = 10;
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

  // Make filtered events a state variable so other parts can access it.
  const [filteredEvents, setFilteredEvents] = useState<typeof allEvents>([]);

  // Re-filter events whenever allEvents or address changes.
  useEffect(() => {
    const newFiltered = allEvents.filter(
      (event) =>
        fixAddress(event.keys[1].toLowerCase()) === address?.toLowerCase()
    );
    setFilteredEvents(newFiltered);
  }, [allEvents, address]);

  // Automatically fetch the next page at set intervals until no more pages exist.
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasNextPage && !isFetchingNextPage) {
        console.log("Automatically fetching next page...");
        fetchNextPage();
      } else if (!hasNextPage) {
        clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  console.log("Filtered Events:", filteredEvents);

  // Example log for debugging:
  useEffect(() => {
    if (filteredEvents.length > 0) {
      console.log(
        "Event keys of first filtered event:",
        filteredEvents[0]?.keys
      );
    }
  }, [filteredEvents]);

  return (
    <div className="flex flex-col gap-4">
      {filteredEvents.map((event, idx) => {
        // Extract a token ID from the event’s keys.
        // (Assuming event.keys[3] and event.keys[4] hold low and high parts respectively)
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
      <div>
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more events ..."
            : hasNextPage
            ? "Load more events"
            : "No more events to load"}
        </Button>
      </div>
    </div>
  );
}

export function SearchAndFilter({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
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

// This component now uses a state variable for filtered token IDs.
export default function AllTokenURIsPage() {
  const [allTokenData, setAllTokenData] = useState<
    { tokenId: number; uri: string; metadata: any; hash: string }[]
  >([]);
  const [filteredTokenData, setFilteredTokenData] = useState<
    { tokenId: number; uri: string; metadata: any; hash: string }[]
  >([]);
  // A state for filtered token IDs (as strings).
  const [filteredTokenIds, setFilteredTokenIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // In this useEffect, you might update filteredTokenIds based on some filtering criteria.
  // For example, assume you want to filter based on some condition on the tokenId.
  // You can update filteredTokenIds once you have allTokenData.
  useEffect(() => {
    // Example: Filter tokens with even tokenId.
    const ids = allTokenData
      .filter((data) => data.tokenId % 2 === 0)
      .map((data) => data.tokenId.toString());
    setFilteredTokenIds(ids);
  }, [allTokenData]);

  // Now, instead of looping tokenId 1 to TOTAL_SUPPLY,
  // we loop over filteredTokenIds to fetch metadata:
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const customRpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
        const CONTRACT_ADDRESS = process.env
          .NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`;
        const provider = new RpcProvider({ nodeUrl: customRpcUrl });
        const { abi } = await provider.getClassAt(CONTRACT_ADDRESS);
        if (!abi) {
          throw new Error("Failed to fetch ABI for the contract.");
        }
        const contract = new Contract(abi, CONTRACT_ADDRESS, provider);

        const data: {
          tokenId: number;
          uri: string;
          metadata: any;
          hash: string;
        }[] = [];
        // Loop over filteredTokenIds rather than a continuous range.
        for (let tokenIdStr of filteredTokenIds) {
          const tokenId = parseInt(tokenIdStr, 10);
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
        setFilteredTokenData(data); // or apply additional filtering if needed
      } catch (err: any) {
        console.error("Error fetching token data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    // Only fetch if there are some filtered token IDs.
    if (filteredTokenIds.length > 0) {
      fetchTokenData();
    }
  }, [filteredTokenIds]);

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
          token.metadata.author.toLowerCase().includes(lowerCaseQuery))
    );

    setFilteredTokenData(filtered);
  };

  return (
    <div>
      <EventsHandler />
      <h1 className="text-2xl font-bold tracking-tight text-center p-4">
        Transfer History
      </h1>
      {/* Uncomment the SearchAndFilter component if you want live searching */}
      {/* <SearchAndFilter onSearch={handleSearch} /> */}
      {loading ? (
        <Loading />
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : filteredTokenData.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTokenData.map((data) => {
            const metadata = data.metadata || {};
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

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
