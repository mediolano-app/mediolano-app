import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'IP Collections',
    description: 'Explore and discover curated IP collections on Starknet. Browse digital assets, artwork, and intellectual property protected on the blockchain.',
    openGraph: {
        title: 'IP Collections | IP Creator',
        description: 'Explore and discover curated IP collections on Starknet. Browse digital assets, artwork, and intellectual property protected on the blockchain.',
    },
}

export default function CollectionsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
