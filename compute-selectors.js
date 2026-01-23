
const { hash } = require("starknet");

const events = [
    "ip_collection_erc_721::IPCollection::IPCollection::TokenMinted",
    "ip_collection_erc_721::IPCollection::IPCollection::TokenTransferred",
    "ip_collection_erc_721::IPCollection::IPCollection::CollectionCreated",
    "TokenMinted", // Check short name too
    "Transfer"
];

events.forEach(name => {
    console.log(`${name}: ${hash.getSelectorFromName(name)}`);
});
