
import type { Metadata } from "next"
import PrivacyPolicyContent from "@/app/docs/privacy-policy/PrivacyPolicyContent"

export const metadata: Metadata = {
  title: "Privacy Policy | Mediolano IP Creator",
  description: "Our privacy policy outlines our commitment to user sovereignty, data security, and decentralization.",
  openGraph: {
    title: "Privacy Policy | Mediolano IP Creator",
    description: "Privacy by design in a decentralized ecosystem.",
    url: 'https://ip.mediolano.app/docs/privacy-policy',
    siteName: 'Mediolano IP Creator',
    images: [
      {
        url: '/mediolano-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'Mediolano Privacy Policy',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Privacy Policy | Mediolano IP Creator",
    description: "Privacy by design in a decentralized ecosystem.",
    images: ['/mediolano-logo-dark.png'],
  },
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />
}
