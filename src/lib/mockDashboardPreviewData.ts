export interface PortfolioSummary {
  totalValue: number
  changePercentage: number
  changeDirection: "up" | "down"
  nftCount: number
}

export interface RecentTransaction {
  id: string
  type: "buy" | "sell"
  nftName: string
  collection: string
  collectionId: string
  nftType: string
}

export interface TopCollection {
  id: string
  name: string
  nftType: string
}

export interface NFTItem {
  id: string
  name: string
  collection: string
  collectionId: string
  image: string
  ipType: "Art" | "Music" | "Video" | "Domain" | "Trading Card"
}

export const portfolioSummary: PortfolioSummary = {
  totalValue: 14.5,
  changePercentage: 2.5,
  changeDirection: "up",
  nftCount: 7,
}

export const recentTransactions: RecentTransaction[] = [
  {
    id: "1",
    type: "buy",
    nftName: "Bored Ape #1234",
    collection: "Bored Ape Yacht Club",
    collectionId: "bayc",
    nftType: "Art",
  },
  {
    id: "2",
    type: "sell",
    nftName: "CryptoPunk #5678",
    collection: "CryptoPunks",
    collectionId: "cryptopunks",
    nftType: "Art",
  },
  { id: "3", type: "buy", nftName: "Doodle #9101", collection: "Doodles", collectionId: "doodles", nftType: "Art" },
  { id: "4", type: "buy", nftName: "Azuki #4321", collection: "Azuki", collectionId: "azuki", nftType: "Art" },
  { id: "5", type: "sell", nftName: "CloneX #8765", collection: "CloneX", collectionId: "clonex", nftType: "Art" },
]

export const topCollections: TopCollection[] = [
  { id: "1", name: "Bored Ape Yacht Club", nftType: "Art" },
  { id: "2", name: "CryptoPunks", nftType: "Art" },
  { id: "3", name: "Doodles", nftType: "Art" },
  { id: "4", name: "Azuki", nftType: "Art" },
  { id: "5", name: "CloneX", nftType: "Art" },
]

export const ownedNFTs: NFTItem[] = [
  {
    id: "1",
    name: "Bored Ape #1234",
    collection: "Bored Ape Yacht Club",
    collectionId: "bayc",
    image: "/background.jpg",
    ipType: "Art",
  },
  {
    id: "2",
    name: "Doodle #9101",
    collection: "Doodles",
    collectionId: "doodles",
    image: "/background.jpg",
    ipType: "Art",
  },
  {
    id: "3",
    name: "Azuki #4321",
    collection: "Azuki",
    collectionId: "azuki",
    image: "/background.jpg",
    ipType: "Art",
  },
  {
    id: "4",
    name: "Cool Cat #6789",
    collection: "Cool Cats",
    collectionId: "coolcats",
    image: "/background.jpg",
    ipType: "Art",
  },
  {
    id: "5",
    name: "Decentraland Parcel",
    collection: "Decentraland",
    collectionId: "decentraland",
    image: "/background.jpg",
    ipType: "Domain",
  },
  {
    id: "6",
    name: "CryptoKitties #12345",
    collection: "CryptoKitties",
    collectionId: "cryptokitties",
    image: "/background.jpg",
    ipType: "Trading Card",
  },
  {
    id: "7",
    name: "NBA Top Shot Moment",
    collection: "NBA Top Shot",
    collectionId: "nbatopshot",
    image: "/background.jpg",
    ipType: "Video",
  },
]

