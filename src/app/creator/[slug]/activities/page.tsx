"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ActivityCard } from "@/components/activity-card"
import { useUserActivities } from "@/hooks/useUserActivities"
import { useCreatorData } from "@/components/creator/creator-data-context"
import {
    Activity,
    Search,
    Filter,
    RefreshCw,
    X,
    Loader2,
    AlertCircle
} from "lucide-react"

export default function CreatorActivitiesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [activityTypeFilter, setActivityTypeFilter] = useState("all")

    // Get wallet address from context
    const { walletAddress } = useCreatorData()

    // Activities still need their own hook as they're not shared with other pages
    const { activities, loading, loadingMore, error, hasMore, loadMore, refresh } = useUserActivities(walletAddress, 12)

    const filteredActivities = useMemo(() => {
        let result = activities

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase()
            result = result.filter(
                (activity) =>
                    activity.assetName.toLowerCase().includes(lowerQuery) ||
                    activity.user.toLowerCase().includes(lowerQuery) ||
                    activity.details.toLowerCase().includes(lowerQuery)
            )
        }

        if (activityTypeFilter !== "all") {
            result = result.filter((activity) => activity.type === activityTypeFilter)
        }

        return result
    }, [activities, searchQuery, activityTypeFilter])

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/*  Filters Bar */}
            <div className="sticky top-[57px] z-10 -mx-4 px-4 pb-4">
                <Card className="bg-background/80 backdrop-blur-xl border-white/10 shadow-lg">
                    <div className="p-3 md:p-4">
                        <div className="flex flex-col gap-3 md:gap-4">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search activities..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-10 bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Filter Controls */}
                            <div className="flex flex-wrap gap-2">
                                <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                                    <SelectTrigger className="w-full sm:w-[140px] bg-background/50 border-white/10 focus:border-primary/50">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent className="backdrop-blur-xl bg-background/95">
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="mint">Mint</SelectItem>
                                        <SelectItem value="transfer">Transfer</SelectItem>
                                        <SelectItem value="remix">Remix</SelectItem>
                                        <SelectItem value="collection">Collection</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    variant="outline"
                                    size="default"
                                    onClick={refresh}
                                    disabled={loading}
                                    className="flex-1 sm:flex-initial bg-background/50 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                                >
                                    <RefreshCw className={`h-4 w-4 ${loading && !loadingMore ? "animate-spin" : ""}`} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Activity Feed */}
            <div className="space-y-6">
                {error && (
                    <Card className="p-4 bg-destructive/10 border-destructive/20 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <p>{error}</p>
                            <Button variant="link" onClick={refresh} className="h-auto p-0 ml-2">Try Again</Button>
                        </div>
                    </Card>
                )}

                {loading && !loadingMore && activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                            <Loader2 className="relative h-8 w-8 animate-spin text-primary" />
                        </div>
                        <p className="text-muted-foreground">Loading activities...</p>
                    </div>
                ) : filteredActivities.length === 0 && !loading ? (
                    <Card className="border-dashed p-12 text-center bg-muted/10 backdrop-blur-sm">
                        <Activity className="h-10 w-10 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No activities found</h3>
                        <p className="text-muted-foreground">
                            {searchQuery || activityTypeFilter !== "all"
                                ? "Try adjusting your search or filters to find what you're looking for."
                                : "This creator hasn't performed any activities yet."}
                        </p>
                    </Card>
                ) : (
                    <>
                        <div className="grid gap-4">
                            {filteredActivities.map((activity) => (
                                <ActivityCard key={activity.id} activity={activity} />
                            ))}
                        </div>

                        {hasMore && (
                            <div className="flex justify-center pt-4">
                                <Button
                                    variant="outline"
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="bg-background/50 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                                >
                                    {loadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Load More"}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
