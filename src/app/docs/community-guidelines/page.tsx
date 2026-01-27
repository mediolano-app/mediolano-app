
import type { Metadata } from "next"
import CommunityGuidelinesContent from "@/app/docs/community-guidelines/CommunityGuidelinesContent"

export const metadata: Metadata = {
  title: "Community Guidelines | Mediolano IP Creator",
  description: "Our standards for fostering a safe, inclusive, and respectful community for all creators and collectors.",
  openGraph: {
    title: "Community Guidelines | Mediolano IP Creator",
    description: "Building a respectful and thriving decentralized community.",
    url: 'https://ip.mediolano.app/docs/community-guidelines',
    siteName: 'Mediolano IP Creator',
    images: [
      {
        url: '/mediolano-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'Mediolano Community',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Community Guidelines | Mediolano IP Creator",
    description: "Building a respectful and thriving decentralized community.",
    images: ['/mediolano-logo-dark.png'],
  },
}

export default function CommunityGuidelinesPage() {
  return <CommunityGuidelinesContent />
}
