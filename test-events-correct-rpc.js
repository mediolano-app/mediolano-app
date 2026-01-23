const { RpcProvider, hash } = require("starknet");

async function main() {
    // Use the EXACT RPC URL from .env.local
    const rpcUrl = "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/tOTwt1ug3YNOsaPjinDvS";
    const provider = new RpcProvider({ nodeUrl: rpcUrl });

    const contractAddress = "0x03990b145bec2bb3d3143e7cb3b8a89a72272cf562d2b0278f38e3357cbc976f";
    const tokenMintedSelector = "0x3e517dedbc7bae62d4ace7e3dfd33255c4a7fe7c1c6f53c725d52b45f9c5a00";

    console.log("Testing with correct RPC URL:", rpcUrl);
    console.log("Contract:", contractAddress);
    console.log("Selector:", tokenMintedSelector);
    console.log();

    try {
        const response = await provider.getEvents({
            address: contractAddress,
            keys: [[tokenMintedSelector]],
            chunk_size: 10
        });

        console.log("SUCCESS! Events found:", response.events.length);

        if (response.events.length > 0) {
            console.log("\nFirst event:");
            console.log("TX Hash:", response.events[0].transaction_hash);
            console.log("Data fields:", response.events[0].data.length);
            console.log("Data:", response.events[0].data);
        }

        console.log("\nContinuation token:", response.continuation_token);

    } catch (error) {
        console.error("ERROR:", error.message);
        console.error("Full error:", error);
    }
}

main();
