"use client"

import { Suspense } from "react"
import { Twitter, Zap, Shield, Coins } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TwitterIntegrationMain from "@/components/twitter-integration/TwitterIntegrationMain"

export default function XIntegrationPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Twitter className="h-8 w-8 text-blue-500" />
          <h1 className="text-4xl font-bold">X Integration</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect your X account and transform your posts into valuable NFTs on the Starknet blockchain
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Secure Connection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect your X account securely using OAuth 2.0. Your credentials are never stored on our servers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Easy Tokenization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Select any of your posts and convert them to NFTs with just a few clicks. Preserve your digital content forever.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-blue-500" />
              <span>Monetize Content</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Turn your viral posts into tradeable assets. Set royalties and earn from secondary sales.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Privacy & Security:</strong> We only access your public posts and profile information. 
          Your account credentials are handled securely through X&#39;s official OAuth system.
        </AlertDescription>
      </Alert>

      {/* Main Integration Component */}
      <div className="flex justify-center">
        <Suspense fallback={
          <Card className="w-[350px]">
            <CardContent className="p-6 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        }>
          <TwitterIntegrationMain mode="full-integration" />
        </Suspense>
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Simple steps to get started with X integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-semibold">
                1
              </div>
              <h4 className="font-semibold">Connect Account</h4>
              <p className="text-sm text-muted-foreground">
                Link your X account securely through OAuth
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-semibold">
                2
              </div>
              <h4 className="font-semibold">Browse Posts</h4>
              <p className="text-sm text-muted-foreground">
                View your recent posts and select ones to tokenize
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-semibold">
                3
              </div>
              <h4 className="font-semibold">Tokenize Post</h4>
              <p className="text-sm text-muted-foreground">
                Convert your selected post into an NFT
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-semibold">
                4
              </div>
              <h4 className="font-semibold">Trade & Earn</h4>
              <p className="text-sm text-muted-foreground">
                List your NFT for sale or keep it in your collection
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}