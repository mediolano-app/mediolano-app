
import type { Metadata } from "next"
import SecurityContent from "@/app/docs/security/SecurityContent"

export const metadata: Metadata = {
    title: "Security | IP Creator",
    description: "Security is paramount for the Integrity Web. Learn about our security and risk approach.",
    openGraph: {
        title: "Security | IP Creator",
        description: "Official security information for Mediolano Protocol and IP Creator.",
        url: 'https://ip.mediolano.app/docs/security',
        siteName: 'IP Creator',
        images: [
            {
                url: '/app-card.jpg',
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
        title: "Security | IP Creator",
        description: "Official security information for Mediolano Protocol and IP Creator.",
        images: ['/mediolano-logo-dark.png'],
    },
}

export default function SecurityPage() {
    return <SecurityContent />
}
