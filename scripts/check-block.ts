
import { RpcProvider } from "starknet";

const ALCHEMY_API_KEY = "tOTwt1ug3YNOsaPjinDvS";
const RPC_URL = `https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/${ALCHEMY_API_KEY}`;

async function main() {
    const provider = new RpcProvider({ nodeUrl: RPC_URL });
    const block = await provider.getBlock("latest");
    console.log(`Current Block: ${block.block_number}`);
}
main();
