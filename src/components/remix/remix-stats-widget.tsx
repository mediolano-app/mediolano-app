"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch } from "lucide-react"
import { TokenData } from "@/hooks/use-portfolio"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface RemixStatsWidgetProps {
    tokens: Record<string, TokenData[]>
}

export function RemixStatsWidget({ tokens }: RemixStatsWidgetProps) {
    const remixStats = useMemo(() => {
        let totalRemixes = 0
        let remixTypesCount: Record<string, number> = {}

        Object.values(tokens).flat().forEach(token => {
            const remixType = token.attributes?.find(attr => attr.trait_type === "Remix Type")?.value
            if (remixType) {
                totalRemixes++
                remixTypesCount[remixType] = (remixTypesCount[remixType] || 0) + 1
            }
        })

        return { totalRemixes, remixTypesCount }
    }, [tokens])

    return (
        <Card className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-200/20 dark:border-indigo-800/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Remixes Created</CardTitle>
                <GitBranch className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{remixStats.totalRemixes}</div>
                <p className="text-xs text-muted-foreground mb-3">
                    Across {Object.keys(tokens).length} collections
                </p>

                {remixStats.totalRemixes === 0 && (
                    <Button variant="outline" size="sm" className="w-full text-xs h-7 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" asChild>
                        <Link href="/create/remix">Create First Remix</Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
