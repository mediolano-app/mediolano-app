import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'IP Portfolio',
    description: 'Manage your intellectual property portfolio on Starknet. View your collections, assets, and track your digital asset holdings.',
    openGraph: {
        title: 'IP Portfolio | IP Creator',
        description: 'Manage your intellectual property portfolio on Starknet. View your collections, assets, and track your digital asset holdings.',
    },
    robots: {
        index: false,
        follow: false,
    },
}

export default function PortfolioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
