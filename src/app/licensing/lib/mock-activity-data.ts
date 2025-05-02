import type { ActivityEvent, HistoryEvent } from "./types"

export const recentActivity: ActivityEvent[] = [
  {
    user: "Alex Morgan",
    userAvatar: "/placeholder.svg?height=40&width=40&text=AM",
    action: "Created new IP asset",
    assetName: "Digital Artwork Series: Quantum Realms",
    time: "2 days ago",
  },
  {
    user: "Sarah Chen",
    userAvatar: "/placeholder.svg?height=40&width=40&text=SC",
    action: "Licensed IP asset",
    assetName: "3D Model: Future City",
    time: "3 days ago",
  },
  {
    user: "Michael Davis",
    userAvatar: "/placeholder.svg?height=40&width=40&text=MD",
    action: "Transferred license",
    assetName: "Music Album: Ethereal Sounds",
    time: "5 days ago",
  },
  {
    user: "Creative Futures",
    userAvatar: "/placeholder.svg?height=40&width=40&text=CF",
    action: "Purchased license",
    assetName: "Digital Artwork Series: Quantum Realms",
    time: "1 week ago",
  },
  {
    user: "Indie Game Collective",
    userAvatar: "/placeholder.svg?height=40&width=40&text=IGC",
    action: "Created new IP asset",
    assetName: "Video Game: Cosmic Explorers",
    time: "2 weeks ago",
  },
]

export function getAssetHistory(assetId: string): HistoryEvent[] {
  // In a real app, this would filter based on the asset ID
  // For now, we'll just return mock data
  return [
    {
      event: "Asset Creation",
      details: "Asset was minted on Starknet blockchain",
      user: "Asset Creator",
      date: "Oct 15, 2023",
      transactionHash: "0x7d2f378297abcdef183B55Fd93C6371C7912345",
    },
    {
      event: "License Created",
      details: "Commercial License created for Creative Futures Agency",
      user: "Asset Creator",
      date: "Jan 15, 2024",
      transactionHash: "0x8b3a9c1dE4F12c894123489aB60C89f432",
    },
    {
      event: "License Created",
      details: "Exhibition License created for Digital Art Museum",
      user: "Asset Creator",
      date: "Feb 2, 2024",
      transactionHash: "0x9c4d7e358f2a1B6e4D7123455a2E8B3a2F",
    },
    {
      event: "Royalty Payment",
      details: "Royalty payment of 0.25 ETH received",
      user: "Creative Futures Agency",
      date: "Mar 10, 2024",
      transactionHash: "0x1a2b3c4d5e6f7g8h9i0j1234567890",
    },
    {
      event: "Metadata Update",
      details: "Asset metadata was updated",
      user: "Asset Creator",
      date: "Apr 5, 2024",
    },
  ]
}
