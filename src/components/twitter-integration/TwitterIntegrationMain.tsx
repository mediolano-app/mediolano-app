"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Loader2, 
  Twitter, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Zap,
  ArrowRight,
  RefreshCw
} from "lucide-react"
import { TwitterIntegrationProvider, useTwitterIntegrationContext } from "./TwitterIntegrationProvider"
import type { TokenizedPost } from "@/types/twitter"
import TwitterPostBrowser from "./TwitterPostBrowser"
import XVerificationComponent from "./XVerification"

interface TwitterIntegrationMainProps {
  mode?: "verification-only" | "full-integration"
  useXVerificationComponent?: boolean
}

function TwitterIntegrationContent({ 
  mode = "verification-only", 
  useXVerificationComponent = false 
}: TwitterIntegrationMainProps) {
  const {
    state,
    user,
    error,
    tokenizedPosts,
    connect,
    reset,
  } = useTwitterIntegrationContext()

  const [activeTab, setActiveTab] = useState("connect")
  
  // Effect to automatically switch to browse tab after verification
  useEffect(() => {
    console.log("Effect triggered - state:", state, "activeTab:", activeTab)
    if (state === "verified" && activeTab === "connect") {
      // Wait a moment before switching tabs for better UX
      const timer = setTimeout(() => {
        console.log("Switching to posts tab")
        setActiveTab("posts")
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [state, activeTab])

  // Effect to automatically switch to posts tab if user is already verified
  useEffect(() => {
    console.log("Full integration effect - mode:", mode, "state:", state, "activeTab:", activeTab)
    if (mode === "full-integration" && state === "verified" && activeTab === "connect") {
      console.log("Auto-switching to posts tab for full integration")
      setActiveTab("posts")
    }
  }, [mode, state, activeTab])

  const renderConnectionStatus = () => {
    switch (state) {
      case "idle":
        return (
          <div className="text-center space-y-4">
            <Twitter className="h-12 w-12 mx-auto text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold">Connect Your X Account</h3>
              <p className="text-muted-foreground">
                Securely link your X account to get started
              </p>
            </div>
            <Button onClick={connect} className="w-full">
              <Twitter className="mr-2 h-4 w-4" />
              Connect X Account
            </Button>
          </div>
        )

      case "connecting":
        return (
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 mx-auto text-blue-500 animate-spin" />
            <div>
              <h3 className="text-lg font-semibold">Connecting...</h3>
              <p className="text-muted-foreground">
                Please wait while we connect your X account
              </p>
            </div>
          </div>
        )

      case "connected":
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Connected Successfully</h3>
              <p className="text-muted-foreground">
                Your X account has been connected and is being verified...
              </p>
            </div>
          </div>
        )

      case "verifying":
        return (
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 mx-auto text-orange-500 animate-spin" />
            <div>
              <h3 className="text-lg font-semibold">Verifying Identity</h3>
              <p className="text-muted-foreground">
                Confirming your account details...
              </p>
            </div>
          </div>
        )

      case "verified":
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Verification Complete!</h3>
              <p className="text-muted-foreground">
                Your X account is now verified and ready to use
              </p>
            </div>
            {user && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                    <div className="flex space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {user.public_metrics.followers_count} followers
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {user.public_metrics.tweet_count} posts
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex space-x-2">
              <Button 
                onClick={reset} 
                variant="outline" 
                className="flex-1"
              >
                Disconnect Account
              </Button>
              {mode === "full-integration" && (
                <Button 
                  onClick={() => setActiveTab("posts")} 
                  className="flex-1"
                >
                  Browse Posts <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )

      case "error":
        return (
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-500" />
            <div>
              <h3 className="text-lg font-semibold">Connection Failed</h3>
              <p className="text-muted-foreground">
                There was an error connecting your account
              </p>
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>
            <Button onClick={connect} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        )

      default:
        return null
    }
  }
  
  // Helper component for rendering tokenized posts
  const TokenizedPostCard = ({ post }: { post: TokenizedPost }) => (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <CardTitle className="text-base flex items-center">
          <Zap className="mr-2 h-4 w-4" /> 
          Tokenized Post
        </CardTitle>
        <CardDescription className="text-white/80 text-xs">
          Transaction: {post.transactionHash.substring(0, 10)}...
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <Badge>Token #{post.tokenId}</Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <Alert variant="default" className="bg-muted/50">
          <AlertDescription className="text-xs font-mono break-all">
            IPFS: {post.ipfsHash}
          </AlertDescription>
        </Alert>
        <div className="text-right">
          <Badge 
            variant={post.status === 'confirmed' ? "default" : 
                   post.status === 'pending' ? "outline" : "destructive"}
            className="text-xs"
          >
            {post.status === 'confirmed' && <CheckCircle className="mr-1 h-3 w-3" />}
            {post.status === 'pending' && <RefreshCw className="mr-1 h-3 w-3 animate-spin" />}
            {post.status}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 p-3 flex justify-between">
        <Button variant="ghost" size="sm" className="text-xs">
          View on Starknet
        </Button>
        <Button variant="ghost" size="sm" className="text-xs">
          View on IPFS
        </Button>
      </CardFooter>
    </Card>
  )

  if (mode === "verification-only") {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Twitter className="h-5 w-5 text-blue-500" />
            <span>X Account Verification</span>
          </CardTitle>
          <CardDescription>
            Connect and verify your X account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {useXVerificationComponent ? <XVerificationComponent /> : renderConnectionStatus()}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Twitter className="h-6 w-6 text-blue-500" />
          <span>X Integration</span>
        </CardTitle>
        <CardDescription>
          Connect your X account and tokenize your posts as NFTs
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connect">
              Connect
              {state === "verified" && <CheckCircle className="ml-2 h-3 w-3 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="posts" disabled={state !== "verified"}>
              Browse Posts
            </TabsTrigger>
            <TabsTrigger value="tokenize" disabled={state !== "verified"}>
              Tokenized Posts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect" className="mt-6">
            {useXVerificationComponent ? <XVerificationComponent /> : renderConnectionStatus()}
          </TabsContent>
          
          <TabsContent value="posts" className="mt-6">
            {state === "verified" ? (
              <div className="space-y-4">
                <TwitterPostBrowser />
              </div>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please connect your X account first to browse posts. Current state: {state}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="tokenize" className="mt-6">
            {state === "verified" ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Your Tokenized Posts</h3>
                  <p className="text-sm text-muted-foreground">
                    View and manage your posts that have been tokenized as NFTs
                  </p>
                </div>
                
                {tokenizedPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tokenizedPosts.map((post, index) => (
                      <TokenizedPostCard key={index} post={post} />
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <AlertTitle>No tokenized posts yet</AlertTitle>
                    <AlertDescription>
                      Go to the Browse Posts tab, select a post, and click the &quot;Tokenize Post&quot; button to create your first NFT.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Card className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">What happens when you tokenize a post?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5">
                      <li>Your post content is stored permanently on IPFS</li>
                      <li>A unique NFT is minted on Starknet blockchain</li>
                      <li>You maintain ownership rights to your content</li>
                      <li>You can sell or license your tokenized content</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please connect your X account first to view tokenized posts. Current state: {state}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default function TwitterIntegrationMain(props: TwitterIntegrationMainProps) {
  return (
    <TwitterIntegrationProvider>
      <TwitterIntegrationContent {...props} />
    </TwitterIntegrationProvider>
  )
}