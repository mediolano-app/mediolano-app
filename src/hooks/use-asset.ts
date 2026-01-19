"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useContract } from "@starknet-react/core";
import type { Abi } from "starknet";
import { COLLECTION_NFT_ABI } from "@/abis/ip_nft";
import {
  fetchIPFSMetadata,
  processIPFSHashToUrl,
  IPFSMetadata,
} from "@/utils/ipfs";
import { DisplayAsset } from "@/lib/types";

const RETRY_DELAY_MS = 1200;
const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 800;
const BACKOFF_MAX_MS = 8000;
const CACHE_TTL_MS = 30000;
const MAX_CACHE_ENTRIES = 500;

type CachedAsset = { value: AssetDetail; timestamp: number };
const assetCache: Map<string, CachedAsset> = new Map();
const notFoundCache: Map<string, number> = new Map();

type CacheOptions = { ttl?: number; maxEntries?: number };

type CacheMeta = { createdAt: number; lastAccessedAt: number };

// Per-Map metadata store to support TTL pruning and LRU without changing stored values
const mapToMetaStore: WeakMap<Map<unknown, unknown>, Map<unknown, CacheMeta>> = new WeakMap();

function getMetaStore<K>(map: Map<K, unknown>): Map<K, CacheMeta> {
  let meta = mapToMetaStore.get(map as unknown as Map<unknown, unknown>) as Map<K, CacheMeta> | undefined;
  if (!meta) {
    meta = new Map<K, CacheMeta>();
    mapToMetaStore.set(map as unknown as Map<unknown, unknown>, meta as unknown as Map<unknown, CacheMeta>);
  }
  return meta;
}

function pruneCache<K, V>(map: Map<K, V>, options?: CacheOptions) {
  const ttl = options?.ttl ?? CACHE_TTL_MS;
  const maxEntries = options?.maxEntries ?? MAX_CACHE_ENTRIES;
  const now = Date.now();
  const meta = getMetaStore(map);

  // Remove stale by ttl based on createdAt
  if (ttl > 0 && meta.size > 0) {
    for (const [key, info] of meta) {
      if (now - info.createdAt > ttl) {
        meta.delete(key as unknown as K);
        map.delete(key as unknown as K);
      }
    }
  }

  // Enforce maxEntries with LRU (least recently used by lastAccessedAt)
  if (maxEntries > 0 && map.size > maxEntries) {
    const entries: Array<{ key: K; info: CacheMeta }> = [];
    for (const [key, info] of meta as Map<K, CacheMeta>) {
      // Only consider keys that still exist in the map
      if (map.has(key)) entries.push({ key, info });
    }
    entries.sort((a, b) => a.info.lastAccessedAt - b.info.lastAccessedAt);
    const toRemoveCount = map.size - maxEntries;
    for (let i = 0; i < toRemoveCount && i < entries.length; i++) {
      const k = entries[i].key;
      meta.delete(k);
      map.delete(k);
    }
  }
}

function addToCache<K, V>(map: Map<K, V>, key: K, value: V, options?: CacheOptions) {
  const now = Date.now();
  map.set(key, value);
  const meta = getMetaStore(map);
  meta.set(key, { createdAt: now, lastAccessedAt: now });
  pruneCache(map, options);
}

function touchCache<K, V>(map: Map<K, V>, key: K) {
  const meta = getMetaStore(map);
  const existing = meta.get(key);
  if (existing) {
    existing.lastAccessedAt = Date.now();
    meta.set(key, existing);
  }
}

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

export interface LoadingState {
  isInitializing: boolean;
  isFetchingOnchainData: boolean;
  isFetchingMetadata: boolean;
  isComplete: boolean;
  currentStep: string;
  progress: number; // 0-100
}

export function useAsset(nftAddress?: `0x${string}`, tokenIdInput?: number) {
  const [asset, setAsset] = useState<AssetDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isInitializing: false,
    isFetchingOnchainData: false,
    isFetchingMetadata: false,
    isComplete: false,
    currentStep: "",
    progress: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  const inFlightRef = useRef<boolean>(false);
  const lastLoadedIdRef = useRef<string | null>(null);
  const retryAttemptRef = useRef<number>(0);

  const { contract } = useContract({
    abi: COLLECTION_NFT_ABI as unknown as Abi,
    address: (nftAddress as `0x${string}`) || undefined,
  });

  const load = useCallback(async () => {
    if (inFlightRef.current) {
      return;
    }
    if (
      !nftAddress ||
      tokenIdInput === undefined ||
      tokenIdInput === null ||
      !contract
    ) {
      // Keep initial state as loading; show clear step while provider/contract is not ready
      setLoading(true);
      setError(null);
      setNotFound(false);
      setLoadingState({
        isInitializing: true,
        isFetchingOnchainData: false,
        isFetchingMetadata: false,
        isComplete: false,
        currentStep: "Establishing connection...",
        progress: 10,
      });
      return;
    }

    inFlightRef.current = true;
    try {
      const tokenId = Number(tokenIdInput);
      const currentId = `${nftAddress}-${tokenId}`;

      // Serve from cache if fresh (avoid toggling loading if we can return immediately)
      const cached = assetCache.get(currentId);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        touchCache(assetCache, currentId);
        setAsset(cached.value);
        setLoadingState((prev) => ({
          ...prev,
          isInitializing: false,
          isFetchingOnchainData: false,
          isFetchingMetadata: false,
          isComplete: true,
          currentStep: "Ready!",
          progress: 100,
        }));
        lastLoadedIdRef.current = currentId;
        retryAttemptRef.current = 0;
        setLoading(false);
        return;
      }

      // Short-circuit if recently known as not found (avoid showing loader)
      const nfCachedAt = notFoundCache.get(currentId);
      if (nfCachedAt && Date.now() - nfCachedAt < CACHE_TTL_MS) {
        touchCache(notFoundCache, currentId);
        setAsset(null);
        setNotFound(true);
        setLoadingState((prev) => ({
          ...prev,
          isInitializing: false,
          isFetchingOnchainData: false,
          isFetchingMetadata: false,
          isComplete: true,
          currentStep: "Asset not found",
          progress: 100,
        }));
        lastLoadedIdRef.current = currentId;
        retryAttemptRef.current = 0;
        setLoading(false);
        return;
      }

      // Proceed with fresh load
      setLoading(true);
      setError(null);
      setNotFound(false);
      setLoadingState({
        isInitializing: true,
        isFetchingOnchainData: false,
        isFetchingMetadata: false,
        isComplete: false,
        currentStep: "Loading asset...",
        progress: 10,
      });

      // Step 1: Fetch onchain data
      setLoadingState((prev) => ({
        ...prev,
        isInitializing: false,
        isFetchingOnchainData: true,
        currentStep: "Fetching onchain data...",
        progress: 30,
      }));

      const onchainTimeout = new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                "Connection timeout - Please check your internet connection and try again"
              )
            ),
          15000
        )
      );

      const onchainData = (await Promise.race([
        (async () => {
          // owner
          const ownerRaw = await (
            contract as unknown as {
              owner_of?: (id: number) => Promise<unknown>;
              ownerOf?: (id: number) => Promise<unknown>;
            }
          )
            .owner_of?.(tokenId)
            .catch(async () => {
              const owned = await (
                contract as unknown as {
                  ownerOf: (id: number) => Promise<unknown>;
                }
              ).ownerOf(tokenId);
              return owned;
            });
          const owner = ownerRaw as `0x${string}`;

          // token URI
          const uriRaw = await (
            contract as unknown as {
              token_uri?: (id: number) => Promise<unknown>;
              tokenURI?: (id: number) => Promise<unknown>;
            }
          )
            .token_uri?.(tokenId)
            .catch(async () => {
              const r = await (
                contract as unknown as {
                  tokenURI: (id: number) => Promise<unknown>;
                }
              ).tokenURI(tokenId);
              return r;
            });
          const tokenURI = String(uriRaw || "");

          return { owner, tokenURI };
        })(),
        onchainTimeout,
      ])) as { owner: `0x${string}`; tokenURI: string };

      // Step 2: Fetch IPFS metadata
      setLoadingState((prev) => ({
        ...prev,
        isFetchingOnchainData: false,
        isFetchingMetadata: true,
        currentStep: "Fetching metadata...",
        progress: 60,
      }));

      let ipfsCid: string | undefined;
      let metadata: IPFSMetadata | null = null;

      if (onchainData.tokenURI) {
        let cid = "";
        const uri = onchainData.tokenURI;

        if (uri.startsWith("ipfs://")) {
          cid = uri.replace("ipfs://", "");
        } else if (uri.includes("/ipfs/")) {
          cid = uri.split("/ipfs/")[1]?.split("?")[0] || "";
        } else if (uri.match(/^[a-zA-Z0-9]{46,59}$/)) {
          cid = uri;
        }

        if (cid) {
          ipfsCid = cid;
          const metadataTimeout = new Promise<IPFSMetadata | null>(
            (_, reject) =>
              setTimeout(
                () =>
                  reject(
                    new Error(
                      "Unable to load asset details - Some information may be missing"
                    )
                  ),
                10000
              )
          );

          try {
            metadata = await Promise.race([
              fetchIPFSMetadata(cid),
              metadataTimeout,
            ]);
          } catch (metadataError) {
            console.warn("Failed to fetch IPFS metadata:", metadataError);
            // Continue without metadata rather than failing completely
          }
        }
      }

      // Step 3: Process and combine data
      setLoadingState((prev) => ({
        ...prev,
        isFetchingMetadata: false,
        currentStep: "Almost ready...",
        progress: 90,
      }));

      const next: AssetDetail = {
        id: `${nftAddress}-${tokenId}`,
        nftAddress,
        tokenId,
        name: (metadata?.name as string) || `IP Asset #${tokenId}`,
        description: (metadata?.description as string) || "",
        image: processIPFSHashToUrl(
          (metadata?.image as string) || "",
          "/placeholder.svg"
        ),
        type:
          (metadata?.type as string) ||
          (metadata?.assetType as string | undefined),
        registrationDate: metadata?.registrationDate as string | undefined,
        attributes:
          (metadata?.attributes as Array<{
            trait_type: string;
            value: string;
          }>) || undefined,
        properties: metadata?.properties || undefined,
        external_url: metadata?.external_url || undefined,
        owner: onchainData.owner,
        tokenURI: onchainData.tokenURI,
        ipfsCid,
        tags: metadata?.tags as string[] | undefined,
        collectionName: metadata?.collectionName as string | undefined,
        licenseType: metadata?.licenseType as string | undefined,
        collectionId: metadata?.collection as string | undefined,
      };

      setAsset(next);
      addToCache(assetCache, next.id, { value: next, timestamp: Date.now() }, { ttl: CACHE_TTL_MS, maxEntries: MAX_CACHE_ENTRIES });
      lastLoadedIdRef.current = next.id;
      retryAttemptRef.current = 0;

      // Step 4: Complete
      setLoadingState((prev) => ({
        ...prev,
        isComplete: true,
        currentStep: "Ready!",
        progress: 100,
      }));
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      const currentId =
        nftAddress && tokenIdInput != null
          ? `${nftAddress}-${Number(tokenIdInput)}`
          : null;

      // Detect not-found conditions using exact contract revert message
      const notFoundDetected = /erc721:\s*invalid\s*token\s*id/i.test(errorMessage || "");

      if (notFoundDetected) {
        setNotFound(true);
        setError(null);
        if (currentId) {
          addToCache(notFoundCache, currentId, Date.now(), { ttl: CACHE_TTL_MS, maxEntries: MAX_CACHE_ENTRIES });
        }
        setLoadingState((prev) => ({
          ...prev,
          isInitializing: false,
          isFetchingOnchainData: false,
          isFetchingMetadata: false,
          isComplete: true,
          currentStep: "Asset not found",
          progress: 100,
        }));
      } else {
        setError(errorMessage);
        setLoadingState((prev) => ({
          ...prev,
          isInitializing: false,
          isFetchingOnchainData: false,
          isFetchingMetadata: false,
          isComplete: false,
          currentStep: "Error occurred",
          progress: 0,
        }));
      }
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }, [nftAddress, tokenIdInput, contract]);

  // Removed auto-retry to minimize RPC calls
  const loadWithRetry = load;

  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  useEffect(() => {
    const currentId = nftAddress && tokenIdInput != null ? `${nftAddress}-${Number(tokenIdInput)}` : null;
    if (currentId && lastLoadedIdRef.current === currentId && inFlightRef.current) {
      return;
    }
    setAsset(null);
    lastLoadedIdRef.current = currentId;
    retryAttemptRef.current = 0;
    loadWithRetry();
  }, [loadWithRetry, nftAddress, tokenIdInput]);

  useEffect(() => {
    if (!asset && error && !notFound) {
      if (retryAttemptRef.current >= MAX_RETRIES) {
        return;
      }
      const attempt = retryAttemptRef.current;
      const delay = Math.min(BACKOFF_BASE_MS * Math.pow(2, attempt), BACKOFF_MAX_MS);
      setError(null);
      setLoading(true);
      const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
        retryAttemptRef.current = attempt + 1;
        if (!inFlightRef.current) {
          loadRef.current?.();
        }
      }, attempt === 0 ? RETRY_DELAY_MS : delay);
      return () => clearTimeout(timer);
    }
  }, [asset, error, notFound]);

  const displayAsset = useMemo(() => {
    if (!asset) return null;

    const tokenOwnerAddress = asset.owner
      ? "0x" + BigInt(asset.owner).toString(16)
      : "Unknown";

    // Extract license information from attributes
    const licenseAttributeTerms = asset.attributes?.find(
      (attr) => attr.trait_type?.toLowerCase() === "license"
    );
    const licenseAttributeType = asset.attributes?.find(
      (attr) => attr.trait_type?.toLowerCase() === "type"
    );
    const commercialUseAttribute = asset.attributes?.find(
      (attr) => attr.trait_type?.toLowerCase() === "commercial use"
    );
    const modificationsAttribute = asset.attributes?.find(
      (attr) => attr.trait_type?.toLowerCase() === "modifications"
    );
    const attributionAttribute = asset.attributes?.find(
      (attr) => attr.trait_type?.toLowerCase() === "attribution"
    );
    const ipVersionAttribute = asset.attributes?.find(
      (attr) => attr.trait_type?.toLowerCase() === "ip version"
    );

    // Extract creator and collection from properties
    const creator = asset.properties?.creator || tokenOwnerAddress;
    const collection =
      asset.properties?.collection ||
      asset.collectionName ||
      asset.collectionId ||
      "";

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
      createdAt:
        asset.registrationDate ||
        asset.properties?.registration_date ||
        new Date().toLocaleDateString(),
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
        type: licenseAttributeType?.value || asset.licenseType || "Unknown",
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

  const uiState = useMemo<"loading" | "ready" | "not_found" | "error">(() => {
    if (notFound) return "not_found";
    if (loading) return "loading";
    if (error) return "error";
    return asset ? "ready" : "loading";
  }, [notFound, loading, error, asset]);

  return useMemo(
    () => ({
      asset,
      displayAsset,
      loading,
      loadingState,
      error,
      notFound,
      uiState,
      showSkeleton: uiState === "loading",
      reload: loadWithRetry,
    }),
    [asset, displayAsset, loading, loadingState, error, notFound, uiState, loadWithRetry]
  );
}

export type { DisplayAsset };
