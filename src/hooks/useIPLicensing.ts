import { useContract } from '@starknet-react/core';
import { useCallback } from 'react';
import IPLicensingABI from '../abis/ip_licensing';

export const useIPLicensing = (contractAddress: string) => {
    // Initialize contract
    const { contract } = useContract({
        address: contractAddress as `0x${string}`,
        abi: IPLicensingABI,
    });

    // Queries
    const getLastMintedId = useCallback(async () => {
        if (!contract) return null;
        return contract.get_last_minted_id();
    }, [contract]);

    const getTokenMintTimestamp = useCallback(async (tokenId: bigint) => {
        if (!contract) return null;
        return contract.get_token_mint_timestamp(tokenId);
    }, [contract]);

    const getTokenUri = useCallback(async (tokenId: bigint) => {
        if (!contract) return null;
        return contract.get_token_uri(tokenId);
    }, [contract]);

    const getLicenseData = useCallback(async (tokenId: bigint) => {
        if (!contract) return null;
        return contract.get_license_data(tokenId);
    }, [contract]);

    const getOwnerOfToken = useCallback(async (tokenId: bigint) => {
        if (!contract) return null;
        return contract.get_owner_of_token(tokenId);
    }, [contract]);

    // Mutations
    const mintLicensingNft = useCallback(async (
        recipient: string,
        tokenId: bigint,
        tokenUri: string,
        licenseData: string
    ) => {
        if (!contract) throw new Error('Contract not initialized');
        return contract.mint_Licensing_nft(recipient, tokenId, tokenUri, licenseData);
    }, [contract]);

    const mintNft = useCallback(async (
        recipient: string,
        tokenUri: string
    ) => {
        if (!contract) throw new Error('Contract not initialized');
        return contract.mint_nft(recipient, tokenUri);
    }, [contract]);

    return {
        // Query functions
        getLastMintedId,
        getTokenMintTimestamp,
        getTokenUri,
        getLicenseData,
        getOwnerOfToken,

        // Mutation functions
        mintLicensingNft,
        mintNft,

        // Contract instance
        contract,
    };
}; 