import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Community Activities',
    description: 'Track the latest IP activities on Mediolano. See minting, transfers, remixes, and other on-chain events from the creator community.',
    openGraph: {
        title: 'Community Activities | IP Creator',
        description: 'Track the latest IP activities on Mediolano. See minting, transfers, remixes, and other on-chain events from the creator community.',
    },
}

export default function ActivitiesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
