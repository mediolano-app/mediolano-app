
import type { Metadata } from "next"
import IPProtectionContent from "@/app/docs/ip-protection/IPProtectionContent"

export const metadata: Metadata = {
    title: "How does Mediolano protect IP? | Mediolano IP Creator",
    description: "Discover the multi-layered protection strategy of the Mediolano Protocol, combining immutable cryptography, international law, and decentralized governance.",
    openGraph: {
        title: "How does Mediolano protect IP? | Mediolano IP Creator",
        description: "Built for the Integrity Web: Cryptography, Law, and Community.",
        url: 'https://ip.mediolano.app/docs/ip-protection',
        siteName: 'Mediolano IP Creator',
        images: [
            {
                url: '/mediolano-logo-dark.png',
                width: 1200,
                height: 630,
                alt: 'Mediolano IP Protection',
            },
        ],
        locale: 'en_US',
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: "How does Mediolano protect IP? | Mediolano IP Creator",
        description: "Built for the Integrity Web: Cryptography, Law, and Community.",
        images: ['/mediolano-logo-dark.png'],
    },
}

export default function IPProtectionPage() {
    return <IPProtectionContent />
}
