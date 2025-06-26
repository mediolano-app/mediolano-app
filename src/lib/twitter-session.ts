import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key')

export interface TwitterSession {
  accessToken: string
  refreshToken?: string
  userId: string
  username: string
  expiresAt: number
  [key: string]: any // Add index signature for JWT compatibility
}

export class TwitterSessionManager {
  private static readonly COOKIE_NAME = 'twitter-session'
  private static readonly MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

  // Create session and return the token + response with cookie set
  static async createSessionWithResponse(sessionData: TwitterSession, response: NextResponse): Promise<string> {
    console.log('=== Creating Twitter Session ===')
    console.log('Session data:', { userId: sessionData.userId, username: sessionData.username })
    
    const token = await new SignJWT(sessionData as any)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    // Set cookie on the response object
    response.cookies.set(this.COOKIE_NAME, token, {
      httpOnly: false, // Allow access for debugging in development
      secure: false, // Don't require HTTPS in development
      sameSite: 'lax',
      maxAge: this.MAX_AGE,
      path: '/'
    })

    console.log('Session cookie set on response')
    return token
  }

  // Legacy method for compatibility (but we should avoid using this)
  static async createSession(sessionData: TwitterSession): Promise<string> {
    console.log('=== Creating Twitter Session (Legacy) ===')
    console.log('WARNING: Using legacy createSession method - cookies may not persist properly')
    
    const token = await new SignJWT(sessionData as any)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    try {
      const cookieStore = await cookies()
      cookieStore.set(this.COOKIE_NAME, token, {
        httpOnly: false, // Allow access for debugging in development
        secure: false, // Don't require HTTPS in development
        sameSite: 'lax',
        maxAge: this.MAX_AGE,
        path: '/'
      })
      console.log('Session cookie set via cookies() method')
    } catch (error) {
      console.error('Failed to set session cookie:', error)
    }

    return token
  }

  static async getSession(): Promise<TwitterSession | null> {
    try {
      console.log('=== Getting Twitter Session ===')
      const cookieStore = await cookies()
      const token = cookieStore.get(this.COOKIE_NAME)?.value

      console.log('Session token found:', token ? 'YES' : 'NO')
      console.log('Session token length:', token?.length || 0)

      if (!token) {
        console.log('No session token found')
        return null
      }

      const { payload } = await jwtVerify(token, JWT_SECRET)
      console.log('Session verified successfully:', { userId: payload.userId, username: payload.username })
      return payload as unknown as TwitterSession
    } catch (error) {
      console.error('Failed to verify session:', error)
      return null
    }
  }

  static async updateSession(sessionData: Partial<TwitterSession>): Promise<void> {
    const currentSession = await this.getSession()
    
    if (!currentSession) {
      throw new Error('No active session found')
    }

    const updatedSession = { ...currentSession, ...sessionData }
    await this.createSession(updatedSession)
  }

  static async destroySession(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(this.COOKIE_NAME)
  }

  static async refreshSessionIfNeeded(): Promise<TwitterSession | null> {
    const session = await this.getSession()
    
    if (!session) {
      console.log('No session found for refresh check')
      return null
    }

    console.log('=== Checking if session needs refresh ===')
    console.log('Current time:', Date.now())
    console.log('Session expires at:', session.expiresAt)
    console.log('Time until expiry (hours):', (session.expiresAt - Date.now()) / (1000 * 60 * 60))

    // Check if token expires in the next 1 hour (more conservative than 24 hours)
    const oneHourFromNow = Date.now() + (1 * 60 * 60 * 1000)
    
    if (session.expiresAt > oneHourFromNow) {
      console.log('Session is still valid, no refresh needed')
      return session
    }

    if (!session.refreshToken) {
      console.log('Session is expiring but no refresh token available')
      // Don't destroy session immediately, let it expire naturally
      return session
    }

    console.log('Session needs refresh, attempting to refresh...')
    
    try {
      const { TwitterOAuth } = await import('./twitter-api')
      const oauth = new TwitterOAuth()
      
      const tokenResponse = await oauth.refreshToken(session.refreshToken)
      
      const updatedSession: TwitterSession = {
        ...session,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token || session.refreshToken,
        expiresAt: Date.now() + (tokenResponse.expires_in * 1000)
      }

      await this.updateSession(updatedSession)
      console.log('Session refreshed successfully')
      return updatedSession
    } catch (error) {
      console.error('Failed to refresh token:', error)
      // Don't destroy session on refresh failure, just return existing session
      // Let the API call fail naturally and handle it there
      console.log('Returning existing session despite refresh failure')
      return session
    }
  }
}

// PKCE state management for OAuth flow
export class PKCEStateManager {
  private static readonly STATE_COOKIE = 'twitter-oauth-state'
  private static readonly VERIFIER_COOKIE = 'twitter-code-verifier'

  static async createOAuthState(state: string, codeVerifier: string): Promise<void> {
    console.log('=== Creating PKCE State ===')
    console.log('State:', state)
    console.log('Code verifier length:', codeVerifier.length)
    
    const cookieStore = await cookies()
    
    // Store state and code verifier for 10 minutes
    const maxAge = 10 * 60 // 10 minutes
    
    // More permissive cookie settings for development
    const cookieOptions = {
      httpOnly: false, // Allow access for debugging in development
      secure: false, // Don't require HTTPS in development
      sameSite: 'lax' as const,
      maxAge,
      path: '/'
    }

    console.log('Setting cookies with options:', cookieOptions)
    
    cookieStore.set(this.STATE_COOKIE, state, cookieOptions)
    cookieStore.set(this.VERIFIER_COOKIE, codeVerifier, cookieOptions)
    
    console.log('Cookies set successfully')
  }

  static async validateAndGetVerifier(state: string): Promise<string | null> {
    console.log('=== Validating PKCE State ===')
    console.log('Received state:', state)
    
    const cookieStore = await cookies()
    
    const storedState = cookieStore.get(this.STATE_COOKIE)?.value
    const codeVerifier = cookieStore.get(this.VERIFIER_COOKIE)?.value

    console.log('Stored state:', storedState)
    console.log('Code verifier found:', codeVerifier ? 'YES' : 'NO')
    console.log('Code verifier length:', codeVerifier?.length || 0)
    
    // Check all cookies for debugging
    const allCookies = cookieStore.getAll()
    console.log('All cookies:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })))

    // Clear cookies after reading
    try {
      cookieStore.delete(this.STATE_COOKIE)
      cookieStore.delete(this.VERIFIER_COOKIE)
      console.log('Cookies deleted')
    } catch (error) {
      console.error('Error deleting cookies:', error)
    }

    if (!storedState) {
      console.error('No stored state found - cookie may have expired or not been set')
      return null
    }

    if (!codeVerifier) {
      console.error('No code verifier found - cookie may have expired or not been set')
      return null
    }

    if (storedState !== state) {
      console.error('State mismatch:', { expected: state, received: storedState })
      return null
    }

    console.log('PKCE validation successful')
    return codeVerifier
  }
}