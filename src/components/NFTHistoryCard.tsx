"use client";
import React, { useEffect, useState } from "react";
import { useReadContract } from "@starknet-react/core";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { abi } from "../../src/abis/abi";
import { type Abi } from "starknet";

// A helper to check if a URL is valid.
function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

interface NFTHistoryCardProps {
  tokenId: string; // use string (or number) for simplicity
}

const NFTHistoryCard: React.FC<NFTHistoryCardProps> = ({ tokenId }) => {
  // Always call hooks at the top level.
  const {
    data: tokenURI,
    isLoading: isContractLoading,
    error: contractError,
  } = useReadContract({
    abi: abi as Abi,
    functionName: "tokenURI",
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`,
    args: [Number(tokenId)],
    watch: false,
  });

  // Local state for metadata and error.
  const [metadata, setMetadata] = useState<any>(null);
  const [metaError, setMetaError] = useState<string | null>(null);

  // Always call this effect.
  useEffect(() => {
    async function fetchMetadata() {
      if (tokenURI && typeof tokenURI === "string") {
        try {
          const response = await fetch(tokenURI);
          if (!response.ok) {
            throw new Error(`Failed to fetch metadata for token ID ${tokenId}`);
          }
          const meta = await response.json();
          setMetadata(meta);
        } catch (err: any) {
          setMetaError(err.message);
        }
      }
    }
    fetchMetadata();
  }, [tokenURI, tokenId]);

  // Decide on the image URL.
  const imageUrl =
    metadata && isValidUrl(metadata.image) ? metadata.image : "/background.jpg";

  // Instead of early-returning, store fallback UI content in variables.
  const loadingUI = <p>Loading contract data...</p>;
  const errorUI = <p>Error: {contractError?.message}</p>;
  const mainUI = (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={imageUrl}
          alt={metadata?.name || "Default Name"}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={metadata?.authorAvatar || ""} />
            <AvatarFallback>{metadata?.author?.[0] || "A"}</AvatarFallback>
          </Avatar>
          <span className="font-medium">
            {metadata?.name || "Unknown Name"}
          </span>
          {metadata?.verified && <Badge variant="secondary">Verified</Badge>}
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          {metadata?.description || "No description available."}
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Token ID</p>
            <p className="font-medium">{tokenId}</p>
          </div>
        </div>
        {metaError && (
          <p style={{ color: "red" }}>Metadata Error: {metaError}</p>
        )}
      </CardContent>
    </Card>
  );

  // Now, in the return, always call hooks and choose which UI to show.
  return (
    <>
      {isContractLoading ? loadingUI : contractError ? errorUI : mainUI}
      {/* For debugging, log metadata changes */}
      {metadata && console.log("Fetched metadata:", metadata)}
    </>
  );
};

export default NFTHistoryCard;
