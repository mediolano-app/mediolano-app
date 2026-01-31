
import type { Metadata } from "next"
import PermissionlessSetupContent from "./PermissionlessSetupContent"

export const metadata: Metadata = {
    title: "Permissionless Setup | IP Creator",
    description: "Guide to running Mediolano IP Creator locally or deploying your own instance.",
    openGraph: {
        title: "Permissionless Setup | IP Creator",
        description: "Run Mediolano permissionlessly. Local setup and deployment guide.",
        url: 'https://ip.mediolano.app/docs/permissionless-setup',
        siteName: 'IP Creator',
        images: [
            {
                url: '/app-card.jpg',
                width: 1200,
                height: 630,
                alt: 'Mediolano Permissionless Setup',
            },
        ],
        locale: 'en_US',
        type: 'article',
    },
}

export default function PermissionlessSetupPage() {
    return <PermissionlessSetupContent />
}
