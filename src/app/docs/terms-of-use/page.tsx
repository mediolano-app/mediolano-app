
import type { Metadata } from "next"
import TermsOfUseContent from "@/app/docs/terms-of-use/TermsOfUseContent"

export const metadata: Metadata = {
  title: "Terms of Use | Mediolano IP Creator",
  description: "Terms governing the use of the Mediolano platform, addressing IP rights, licensing, and DAO governance.",
  openGraph: {
    title: "Terms of Use | Mediolano IP Creator",
    description: "Official Terms of Use for the Mediolano decentralized IP protocol and platform.",
    url: 'https://ip.mediolano.app/docs/terms-of-use',
    siteName: 'Mediolano IP Creator',
    images: [
      {
        url: '/mediolano-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'Mediolano Terms of Use',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Terms of Use | Mediolano IP Creator",
    description: "Official Terms of Use for the Mediolano decentralized IP protocol and platform.",
    images: ['/mediolano-logo-dark.png'],
  },
}

export default function TermsOfUsePage() {
  return <TermsOfUseContent />
}
