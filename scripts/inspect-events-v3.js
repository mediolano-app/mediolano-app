
const { RpcProvider, hash, shortString } = require("starknet");

const ALCHEMY_URL = "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/tOTwt1ug3YNOsaPjinDvS";
const CONTRACT_ADDRESS = "0x05e73b7be06d82beeb390a0e0d655f2c9e7cf519658e04f05d9c690ccc41da03";

// Selectors
const TOKEN_MINTED_SELECTOR = "0x3e517dedbc7bae62d4ace7e3dfd33255c4a7fe7c1c6f53c725d52b45f9c5a00";
const COLLECTION_CREATED_SELECTOR = "0xfca650bfd622aeae91aa1471499a054e4c7d3f0d75fbcb98bdb3bbb0358b0c";
const TOKEN_TRANSFERRED_SELECTOR = "0x3ddaa3f2d17cc7984d82075aa171282e6fff4db61944bf218f60678f95e2567";
const TRANSFER_SELECTOR = hash.getSelectorFromName("Transfer"); // Standard Transfer

async function main() {
    console.log("Connecting to RPC:", ALCHEMY_URL);
    const provider = new RpcProvider({ nodeUrl: ALCHEMY_URL });

    console.log("Checking events for contract:", CONTRACT_ADDRESS);
    console.log("Selectors:");
    console.log("TokenMinted:", TOKEN_MINTED_SELECTOR);
    console.log("CollectionCreated:", COLLECTION_CREATED_SELECTOR);
    console.log("TokenTransferred (Custom):", TOKEN_TRANSFERRED_SELECTOR);
    console.log("Transfer (Standard):", TRANSFER_SELECTOR);

    try {
        const block = await provider.getBlock("latest");
        console.log("Latest block:", block.block_number);

        // Fetch last 1000 events
        const response = await provider.getEvents({
            address: CONTRACT_ADDRESS,
            // keys: [[TOKEN_MINTED_SELECTOR, COLLECTION_CREATED_SELECTOR, TOKEN_TRANSFERRED_SELECTOR, TRANSFER_SELECTOR]],
            chunk_size: 100,
            from_block: { block_number: block.block_number - 50000 },
            to_block: { block_number: block.block_number }
        });

        console.log(`Found ${response.events.length} events.`);

        response.events.forEach((e, i) => {
            console.log(`\nEvent ${i} (Key: ${e.keys[0]}):`);
            if (e.keys[0] === COLLECTION_CREATED_SELECTOR) console.log("TYPE: CollectionCreated");
            if (e.keys[0] === TRANSFER_SELECTOR) console.log("TYPE: Transfer (Standard)");
            if (e.keys[0] === TOKEN_TRANSFERRED_SELECTOR) console.log("TYPE: TokenTransferred (Custom)");
            if (e.keys[0] === TOKEN_MINTED_SELECTOR) console.log("TYPE: TokenMinted");

            console.log(`  Keys: [${e.keys.join(", ")}]`);
            console.log(`  Data: [${e.data.join(", ")}]`);
        });


        const grouped = {};

        response.events.forEach(e => {
            const key = e.keys[0];
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(e);
        });

        // Analyze Collection Created
        if (grouped[COLLECTION_CREATED_SELECTOR]) {
            console.log("\n--- Collection Created Events ---");
            grouped[COLLECTION_CREATED_SELECTOR].slice(0, 3).forEach((e, i) => {
                console.log(`Event ${i}:`);
                console.log(`  Tx: ${e.transaction_hash}`);
                console.log(`  Data Length: ${e.data.length}`);
                console.log(`  Data: [${e.data.join(", ")}]`);
                // Attempt decode
                try {
                    const dataIter = e.data[Symbol.iterator]();
                    const cIdLow = dataIter.next().value;
                    const cIdHigh = dataIter.next().value;
                    const owner = dataIter.next().value;
                    // name is probably ByteArray
                    // Simple check if name starts here
                    console.log("  Possible Owner:", owner);
                    console.log("  Checking ByteArray decode...");

                    // Helper for ByteArray
                    function parseByteArray(iter) {
                        const len = parseInt(iter.next().value, 16);
                        let s = "";
                        for (let k = 0; k < len; k++) {
                            try { s += shortString.decodeShortString(iter.next().value); } catch (e) { }
                        }
                        const pending = iter.next().value;
                        const pendingLen = iter.next().value;
                        if (pending && pending !== '0x0') try { s += shortString.decodeShortString(pending); } catch (e) { }
                        return s;
                    }

                    const name = parseByteArray(dataIter);
                    console.log("  Decoded Name:", name);

                } catch (err) { console.log("  Decode error:", err.message); }
            });
        } else {
            console.log("\n--- No Collection Created Events found in range ---");
        }

        // Analyze Token Transferred (Custom)
        if (grouped[TOKEN_TRANSFERRED_SELECTOR]) {
            console.log("\n--- TokenTransferred (Custom) Events ---");
            grouped[TOKEN_TRANSFERRED_SELECTOR].slice(0, 3).forEach((e, i) => {
                console.log(`Event ${i}:`);
                console.log(`  Tx: ${e.transaction_hash}`);
                console.log(`  Data: [${e.data.join(", ")}]`);
            });
        } else {
            console.log("\n--- No TokenTransferred (Custom) Events found ---");
        }

        // Analyze Standard Transfer
        if (grouped[TRANSFER_SELECTOR]) {
            console.log("\n--- Transfer (Standard) Events ---");
            grouped[TRANSFER_SELECTOR].slice(0, 3).forEach((e, i) => {
                console.log(`Event ${i}:`);
                console.log(`  Tx: ${e.transaction_hash}`);
                console.log(`  Keys: [${e.keys.join(", ")}]`);
                console.log(`  Data: [${e.data.join(", ")}]`);
                // Standard Transfer: keys=[Selector, From, To], data=[tokenId_low, tokenId_high]
                // OR keys=[Selector], data=[From, To, tokenId_low, tokenId_high]
                // Let's see structure.
            });
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
