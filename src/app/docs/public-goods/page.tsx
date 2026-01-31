
import type { Metadata } from "next"
import PublicGoodsContent from "@/app/docs/public-goods/PublicGoodsContent"

export const metadata: Metadata = {
    title: "Public Goods | IP Creator",
    description: "Mediolano is built as a digital public good, democratizing access to intellectual property protections and monetization tools.",
    openGraph: {
        title: "Public Goods | IP Creator",
        description: "Accessible, open-source, and community-owned infrastructure for the Integrity Web.",
        url: 'https://ip.mediolano.app/docs/public-goods',
        siteName: 'IP Creator',
        images: [
            {
                url: '/app-card.jpg',
                width: 1200,
                height: 630,
                alt: 'Mediolano Public Goods',
            },
        ],
        locale: 'en_US',
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Public Goods | IP Creator",
        description: "Accessible, open-source, and community-owned infrastructure for the Integrity Web.",
        images: ['/mediolano-logo-dark.png'],
    },
}

export default function PublicGoodsPage() {
    return <PublicGoodsContent />
}
