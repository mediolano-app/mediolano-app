import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Discover IP Assets',
    description: 'Discover unique intellectual property assets on Starknet. Browse trending creations, find new artists, and explore the creator economy.',
    openGraph: {
        title: 'Discover IP Assets | IP Creator',
        description: 'Discover unique intellectual property assets on Starknet. Browse trending creations, find new artists, and explore the creator economy.',
    },
}

export default function DiscoverLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
