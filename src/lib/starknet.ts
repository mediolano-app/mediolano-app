// src/lib/starknet.ts
import { Provider, Contract, constants } from 'starknet';

export const NETWORKS = {
    sepolia: {
        nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_6',
        chainId: constants.StarknetChainId.SN_SEPOLIA,
        contractAddress: process.env.NEXT_PUBLIC_MIP_CONTRACT_SEPOLIA || '0x0',
    },
    mainnet: {
        nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_6',
        chainId: constants.StarknetChainId.SN_MAIN,
        contractAddress: process.env.NEXT_PUBLIC_MIP_CONTRACT_MAINNET || '0x0',
    },
};

export class StarknetService {
    private provider: Provider;
    private network: 'sepolia' | 'mainnet';

    constructor(network: 'sepolia' | 'mainnet' = 'sepolia') {
        this.network = network;
        this.provider = new Provider({
            sequencer: {
                network: NETWORKS[network].nodeUrl,
                chainId: NETWORKS[network].chainId
            }
        });
    }

    getProvider() {
        return this.provider;
    }

    getContractAddress() {
        return NETWORKS[this.network].contractAddress;
    }

    async getContract(abi: any[]) {
        const address = this.getContractAddress();
        if (!address || address === '0x0') {
            throw new Error(`Contract address not configured for ${this.network}`);
        }
        return new Contract(abi, address, this.provider);
    }

    switchNetwork(network: 'sepolia' | 'mainnet') {
        this.network = network;
        this.provider = new Provider({
            sequencer: {
                network: NETWORKS[network].nodeUrl,
                chainId: NETWORKS[network].chainId
            }
        });
    }
}

export const starknetService = new StarknetService();