
import type { Metadata } from "next"
import GovernanceCharterContent from "@/app/docs/governance-charter/GovernanceCharterContent"

export const metadata: Metadata = {
  title: "Governance Charter | Mediolano DAO",
  description: "Principles, processes, and structures for the decentralized governance of Mediolano DAO.",
  openGraph: {
    title: "Governance Charter | Mediolano DAO",
    description: "How Mediolano DAO works. Proposals, Voting, and Treasury.",
    url: 'https://ip.mediolano.app/docs/governance-charter',
    siteName: 'Mediolano IP Creator',
    images: [
      {
        url: '/mediolano-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'Mediolano Governance Charter',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Governance Charter | Mediolano DAO",
    description: "How Mediolano DAO works. Proposals, Voting, and Treasury.",
    images: ['/mediolano-logo-dark.png'],
  },
}

export default function GovernanceCharterPage() {
  return <GovernanceCharterContent />
}
