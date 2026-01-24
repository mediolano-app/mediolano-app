import { Metadata } from 'next'

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params

    const shortAddress = slug.length > 10
        ? `${slug.slice(0, 6)}...${slug.slice(-4)}`
        : slug

    return {
        title: `Creator ${shortAddress}`,
        description: `View the profile and IP portfolio of creator ${shortAddress} on Mediolano. Explore their collections, assets, and contributions to the creator economy on Starknet.`,
        openGraph: {
            title: `Creator ${shortAddress} | Mediolano IP Creator`,
            description: `View the profile and IP portfolio of creator ${shortAddress}. Explore their collections and assets on Starknet.`,
            type: 'profile',
        },
        twitter: {
            card: 'summary_large_image',
            title: `Creator ${shortAddress} | IP Creator`,
            description: `View the profile and IP portfolio of creator ${shortAddress} on Starknet.`,
        },
    }
}

export default function CreatorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
