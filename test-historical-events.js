const { RpcProvider } = require("starknet");

async function main() {
    const rpcUrl = "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/tOTwt1ug3YNOsaPjinDvS";
    const provider = new RpcProvider({ nodeUrl: rpcUrl });

    const contractAddress = "0x03990b145bec2bb3d3143e7cb3b8a89a72272cf562d2b0278f38e3357cbc976f";

    // Selectors
    const selectors = [
        "0x3e517dedbc7bae62d4ace7e3dfd33255c4a7fe7c1c6f53c725d52b45f9c5a00", // TokenMinted
        "0x2f241bb3f752d1fb3ac68c703d92bb418a7a7c165f066fdb2d90094b5d95f0e", // CollectionCreated
        "0x3ddaa3f2d17cc7984d82075aa171282e6fff4db61944bf218f60678f95e2567"  // TokenTransferred
    ];

    console.log("Testing fetch from block 1861690...\n");

    try {
        const response = await provider.getEvents({
            address: contractAddress,
            keys: [selectors], // OR filter: any of these selectors
            from_block: { block_number: 1861690 },
            chunk_size: 100 // Fetch a larger chunk to see count
        });

        console.log(`Events found: ${response.events.length}`);
        console.log(`Has more: ${!!response.continuation_token}`);
        if (response.continuation_token) {
            console.log(`Continuation token: ${response.continuation_token}`);
        }

        // Count by type
        const counts = {};
        response.events.forEach(e => {
            const key = e.keys[0];
            counts[key] = (counts[key] || 0) + 1;
        });

        console.log("\nCounts by selector:");
        Object.entries(counts).forEach(([key, count]) => {
            console.log(`${key}: ${count}`);
        });

    } catch (error) {
        console.error("ERROR:", error.message);
    }
}

main();
