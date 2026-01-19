export function getAssetInfo() {
    return {
      title: "Cosmic Harmony #42",
      description: "A mesmerizing digital artwork exploring the balance of the universe.",
      tags: ["Digital Art", "Abstract", "Space"],
      collection: "Cosmic Visions",
      tokenId: "42",
      tokenStandard: "ERC721",
      imageUrl: "/background.jpg",
      creator: "0xCreator...1234",
      owner: "0xOwner...5678",
    }
  }
  
  export function getAssetActivity() {
    return [
      { event: "Minted", from: "0x0000...0000", to: "0xabcd...1234", price: 0, date: "2023-01-01" },
      { event: "Listed", from: "0xabcd...1234", to: "-", price: 1.5, date: "2023-02-15" },
      { event: "Sold", from: "0xabcd...1234", to: "0xefgh...5678", price: 1.5, date: "2023-03-01" },
      { event: "Transfer", from: "0xefgh...5678", to: "0xijkl...9012", price: 0, date: "2023-04-10" },
      { event: "Licensed", from: "0xijkl...9012", to: "0xmnop...3456", price: 0.5, date: "2023-05-20" },
    ]
  }
  
  export function getCollectionAssets() {
    return [
      { title: "Cosmic Harmony #12", imageUrl: "/background.jpg" },
      { title: "Cosmic Harmony #23", imageUrl: "/background.jpg" },
      { title: "Cosmic Harmony #34", imageUrl: "/background.jpg" },
      { title: "Cosmic Harmony #45", imageUrl: "/background.jpg" },
      { title: "Cosmic Harmony #56", imageUrl: "/background.jpg" },
    ]
  }
  
  export function getLicensingOptions() {
    return [
      {
        name: "Basic License",
        description: "Personal use and small-scale commercial applications.",
        price: 0.1,
        rights: ["Display", "Personal Use", "Small Commercial Use"],
      },
      {
        name: "Extended License",
        description: "Unlimited commercial use and redistribution rights.",
        price: 0.5,
        rights: ["Display", "Commercial Use", "Modify", "Distribute"],
      },
      {
        name: "Exclusive License",
        description: "Full ownership transfer and exclusive rights.",
        price: 2.0,
        rights: ["All Rights", "Transfer Ownership", "Sublicense"],
      },
    ]
  }
  
  export function getAssetMetadata() {
    return {
      "IPFS Hash": "QmX...abc",
      "Image Resolution": "3000x3000",
      "File Format": "PNG",
      "Creation Date": "2023-01-01",
      "Last Updated": "2023-06-15",
      Blockchain: "Starknet",
      "Smart Contract": "0xContract...7890",
    }
  }
  
  export function getAssetRoyalties() {
    return {
      "Creator Royalty": "10%",
      "Platform Fee": "2.5%",
      "Resale Royalty": "5%",
      "Licensing Royalty": "15%",
      "Total Royalties Earned": "2.5%",
      "Resale Royalty": "5%",
      "Licensing Royalty": "15%",
      "Total Royalties Earned": "1.2 ETH",
    }
  }
  
  export function getAssetAnalytics() {
    return [
      { name: "Views", value: 1200 },
      { name: "Likes", value: 450 },
      { name: "Shares", value: 200 },
      { name: "Licenses Sold", value: 15 },
      { name: "Total Revenue (ETH)", value: 3.5 },
    ]
  }
  
  export function getLicenseOptions() {
    return {
      rights: [
        "Display",
        "Reproduce",
        "Distribute",
        "Perform",
        "Modify",
        "Create Derivative Works",
        "Sublicense",
        "Commercial Use",
      ],
      durations: ["1", "2", "3", "5", "10", "Perpetual"],
      territories: ["Worldwide", "North America", "Europe", "Asia", "Custom"],
    }
  }
  
  export function getCreatorInfo() {
    return {
      name: "Alex Creativemind",
      avatarUrl: "/placeholder.svg?height=100&width=100",
      bio: "Digital artist exploring the intersection of technology and creativity.",
      totalWorks: 42,
      followers: 1500,
      totalSales: 25.5,
      specialties: ["Digital Art", "3D Modeling", "Animation"],
    }
  }
  
  