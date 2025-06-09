"use client"

import { useEffect, useState } from "react"
import { useTwitterIntegrationContext } from "./TwitterIntegrationProvider"
import type { TwitterPost } from "@/types/twitter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, MessageCircle, Repeat2, Share, Calendar, Hash, ExternalLink, Loader2, CheckCircle2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface TwitterPostBrowserProps {
  onPostSelected?: (post: TwitterPost) => void
  showTokenizeButton?: boolean
}

export default function TwitterPostBrowser({ 
  onPostSelected, 
  showTokenizeButton = true 
}: TwitterPostBrowserProps) {
  const { 
    state, 
    user, 
    posts, 
    selectedPost, 
    tokenizedPosts,
    isLoadingPosts, 
    isTokenizing,
    error,
    loadUserPosts,
    selectPost,
    tokenizeSelectedPost
  } = useTwitterIntegrationContext()
  
  console.log("TwitterPostBrowser - received state:", state, "user:", user?.username, "posts:", posts.length)
  
  const { toast } = useToast()
  const [hasLoadedPosts, setHasLoadedPosts] = useState(false)
  const [filter, setFilter] = useState<string>("all")

  // Load posts when user is verified and posts haven't been loaded yet
  useEffect(() => {
    if (state === "verified" && user && !hasLoadedPosts && posts.length === 0) {
      console.log("Auto-loading posts for verified user")
      loadUserPosts().then(() => {
        setHasLoadedPosts(true)
      })
    }
  }, [state, user, hasLoadedPosts, posts.length, loadUserPosts])

  const handleLoadPosts = async () => {
    console.log("Manually loading posts")
    try {
      await loadUserPosts()
      setHasLoadedPosts(true)
      toast({
        title: "Posts Loaded",
        description: "Your X posts have been loaded successfully.",
      })
    } catch (error) {
      console.error("Error loading posts:", error)
      toast({
        title: "Error Loading Posts",
        description: "There was an error loading your posts. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handlePostSelect = (post: TwitterPost) => {
    selectPost(post)
    onPostSelected?.(post)
  }

  const handleTokenizePost = async () => {
    if (!selectedPost) return

    try {
      const tokenizedPost = await tokenizeSelectedPost()
      toast({
        title: "Post Tokenized Successfully!",
        description: `Your post has been converted to an NFT. Transaction: ${tokenizedPost?.transactionHash.slice(0, 10)}...`,
      })
    } catch {
      toast({
        title: "Tokenization Failed",
        description: "There was an error tokenizing your post. Please try again.",
        variant: "destructive"
      })
    }
  }

  const isPostTokenized = (postId: string) => {
    return tokenizedPosts.some(tp => tp.postId === postId)
  }

  const formatMetrics = (metrics: TwitterPost['public_metrics']) => {
    return [
      { icon: Heart, count: metrics.like_count, label: "Likes" },
      { icon: Repeat2, count: metrics.retweet_count, label: "Retweets" },
      { icon: MessageCircle, count: metrics.reply_count, label: "Replies" },
      { icon: Share, count: metrics.quote_count, label: "Quotes" }
    ]
  }

  const filteredPosts = posts.filter(post => {
    if (filter === "all") return true
    if (filter === "media") return post.attachments?.media_keys && post.attachments.media_keys.length > 0
    if (filter === "popular") 
      return post.public_metrics.like_count > 100 || post.public_metrics.retweet_count > 50
    return true
  })

  if (state !== "verified") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Twitter Posts</CardTitle>
          <CardDescription>
            Connect and verify your X account to browse your posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <ExternalLink className="h-4 w-4" />
            <AlertDescription>
              Please complete X account verification first. Current state: {state}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Twitter Posts</CardTitle>
          <CardDescription>Error loading posts</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            onClick={handleLoadPosts} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your X Posts</h2>
          <p className="text-muted-foreground">
            Select a post to tokenize as an NFT
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <Image 
                src={user.profile_image_url} 
                alt={user.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="text-sm">
                <p className="font-medium">@{user.username}</p>
                <p className="text-muted-foreground">{user.public_metrics.tweet_count} posts</p>
              </div>
            </div>
          )}
          <Button 
            onClick={handleLoadPosts} 
            disabled={isLoadingPosts}
            variant="outline"
          >
            {isLoadingPosts ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : posts.length === 0 ? (
              "Load Posts"
            ) : (
              "Refresh Posts"
            )}
          </Button>
        </div>
      </div>

      {posts.length > 0 && (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All ({posts.length})
          </Button>
          <Button 
            size="sm" 
            variant={filter === "media" ? "default" : "outline"}
            onClick={() => setFilter("media")}
          >
            With Media
          </Button>
          <Button 
            size="sm" 
            variant={filter === "popular" ? "default" : "outline"}
            onClick={() => setFilter("popular")}
          >
            Popular
          </Button>
        </div>
      )}
      
      {isLoadingPosts ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              {!hasLoadedPosts ? "Click 'Load Posts' to fetch your X posts" : "No posts found"}
            </p>
            {!hasLoadedPosts && (
              <Button 
                onClick={handleLoadPosts} 
                variant="default"
              >
                Load Your Posts
              </Button>
            )}
          </CardContent>
        </Card>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No posts match the current filter</p>
            <Button 
              onClick={() => setFilter("all")} 
              className="mt-4"
              variant="outline"
            >
              Show All Posts
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => {
            const isSelected = selectedPost?.id === post.id
            const isTokenized = isPostTokenized(post.id)
            
            return (
              <Card 
                key={post.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? "ring-2 ring-primary" : ""
                } ${isTokenized ? "opacity-75" : ""}`}
                onClick={() => !isTokenized && handlePostSelect(post)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Post Content */}
                    <div className="space-y-2">
                      <p className="text-sm leading-relaxed">{post.text}</p>
                      
                      {/* Hashtags */}
                      {post.entities?.hashtags && post.entities.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.entities.hashtags.map((hashtag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Hash className="w-3 h-3 mr-1" />
                              {hashtag.tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Post Metrics */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        {formatMetrics(post.public_metrics).map(({ icon: Icon, count, label }) => (
                          <div key={label} className="flex items-center space-x-1">
                            <Icon className="w-4 h-4" />
                            <span>{count}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        {isSelected && (
                          <Badge variant="default">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Selected
                          </Badge>
                        )}
                        {isTokenized && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Tokenized
                          </Badge>
                        )}
                      </div>
                      
                      {isSelected && showTokenizeButton && !isTokenized && (
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTokenizePost()
                          }}
                          disabled={isTokenizing}
                          size="sm"
                        >
                          {isTokenizing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Tokenizing...
                            </>
                          ) : (
                            "Tokenize as NFT"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Selected Post Summary */}
      {selectedPost && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-lg">Selected Post</CardTitle>
            <CardDescription>
              This post will be tokenized as an NFT
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm">{selectedPost.text}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Post ID: {selectedPost.id}</span>
                <span>{formatDistanceToNow(new Date(selectedPost.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tokenized Posts Summary */}
      {tokenizedPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tokenized Posts</CardTitle>
            <CardDescription>
              Posts you&apos;ve successfully converted to NFTs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tokenizedPosts.map((tokenizedPost) => (
                <div 
                  key={tokenizedPost.postId}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Post {tokenizedPost.postId}</p>
                    <p className="text-xs text-muted-foreground">
                      Token ID: {tokenizedPost.tokenId}
                    </p>
                  </div>
                  <Badge variant={tokenizedPost.status === 'confirmed' ? 'default' : 'secondary'}>
                    {tokenizedPost.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}