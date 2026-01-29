
import { RpcProvider } from "starknet";

const ALCHEMY_API_KEY = "tOTwt1ug3YNOsaPjinDvS";
const COLLECTION_ADDRESS = "0x05e73b7be06d82beeb390a0e0d655f2c9e7cf519658e04f05d9c690ccc41da03";
const TOKEN_MINTED_SELECTOR = "0x3e517dedbc7bae62d4ace7e3dfd33255c4a7fe7c1c6f53c725d52b45f9c5a00";
const RPC_URL = `https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/${ALCHEMY_API_KEY}`;
const BLOCK_WINDOW_SIZE = 50000;

// User provided: 0x60bb4536c3db677637eda4e2f14c1d22d01d3dfd9e592c62ba7a36e749726cc-1

async function main() {
    const provider = new RpcProvider({ nodeUrl: RPC_URL });
    const block = await provider.getBlock("latest");
    let currentToBlock = block.block_number;

    console.log(`Starting scan from latest block: ${currentToBlock}`);

    let totalEvents = 0;

    // Scan 10 windows (500k blocks)
    for (let i = 0; i < 10; i++) {
        const currentFromBlock = Math.max(0, currentToBlock - BLOCK_WINDOW_SIZE);
        console.log(`Scanning window ${i}: ${currentFromBlock} - ${currentToBlock}`);

        // Fetch
        let continuationToken: string | undefined = undefined;
        let windowEvents = 0;

        do {
            const response = await provider.getEvents({
                address: COLLECTION_ADDRESS,
                keys: [[TOKEN_MINTED_SELECTOR]],
                from_block: { block_number: currentFromBlock },
                to_block: { block_number: currentToBlock },
                chunk_size: 100,
                continuation_token: continuationToken,
            });

            for (const event of response.events) {
                const data = event.data;
                const collectionId = (BigInt(data[0]) + (BigInt(data[1]) << 128n)).toString();
                const tokenId = (BigInt(data[2]) + (BigInt(data[3]) << 128n)).toString();

                console.log(`FOUND EVENT: CollectionID=${collectionId}, TokenID=${tokenId} at Block ${event.block_number}`);
            }

            windowEvents += response.events.length;
            totalEvents += response.events.length;
            continuationToken = response.continuation_token;
        } while (continuationToken);

        if (windowEvents > 0) {
            console.log(`✅ Found ${windowEvents} events in window ${i}`);
        }

        currentToBlock = currentFromBlock - 1;
    }

    console.log(`Total events found in scan: ${totalEvents}`);
}

main();
