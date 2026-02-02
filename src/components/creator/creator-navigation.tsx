"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FolderOpen, Palette, Activity } from "lucide-react"
import { useCreatorData } from "./creator-data-context"

export function CreatorNavigation() {
    const pathname = usePathname()
    const { slug, collections, collectionsLoading, standardTokens, assetsLoading } = useCreatorData()

    const tabs = [
        {
            name: "Collections",
            href: `/creator/${slug}/collections`,
            icon: FolderOpen,
            isActive: pathname.includes("/collections"),
            count: collectionsLoading ? null : collections.length,
        },
        {
            name: "Assets",
            href: `/creator/${slug}/assets`,
            icon: Palette,
            isActive: pathname.includes("/assets"),
            count: assetsLoading ? null : standardTokens.length,
        },
        {
            name: "Activities",
            href: `/creator/${slug}/activities`,
            icon: Activity,
            isActive: pathname.includes("/activities"),
            count: null, // Activities don't have a pre-loaded count
        }
    ]

    return (
        <div className="sticky top-0 z-30">
            {/*  Navigation Bar */}
            <div className="bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar" aria-label="Creator sections">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={cn(
                                        "relative flex items-center gap-2 px-4 py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap group",
                                        tab.isActive
                                            ? "text-primary"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Icon className={cn(
                                        "h-4 w-4 transition-transform duration-200",
                                        tab.isActive && "scale-110"
                                    )} />
                                    <span className="relative z-10">{tab.name}</span>

                                    {/* Badge with count */}
                                    {tab.count !== null && (
                                        <span className={cn(
                                            "ml-1 px-1.5 py-0.5 text-xs rounded-full transition-colors",
                                            tab.isActive
                                                ? "bg-primary/20 text-primary"
                                                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                        )}>
                                            {tab.count}
                                        </span>
                                    )}

                                    {/* Active indicator with gradient */}
                                    {tab.isActive && (
                                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/50" />
                                    )}

                                    {/* Hover background */}
                                    <div className={cn(
                                        "absolute inset-0 rounded-lg transition-colors -z-10",
                                        !tab.isActive && "group-hover:bg-white/5"
                                    )} />
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </div>
        </div>
    )
}
