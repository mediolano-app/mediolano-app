
const { RpcProvider, num, hash } = require("starknet");

const ALCHEMY_URL = "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/tOTwt1ug3YNOsaPjinDvS";
const CONTRACT_ADDRESS = "0x060bb4536c3db677637eda4e2f14c1d22d01d3dfd9e592c62ba7a36e749726cc";
const REGISTRY_ADDRESS = "0x03990b145bec2bb3d3143e7cb3b8a89a72272cf562d2b0278f38e3357cbc976f";

async function main() {
    console.log("Connecting to RPC:", ALCHEMY_URL);
    const provider = new RpcProvider({ nodeUrl: ALCHEMY_URL });
    const targetAddressBigInt = BigInt(CONTRACT_ADDRESS);

    console.log(`Searching for Target Contract in Registry: ${REGISTRY_ADDRESS}`);

    for (let i = 1; i <= 50; i++) {
        try {
            const res = await provider.callContract({
                contractAddress: REGISTRY_ADDRESS,
                entrypoint: hash.getSelectorFromName("get_collection"),
                calldata: [i.toString(), "0"]
            });

            // Check if target address matches ANY felt in the response
            const found = res.some(val => BigInt(val) === targetAddressBigInt);

            if (found) {
                console.log(`[FOUND!] Target Address found in get_collection(${i}) result!`);
                console.log(`Collection ID is likely: ${i}`);
                return;
            } else {
                // console.log(`ID ${i}: No match in ${res.length} felts`);
            }
        } catch (err) {
            // ignore
        }
        if (i % 10 === 0) process.stdout.write(".");
    }
    console.log("\nFinished searching IDs 1-50.");
}

main();
