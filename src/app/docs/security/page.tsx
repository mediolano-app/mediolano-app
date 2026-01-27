
import type { Metadata } from "next"
import SecurityContent from "@/app/docs/security/SecurityContent"

export const metadata: Metadata = {
    title: "Security & Audits | Mediolano IP Creator",
    description: "Security is paramount for the Integrity Web. Learn about our audits, bug bounty programs, and risk approach.",
    openGraph: {
        title: "Security & Audits | Mediolano IP Creator",
        description: "Official security audits and bug bounty information for Mediolano Protocol.",
        url: 'https://ip.mediolano.app/docs/security',
        siteName: 'Mediolano IP Creator',
        images: [
            {
                url: '/mediolano-logo-dark.png',
                width: 1200,
                height: 630,
                alt: 'Mediolano Security',
            },
        ],
        locale: 'en_US',
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Security & Audits | Mediolano IP Creator",
        description: "Official security audits and bug bounty information for Mediolano Protocol.",
        images: ['/mediolano-logo-dark.png'],
    },
}

export default function SecurityPage() {
    return <SecurityContent />
}
