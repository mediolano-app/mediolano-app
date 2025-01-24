export interface NFT {
    id: string
    name: string
    image: string
    collection: string
    floorPrice: number
  }
  
  export interface Collection {
    id: string
    name: string
    image: string
    floorPrice: number
    volume24h: number
  }
  
  export interface PortfolioStats {
    totalValue: number
    totalNFTs: number
    topCollection: {
      name: string
      value: number
    }
    recentActivity: {
      type: "buy" | "sell"
      item: string
      price: number
      date: string
    }[]
  }
  
  export const mockNFTs: NFT[] = [
    {
      id: "1",
      name: "Bored Ape #1234",
      image: "/background.jpg",
      collection: "Bored Ape Yacht Club",
      floorPrice: 30.5,
    },
    {
      id: "2",
      name: "CryptoPunk #5678",
      image: "/background.jpg",
      collection: "CryptoPunks",
      floorPrice: 50.2,
    },
    {
      id: "3",
      name: "Azuki #9101",
      image: "/background.jpg",
      collection: "Azuki",
      floorPrice: 15.7,
    },
    {
      id: "4",
      name: "Doodle #1121",
      image: "/background.jpg",
      collection: "Doodles",
      floorPrice: 8.3,
    },
    {
      id: "5",
      name: "CloneX #3141",
      image: "/background.jpg",
      collection: "CloneX",
      floorPrice: 12.9,
    },
    {
      id: "6",
      name: "Moonbird #5161",
      image: "/background.jpg",
      collection: "Moonbirds",
      floorPrice: 7.1,
    },
    {
      id: "7",
      name: "Cool Cat #7890",
      image: "/background.jpg",
      collection: "Cool Cats",
      floorPrice: 5.2,
    },
    {
      id: "8",
      name: "Pudgy Penguin #2468",
      image: "/background.jpg",
      collection: "Pudgy Penguins",
      floorPrice: 3.8,
    },
    {
      id: "9",
      name: "World of Women #1357",
      image: "/background.jpg",
      collection: "World of Women",
      floorPrice: 2.5,
    },
    {
      id: "10",
      name: "VeeFriends #9876",
      image: "/background.jpg",
      collection: "VeeFriends",
      floorPrice: 6.7,
    },
  ]
  
  export const mockCollections: Collection[] = [
    {
      id: "1",
      name: "Bored Ape Yacht Club",
      image: "/background.jpg",
      floorPrice: 30.5,
      volume24h: 1250.75,
    },
    { id: "2", name: "CryptoPunks", image: "/background.jpg", floorPrice: 50.2, volume24h: 980.3 },
    { id: "3", name: "Azuki", image: "/background.jpg", floorPrice: 15.7, volume24h: 567.8 },
    { id: "4", name: "Doodles", image: "/background.jpg", floorPrice: 8.3, volume24h: 321.45 },
    { id: "5", name: "CloneX", image: "/background.jpg", floorPrice: 12.9, volume24h: 456.7 },
    { id: "6", name: "Moonbirds", image: "/background.jpg", floorPrice: 7.1, volume24h: 234.9 },
    { id: "7", name: "World of Women", image: "/background.jpg", floorPrice: 3.2, volume24h: 98.6 },
    { id: "8", name: "Pudgy Penguins", image: "/background.jpg", floorPrice: 2.8, volume24h: 76.3 },
    { id: "9", name: "Cool Cats", image: "/background.jpg", floorPrice: 2.1, volume24h: 54.2 },
    { id: "10", name: "Meebits", image: "/background.jpg", floorPrice: 4.7, volume24h: 123.4 },
    { id: "11", name: "VeeFriends", image: "/background.jpg", floorPrice: 5.9, volume24h: 178.2 },
    { id: "12", name: "Deadfellaz", image: "/background.jpg", floorPrice: 1.8, volume24h: 43.7 },
  ]
  
  export const mockPortfolioStats: PortfolioStats = {
    totalValue: 145.7,
    totalNFTs: 12,
    topCollection: {
      name: "Bored Ape Yacht Club",
      value: 87.3,
    },
    recentActivity: [
      { type: "buy", item: "Doodle #2234", price: 8.5, date: "2023-04-15" },
      { type: "sell", item: "Azuki #1337", price: 12.3, date: "2023-04-14" },
      { type: "buy", item: "CloneX #8876", price: 10.1, date: "2023-04-13" },
    ],
  }
  
  