"use client"

import { useEffect, useState } from "react"
import { useTwitterIntegrationContext } from "./TwitterIntegrationProvider"
import { useStarknetWallet } from "@/hooks/useStarknetWallet"
import { StarknetMintingService } from "@/lib/starknet-minting"
import type { TwitterPost, TokenizedPost } from "@/types/twitter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, MessageCircle, Repeat2, Share, Calendar, Hash, ExternalLink, Loader2, CheckCircle2, Wallet } from "lucide-react"
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
    tokenizeSelectedPost,
    setTokenizedPosts
  } = useTwitterIntegrationContext()

  // Get Starknet wallet info
  const { 
    account, 
    address: walletAddress, 
    isConnected: isWalletConnected,
    mipContract 
  } = useStarknetWallet()
  
  const { toast } = useToast()
  const [hasLoadedPosts, setHasLoadedPosts] = useState(false)
  const [filter, setFilter] = useState<string>("all")
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    isLimited: boolean
    resetTime?: number
    resetInMinutes?: number
    message?: string
  }>({ isLimited: false })
  const [pendingMints, setPendingMints] = useState<Set<string>>(new Set())

  // Load first batch of posts when user is verified
  useEffect(() => {
    if (state === "verified" && user && !hasLoadedPosts && posts.length === 0) {
      handleLoadPosts(true)
    }
  }, [state, user, hasLoadedPosts, posts.length])

  // Process pending mints and update their status
  useEffect(() => {
    const processPendingMints = async () => {
      if (!account || !mipContract || pendingMints.size === 0) return

      for (const postId of pendingMints) {
        const tokenizedPost = tokenizedPosts.find(tp => tp.postId === postId && tp.status === 'pending')
        
        if (tokenizedPost && tokenizedPost._mintingData) {
          try {
            // Perform real Starknet minting
            const mintResult = await StarknetMintingService.mintTwitterPostNFT({
              account,
              contractAddress: tokenizedPost._mintingData.contractAddress,
              recipientAddress: tokenizedPost._mintingData.recipientAddress,
              tokenMetadata: tokenizedPost._mintingData.metadata,
              ipfsHash: tokenizedPost._mintingData.ipfsHash,
              ipfsUrl: tokenizedPost._mintingData.ipfsUrl
            })

            if (mintResult.success) {
              // Update the tokenized post with real blockchain data
              const updatedPost: TokenizedPost = {
                ...tokenizedPost,
                tokenId: mintResult.tokenId || tokenizedPost.tokenId,
                transactionHash: mintResult.transactionHash || tokenizedPost.transactionHash,
                status: 'confirmed',
                starknetUrl: StarknetMintingService.getTransactionUrl(
                  mintResult.transactionHash || tokenizedPost.transactionHash,
                  'sepolia' // or 'mainnet' based on your network
                ),
                contractAddress: tokenizedPost._mintingData.contractAddress,
                network: 'sepolia', // or 'mainnet'
                // Remove minting data as it's no longer needed
                _mintingData: undefined
              }

              // Update the tokenizedPosts state in the Twitter integration context, parent context, and localStorage
              setTokenizedPosts(prev => {
                const updated = prev.map(tp => 
                  tp.postId === postId ? updatedPost : tp
                )
                
                // Also update localStorage
                localStorage.setItem('twitter-tokenized-posts', JSON.stringify(updated))
                
                return updated
              })
              
              // Remove from pending
              setPendingMints(prev => {
                const newSet = new Set(prev)
                newSet.delete(postId)
                return newSet
              })

              toast({
                title: "NFT Minted Successfully! 🎉",
                description: `Your post has been minted as NFT on Starknet. Token ID: ${updatedPost.tokenId}`,
              })
            } else {
              console.error(`❌ Failed to mint NFT for post ${postId}:`, mintResult.error)
              
              // Update status to failed
              setTokenizedPosts(prev => {
                const updated = prev.map(tp => 
                  tp.postId === postId ? { ...tp, status: 'failed' as const } : tp
                )
                localStorage.setItem('twitter-tokenized-posts', JSON.stringify(updated))
                return updated
              })
              
              setPendingMints(prev => {
                const newSet = new Set(prev)
                newSet.delete(postId)
                return newSet
              })

              toast({
                title: "Minting Failed ❌",
                description: `Failed to mint NFT: ${mintResult.error}`,
                variant: "destructive"
              })
            }
          } catch (error) {
            console.error(`❌ Error minting NFT for post ${postId}:`, error)
            
            setPendingMints(prev => {
              const newSet = new Set(prev)
              newSet.delete(postId)
              return newSet
            })

            toast({
              title: "Minting Error ❌",
              description: `Unexpected error during minting: ${error instanceof Error ? error.message : 'Unknown error'}`,
              variant: "destructive"
            })
          }
        }
      }
    }

    if (account && mipContract) {
      processPendingMints()
    }
  }, [account, mipContract, pendingMints, tokenizedPosts, toast, setTokenizedPosts]) // Add setTokenizedPosts to dependencies

  const handleLoadPosts = async (isInitialLoad = false) => {
    // Clear previous rate limit errors if this is a manual retry
    if (!isInitialLoad) {
      setRateLimitInfo({ isLimited: false })
    }
    
    try {
      await loadUserPosts()
      setHasLoadedPosts(true)
      setRateLimitInfo({ isLimited: false })
      
      if (!isInitialLoad) {
        toast({
          title: "Posts Loaded",
          description: "More posts have been loaded successfully.",
        })
      }
    } catch (error) {
      console.error("Error loading posts:", error)
      
      // Check if it's a rate limit error
      if (error instanceof Error && error.message.includes('429')) {
        // Try to extract rate limit info from the error message
        const resetTimeMatch = error.message.match(/wait (\d+) minutes/)
        const resetMinutes = resetTimeMatch ? parseInt(resetTimeMatch[1]) : 15
        
        setRateLimitInfo({
          isLimited: true,
          resetTime: Date.now() + (resetMinutes * 60 * 1000),
          resetInMinutes: resetMinutes,
          message: `Rate limit reached. You can load more posts in ${resetMinutes} minutes.`
        })
        
        if (!isInitialLoad) {
          toast({
            title: "Rate Limit Reached",
            description: `Please wait ${resetMinutes} minutes before loading more posts.`,
            variant: "destructive"
          })
        }
      } else {
        toast({
          title: "Error Loading Posts",
          description: "There was an error loading your posts. Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  const handlePostSelect = (post: TwitterPost) => {
    selectPost(post)
    onPostSelected?.(post)
  }

  const handleTokenizePost = async () => {
    if (!selectedPost) return

    // Check wallet connection first
    if (!isWalletConnected) {
      toast({
        title: "Wallet Required 🔗",
        description: "Please connect your Starknet wallet to tokenize posts as NFTs.",
        variant: "destructive"
      })
      return
    }

    if (!mipContract?.address) {
      toast({
        title: "Contract Not Available 📄",
        description: "MIP Collection contract is not configured. Please check your setup.",
        variant: "destructive"
      })
      return
    }

    try {
      const tokenizedPost = await tokenizeSelectedPost()
      
      if (tokenizedPost) {
        // Add to pending mints for real blockchain processing
        setPendingMints(prev => new Set([...prev, tokenizedPost.postId]))
        
        toast({
          title: "Post Queued for Minting! ⏳",
          description: "Your post metadata has been uploaded to IPFS. NFT minting is in progress...",
        })
      }
    } catch (error) {
      console.error("Tokenization error:", error)
      toast({
        title: "Tokenization Failed ❌",
        description: error instanceof Error ? error.message : "There was an error tokenizing your post. Please try again.",
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

  // Rate Limit Countdown Component
  function RateLimitCountdown({ resetTime }: { resetTime?: number }) {
    const [timeLeft, setTimeLeft] = useState<string>("")

    useEffect(() => {
      if (!resetTime) return

      const interval = setInterval(() => {
        const now = Date.now()
        const remaining = resetTime - now

        if (remaining <= 0) {
          setTimeLeft("Ready now!")
          clearInterval(interval)
        } else {
          const minutes = Math.floor(remaining / (1000 * 60))
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
          setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
        }
      }, 1000)

      return () => clearInterval(interval)
    }, [resetTime])

    if (!resetTime) return null

    return (
      <Badge variant="outline" className="font-mono">
        {timeLeft || "Calculating..."}
      </Badge>
    )
  }

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
            onClick={() => handleLoadPosts()} 
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
            onClick={() => handleLoadPosts()} 
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
                onClick={() => handleLoadPosts()} 
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

      {/* Rate Limit Info */}
      {rateLimitInfo.isLimited && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Rate Limit Reached</strong>
              <p className="text-sm mt-1">
                Free plan allows 1 request per 15 minutes. 
                {rateLimitInfo.resetInMinutes && ` Wait ${rateLimitInfo.resetInMinutes} minutes to load more posts.`}
              </p>
            </div>
            <RateLimitCountdown resetTime={rateLimitInfo.resetTime} />
          </AlertDescription>
        </Alert>
      )}

      {/* Load More Button */}
      {posts.length > 0 && !isLoadingPosts && !rateLimitInfo.isLimited && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Showing {posts.length} posts. Load more to see additional posts.
            </p>
            <Button 
              onClick={() => handleLoadPosts(false)} 
              variant="outline"
              className="w-full"
            >
              Load More Posts
              <span className="ml-2 text-xs text-muted-foreground">
                (Uses 1 API request)
              </span>
            </Button>
          </CardContent>
        </Card>
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
            <div className="space-y-4">
              {tokenizedPosts.map((tokenizedPost) => (
                <div 
                  key={tokenizedPost.postId}
                  className="p-4 rounded-lg bg-muted space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Post {tokenizedPost.postId}</p>
                      <p className="text-xs text-muted-foreground">
                        Token ID: {tokenizedPost.tokenId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        IPFS Hash: {tokenizedPost.ipfsHash}
                      </p>
                    </div>
                    <Badge variant={tokenizedPost.status === 'confirmed' ? 'default' : 'secondary'}>
                      {tokenizedPost.status}
                    </Badge>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {tokenizedPost.starknetUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(tokenizedPost.starknetUrl, '_blank')}
                        className="flex items-center space-x-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View on Starknet</span>
                      </Button>
                    )}
                    
                    {tokenizedPost.ipfsUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(tokenizedPost.ipfsUrl, '_blank')}
                        className="flex items-center space-x-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View on IPFS</span>
                      </Button>
                    )}
                    
                    {tokenizedPost.pinataUrl && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(tokenizedPost.pinataUrl, '_blank')}
                        className="flex items-center space-x-1 text-xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Pinata Dashboard</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}