
const { RpcProvider } = require("starknet");

const ALCHEMY_URL = "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/tOTwt1ug3YNOsaPjinDvS";
const TX_HASH = "0x4a2c0efef407677d8664431dff1398d5ed878d78fec98eb86832090eb9dc6cd";

async function main() {
    console.log("Connecting to RPC:", ALCHEMY_URL);
    const provider = new RpcProvider({ nodeUrl: ALCHEMY_URL });

    console.log("Inspecting Tx:", TX_HASH);

    try {
        const receipt = await provider.getTransactionReceipt(TX_HASH);
        console.log("Status:", receipt.execution_status);
        console.log("Events found:", receipt.events.length);

        receipt.events.forEach((e, i) => {
            console.log(`\nEvent ${i}:`);
            console.log(`  From: ${e.from_address}`);
            console.log(`  Keys: [${e.keys.join(", ")}]`);
            console.log(`  Data: [${e.data.join(", ")}]`);
        });

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
