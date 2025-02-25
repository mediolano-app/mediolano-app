export interface Launch {
    id: string
    name: string
    image: string
    description: string
    launchDate: string
    creator: string
    totalSupply: number
    price: number
  }
  
  export const bestLaunches: Launch[] = [
    {
      id: "1",
      name: "Celestial Guardians",
      image: "/background.jpg?height=600&width=800",
      description: "A collection of mystical beings protecting the cosmos",
      launchDate: "2025-03-15",
      creator: "Stellar Studios",
      totalSupply: 10000,
      price: 0.1,
    },
    {
      id: "2",
      name: "Quantum Pixels",
      image: "/background.jpg?height=600&width=800",
      description: "Dive into a world of vibrant, ever-changing digital art",
      launchDate: "2025-03-20",
      creator: "DigitalDreams Collective",
      totalSupply: 5000,
      price: 0.2,
    },
    {
      id: "3",
      name: "Cybernetic Legends",
      image: "/background.jpg?height=600&width=800",
      description: "Futuristic interpretations of mythological creatures",
      launchDate: "2025-03-25",
      creator: "NeoMythOS",
      totalSupply: 7500,
      price: 0.15,
    },
    {
      id: "4",
      name: "EcoVerse Guardians",
      image: "/background.jpg?height=600&width=800",
      description: "Protectors of digital ecosystems in a virtual world",
      launchDate: "2025-04-01",
      creator: "GreenBlock Studios",
      totalSupply: 3000,
      price: 0.25,
    },
  ]
  
  