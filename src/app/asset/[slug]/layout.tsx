import { Metadata } from 'next'

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params

    // Parse the slug to get collection address and token ID
    const parts = slug.split('-')
    const tokenId = parts.pop() || ''
    const collectionAddress = parts.join('-')
    const shortAddress = collectionAddress.length > 10
        ? `${collectionAddress.slice(0, 6)}...${collectionAddress.slice(-4)}`
        : collectionAddress

    return {
        title: `IP Asset #${tokenId}`,
        description: `View IP Asset #${tokenId} from collection ${shortAddress} on Mediolano. Track provenance, ownership, and licensing details for this digital asset on Starknet.`,
        openGraph: {
            title: `IP Asset #${tokenId} | IP Creator`,
            description: `View IP Asset #${tokenId} from collection ${shortAddress}. Track provenance, ownership, and licensing details on Starknet.`,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: `IP Asset #${tokenId} | IP Creator`,
            description: `View IP Asset #${tokenId} on Mediolano. Track provenance and ownership on Starknet.`,
        },
    }
}

export default function AssetLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
