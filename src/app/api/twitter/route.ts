import { NextRequest, NextResponse } from "next/server"

// Mock Twitter OAuth endpoints (in production, these would connect to actual Twitter API)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    switch (action) {
      case 'auth-url':
        // Generate OAuth URL for Twitter authentication
        const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.TWITTER_REDIRECT_URI || '')}&scope=tweet.read%20users.read&state=${Math.random().toString(36)}&code_challenge=${Math.random().toString(36)}&code_challenge_method=plain`
        
        return NextResponse.json({ 
          authUrl,
          message: "Redirect user to this URL for authentication" 
        })

      case 'user-posts':
        const userId = searchParams.get('userId')
        if (!userId) {
          return NextResponse.json({ error: "User ID required" }, { status: 400 })
        }

        // Mock response - in production, this would fetch from Twitter API
        const mockPosts = [
          {
            id: "1001",
            text: "Building the future with #Web3 and #NFTs! 🚀",
            author_id: userId,
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            public_metrics: {
              retweet_count: 25,
              like_count: 156,
              reply_count: 12,
              quote_count: 8
            },
            entities: {
              hashtags: [{ tag: "Web3" }, { tag: "NFTs" }]
            }
          },
          {
            id: "1002",
            text: "Just deployed my first smart contract on Starknet! The developer experience is amazing ⚡",
            author_id: userId,
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            public_metrics: {
              retweet_count: 18,
              like_count: 89,
              reply_count: 6,
              quote_count: 3
            }
          }
        ]

        return NextResponse.json({
          data: mockPosts,
          meta: {
            result_count: mockPosts.length,
            newest_id: mockPosts[0]?.id,
            oldest_id: mockPosts[mockPosts.length - 1]?.id
          }
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Twitter API error:", error)
    return NextResponse.json({ 
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { code, state } = await request.json()

    // Mock OAuth callback handling
    // In production, exchange code for access token
    const mockUser = {
      id: "123456789",
      username: "web3builder",
      name: "Web3 Builder",
      profile_image_url: "https://pbs.twimg.com/profile_images/example.jpg",
      verified: false,
      public_metrics: {
        followers_count: 2500,
        following_count: 1200,
        tweet_count: 4250
      }
    }

    return NextResponse.json({
      access_token: "mock_access_token_" + Date.now(),
      refresh_token: "mock_refresh_token_" + Date.now(),
      expires_in: 7200,
      user: mockUser
    })

  } catch (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.json({ 
      error: "OAuth authentication failed",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}