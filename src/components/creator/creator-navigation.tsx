"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FolderOpen, Palette, Activity } from "lucide-react"

interface CreatorNavigationProps {
    slug: string
}

export function CreatorNavigation({ slug }: CreatorNavigationProps) {
    const pathname = usePathname()

    const tabs = [
        {
            name: "Collections",
            href: `/creator/${slug}/collections`,
            icon: FolderOpen,
            isActive: pathname.includes("/collections")
        },
        {
            name: "Assets",
            href: `/creator/${slug}/assets`,
            icon: Palette,
            isActive: pathname.includes("/assets")
        },
        {
            name: "Activities",
            href: `/creator/${slug}/activities`,
            icon: Activity,
            isActive: pathname.includes("/activities")
        }
    ]

    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
            <div className="container mx-auto px-4">
                <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar" aria-label="Creator sections">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={cn(
                                    "relative flex items-center gap-2 px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap",
                                    tab.isActive
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="relative z-10">{tab.name}</span>
                                {tab.isActive && (
                                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
