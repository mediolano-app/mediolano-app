
import type { Metadata } from "next"
import ComplianceGuidelinesContent from "@/app/docs/compliance-guidelines/ComplianceGuidelinesContent"

export const metadata: Metadata = {
  title: "Compliance Guidelines | IP Creator",
  description: "Our approach to regulatory compliance, including KYC/AML, securities regulations, and intellectual property rights.",
  openGraph: {
    title: "Compliance Guidelines | IP Creator",
    description: "Navigating the intersection of blockchain technology, IP law, and global regulations.",
    url: 'https://ip.mediolano.app/docs/compliance-guidelines',
    siteName: 'IP Creator',
    images: [
      {
        url: '/app-card.jpg',
        width: 1200,
        height: 630,
        alt: 'Mediolano Compliance',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Compliance Guidelines | IP Creator",
    description: "Navigating the intersection of blockchain technology, IP law, and global regulations.",
    images: ['/mediolano-logo-dark.png'],
  },
}

export default function ComplianceGuidelinesPage() {
  return <ComplianceGuidelinesContent />
}
