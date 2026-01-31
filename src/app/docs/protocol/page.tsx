
import type { Metadata } from "next"
import ProtocolContent from "@/app/docs/protocol/ProtocolContent"

export const metadata: Metadata = {
    title: "Mediolano Protocol | IP Creator",
    description: "The technical foundation of the Integrity Web. A high-performance, modular infrastructure for programmable intellectual property on Starknet.",
    openGraph: {
        title: "Mediolano Protocol | IP Creator",
        description: "Architecture, Smart Contracts, and Decentralization.",
        url: 'https://ip.mediolano.app/docs/protocol',
        siteName: 'IP Creator',
        images: [
            {
                url: '/app-card.jpg',
                width: 1200,
                height: 630,
                alt: 'Mediolano Protocol',
            },
        ],
        locale: 'en_US',
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Mediolano Protocol | IP Creator",
        description: "Architecture, Smart Contracts, and Decentralization.",
        images: ['/mediolano-logo-dark.png'],
    },
}

export default function ProtocolPage() {
    return <ProtocolContent />
}
