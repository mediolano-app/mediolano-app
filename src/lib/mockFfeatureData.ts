import type React from "react"
import type { ProportionsIcon as IconProps } from "lucide-react"
import { Wallet, Sparkles, ShieldCheck, Zap, Globe, BarChart3 } from "lucide-react"

export interface Feature {
  id: string
  title: string
  description: string
  icon: React.ForwardRefExoticComponent<IconProps>
}

export const appFeatures: Feature[] = [
  {
    id: "1",
    title: "Easy Wallet Integration",
    description:
      "Connect your preferred crypto wallet with just a few clicks. Support for web3 wallets.",
    icon: Wallet,
  },
  {
    id: "2",
    title: "Curated Collections",
    description: "Discover hand-picked, high-quality NFT collections from top artists and creators around the world.",
    icon: Sparkles,
  },
  {
    id: "3",
    title: "Secure Transactions",
    description: "Every transaction is protected with state-of-the-art encryption and blockchain technology.",
    icon: ShieldCheck,
  },
  {
    id: "4",
    title: "Instant Listings",
    description: "List your NFTs for sale in seconds with our streamlined process and user-friendly interface.",
    icon: Zap,
  },
  {
    id: "5",
    title: "Global Marketplace",
    description: "Connect with buyers and sellers from around the globe in our thriving NFT community.",
    icon: Globe,
  },
  {
    id: "6",
    title: "Market Insights",
    description: "Access real-time data and analytics to make informed decisions about your NFT investments.",
    icon: BarChart3,
  },
]

