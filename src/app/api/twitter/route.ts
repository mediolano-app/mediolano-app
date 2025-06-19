import { NextRequest, NextResponse } from "next/server"
import { TwitterOAuth, TwitterAPI, RateLimiter } from "@/lib/twitter-api"
import { TwitterSessionManager, PKCEStateManager } from "@/lib/twitter-session"
import crypto from 'crypto'

// Rate limiter for API requests
const rateLimiter = new RateLimiter()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    switch (action) {
      case 'auth-url':
        return handleAuthUrl()
      
      case 'user-posts':
        return await handleUserPosts(searchParams)
      
      case 'user-profile':
        return await handleUserProfile()
      
      case 'session':
        return await handleGetSession()
      
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

async function handleAuthUrl() {
  try {
    const oauth = new TwitterOAuth()
    const { codeVerifier, codeChallenge } = oauth.generatePKCE()
    const state = crypto.randomBytes(16).toString('hex')
    
    // Store PKCE parameters securely
    await PKCEStateManager.createOAuthState(state, codeVerifier)
    
    const authUrl = oauth.getAuthorizationUrl(state, codeChallenge)
    
    return NextResponse.json({ 
      authUrl,
      message: "Redirect user to this URL for authentication" 
    })
  } catch (error) {
    console.error("Auth URL generation error:", error)
    return NextResponse.json({ 
      error: "Failed to generate auth URL",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

async function handleUserProfile() {
  // Check session
  const session = await TwitterSessionManager.refreshSessionIfNeeded()
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const api = new TwitterAPI(session.accessToken)
    const user = await api.getUser()
    return NextResponse.json(user)
  } catch (error) {
    console.error("User profile fetch error:", error)
    
    if (error instanceof Error && error.message.includes('401')) {
      await TwitterSessionManager.destroySession()
      return NextResponse.json({ error: "Authentication expired" }, { status: 401 })
    }
    
    return NextResponse.json({ 
      error: "Failed to fetch user profile",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

async function handleUserPosts(searchParams: URLSearchParams) {
  // Check session
  const session = await TwitterSessionManager.refreshSessionIfNeeded()
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // Rate limiting - 75 requests per 15 minutes for user tweets endpoint
  const clientId = session.userId
  if (!rateLimiter.canMakeRequest(clientId, 15 * 60 * 1000, 1)) {
    const rateLimitInfo = rateLimiter.getRateLimitInfo(clientId, 15 * 60 * 1000, 75)
    return NextResponse.json({ 
      error: "Rate limit exceeded",
      resetTime: rateLimitInfo.resetTime
    }, { status: 429 })
  }

  try {
    const api = new TwitterAPI(session.accessToken)
    const maxResults = parseInt(searchParams.get('max_results') || '10')
    const paginationToken = searchParams.get('pagination_token') || undefined
    const excludeReplies = searchParams.get('exclude_replies') === 'true'
    const excludeRetweets = searchParams.get('exclude_retweets') === 'true'

    const response = await api.getUserTweets(session.userId, {
      maxResults: Math.min(maxResults, 100), // Twitter API limit
      paginationToken,
      excludeReplies,
      excludeRetweets
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("User posts fetch error:", error)
    
    // Handle specific Twitter API errors
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        // Token expired, destroy session
        await TwitterSessionManager.destroySession()
        return NextResponse.json({ error: "Authentication expired" }, { status: 401 })
      }
      
      if (error.message.includes('429')) {
        return NextResponse.json({ error: "Twitter API rate limit exceeded" }, { status: 429 })
      }
    }
    
    return NextResponse.json({ 
      error: "Failed to fetch posts",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

async function handleGetSession() {
  const session = await TwitterSessionManager.getSession()
  
  if (!session) {
    return NextResponse.json({ authenticated: false })
  }

  // Don't return sensitive data
  return NextResponse.json({ 
    authenticated: true,
    userId: session.userId,
    username: session.username,
    expiresAt: session.expiresAt
  })
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    switch (action) {
      case 'logout':
        return await handleLogout()
      
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.json({ 
      error: "Request processing failed",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

async function handleLogout() {
  await TwitterSessionManager.destroySession()
  return NextResponse.json({ success: true })
}