import crypto from 'crypto'

// Twitter OAuth 2.0 with PKCE utilities
export class TwitterOAuth {
  private clientId: string
  private clientSecret: string
  private redirectUri: string
  
  constructor() {
    this.clientId = process.env.X_CLIENT_ID!
    this.clientSecret = process.env.X_CLIENT_SECRET! // Fixed: Use OAuth 2.0 Client Secret
    this.redirectUri = process.env.NEXT_PUBLIC_X_REDIRECT_URI!
  }

  // Generate code verifier and challenge for PKCE
  generatePKCE() {
    const codeVerifier = crypto.randomBytes(32).toString('base64url')
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url')
    
    return { codeVerifier, codeChallenge }
  }

  // Generate authorization URL
  getAuthorizationUrl(state: string, codeChallenge: string) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'tweet.read users.read offline.access',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    })

    return `https://x.com/i/oauth2/authorize?${params.toString()}`
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string, codeVerifier: string) {
    // Add debugging for credentials
    console.log('=== Token Exchange Debug ===')
    console.log('Client ID length:', this.clientId.length)
    console.log('Client Secret length:', this.clientSecret.length)
    console.log('Client ID format:', /^[a-zA-Z0-9_-]+$/.test(this.clientId) ? 'Valid' : 'Invalid')
    console.log('Redirect URI:', this.redirectUri)
    
    // Check if we have proper OAuth 2.0 credentials
    if (this.clientId.length < 20 || /^\d+$/.test(this.clientId)) {
      throw new Error('Invalid OAuth 2.0 Client ID. You appear to be using OAuth 1.0a credentials. Please get OAuth 2.0 Client ID and Secret from X Developer Portal.')
    }

    if (!this.clientSecret || this.clientSecret.length < 40) {
      throw new Error('Invalid or missing OAuth 2.0 Client Secret. Please check X_CLIENT_SECRET environment variable.')
    }

    const authString = `${this.clientId}:${this.clientSecret}`
    const base64Auth = Buffer.from(authString).toString('base64')
    
    console.log('Auth string length:', authString.length)
    console.log('Base64 auth preview:', base64Auth.substring(0, 20) + '...')

    const requestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
      code_verifier: codeVerifier
    })

    console.log('Request body:', requestBody.toString())

    const response = await fetch('https://api.x.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${base64Auth}`
      },
      body: requestBody
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const error = await response.text()
      console.error('Token exchange error response:', error)
      throw new Error(`Token exchange failed: ${error}`)
    }

    const tokenData = await response.json()
    console.log('Token exchange successful:', Object.keys(tokenData))
    return tokenData
  }

  // Refresh access token
  async refreshToken(refreshToken: string) {
    const response = await fetch('https://api.x.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Token refresh failed: ${error}`)
    }

    return response.json()
  }
}

// Twitter API client
export class TwitterAPI {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  // Get user information
  async getUser(userId?: string) {
    const endpoint = userId 
      ? `https://api.x.com/2/users/${userId}`
      : 'https://api.x.com/2/users/me'
    
    const params = new URLSearchParams({
      'user.fields': 'id,username,name,profile_image_url,verified,public_metrics'
    })

    const response = await fetch(`${endpoint}?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to fetch user: ${error}`)
    }

    const data = await response.json()
    return data.data
  }

  // Get user tweets
  async getUserTweets(userId: string, options: {
    maxResults?: number
    paginationToken?: string
    excludeReplies?: boolean
    excludeRetweets?: boolean
  } = {}) {
    const params = new URLSearchParams({
      'tweet.fields': 'id,text,created_at,public_metrics,attachments,entities',
      'media.fields': 'type,url,preview_image_url,width,height',
      'expansions': 'attachments.media_keys',
      'max_results': (options.maxResults || 10).toString()
    })

    if (options.paginationToken) {
      params.append('pagination_token', options.paginationToken)
    }

    if (options.excludeReplies) {
      params.append('exclude', 'replies')
    }

    if (options.excludeRetweets) {
      params.append('exclude', 'retweets')
    }

    const response = await fetch(
      `https://api.x.com/2/users/${userId}/tweets?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to fetch tweets: ${error}`)
    }

    return response.json()
  }

  // Get tweet by ID (for verification)
  async getTweet(tweetId: string) {
    const params = new URLSearchParams({
      'tweet.fields': 'id,text,created_at,public_metrics,attachments,entities,author_id',
      'media.fields': 'type,url,preview_image_url,width,height',
      'expansions': 'attachments.media_keys'
    })

    const response = await fetch(
      `https://api.x.com/2/tweets/${tweetId}?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to fetch tweet: ${error}`)
    }

    return response.json()
  }
}

// Rate limiting utility
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()

  canMakeRequest(key: string, windowMs: number, maxRequests: number): boolean {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    
    // Remove requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs)
    
    if (validRequests.length >= maxRequests) {
      return false
    }

    // Add current request
    validRequests.push(now)
    this.requests.set(key, validRequests)
    
    return true
  }

  getRateLimitInfo(key: string, windowMs: number, maxRequests: number) {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    const validRequests = requests.filter(time => now - time < windowMs)
    
    const remaining = maxRequests - validRequests.length
    const resetTime = validRequests.length > 0 
      ? Math.max(...validRequests) + windowMs 
      : now

    return {
      remaining,
      resetTime,
      canMakeRequest: remaining > 0
    }
  }
}