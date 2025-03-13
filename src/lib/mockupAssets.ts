import type { Asset, Collection } from "./types"

// Mock collections
const collections: Collection[] = [
  {
    id: "bored-ape",
    name: "Bored Ape Yacht Club",
    description: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs.",
    floorPrice: 30.5,
  },
  {
    id: "cryptopunks",
    name: "CryptoPunks",
    description:
      "CryptoPunks launched as a fixed set of 10,000 items in mid-2017 and became one of the inspirations for the ERC-721 standard.",
    floorPrice: 50.2,
  },
  {
    id: "doodles",
    name: "Doodles",
    description: "A community-driven collectibles project featuring art by Burnt Toast.",
    floorPrice: 5.8,
  },
  {
    id: "azuki",
    name: "Azuki",
    description: "Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden.",
    floorPrice: 10.2,
  },
  {
    id: "moonbirds",
    name: "Moonbirds",
    description:
      "A collection of 10,000 utility-enabled PFPs that feature a richly diverse and unique pool of rarity-powered traits.",
    floorPrice: 8.5,
  },
]

// Mock Asset data (previously NFT data)
const assets: Asset[] = [
  {
    id: "1",
    name: "Bored Ape #7329",
    description: "A bored ape with rare traits from the Bored Ape Yacht Club collection.",
    image: "/background.jpg",
    tokenId: "#7329",
    collection: collections[0],
    price: 35.8,
    rarity: "Legendary",
    attributes: [
      { trait_type: "Background", value: "Blue" },
      { trait_type: "Eyes", value: "Laser" },
      { trait_type: "Mouth", value: "Bored" },
    ],
    createdAt: "2021-04-23T18:25:43.511Z",
    licensing: [
      {
        id: "lic-1",
        type: "Commercial",
        licensee: "AcmeCorp",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        terms: "Use in marketing materials and social media",
      },
      {
        id: "lic-2",
        type: "Personal",
        licensee: "John Doe",
        startDate: "2023-03-15",
        endDate: "2024-03-14",
        terms: "Personal use only, no commercial exploitation",
      },
    ],
  },
  {
    id: "2",
    name: "CryptoPunk #3100",
    description: "One of the 9 Alien CryptoPunks, and one of the most iconic and valuable NFTs in existence.",
    image: "/background.jpg",
    tokenId: "#3100",
    collection: collections[1],
    price: 120.5,
    rarity: "Mythic",
    attributes: [
      { trait_type: "Type", value: "Alien" },
      { trait_type: "Accessory", value: "Headband" },
    ],
    createdAt: "2017-06-23T18:25:43.511Z",
    lastSale: {
      price: 4200,
      date: "2021-03-11T18:25:43.511Z",
    },
  },
  {
    id: "3",
    name: "Doodle #8147",
    description: "A colorful character from the Doodles collection.",
    image: "/background.jpg",
    tokenId: "#8147",
    collection: collections[2],
    price: 6.2,
    rarity: "Rare",
    attributes: [
      { trait_type: "Face", value: "Happy" },
      { trait_type: "Background", value: "Pink" },
      { trait_type: "Body", value: "Blue" },
    ],
    createdAt: "2021-10-17T18:25:43.511Z",
  },
  {
    id: "4",
    name: "Azuki #9242",
    description: "An anime-inspired character from the Azuki collection.",
    image: "/background.jpg",
    tokenId: "#9242",
    collection: collections[3],
    price: 12.8,
    rarity: "Epic",
    attributes: [
      { trait_type: "Hair", value: "Red" },
      { trait_type: "Clothing", value: "Kimono" },
      { trait_type: "Background", value: "Cherry Blossom" },
    ],
    createdAt: "2022-01-12T18:25:43.511Z",
  },
  {
    id: "5",
    name: "Moonbird #4589",
    description: "A pixel owl from the Moonbirds collection.",
    image: "/background.jpg",
    tokenId: "#4589",
    collection: collections[4],
    price: 9.5,
    rarity: "Uncommon",
    attributes: [
      { trait_type: "Feathers", value: "Golden" },
      { trait_type: "Eyes", value: "Cosmic" },
      { trait_type: "Background", value: "Night Sky" },
    ],
    createdAt: "2022-04-16T18:25:43.511Z",
  },
  {
    id: "6",
    name: "Bored Ape #8912",
    description: "A bored ape with a unique combination of traits.",
    image: "/background.jpg",
    tokenId: "#8912",
    collection: collections[0],
    price: 32.1,
    rarity: "Epic",
    attributes: [
      { trait_type: "Background", value: "Yellow" },
      { trait_type: "Fur", value: "Robot" },
      { trait_type: "Clothes", value: "Sailor Shirt" },
    ],
    createdAt: "2021-05-12T18:25:43.511Z",
  },
  {
    id: "7",
    name: "CryptoPunk #7804",
    description: "One of the 9 Alien CryptoPunks with a pipe, cap, and small shades.",
    image: "/background.jpg",
    tokenId: "#7804",
    collection: collections[1],
    price: 95.3,
    rarity: "Mythic",
    attributes: [
      { trait_type: "Type", value: "Alien" },
      { trait_type: "Accessory 1", value: "Pipe" },
      { trait_type: "Accessory 2", value: "Cap Forward" },
      { trait_type: "Accessory 3", value: "Small Shades" },
    ],
    createdAt: "2017-06-23T18:25:43.511Z",
    lastSale: {
      price: 4200,
      date: "2021-03-11T18:25:43.511Z",
    },
  },
  {
    id: "8",
    name: "Doodle #6329",
    description: "A unique character from the Doodles collection with rare traits.",
    image: "/background.jpg",
    tokenId: "#6329",
    collection: collections[2],
    price: 7.8,
    rarity: "Epic",
    attributes: [
      { trait_type: "Face", value: "Rainbow" },
      { trait_type: "Background", value: "Space" },
      { trait_type: "Head", value: "Crown" },
    ],
    createdAt: "2021-10-17T18:25:43.511Z",
  },
  {
    id: "9",
    name: "Azuki #2552",
    description: "A samurai-themed character from the Azuki collection.",
    image: "/background.jpg",
    tokenId: "#2552",
    collection: collections[3],
    price: 15.2,
    rarity: "Legendary",
    attributes: [
      { trait_type: "Hair", value: "Black" },
      { trait_type: "Clothing", value: "Samurai Armor" },
      { trait_type: "Weapon", value: "Katana" },
      { trait_type: "Background", value: "Dojo" },
    ],
    createdAt: "2022-01-12T18:25:43.511Z",
  },
  {
    id: "10",
    name: "Moonbird #7213",
    description: "A rare Moonbird with unique traits.",
    image: "/background.jpg",
    tokenId: "#7213",
    collection: collections[4],
    price: 11.2,
    rarity: "Rare",
    attributes: [
      { trait_type: "Feathers", value: "Diamond" },
      { trait_type: "Eyes", value: "Ruby" },
      { trait_type: "Background", value: "Nebula" },
    ],
    createdAt: "2022-04-16T18:25:43.511Z",
  },
  {
    id: "11",
    name: "Bored Ape #5128",
    description: "A zombie ape from the Bored Ape Yacht Club collection.",
    image: "/background.jpg",
    tokenId: "#5128",
    collection: collections[0],
    price: 38.5,
    rarity: "Legendary",
    attributes: [
      { trait_type: "Background", value: "Army Green" },
      { trait_type: "Fur", value: "Zombie" },
      { trait_type: "Eyes", value: "X Eyes" },
      { trait_type: "Mouth", value: "Bored Unshaven" },
    ],
    createdAt: "2021-04-30T18:25:43.511Z",
  },
  {
    id: "12",
    name: "CryptoPunk #5217",
    description: "A human CryptoPunk with a gold chain and earring.",
    image: "/background.jpg",
    tokenId: "#5217",
    collection: collections[1],
    price: 42.6,
    rarity: "Epic",
    attributes: [
      { trait_type: "Type", value: "Human" },
      { trait_type: "Accessory 1", value: "Gold Chain" },
      { trait_type: "Accessory 2", value: "Earring" },
    ],
    createdAt: "2017-06-23T18:25:43.511Z",
  },
]

assets[1].licensing = [
  {
    id: "lic-3",
    type: "Exclusive",
    licensee: "LuxuryBrands Inc.",
    startDate: "2023-06-01",
    endDate: "2025-05-31",
    terms: "Exclusive rights for use in luxury goods marketing",
  },
]

assets[2].licensing = [
  {
    id: "lic-4",
    type: "Commercial",
    licensee: "TechStartup LLC",
    startDate: "2023-04-01",
    endDate: "2024-03-31",
    terms: "Use in company branding and promotional materials",
  },
  {
    id: "lic-5",
    type: "Personal",
    licensee: "Jane Smith",
    startDate: "2023-05-15",
    endDate: "2023-11-14",
    terms: "Personal use in social media profiles",
  },
]

export function getAssets(): Asset[] {
  return assets
}

export function getCollections(): Collection[] {
  return collections
}

export function getAssetById(id: string): Asset | undefined {
  return assets.find((asset) => asset.id === id)
}

export function getCollectionAssets(collectionId: string): Asset[] {
  return assets.filter((asset) => asset.collection.id === collectionId)
}

