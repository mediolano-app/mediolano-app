const { RpcProvider, shortString } = require("starknet");

// Helper to parse Cairo ByteArray (same as in use-recent-assets.ts but adapted for Node)
function parseByteArray(dataIter) {
    const lenResult = dataIter.next();
    if (lenResult.done) return "";
    const dataLen = parseInt(lenResult.value, 16);

    let result = "";

    // Read data chunks (bytes31)
    for (let i = 0; i < dataLen; i++) {
        const chunk = dataIter.next().value;
        if (chunk) {
            try {
                result += shortString.decodeShortString(chunk);
            } catch {
                // Silently skip
            }
        }
    }

    // Read pending word
    const pendingWord = dataIter.next().value;
    const pendingLen = dataIter.next().value;

    if (pendingWord && pendingWord !== "0x0" && pendingWord !== "0x00") {
        try {
            result += shortString.decodeShortString(pendingWord);
        } catch {
            // Silently skip
        }
    }

    return result;
}

async function fetchMetadata(uri) {
    if (!uri) return null;

    let url = uri;
    // Basic IPFS handling
    if (uri.startsWith("ipfs://")) {
        const cid = uri.replace("ipfs://", "");
        url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    } else if (!uri.startsWith("http")) {
        // Assume CID if no protocol
        url = `https://gateway.pinata.cloud/ipfs/${uri}`;
    }

    try {
        const res = await fetch(url);
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.error(`Failed to fetch ${url}:`, e.message);
    }
    return null;
}

async function main() {
    const rpcUrl = "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/tOTwt1ug3YNOsaPjinDvS";
    const provider = new RpcProvider({ nodeUrl: rpcUrl });

    const contractAddress = "0x05e73b7be06d82beeb390a0e0d655f2c9e7cf519658e04f05d9c690ccc41da03";
    const tokenMintedSelector = "0x3e517dedbc7bae62d4ace7e3dfd33255c4a7fe7c1c6f53c725d52b45f9c5a00";

    try {
        // Get latest block and search backwards for a few events
        const latestBlock = await provider.getBlockLatestAccepted();
        const startBlock = 5600000;

        console.log(`Searching for events from block ${startBlock} to latest...`);

        const response = await provider.getEvents({
            address: contractAddress,
            keys: [[tokenMintedSelector]],
            from_block: { block_number: startBlock },
            to_block: "latest",
            chunk_size: 20
        });

        console.log(`Found ${response.events.length} events. Inspecting last 5...`);

        const eventsToInspect = response.events.slice(-5);

        for (const event of eventsToInspect) {
            const dataIter = event.data[Symbol.iterator]();

            // Skip collection ID (2 words)
            dataIter.next(); dataIter.next();

            // Skip token ID (2 words)
            dataIter.next(); dataIter.next();

            // Skip owner (1 word)
            dataIter.next();

            // Extract metadata URI
            const metadataUri = parseByteArray(dataIter);
            console.log(`\nTX: ${event.transaction_hash}\nURI: ${metadataUri}`);

            if (metadataUri) {
                const metadata = await fetchMetadata(metadataUri);
                if (metadata) {
                    console.log("Metadata Keys:", Object.keys(metadata));
                    console.log("Full Metadata:", JSON.stringify(metadata, null, 2));

                    if (metadata.type) console.log("FOUND 'type':", metadata.type);
                    if (metadata.ipType) console.log("FOUND 'ipType':", metadata.ipType);
                    if (metadata.assetType) console.log("FOUND 'assetType':", metadata.assetType);
                } else {
                    console.log("Failed to fetch metadata.");
                }
            } else {
                console.log("No Metadata URI found.");
            }
        }

    } catch (error) {
        console.error("ERROR:", error);
    }
}

main();
