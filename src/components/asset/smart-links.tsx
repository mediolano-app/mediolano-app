import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink, Youtube, Facebook, Instagram, Music, Globe } from "lucide-react"
import Link from "next/link"

export interface SmartLink {
    platform: string
    url: string
}

interface SmartLinksProps {
    links: SmartLink[]
}

export function SmartLinks({ links }: SmartLinksProps) {
    if (!links || links.length === 0) return null

    const getIcon = (platform: string) => {
        const p = platform.toLowerCase()
        if (p.includes("youtube")) return Youtube
        if (p.includes("facebook")) return Facebook
        if (p.includes("instagram")) return Instagram
        if (p.includes("spotify")) return Music // Lucide doesn't have Spotify, using Music
        if (p.includes("tiktok")) return Music // Lucide doesn't have TikTok, using Music
        if (p.includes("x") || p.includes("twitter")) return Globe // Lucide doesn't have X, using Globe
        return ExternalLink
    }

    const getLabel = (platform: string) => {
        const p = platform.toLowerCase()
        if (p.includes("youtube")) return "YouTube"
        if (p.includes("facebook")) return "Facebook"
        if (p.includes("instagram")) return "Instagram"
        if (p.includes("spotify")) return "Spotify"
        if (p.includes("tiktok")) return "TikTok"
        if (p.includes("x")) return "X (Twitter)"
        return platform || "External Link"
    }

    const getColors = (platform: string) => {
        const p = platform.toLowerCase()
        if (p.includes("youtube")) return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900"
        if (p.includes("facebook")) return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900"
        if (p.includes("instagram")) return "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-900"
        if (p.includes("spotify")) return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900"
        if (p.includes("tiktok")) return "text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700"
        if (p.includes("x")) return "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900"
        return "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700"
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {links.map((link, index) => {
                if (!link.url) return null

                const Icon = getIcon(link.platform)
                const label = getLabel(link.platform)
                const colors = getColors(link.platform)

                return (
                    <Link
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full"
                    >
                        <Card className={`h-full border transition-all hover:scale-[1.02] hover:shadow-md ${colors}`}>
                            <div className="p-4 flex items-center gap-3">
                                <div className={`p-2 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-sm`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Open on</p>
                                    <p className="font-bold truncate">{label}</p>
                                </div>
                                <ExternalLink className="h-4 w-4 opacity-50" />
                            </div>
                        </Card>
                    </Link>
                )
            })}
        </div>
    )
}
