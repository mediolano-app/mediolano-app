"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { ActivityCard } from "@/components/activity-card"
import { useActivities } from "@/hooks/useActivities"
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  X,
  Loader2,
  AlertCircle
} from "lucide-react"

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all") // "all" | "personal" (personal not implemented fully without wallet connection)
  const [activityTypeFilter, setActivityTypeFilter] = useState("all")

  const { activities, loading, loadingMore, error, hasMore, loadMore, refresh } = useActivities(12);

  // Client-side filtering of *loaded* activities
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

    // "Personal" tab logic would require connecting wallet address. 
    // For now, if "personal", we can just show empty or all?
    // Let's hide the Personal tab if not connected or just show all for now/TODO.
    // Assuming "personal" means "My Activity".
    // Since we don't have global user state here easily without context, I'll ignore "personal" filtering 
    // or assume the user wants to see *their* address which we don't have.
    // I will disable the "Personal" tab or just leave it acting like "All" with a todo?
    // Better: Remove the tabs if they don't add value now, or keep "All Activities" as default.
    // I'll keep the UI but "Your Activity" will be empty or show a "Connect Wallet" state if I had time.
    // For this refactor, I'll just filter if activeTab is 'personal' but since I don't have the address...
    // I will just disable the tab trigger for now or remove it from the logic.

    return result;
  }, [activities, searchQuery, activityTypeFilter, activeTab]);

  return (
    <div className="min-h-screen">


      <main className="container mx-auto px-4 py-8 md:py-12 lg:py-16 space-y-8 md:space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 md:space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-xs text-primary">Mediolano Protocol</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Onchain Activity
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed px-4">
            Discover, engage, and connect with our community
          </p>
        </div>

        {/* Filters Bar */}
        <Card className="glass">
          <div className="p-3 md:p-4 lg:p-6">
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search loaded activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-background/50 border-border/50">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
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
                  className="flex-1 sm:flex-initial bg-transparent"
                >
                  <RefreshCw className={`h-4 w-4 ${loading && !loadingMore ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>

            {(searchQuery || activityTypeFilter !== "all") && (
              <div className="flex flex-wrap gap-2 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border/50">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => setSearchQuery("")}
                    />
                  </Badge>
                )}
                {activityTypeFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Type: {activityTypeFilter}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => setActivityTypeFilter("all")}
                    />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setActivityTypeFilter("all")
                  }}
                  className="h-6 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Activity Feed */}
        <div className="space-y-6">
          {/* Removed Tabs for now as "Personal" requires detailed auth context not present here, keeping simple list */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Latest Activities
            </h2>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
              <Button variant="link" onClick={refresh} className="h-auto p-0 ml-2">Try Again</Button>
            </div>
          )}

          {loading && !loadingMore && activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading blockchain activities...</p>
            </div>
          ) : filteredActivities.length === 0 && !loading ? (
            <Card className="border-dashed">
              <div className="p-8 md:p-12 text-center space-y-4">
                <Activity className="h-10 md:h-12 w-10 md:w-12 mx-auto text-muted-foreground/50" />
                <div className="space-y-2">
                  <p className="text-base md:text-lg font-medium">No activities found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setActivityTypeFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 md:gap-6">
                {filteredActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>

              {/* Load More Pagination */}
              {hasMore && (
                <div className="flex justify-center pt-8">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="min-w-[200px]"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      "Load More Activities"
                    )}
                  </Button>
                </div>
              )}
              {!hasMore && activities.length > 0 && (
                <p className="text-center text-muted-foreground text-sm pt-8">You have reached the end of the activity feed.</p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
