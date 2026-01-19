const { hash } = require("starknet");

const target = "0x1d9c1244a591f1654bc5306d01b23fc2a3be48121f9b412790169d8f7fdc014";

const candidates = [
    "balance_of", "balanceOf",
    "owner_of", "ownerOf",
    "token_of_owner_by_index", "tokenOfOwnerByIndex",
    "supports_interface", "supportsInterface",
    "name", "symbol", "token_uri", "tokenURI",
    "get_token", "getToken",
    "get_owner", "getOwner",
    "is_approved_for_all", "isApprovedForAll",
    // Maybe something about permissions or metadata?
    "get_metadata", "getMetadata",
    "get_base_uri", "getBaseUri",
    "get_collection_id", "getCollectionId"
];

candidates.forEach(name => {
    if (hash.getSelectorFromName(name) === target) {
        console.log(`>>> MATCH! ${name} -> ${target}`);
    }
});
