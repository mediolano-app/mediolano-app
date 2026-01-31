
import type { Metadata } from "next"
import DevelopersContent from "@/app/docs/developers/DevelopersContent"

export const metadata: Metadata = {
    title: "Developer Hub | IP Creator",
    description: "Build the next generation of IP applications. Access our smart contracts, SDKs, and data layers to integrate programmable IP into your dApp.",
    openGraph: {
        title: "Developer Hub | IP Creator",
        description: "Everything you need to build on Mediolano. Contracts, SDKs, and Subgraphs.",
        url: 'https://ip.mediolano.app/docs/developers',
        siteName: 'IP Creator',
        images: [
            {
                url: '/app-card.jpg',
                width: 1200,
                height: 630,
                alt: 'Mediolano Developer Hub',
            },
        ],
        locale: 'en_US',
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Developer Hub | IP Creator",
        description: "Code, Contracts, and Tools for the Integrity Web.",
        images: ['/mediolano-logo-dark.png'],
    },
}

export default function DevelopersPage() {
    return <DevelopersContent />
}
