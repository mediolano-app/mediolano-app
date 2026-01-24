"use client"

import { use } from "react"
import { RemixAssetForm } from "@/components/remix/remix-asset-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface RemixPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function RemixPage({ params }: RemixPageProps) {
    const { slug } = use(params)

    // Parse asset slug [address]-[tokenid]
    // Handle potentially encoded slugs
    const decodedSlug = decodeURIComponent(slug)
    const [nftAddress, tokenIdStr] = (decodedSlug || "").split("-")
    const tokenId = parseInt(tokenIdStr)

    if (!decodedSlug || !nftAddress || isNaN(tokenId)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Invalid Asset Link</h1>
                    <p className="text-muted-foreground">The asset link you are trying to access is invalid.</p>
                    <Link href="/">
                        <Button>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create Remix</h1>
                    <p className="text-muted-foreground">
                        Create a new work based on the original asset.
                    </p>
                </div>

                <RemixAssetForm nftAddress={nftAddress} tokenId={tokenId} />
            </main>
        </div>
    )
}
