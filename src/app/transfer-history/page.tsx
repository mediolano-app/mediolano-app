"use client";
import React, { useEffect, useState, useMemo } from "react";
import { BlockTag } from "starknet";
import { useEvents, useAccount } from "@starknet-react/core";
import stringify from "safe-stable-stringify";
import { Button } from "@/components/ui/button";

import NFTHistoryCard from "@/components/NFTHistoryCard";

// Decode a u256 that is split into two 128-bit parts.
function decodeU256(lowHex: string, highHex: string): string {
  const low = BigInt(lowHex);
  const high = BigInt(highHex);
  const factor = BigInt(2) ** BigInt(128);
  return (high * factor + low).toString();
}

// Helper: Fix an address if needed (adds extra 0 after "0x").
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
  const pageSize = 75;
  const { address } = useAccount();

  // Use useEvents to fetch Transfer events from the contract.
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useEvents({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`,
    eventName,
    fromBlock,
    toBlock,
    pageSize,
  });

  // State to hold the cumulative events.
  const [allEvents, setAllEvents] = useState<any[]>([]);
  // State for events filtered by address.
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  // State for the user's search query.
  const [searchQuery, setSearchQuery] = useState("");
  // State to show if automatic fetching is active.
  const [autoFetching, setAutoFetching] = useState(false);

  // When data changes, update the cumulative events and filter by address.
  useEffect(() => {
    if (data) {
      const newEvents = data.pages.flatMap((page) => page.events);
      // Assume data.pages returns the cumulative list.
      setAllEvents(newEvents);
      const addressFiltered = newEvents.filter(
        (event) =>
          fixAddress(event.keys[1]?.toLowerCase()) === address?.toLowerCase()
      );
      setFilteredEvents(addressFiltered);
    }
  }, [data, address]);

  // Automatically fetch next page every 5 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasNextPage && !isFetchingNextPage) {
        setAutoFetching(true);
        console.log("Automatically fetching next page...");
        fetchNextPage().finally(() => {
          setAutoFetching(false);
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Create a memoized filtered list using the search query.
  const finalFilteredEvents = useMemo(() => {
    if (!searchQuery) return filteredEvents;
    const lowerQuery = searchQuery.toLowerCase();
    return filteredEvents.filter((event) => {
      // For demonstration, we filter by checking if tokenId includes the search query.
      // Adjust this logic to also filter by hash or metadata author if needed.
      if (!event.keys || event.keys.length < 5) return false;
      const tokenId = decodeU256(event.keys[3], event.keys[4]);
      return tokenId.toLowerCase().includes(lowerQuery);
    });
  }, [filteredEvents, searchQuery]);

  // Debug logging for events.
  useEffect(() => {
    console.log("All Events:", allEvents);
    console.log("Filtered Events:", filteredEvents);
    console.log("Final Filtered Events:", finalFilteredEvents);
  }, [allEvents, filteredEvents, finalFilteredEvents]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight text-center p-4">
        Transfer History
      </h1>
      {/* Search Input */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search by Token ID, Hash, or Author"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-full px-6 py-3 w-3/4 max-w-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {finalFilteredEvents.length > 0 ? (
          finalFilteredEvents.map((event, idx) => {
            if (!event.keys || event.keys.length < 5) return null;
            const tokenId = decodeU256(event.keys[3], event.keys[4]);
            return <NFTHistoryCard key={idx} tokenId={tokenId} />;
          })
        ) : (
          <p>No transfers found matching your criteria.</p>
        )}
      </div>
      <div className="flex justify-center my-4">
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more events..."
            : hasNextPage
            ? "Load more events"
            : "No more events to load"}
        </Button>
      </div>
      {autoFetching && (
        <p className="text-center text-gray-600">
          Still loading all NFT transfers...
        </p>
      )}
      {status === "error" && (
        <>
          <p>Error: {error?.message}</p>
          <pre>{stringify({ data, error }, null, 2)}</pre>
        </>
      )}
      {status === "pending" && (
        <p className="text-center">Loading events ...</p>
      )}
    </div>
  );
}

export default function Events() {
  return <EventsHandler />;
}
