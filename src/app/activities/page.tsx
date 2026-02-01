
"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ActivityCard } from "@/components/activity-card"
import { useActivities } from "@/hooks/useActivities"
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  X,
  Loader2,
  AlertCircle
} from "lucide-react"

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activityTypeFilter, setActivityTypeFilter] = useState("all")

  // Load more initially for grid
  const { activities, loading, loadingMore, error, hasMore, loadMore, refresh } = useActivities(12);

  const filteredActivities = useMemo(() => {
    let result = activities;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (activity) =>
          activity.assetName.toLowerCase().includes(lowerQuery) ||
          activity.user.toLowerCase().includes(lowerQuery) ||
          activity.details.toLowerCase().includes(lowerQuery)
      );
    }

    if (activityTypeFilter !== "all") {
      result = result.filter((activity) => activity.type === activityTypeFilter);
    }

    return result;
  }, [activities, searchQuery, activityTypeFilter]);

  const activityTypes = ["all", "mint", "transfer", "remix", "collection"];

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none fixed" />

      <main className="container relative mx-auto px-4 py-12 md:py-20 space-y-12 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between">
          <div className="space-y-4 max-w-2xl">
            <Badge variant="outline" className="rounded-full px-4 py-1.5 border-primary/20 bg-primary/5 text-primary">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed
              </span>
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
              Protocol Activity
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Explorer the pulse of the Mediolano ecosystem. Track live mints, collections, and asset transfers occurring on Starknet.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-background/50 backdrop-blur text-sm text-muted-foreground shadow-sm">
              <span className="font-semibold text-foreground">{activities.length}</span>
              <span>events loaded</span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={refresh}
              disabled={loading}
              className="rounded-full h-10 w-10 shrink-0 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading && !loadingMore ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Controls Section */}
        <div className="space-y-6 sticky top-20 z-30 bg-background/80 backdrop-blur-xl p-1 -m-1 rounded-2xl md:static md:bg-transparent md:p-0">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by asset, user, or details..."
                className="pl-10 h-11 bg-background border-border/60 focus:border-primary/30 hover:border-border transition-all shadow-sm rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-2 p-1 bg-muted/30 rounded-xl border border-border/40">
              {activityTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActivityTypeFilter(type)}
                  className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize
                      ${activityTypeFilter === type
                      ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"}
                    `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Feed */}
        <div className="min-h-[400px]">
          {error ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-destructive/10 text-destructive mb-2">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-destructive">Failed to load activity</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={refresh} variant="outline" className="mt-4">Retry Connection</Button>
            </div>
          ) : loading && !loadingMore && activities.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-[340px] rounded-xl bg-muted/20 animate-pulse" />
              ))}
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 border-2 border-dashed rounded-3xl border-muted">
              <div className="p-4 rounded-full bg-muted/30 text-muted-foreground">
                <Activity className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-medium">No results found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => { setSearchQuery(""); setActivityTypeFilter("all"); }}
                className="mt-2"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="animate-in fade-in zoom-in-95 duration-500 fill-mode-backwards">
                    <ActivityCard activity={activity} />
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center py-8">
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="min-w-[180px] rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Fetching more...
                      </>
                    ) : (
                      "View Older Activity"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
