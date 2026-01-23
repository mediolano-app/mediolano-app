
const { RpcProvider, hash, num } = require("starknet");

async function main() {
    const provider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.g.alchemy.com/v2/tOTwt1ug3YNOsaPjinDvS" });
    const targetBlock = 5652710;

    console.log("Inspecting block:", targetBlock);

    try {
        const block = await provider.getBlockWithTxHashes(targetBlock);
        console.log("Block found. Transactions:", block.transactions.length);

        if (block.transactions.length > 0) {
            const txHash = block.transactions[0];
            console.log("Checking Tx:", txHash);

            const receipt = await provider.getTransactionReceipt(txHash);
            console.log("Receipt status:", receipt.execution_status);
            console.log("Events:", receipt.events.length);

            receipt.events.forEach((e, i) => {
                console.log(`Event ${i}: from=${e.from_address}`);
                console.log(`keys=[${e.keys.join(", ")}]`);
                // Check if address matches what we expect
                if (e.from_address === "0x03990b145bec2bb3d3143e7cb3b8a89a72272cf562d2b0278f38e3357cbc976f" ||
                    e.from_address === "0x3990b145bec2bb3d3143e7cb3b8a89a72272cf562d2b0278f38e3357cbc976f") {
                    console.log(">>> MATCHED CONTRACT ADDRESS <<<");
                }
            });
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
