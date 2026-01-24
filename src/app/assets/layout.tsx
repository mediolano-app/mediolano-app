import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Explore Assets',
    description: 'Discover and explore the latest minted IP assets on Mediolano. Browse creative works from the global creator community.',
    openGraph: {
        title: 'Explore Assets | Mediolano',
        description: 'Discover and explore the latest minted IP assets on Mediolano. Browse creative works from the global creator community.',
    },
}

export default function AssetsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
