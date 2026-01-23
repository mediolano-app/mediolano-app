const { RpcProvider } = require("starknet");

async function main() {
    const rpcUrl = "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/tOTwt1ug3YNOsaPjinDvS";
    const provider = new RpcProvider({ nodeUrl: rpcUrl });

    const contractAddress = "0x03990b145bec2bb3d3143e7cb3b8a89a72272cf562d2b0278f38e3357cbc976f";
    const tokenMintedSelector = "0x3e517dedbc7bae62d4ace7e3dfd33255c4a7fe7c1c6f53c725d52b45f9c5a00";

    console.log("Testing with block range...\n");

    try {
        // Test 1: From block 5600000 (recent according to user's screenshot showing 5652710)
        console.log("Test 1: from_block 5600000");
        const response1 = await provider.getEvents({
            address: contractAddress,
            keys: [[tokenMintedSelector]],
            from_block: { block_number: 5600000 },
            chunk_size: 10
        });
        console.log("Events found:", response1.events.length);
        if (response1.events.length > 0) {
            console.log("First TX:", response1.events[0].transaction_hash);
        }
        console.log();

        // Test 2: Get latest block and work backwards
        console.log("Test 2: Fetching latest block number...");
        const latestBlock = await provider.getBlockLatestAccepted();
        console.log("Latest block:", latestBlock.block_number);

        const fromBlock = latestBlock.block_number - 10000; // Last ~10k blocks
        console.log(`Searching from block ${fromBlock} to latest`);

        const response2 = await provider.getEvents({
            address: contractAddress,
            keys: [[tokenMintedSelector]],
            from_block: { block_number: fromBlock },
            to_block: "latest",
            chunk_size: 20
        });
        console.log("Events found:", response2.events.length);
        if (response2.events.length > 0) {
            console.log("Sample events:");
            response2.events.slice(0, 3).forEach((e, i) => {
                console.log(`  ${i + 1}. TX: ${e.transaction_hash}`);
            });
        }

    } catch (error) {
        console.error("ERROR:", error.message);
    }
}

main();
