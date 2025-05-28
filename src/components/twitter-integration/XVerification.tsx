"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Twitter, CheckCircle, XCircle } from "lucide-react"
import { useTwitterIntegration } from "@/hooks/useTwitterIntegration"
import Image from "next/image"

export default function XVerificationComponent() {
  const {
    user,
    state,
    isLoadingPosts,
    error,
    connect,
    reset,
    verify
  } = useTwitterIntegration()

  const [username, setUsername] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const handleConnect = async () => {
    if (username.trim()) {
      await connect()
    }
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    try {
      await verify(username)
    } finally {
      setIsVerifying(false)
    }
  }

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">X (Twitter) Account Integration</h2>
        <p className="text-muted-foreground">
          Connect your X account to tokenize your posts and content as NFTs
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {state !== "connected" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Twitter className="h-5 w-5" />
              <span>Connect X Account</span>
            </CardTitle>
            <CardDescription>
              Enter your X username to begin the verification process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">X Username</Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    @
                  </span>
                  <Input
                    id="username"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-8"
                    disabled={isLoadingPosts}
                  />
                </div>
                <Button 
                  onClick={handleConnect}
                  disabled={!username.trim() || isLoadingPosts}
                >
                  {isLoadingPosts ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Twitter className="mr-2 h-4 w-4" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">How it works:</h4>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Enter your X username</li>
                <li>2. We&apos;ll fetch your public profile information</li>
                <li>3. Verify account ownership (optional)</li>
                <li>4. Start tokenizing your posts as NFTs</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Account Connected</span>
                </div>
                <Button variant="outline" size="sm" onClick={reset}>
                  Disconnect
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user && (
                <div className="flex items-start space-x-4">
                 {user.profile_image_url && (
                    <Image
                      src={user.profile_image_url.replace('_normal', '_400x400')}
                      alt={`${user.name} profile`}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-muted-foreground">@{user.username}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">
                          {formatFollowerCount(user.public_metrics.followers_count)}
                        </span>
                        <span className="text-sm text-muted-foreground">followers</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">
                          {formatFollowerCount(user.public_metrics.following_count)}
                        </span>
                        <span className="text-sm text-muted-foreground">following</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">
                          {formatFollowerCount(user.public_metrics.tweet_count)}
                        </span>
                        <span className="text-sm text-muted-foreground">posts</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {user.verified && (
                        <Badge variant="secondary">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Verification</CardTitle>
              <CardDescription>
                Verify account ownership to enable advanced features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Profile Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      Confirm this is your account by updating your profile
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {user?.verified ? (
                      <Badge variant="default">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={handleVerify}
                        disabled={isVerifying}
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    Account verification is optional but recommended for enhanced security 
                    and access to premium features.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}