
import type { Metadata } from "next"
import MediolanoDAOContent from "@/app/docs/mediolano-dao/MediolanoDAOContent"

export const metadata: Metadata = {
    title: "Mediolano DAO | IP Creator",
    description: "Ensuring transparency, permissionless participation, and truly decentralized governance for the Integrity Web.",
    openGraph: {
        title: "Mediolano DAO | IP Creator",
        description: "Decentralized Autonomous Organization. Governance, Mission, and Values.",
        url: 'https://ip.mediolano.app/docs/mediolano-dao',
        siteName: 'IP Creator',
        images: [
            {
                url: '/app-card.jpg',
                width: 1200,
                height: 630,
                alt: 'Mediolano DAO',
            },
        ],
        locale: 'en_US',
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Mediolano DAO | IP Creator",
        description: "Decentralized Autonomous Organization. Governance, Mission, and Values.",
        images: ['/mediolano-logo-dark.png'],
    },
}

export default function MediolanoDAOPage() {
    return <MediolanoDAOContent />
}
