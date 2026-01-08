// Mock data for Mediolano features showcase

export interface Feature {
  id: string
  title: string
  description: string
  icon: string
  gradient: string
  bgImage: string
  link: string
}

export const mediolanoFeatures: Feature[] = [
  {
    id: "ip-creator-dapp",
    title: "Permissionless IP Creator",
    description:
      "Tokenize and protect your intellectual property with complete sovereignty. Powered on Starknet.",
    icon: "🎨",
    gradient: "gradient-teal-purple",
    bgImage: "/featured/ip-creator-bg.jpg",
    link: "https://ip.mediolano.app",
  },
  {
    id: "mip-mobile",
    title: "MIP Mobile for iOS and Android",
    description:
      "MyIntellectualProperty Mobile App with Free and Frictionless Tokenization.",
    icon: "📱",
    gradient: "gradient-purple-orange",
    bgImage: "/featured/mip-mobile-bg.jpg",
    link: "https://mip.mediolano.app",
  },
  {
    id: "zero-fee",
    title: "Zero Fee Tokenization",
    description:
      "Programmable IP for the Integrity Web. Zero fee, zero intermediaries.",
    icon: "⚡",
    gradient: "gradient-teal-orange",
    bgImage: "/featured/zero-fee-bg.jpg",
    link: "https://mediolano.app/protocol",
  },
]
