
import type { Metadata } from "next"
import FAQContent from "@/app/docs/faq/FAQContent"

export const metadata: Metadata = {
    title: "FAQ | Mediolano IP Creator",
    description: "Frequently Asked Questions about Mediolano, IP tokenization, fees, and more.",
    openGraph: {
        title: "FAQ | Mediolano IP Creator",
        description: "Find answers to your questions about the Integrity Web and Programmable IP.",
        url: 'https://ip.mediolano.app/docs/faq',
        siteName: 'Mediolano IP Creator',
        images: [
            {
                url: '/mediolano-logo-dark.png',
                width: 1200,
                height: 630,
                alt: 'Mediolano FAQ',
            },
        ],
        locale: 'en_US',
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: "FAQ | Mediolano IP Creator",
        description: "Find answers to your questions about the Integrity Web and Programmable IP.",
        images: ['/mediolano-logo-dark.png'],
    },
}

export default function FAQPage() {
    return <FAQContent />
}
