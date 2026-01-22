import { useState, useCallback, useEffect } from "react";
import { Asset } from "@/types/asset";

export interface UseCreatorAssetsReturn {
    assets: Asset[];
    remixAssets: Asset[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    reload: () => void;
}

export function useCreatorAssets(address?: string, pageSize: number = 20): UseCreatorAssetsReturn {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [remixAssets, setRemixAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pageKey, setPageKey] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true);

    const fetchNFTs = useCallback(async (isLoadMore: boolean = false) => {
        if (!address || !address.startsWith('0x')) {
            setLoading(false);
            setHasMore(false);
            return;
        }

        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
            const contractAddress = process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS;

            if (!apiKey || !contractAddress) {
                throw new Error("Missing request parameters: API Key or Contract Address");
            }

            // Fetch NFTs using Alchemy Starknet NFT API
            // Reference: https://docs.alchemy.com/reference/getnftsforowner-starknet
            let url = `https://starknet-sepolia.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner?owner=${address}&contractAddresses[]=${contractAddress}&withMetadata=true&pageSize=${pageSize}`;

            if (isLoadMore && pageKey) {
                url += `&pageKey=${pageKey}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: { accept: 'application/json' }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.warn("Alchemy API Error (handling gracefully):", errorText);
                // Don't throw, just return empty to avoid crashing UI
                setLoading(false);
                setHasMore(false);
                return;
            }

            const data = await response.json();

            // Transform the data to match our UI requirements
            const fetchedAssets: Asset[] = data.ownedNfts.map((nft: any) => {
                const metadata = nft.rawMetadata || {};
                const tokenId = nft.tokenId;

                // Basic image resolution
                let imageUrl = metadata.image || nft.image?.originalUrl || '/placeholder.svg';
                if (imageUrl.startsWith('ipfs://')) {
                    imageUrl = imageUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
                }

                return {
                    id: tokenId,
                    name: metadata.name || nft.name || `Asset #${tokenId}`,
                    creator: metadata.creator || address || "Unknown",
                    owner: address,
                    verified: false, // Default to false as we don't have this info easily
                    image: imageUrl,
                    collection: metadata.collection || "Unknown Collection",
                    licenseType: metadata.licenseType || "Personal Use",
                    description: metadata.description || "No description available",
                    registrationDate: metadata.date || new Date().toISOString(),
                    value: "0", // Price info not directly available in this endpoint usually
                    type: metadata.type || "Art", // Default to Art
                    templateType: metadata.templateType || metadata.template_type,
                    templateId: metadata.templateId,
                    metadata: metadata,
                    protectionLevel: 0,
                } as Asset;
            });

            // Filter for Remix vs Regular Assets
            // Based on mock-data logic: asset.templateType === "Remix Art" || asset.metadata?.originalAsset
            const newRemixes = fetchedAssets.filter(a =>
                a.templateType === "Remix Art" ||
                a.metadata?.originalAsset ||
                (a.metadata?.attributes && Array.isArray(a.metadata.attributes) && a.metadata.attributes.some((attr: any) => attr.trait_type === "Type" && attr.value === "Remix"))
            );

            const newStandardAssets = fetchedAssets.filter(a => !newRemixes.includes(a));

            if (isLoadMore) {
                setAssets(prev => [...prev, ...newStandardAssets]);
                setRemixAssets(prev => [...prev, ...newRemixes]);
            } else {
                setAssets(newStandardAssets);
                setRemixAssets(newRemixes);
            }

            // Pagination handling
            if (data.pageKey) {
                setPageKey(data.pageKey);
                setHasMore(true);
            } else {
                setPageKey(undefined);
                setHasMore(false);
            }

        } catch (err) {
            console.error("Error fetching creator assets:", err);
            setError(err instanceof Error ? err.message : 'Failed to fetch assets');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [address, pageSize, pageKey]);

    useEffect(() => {
        // Reset state when address changes
        setAssets([]);
        setRemixAssets([]);
        setPageKey(undefined);
        setHasMore(true);
        fetchNFTs(false);
    }, [address]); // Only trigger on address change. pageSize shouldn't trigger, fetchNFTs depends on it but it's fine. 
    // Actually if fetchNFTs is in dependency, we need to be careful.
    // We want to fetch initially.

    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        await fetchNFTs(true);
    }, [loadingMore, hasMore, fetchNFTs]);

    const reload = useCallback(() => {
        setAssets([]);
        setRemixAssets([]);
        setPageKey(undefined);
        setHasMore(true);
        fetchNFTs(false);
    }, [fetchNFTs]);

    return {
        assets,
        remixAssets,
        loading,
        loadingMore,
        error,
        hasMore,
        loadMore,
        reload
    };
}
