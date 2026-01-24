import { Metadata } from 'next'

type Props = {
    params: Promise<{ assetId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { assetId } = await params

    // Parse assetId to get collection address and token ID
    const parts = assetId.split('-')
    const tokenId = parts.pop() || ''
    const collectionAddress = parts.join('-')
    const shortAddress = collectionAddress.length > 10
        ? `${collectionAddress.slice(0, 6)}...${collectionAddress.slice(-4)}`
        : collectionAddress

    return {
        title: `Provenance - Asset #${tokenId}`,
        description: `Ownership history and provenance of IP Asset #${tokenId} from collection ${shortAddress}. Verify authenticity and track transfers on Starknet.`,
        openGraph: {
            title: `Provenance - Asset #${tokenId} | IP Creator`,
            description: `Ownership history and provenance of IP Asset #${tokenId}. Verify authenticity on Starknet.`,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: `Provenance - Asset #${tokenId} | IP Creator`,
            description: `View the ownership history of IP Asset #${tokenId} on Starknet.`,
        },
    }
}

export default function ProvenanceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
