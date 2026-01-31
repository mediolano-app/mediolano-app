
import type { Metadata } from "next"
import DocsLandingClient from "@/app/docs/DocsLandingClient"

export const metadata: Metadata = {
    title: "Documentation | IP Creator",
    description: "The definitive guide to Mediolano IP Creator. Explore the DApp, developer tools, protocol architecture, and DAO governance.",
    openGraph: {
        title: "Documentation | IP Creator",
        description: "Explore the protocol, build with our tools, or participate in Mediolano DAO.",
        url: 'https://ip.mediolano.app/docs',
        siteName: 'IP Creator',
        images: [
            {
                url: '/app-card.jpg',
                width: 1200,
                height: 630,
                alt: 'Mediolano Documentation',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Documentation | IP Creator",
        description: "The definitive guide to Mediolano. DApp, Devs, & DAO.",
        images: ['/mediolano-logo-dark.png'],
    },
}

export default function DocsLandingPage() {
    return <DocsLandingClient />
}
