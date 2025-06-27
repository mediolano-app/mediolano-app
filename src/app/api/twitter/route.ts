import { NextRequest, NextResponse } from "next/server"
import { TwitterOAuth, TwitterAPI, RateLimiter } from "@/lib/twitter-api"
import { TwitterSessionManager } from "@/lib/twitter-session"
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
      
      case 'create-session':
        return await handleCreateSession(request)
      
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
    console.log('=== Starting Auth URL Generation ===')
    
    const oauth = new TwitterOAuth()
    const { codeVerifier, codeChallenge } = oauth.generatePKCE()
    const state = crypto.randomBytes(16).toString('hex')
    
    console.log('Generated state:', state)
    console.log('Generated code verifier length:', codeVerifier.length)
    console.log('Generated code challenge:', codeChallenge)
    
    // Store PKCE data in a more reliable way - encode in the state parameter
    const stateData = {
      state: state,
      codeVerifier: codeVerifier,
      timestamp: Date.now()
    }
    
    // Base64 encode the state data to include in the OAuth state parameter
    const encodedState = Buffer.from(JSON.stringify(stateData)).toString('base64url')
    
    const authUrl = oauth.getAuthorizationUrl(encodedState, codeChallenge)
    console.log('Generated auth URL:', authUrl)
    
    // Still try to set cookies as backup, but don't rely on them
    const response = NextResponse.json({ 
      authUrl,
      message: "Redirect user to this URL for authentication",
      debug: {
        state: encodedState,
        codeVerifierLength: codeVerifier.length
      }
    })

    // Set cookies as backup (but we'll primarily use the encoded state)
    const maxAge = 10 * 60 // 10 minutes
    
    response.cookies.set('twitter-oauth-state', state, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge,
      path: '/'
    })

    response.cookies.set('twitter-code-verifier', codeVerifier, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge,
      path: '/'
    })
    
    return response
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

  // Rate limiting - Free plan: 1 request per 15 minutes for user tweets endpoint
  const clientId = session.userId
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 1 // Free plan limit
  
  if (!rateLimiter.canMakeRequest(clientId, windowMs, maxRequests)) {
    const rateLimitInfo = rateLimiter.getRateLimitInfo(clientId, windowMs, maxRequests)
    const resetTimeMinutes = Math.ceil((rateLimitInfo.resetTime - Date.now()) / (1000 * 60))
    
    console.log(`Rate limit exceeded for user ${clientId}. Reset in ${resetTimeMinutes} minutes.`)
    
    return NextResponse.json({ 
      error: "Twitter API rate limit exceeded",
      message: `Free plan allows 1 request per 15 minutes. Please wait ${resetTimeMinutes} minutes before trying again.`,
      resetTime: rateLimitInfo.resetTime,
      resetInMinutes: resetTimeMinutes
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

    console.log(`Twitter API request successful. Retrieved ${response.data?.length || 0} posts`)
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
        return NextResponse.json({ 
          error: "Twitter API rate limit exceeded",
          message: "Your Twitter API plan has reached its rate limit. Please wait before making another request.",
          details: "Free plan: 1 request per 15 minutes"
        }, { status: 429 })
      }
    }
    
    return NextResponse.json({ 
      error: "Failed to fetch posts",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

async function handleGetSession() {
  try {
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
  } catch (error) {
    console.error('Session endpoint error:', error)
    return NextResponse.json({ 
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function handleCreateSession(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionDataParam = searchParams.get('session_data')
    
    if (!sessionDataParam) {
      return NextResponse.json({ error: "Missing session data" }, { status: 400 })
    }

    // Decode the session data from the URL parameter
    const decodedSessionJson = Buffer.from(sessionDataParam, 'base64url').toString()
    const sessionData = JSON.parse(decodedSessionJson)

    // Create the session using the createSession method that works with cookies()
    const response = NextResponse.json({ 
      success: true,
      message: "Session created successfully",
      userId: sessionData.userId,
      username: sessionData.username
    })

    // Use the createSessionWithResponse method to properly set the session cookie
    await TwitterSessionManager.createSessionWithResponse(sessionData, response)
    
    return response
  } catch (error) {
    console.error('Create session error:', error)
    return NextResponse.json({ 
      error: "Failed to create session",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
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