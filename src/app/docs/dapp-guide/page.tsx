
import type { Metadata } from "next"
import DAppGuideContent from "@/app/docs/dapp-guide/DAppGuideContent"

export const metadata: Metadata = {
    title: "Platform Guide | IP Creator",
    description: "Your gateway to the DApp. Learn how to create, license, and monetize IP assets with zero fees permissionslessly on Starknet.",
    openGraph: {
        title: "Platform Guide | IP Creator",
        description: "Your gateway to the DApp. Tokenize and protect your creative assets freely.",
        url: 'https://ip.mediolano.app/docs/dapp-guide',
        siteName: 'IP Creator',
        images: [
            {
                url: '/app-card.jpg',
                width: 1200,
                height: 630,
                alt: 'Mediolano Platform Guide',
            },
        ],
        locale: 'en_US',
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Platform Guide | IP Creator",
        description: "Zero fees, global protection, programmable IP.",
        images: ['/mediolano-logo-dark.png'],
    },
}

export default function DAppGuidePage() {
    return <DAppGuideContent />
}
