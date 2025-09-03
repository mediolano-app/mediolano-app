"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useContract } from "@starknet-react/core";
import type { Abi } from "starknet";
import { COLLECTION_NFT_ABI } from "@/abis/ip_nft";
import { fetchIPFSMetadata, processIPFSHashToUrl, IPFSMetadata } from "@/utils/ipfs";
import { DisplayAsset } from "@/lib/types"; 

export interface AssetDetail {
  id: string; // `${nftAddress}-${tokenId}`
  name: string;
  description?: string;
  image?: string;
  type?: string;
  registrationDate?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
  properties?: Record<string, unknown>;
  external_url?: string;
  collectionId?: string;
  collectionName?: string;
  nftAddress: `0x${string}`;
  tokenId: number;
  owner?: `0x${string}`;
  tokenURI?: string;
  ipfsCid?: string;
  tags?: string[];
  licenseType?: string;
}



export function useAsset(nftAddress?: `0x${string}`, tokenIdInput?: number) {
  const [asset, setAsset] = useState<AssetDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: COLLECTION_NFT_ABI as unknown as Abi,
    address: (nftAddress as `0x${string}`) || undefined,
  });

  const load = useCallback(async () => {
    if (!nftAddress || tokenIdInput === undefined || tokenIdInput === null || !contract) {
      setLoading(false);
      setError(prev => prev ?? 'Invalid asset identifier');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const tokenId = Number(tokenIdInput);
      // owner
      const ownerRaw = await (contract as unknown as {
        get_token_owner?: (id: number) => Promise<unknown>;
        ownerOf?: (id: number) => Promise<unknown>;
      }).get_token_owner?.(tokenId).catch(async () => {
        const owned = await (contract as unknown as { ownerOf: (id: number) => Promise<unknown> }).ownerOf(tokenId);
        return owned;
      });
      const owner = ownerRaw as `0x${string}`;

      // token URI
      const uriRaw = await (contract as unknown as {
        get_token_uri?: (id: number) => Promise<unknown>;
        tokenURI?: (id: number) => Promise<unknown>;
      }).get_token_uri?.(tokenId).catch(async () => {
        const r = await (contract as unknown as { tokenURI: (id: number) => Promise<unknown> }).tokenURI(tokenId);
        return r;
      });
      const tokenURI = String(uriRaw || "");


      // ipfs metadata
      let ipfsCid: string | undefined;
      let metadata: IPFSMetadata | null = null;
      if (tokenURI) {
        const match = tokenURI.match(/\/ipfs\/([a-zA-Z0-9]+)/);
        if (match) {
          ipfsCid = match[1];
          metadata = await fetchIPFSMetadata(ipfsCid);
        }
      }

      const next: AssetDetail = {
        id: `${nftAddress}-${tokenId}`,
        nftAddress,
        tokenId,
        name: (metadata?.name as string) || `IP Asset #${tokenId}`,
        description: (metadata?.description as string) || "",
        image: processIPFSHashToUrl((metadata?.image as string) || "", "/placeholder.svg"),
        type: metadata?.type as string || metadata?.assetType as string | undefined,
        registrationDate: metadata?.registrationDate as string | undefined,
        attributes: (metadata?.attributes as Array<{ trait_type: string; value: string }>) || undefined,
        properties: metadata?.properties || undefined,
        external_url: metadata?.external_url || undefined,
        owner,
        tokenURI,
        ipfsCid,
        tags: metadata?.tags as string[] | undefined,
        collectionName: metadata?.collectionName as string | undefined,
        licenseType: metadata?.licenseType as string | undefined,
        collectionId: metadata?.collection as string | undefined,
      };
      setAsset(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [nftAddress, tokenIdInput, contract]);

  useEffect(() => {
    setAsset(null);
    load();
  }, [load]);

  const displayAsset = useMemo(() => {
    if (!asset) return null;
    
    const tokenOwnerAddress = asset.owner
      ? "0x" + BigInt(asset.owner).toString(16)
      : "Unknown";
    
    // Extract license information from attributes
    const licenseAttributeTerms = asset.attributes?.find(attr => 
      attr.trait_type?.toLowerCase() === "license" 
    );
    const licenseAttributeType = asset.attributes?.find(attr => 
      attr.trait_type?.toLowerCase() === "type" 
    );
    const commercialUseAttribute = asset.attributes?.find(attr => 
      attr.trait_type?.toLowerCase() === "commercial use"
    );
    const modificationsAttribute = asset.attributes?.find(attr => 
      attr.trait_type?.toLowerCase() === "modifications"
    );
    const attributionAttribute = asset.attributes?.find(attr => 
      attr.trait_type?.toLowerCase() === "attribution"
    );
    const ipVersionAttribute = asset.attributes?.find(attr => 
      attr.trait_type?.toLowerCase() === "ip version"
    );
    
    // Extract creator and collection from properties
    const creator = asset.properties?.creator || tokenOwnerAddress;
    const collection = asset.properties?.collection || asset.collectionName || asset.collectionId || "";
    
    return {
      id: asset.id,
      tokenId: asset.tokenId,
      name: asset.name || "Untitled",
      tags: asset.tags || [],
      author: {
        name: creator,
        address: tokenOwnerAddress,
        avatar: asset.image || "/background.jpg",
        verified: false,
        bio: "",
        website: asset.external_url || "https://ip.mediolano.app",
      },
      creator: {
        name: creator,
        address: tokenOwnerAddress,
        avatar: asset.image || "/background.jpg",
        verified: false,
        bio: "",
        website: asset.external_url || "https://ip.mediolano.app",
      },
      owner: {
        name: tokenOwnerAddress,
        address: tokenOwnerAddress,
        avatar: "/background.jpg",
        verified: true,
        acquired: "(Preview)",
      },
      description: asset.description || "",
      template: asset.type || "Asset",
      image: asset.image || "/background.jpg",
      createdAt: asset.registrationDate || asset.properties?.registration_date || "(Preview)",
      collection: collection || "Unknown Collection",
      blockchain: "Starknet",
      tokenStandard: "ERC-721",
      licenseType: asset.licenseType || licenseAttributeType?.value || "",
      licenseDetails: "Unknown",
      version: ipVersionAttribute?.value || "1.0",
      commercialUse: commercialUseAttribute?.value === "true",
      modifications: modificationsAttribute?.value === "true",
      attribution: attributionAttribute?.value === "true",
      licenseTerms: licenseAttributeTerms?.value || "Unknown",
      contract: (asset.nftAddress as string) || "",
      attributes: asset.attributes || [
        { trait_type: "Asset", value: "Programmable IP" },
        { trait_type: "Protection", value: "Proof of Ownership" },
      ],
      licenseInfo: {
        type: licenseAttributeType?.value || asset.licenseType|| "Unknown",
        terms: licenseAttributeTerms?.value || "Unknown",
        allowCommercial: commercialUseAttribute?.value === "true",
        allowDerivatives: modificationsAttribute?.value === "true",
        requireAttribution: attributionAttribute?.value === "true",
        royaltyPercentage: 5,
      },
      ipfsCid: asset.ipfsCid,
      type: asset.type || "",
    } as DisplayAsset;
  }, [asset]);

  return useMemo(
    () => ({ asset, displayAsset, loading, error, reload: load }),
    [asset, displayAsset, loading, error, load]
  );
}


