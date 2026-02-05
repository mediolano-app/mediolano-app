"use client"

import { use } from "react"
import { RemixAssetForm } from "@/components/remix/remix-asset-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

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
                <div className="text-center space-y-4 glass-card p-12">
                    <h1 className="text-3xl font-bold text-red-500">Invalid Asset Link</h1>
                    <p className="text-muted-foreground">The asset link you are trying to access is invalid.</p>
                    <Link href="/">
                        <Button className="glass-button">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-20">
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link href="/create/remix">
                        <Button variant="ghost" size="sm" className="pl-0 mb-4 hover:bg-transparent hover:text-primary transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Discovery
                        </Button>
                    </Link>

                    <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Create Remix
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Transform knowledge and creativity into new IP.
                    </p>
                </motion.div>

                <RemixAssetForm nftAddress={nftAddress} tokenId={tokenId} />
            </main>
        </div>
    )
}
