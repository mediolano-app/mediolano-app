
const { hash } = require("starknet");

const events = [
    "TokenMinted",
    "CollectionCreated",
    "Transfer",
    "TokenTransferred"
];

console.log("Computing Selectors:");
events.forEach(name => {
    const selector = hash.getSelectorFromName(name);
    console.log(`${name}: ${selector}`);
});

// Current hardcoded values in code:
console.log("\nCurrent Hardcoded:");
console.log("TokenMinted: 0x3e517dedbc7bae62d4ace7e3dfd33255c4a7fe7c1c6f53c725d52b45f9c5a00");
console.log("CollectionCreated: 0x2f241bb3f752d1fb3ac68c703d92bb418a7a7c165f066fdb2d90094b5d95f0e");
console.log("TokenTransferred: 0x3ddaa3f2d17cc7984d82075aa171282e6fff4db61944bf218f60678f95e2567");
console.log("Transfer: 0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9");
