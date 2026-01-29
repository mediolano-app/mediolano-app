import { Metadata } from 'next'
import { CreatorHeader } from '@/components/creator/creator-header'
import { CreatorNavigation } from '@/components/creator/creator-navigation'

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
            title: `Creator ${shortAddress} | IP Creator`,
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

import { CreatorDataProvider } from '@/components/creator/creator-data-context'

export default async function CreatorLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    return (
        <CreatorDataProvider slug={slug}>
            <div className="min-h-screen flex flex-col bg-background">
                <CreatorHeader address={slug} />
                <CreatorNavigation />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </CreatorDataProvider>
    )
}
