const { RpcProvider } = require("starknet");

async function main() {
    const rpcUrl = "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/tOTwt1ug3YNOsaPjinDvS";
    const provider = new RpcProvider({ nodeUrl: rpcUrl });

    const contractAddress = "0x03990b145bec2bb3d3143e7cb3b8a89a72272cf562d2b0278f38e3357cbc976f";

    const selectors = {
        TokenMinted: "0x3e517dedbc7bae62d4ace7e3dfd33255c4a7fe7c1c6f53c725d52b45f9c5a00",
        CollectionCreated: "0x2f241bb3f752d1fb3ac68c703d92bb418a7a7c165f066fdb2d90094b5d95f0e",
        TokenTransferred: "0x3ddaa3f2d17cc7984d82075aa171282e6fff4db61944bf218f60678f95e2567"
    };

    console.log("Checking all event types...\n");

    for (const [eventName, selector] of Object.entries(selectors)) {
        try {
            const response = await provider.getEvents({
                address: contractAddress,
                keys: [[selector]],
                from_block: { block_number: 5600000 },
                chunk_size: 50
            });

            console.log(`${eventName}: ${response.events.length} events`);
            if (response.continuation_token) {
                console.log(`  (has more - continuation token: ${response.continuation_token})`);
            }
        } catch (error) {
            console.log(`${eventName}: ERROR - ${error.message}`);
        }
    }

    console.log("\n--- Testing combined query ---");
    try {
        // Try querying all event types together
        const combined = await provider.getEvents({
            address: contractAddress,
            keys: [[
                selectors.TokenMinted,
                selectors.CollectionCreated,
                selectors.TokenTransferred
            ]],
            from_block: { block_number: 5600000 },
            chunk_size: 50
        });

        console.log(`Combined: ${combined.events.length} events total`);
        console.log(`Has more: ${!!combined.continuation_token}`);
    } catch (error) {
        console.log(`Combined query ERROR: ${error.message}`);
    }
}

main();
