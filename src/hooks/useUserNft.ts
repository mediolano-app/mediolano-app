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
                // Fetch only NFTs from our IP Licensing contract
                const response = await fetch(
                    `https://api.starkscan.co/api/v0/nfts?owner_address=${address}&contract_address=${process.env.NEXT_PUBLIC_LICENSING_CONTRACT_ADDRESS}`,
                    {
                        headers: {
                            'x-api-key': process.env.NEXT_PUBLIC_STARKSCAN_API_KEY as string
                        }
                    }
                );

                const data = await response.json();

                // Transform the data to match our UI requirements
                const transformedNFTs = await Promise.all(data.nfts.map(async (nft: any) => {
                    // Fetch and parse token URI data
                    let metadata: any = {};
                    try {
                        const metadataResponse = await fetch(nft.token_uri);
                        metadata = await metadataResponse.json();
                    } catch (e) {
                        console.error('Error fetching metadata:', e);
                    }

                    return {
                        id: nft.token_id,
                        name: metadata.name || `IP License #${nft.token_id}`,
                        type: metadata.type || 'License',
                        status: metadata.status || 'Listed',
                        price: metadata.price || 'N/A',
                        image: metadata.image || '/background.jpg',
                        token_uri: nft.token_uri
                    };
                }));

                setNfts(transformedNFTs);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch NFTs');
            } finally {
                setLoading(false);
            }
        };

        fetchNFTs();
    }, [address]);

    return { nfts, loading, error };
};