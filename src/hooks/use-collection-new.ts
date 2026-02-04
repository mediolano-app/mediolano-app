import { useState, useEffect, useMemo } from "react";
import { useContract } from "@starknet-react/core";
import { Asset, LicenseType } from "@/types/asset";
import { Collection } from "@/lib/types";
import { isAssetReported } from "@/lib/reported-content";
import { Abi } from "starknet";
import { fetchIPFSMetadata, processIPFSHashToUrl } from "@/utils/ipfs";

// --- Minimal ABIs ---

const MINIMAL_COLLECTION_ABI = [
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      { name: "low", type: "core::integer::u128" },
      { name: "high", type: "core::integer::u128" },
    ],
  },
  {
    type: "struct",
    name: "core::byte_array::ByteArray",
    members: [
      { name: "data", type: "core::array::Array::<core::bytes_31::bytes31>" },
      { name: "pending_word", type: "core::felt252" },
      { name: "pending_word_len", type: "core::integer::u32" },
    ],
  },
  {
    type: "function",
    name: "get_collection_id",
    inputs: [],
    outputs: [{ type: "core::integer::u256" }],
    state_mutability: "view",
  },
  {
    type: "function",
    name: "total_supply",
    inputs: [],
    outputs: [{ type: "core::integer::u256" }],
    state_mutability: "view",
  },
  {
    type: "function",
    name: "owner_of",
    inputs: [{ name: "token_id", type: "core::integer::u256" }],
    outputs: [{ type: "core::starknet::contract_address::ContractAddress" }],
    state_mutability: "view",
  },
  {
    type: "function",
    name: "token_uri",
    inputs: [{ name: "token_id", type: "core::integer::u256" }],
    outputs: [{ type: "core::byte_array::ByteArray" }],
    state_mutability: "view",
  },
] as const;

const MINIMAL_MIP_ABI = [
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      { name: "low", type: "core::integer::u128" },
      { name: "high", type: "core::integer::u128" },
    ],
  },
  {
    type: "struct",
    name: "core::byte_array::ByteArray",
    members: [
      { name: "data", type: "core::array::Array::<core::bytes_31::bytes31>" },
      { name: "pending_word", type: "core::felt252" },
      { name: "pending_word_len", type: "core::integer::u32" },
    ],
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      { name: "False", type: "()" },
      { name: "True", type: "()" },
    ],
  },
  {
    type: "struct",
    name: "ip_collection_erc_721::types::Collection",
    members: [
      { name: "name", type: "core::byte_array::ByteArray" },
      { name: "symbol", type: "core::byte_array::ByteArray" },
      { name: "base_uri", type: "core::byte_array::ByteArray" },
      { name: "owner", type: "core::starknet::contract_address::ContractAddress" },
      { name: "ip_nft", type: "core::starknet::contract_address::ContractAddress" },
      { name: "is_active", type: "core::bool" },
    ],
  },
  {
    type: "function",
    name: "get_collection",
    inputs: [{ name: "collection_id", type: "core::integer::u256" }],
    outputs: [{ type: "ip_collection_erc_721::types::Collection" }],
    state_mutability: "view",
  },
] as const;

function resolveIpfsUrl(url: string): string {
  return processIPFSHashToUrl(url, "/placeholder.svg");
}

function mapStringToLicenseType(value: string): LicenseType {
  const normalized = value?.toLowerCase() || "";

  if (normalized === "cc-by" || normalized === "creative commons") return "cc-by";
  if (normalized === "cc-by-sa") return "cc-by-sa";
  if (normalized === "cc-by-nc") return "cc-by-nc";

  if (normalized === "all-rights-reserved" || normalized === "exclusive rights" || normalized === "exclusive") {
    return "all-rights-reserved";
  }

  // Legacy/Other mappings
  if (normalized.includes("commercial")) return "custom"; // "Commercial Use" -> Custom
  if (normalized.includes("personal")) return "all-rights-reserved"; // "Personal Use" -> All Rights Reserved (closest safe default)
  if (normalized.includes("open source") || normalized === "mit" || normalized === "apache-2.0") return "custom";

  return "all-rights-reserved"; // Default fallback
}

export function useCollectionMetadata(collectionAddress: string) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MIPAddress = process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS!;

  const normalizedAddress = useMemo(() => {
    if (!collectionAddress) return undefined;
    if (String(collectionAddress).toLowerCase().startsWith("0x")) return collectionAddress;
    try {
      return "0x" + BigInt(collectionAddress).toString(16);
    } catch {
      return collectionAddress;
    }
  }, [collectionAddress]);

  const { contract: collectionContract } = useContract({
    abi: MINIMAL_COLLECTION_ABI as any,
    address: normalizedAddress as `0x${string}`,
  });

  const { contract: mipContract } = useContract({
    abi: MINIMAL_MIP_ABI as any,
    address: MIPAddress as `0x${string}`,
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!collectionAddress || !MIPAddress || !collectionContract || !mipContract) return;

      setLoading(true);
      setError(null);

      try {
        const collectionIdResult = await collectionContract.call("get_collection_id", [] as any[]);
        const collectionIdCasted = collectionIdResult as any;
        const collectionId = typeof collectionIdCasted === 'object'
          ? (BigInt(collectionIdCasted.high) << 128n) + BigInt(collectionIdCasted.low)
          : BigInt(collectionIdCasted);

        const totalSupplyResult = await collectionContract.call("total_supply", [] as any[]);
        const totalSupplyCasted = totalSupplyResult as any;
        const totalSupply = typeof totalSupplyCasted === 'object'
          ? (BigInt(totalSupplyCasted.high) << 128n) + BigInt(totalSupplyCasted.low)
          : BigInt(totalSupplyCasted);

        const collectionDetails: any = await mipContract.call("get_collection", [collectionId.toString()] as any[]);

        const name = collectionDetails.name;
        const symbol = collectionDetails.symbol;
        const rawBaseUri = collectionDetails.base_uri || "";
        const owner = collectionDetails.owner ? `0x${BigInt(collectionDetails.owner).toString(16)}` : "";

        let description = "";
        let image = "/placeholder.svg";
        let resolvedBaseUri = "";

        if (rawBaseUri) {
          try {
            // If rawBaseUri is 'ipfs://...' or hash, extract CID
            const cidMatch = rawBaseUri.match(/ipfs:\/\/([a-zA-Z0-9]+)/) || rawBaseUri.match(/^([a-zA-Z0-9]+)$/);

            // Try fetching metadata from IPFS if it looks like a CID or processable URL
            // If the base_uri points to a directory (common for collections), we might need `base_uri + "collection.json"`
            // But let's try assuming base_uri points to metadata file first.
            const metadataUrl = resolveIpfsUrl(rawBaseUri);

            if (metadataUrl && metadataUrl !== "/placeholder.svg") {
              const res = await fetch(metadataUrl);
              if (res.ok) {
                const json = await res.json();
                description = json.description || "";
                image = resolveIpfsUrl(json.image || json.cover_image || json.coverImage || "/placeholder.svg");
              }
            }
            resolvedBaseUri = metadataUrl;
          } catch (e) {
            console.warn("Failed to fetch collection IPFS metadata", e);
            // If direct fetch fails, it might be a directory or specialized format.
            // Fallback: leave description empty for now.
          }
        }

        setCollection({
          id: collectionId.toString(),
          name: name || "IP Collection",
          symbol: symbol || "MIP",
          description: description,
          image: image,
          nftAddress: collectionAddress,
          owner: owner,
          isActive: collectionDetails.is_active,
          totalMinted: Number(totalSupply),
          totalBurned: 0,
          totalTransfers: 0,
          lastMintTime: "",
          lastBurnTime: "",
          lastTransferTime: "",
          itemCount: Number(totalSupply),
          totalSupply: Number(totalSupply),
          baseUri: resolvedBaseUri,
        });

      } catch (err: any) {
        console.error("Error fetching collection metadata:", err);
        setError(err.message || "Failed to fetch collection data");
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [collectionAddress, MIPAddress, collectionContract, mipContract]);

  return { collection, loading, error };
}

export function useCollectionAssets(collectionAddress: string) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizedAddress = useMemo(() => {
    if (!collectionAddress) return undefined;
    if (String(collectionAddress).toLowerCase().startsWith("0x")) return collectionAddress;
    try {
      return "0x" + BigInt(collectionAddress).toString(16);
    } catch {
      return collectionAddress;
    }
  }, [collectionAddress]);

  const { contract: collectionContract } = useContract({
    abi: MINIMAL_COLLECTION_ABI as any,
    address: normalizedAddress as `0x${string}`,
  });

  useEffect(() => {
    const fetchAssets = async () => {
      if (!collectionAddress || !collectionContract) return;

      setLoading(true);
      setError(null);

      try {
        const totalSupplyResult = await collectionContract.call("total_supply", [] as any[]);
        const totalSupplyCasted = totalSupplyResult as any;
        const totalSupply = Number(
          typeof totalSupplyCasted === 'object'
            ? (BigInt(totalSupplyCasted.high) << 128n) + BigInt(totalSupplyCasted.low)
            : BigInt(totalSupplyCasted)
        );

        const tokenIds = Array.from({ length: totalSupply }, (_, i) => i);

        // Fetch owners
        const ownersPromises = tokenIds.map(id => collectionContract.call("owner_of", [id] as any[]));
        const ownersResults = await Promise.allSettled(ownersPromises);

        const validOwners = ownersResults.map((result, index) => {
          if (result.status === "fulfilled") {
            const val = result.value as any;
            const owner = val ? `0x${BigInt(val).toString(16)}` : "";
            return { tokenId: index, owner };
          }
          return null;
        }).filter((item): item is { tokenId: number, owner: string } => item !== null && !!item.owner && item.owner !== "0x0");

        // Fetch URIs
        const uriPromises = validOwners.map(({ tokenId }) => collectionContract.call("token_uri", [tokenId] as any[]));
        const uriResults = await Promise.allSettled(uriPromises);

        const validUris = uriResults.map((result, index) => {
          if (result.status === "fulfilled") {
            return { tokenId: validOwners[index].tokenId, owner: validOwners[index].owner, uri: resolveIpfsUrl(result.value as string) };
          }
          return null;
        }).filter((item): item is { tokenId: number, owner: string, uri: string } => item !== null);

        // Fetch Metadata
        const metadataPromises = validUris.map(async ({ tokenId, owner, uri }) => {
          try {
            const res = await fetch(uri);
            if (!res.ok) throw new Error("Fetch failed");
            const metadata = await res.json();
            return { tokenId, owner, metadata };
          } catch (e) {
            console.warn(`Failed to fetch metadata for ${tokenId}`, e);
            return null;
          }
        });

        const metadataResults = (await Promise.all(metadataPromises)).filter((item): item is { tokenId: number, owner: string, metadata: any } => item !== null);

        const parsedAssets: Asset[] = metadataResults.map(({ tokenId, owner, metadata }) => {
          const licenseAttribute = metadata.attributes?.find((attr: any) => attr.trait_type === "License");
          const licenseType = mapStringToLicenseType(licenseAttribute?.value || "Personal Use");

          const typeAttribute = metadata.attributes?.find((attr: any) => attr.trait_type === "Type");

          return {
            id: `${collectionAddress}-${tokenId}`,
            name: metadata.name || `Asset #${tokenId}`,
            creator: owner,
            verified: true,
            image: resolveIpfsUrl(metadata.image || metadata.assetUrl),
            collection: collectionAddress,
            licenseType,
            description: metadata.description || "",
            type: typeAttribute?.value || "Unknown",
            metadata
          };
        });

        setAssets(parsedAssets.filter(asset => !isAssetReported(asset.id)));

      } catch (err: any) {
        console.error("Error fetching collection assets:", err);
        setError(err.message || "Failed to fetch assets");
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [collectionAddress, collectionContract]);

  return { assets, loading, error };
}
