
const { RpcProvider, hash, num } = require("starknet");

async function main() {
    const provider = new RpcProvider({ nodeUrl: "https://starknet-mainnet.g.alchemy.com/v2/tOTwt1ug3YNOsaPjinDvS" });
    const targetBlock = 5652710;

    console.log("Inspecting block:", targetBlock);

    try {
        const block = await provider.getBlockWithTxHashes(targetBlock);
        console.log("Block found. Transactions:", block.transactions.length);

        for (const txHash of block.transactions) {
            console.log("Checking Tx:", txHash);

            // Check for the hash from user screenshot (starts with 0xe9a3)
            if (txHash.startsWith("0xe9a3")) {
                console.log(">>> FOUND TARGET TX <<<");
                const receipt = await provider.getTransactionReceipt(txHash);
                console.log("Receipt status:", receipt.execution_status);
                console.log("Events found:", receipt.events.length);

                receipt.events.forEach((e, i) => {
                    console.log(`Event ${i}:`);
                    console.log(`  From: ${e.from_address}`);
                    console.log(`  Keys: [${e.keys.join(", ")}]`);
                    console.log(`  Data: [${e.data.join(", ")}]`);
                });
                break; // Found it
            }
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
