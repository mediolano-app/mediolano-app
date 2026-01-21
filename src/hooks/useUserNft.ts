import { useAccount } from "@starknet-react/core";
import { useState, useEffect } from "react";

export interface NFT {
    id: string | number;
    name: string;
    type: string;
    status: string;
    price: string;
    image: string;
    token_uri: string;
    description?: string;
}

export const useUserNFTs = () => {
    const { address } = useAccount();
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNFTs = async () => {
            if (!address) return;

            try {
                setLoading(true);
                const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
                const contractAddress = process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS;

                if (!apiKey || !contractAddress) {
                    throw new Error("Missing request parameters");
                }

                // Fetch NFTs using Alchemy Starknet NFT API
                const url = `https://starknet-sepolia.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner?owner=${address}&contractAddresses[]=${contractAddress}&withMetadata=true`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: { accept: 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`Alchemy API Error: ${response.statusText}`);
                }

                const data = await response.json();

                // Transform the data to match our UI requirements
                const transformedNFTs: NFT[] = data.ownedNfts.map((nft: any) => {
                    const metadata = nft.rawMetadata || {};

                    // Parse Token ID - Alchemy might return it as hex string or decimal string
                    // We keep it as string for consistency unless we need number
                    const tokenId = nft.tokenId;

                    return {
                        id: tokenId,
                        name: metadata.name || nft.name || `IP License #${tokenId}`,
                        type: metadata.type || 'License',
                        status: metadata.status || 'Listed',
                        price: metadata.price || 'N/A',
                        image: metadata.image || nft.image?.originalUrl || '/background.jpg',
                        token_uri: nft.tokenUri || ''
                    };
                });

                setNfts(transformedNFTs);
            } catch (err) {
                console.error("Error fetching NFTs:", err);
                setError(err instanceof Error ? err.message : 'Failed to fetch NFTs');
            } finally {
                setLoading(false);
            }
        };

        fetchNFTs();
    }, [address]);

    return { nfts, loading, error };
};