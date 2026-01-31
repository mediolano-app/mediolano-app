
import type { Metadata } from "next"
import UserGuideContent from "@/app/docs/user-guide/UserGuideContent"

export const metadata: Metadata = {
    title: "User Guide | IP Creator",
    description: "Step-by-step instructions on how to use Mediolano IP Creator to create, manage, and explore programmable IP assets on Starknet.",
    openGraph: {
        title: "User Guide | IP Creator",
        description: "Learn how to use Mediolano IP Creator. Complete guide for creators and collectors.",
        url: 'https://ip.mediolano.app/docs/user-guide',
        siteName: 'IP Creator',
        images: [
            {
                url: '/app-card.jpg',
                width: 1200,
                height: 630,
                alt: 'Mediolano User Guide',
            },
        ],
        locale: 'en_US',
        type: 'article',
    },
}

export default function UserGuidePage() {
    return <UserGuideContent />
}
