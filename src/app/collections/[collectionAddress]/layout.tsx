import { Metadata } from 'next'

type Props = {
    params: Promise<{ collectionAddress: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { collectionAddress } = await params

    const shortAddress = collectionAddress.length > 10
        ? `${collectionAddress.slice(0, 6)}...${collectionAddress.slice(-4)}`
        : collectionAddress

    return {
        title: `Collection ${shortAddress}`,
        description: `Explore the IP collection at ${shortAddress} on Mediolano. Browse all assets, view collection details, and discover digital creations on Starknet.`,
        openGraph: {
            title: `Collection ${shortAddress} | IP Creator`,
            description: `Explore the IP collection at ${shortAddress}. Browse all assets and discover digital creations on Starknet.`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `Collection ${shortAddress} | IP Creator`,
            description: `Explore the IP collection at ${shortAddress} on Starknet.`,
        },
    }
}

export default function CollectionDetailLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
