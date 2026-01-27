
import type { Metadata } from "next"
import ConstitutionContent from "@/app/docs/constitution/ConstitutionContent"

export const metadata: Metadata = {
    title: "Constitution | Mediolano DAO",
    description: "The founding document of Mediolano DAO, outlining its identity, purpose, governance, and commitment to the Integrity Web.",
    openGraph: {
        title: "Constitution | Mediolano DAO",
        description: "The governing principles of the Mediolano Tokenized IP Protocol.",
        url: 'https://ip.mediolano.app/docs/constitution',
        siteName: 'Mediolano IP Creator',
        images: [
            {
                url: '/mediolano-logo-dark.png',
                width: 1200,
                height: 630,
                alt: 'Mediolano Constitution',
            },
        ],
        locale: 'en_US',
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Constitution | Mediolano DAO",
        description: "The governing principles of the Mediolano Tokenized IP Protocol.",
        images: ['/mediolano-logo-dark.png'],
    },
}

export default function ConstitutionPage() {
    return <ConstitutionContent />
}
