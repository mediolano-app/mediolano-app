export interface NFT {
    id: string
    name: string
    description: string
    image: string
    price: number
    creator: string
    collection: string
  }
  
  export const featuredNFTs: NFT[] = [
    {
      id: "1",
      name: "Cosmic Dreamer #001",
      description: "A mesmerizing journey through the cosmos",
      image: "/background.jpg?height=400&width=400",
      price: 0.5,
      creator: "0x1234...5678",
      collection: "Cosmic Dreamers",
    },
    {
      id: "2",
      name: "Digital Fauna #042",
      description: "Vibrant digital representation of exotic wildlife",
      image: "/background.jpg?height=400&width=400",
      price: 0.75,
      creator: "0xabcd...efgh",
      collection: "Digital Fauna",
    },
    {
      id: "3",
      name: "Neon City #103",
      description: "A futuristic cityscape bathed in neon lights",
      image: "/background.jpg?height=400&width=400",
      price: 1.2,
      creator: "0x9876...5432",
      collection: "Neon Cities",
    },
    {
      id: "4",
      name: "Abstract Emotions #007",
      description: "An abstract representation of human emotions",
      image: "/background.jpg?height=400&width=400",
      price: 0.6,
      creator: "0xijkl...mnop",
      collection: "Abstract Emotions",
    },
  ]
  
  