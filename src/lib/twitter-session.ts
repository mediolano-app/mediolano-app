import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

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

  static async createSession(sessionData: TwitterSession): Promise<string> {
    const token = await new SignJWT(sessionData as any)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    const cookieStore = await cookies()
    cookieStore.set(this.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: this.MAX_AGE,
      path: '/'
    })

    return token
  }

  static async getSession(): Promise<TwitterSession | null> {
    try {
      const cookieStore = await cookies()
      const token = cookieStore.get(this.COOKIE_NAME)?.value

      if (!token) {
        return null
      }

      const { payload } = await jwtVerify(token, JWT_SECRET)
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
      return null
    }

    // Check if token expires in the next 24 hours
    const oneDayFromNow = Date.now() + (24 * 60 * 60 * 1000)
    
    if (session.expiresAt < oneDayFromNow && session.refreshToken) {
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
        return updatedSession
      } catch (error) {
        console.error('Failed to refresh token:', error)
        await this.destroySession()
        return null
      }
    }

    return session
  }
}

// PKCE state management for OAuth flow
export class PKCEStateManager {
  private static readonly STATE_COOKIE = 'twitter-oauth-state'
  private static readonly VERIFIER_COOKIE = 'twitter-code-verifier'

  static async createOAuthState(state: string, codeVerifier: string): Promise<void> {
    const cookieStore = await cookies()
    
    // Store state and code verifier for 10 minutes
    const maxAge = 10 * 60 // 10 minutes
    
    cookieStore.set(this.STATE_COOKIE, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/'
    })

    cookieStore.set(this.VERIFIER_COOKIE, codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/'
    })
  }

  static async validateAndGetVerifier(state: string): Promise<string | null> {
    const cookieStore = await cookies()
    
    const storedState = cookieStore.get(this.STATE_COOKIE)?.value
    const codeVerifier = cookieStore.get(this.VERIFIER_COOKIE)?.value

    // Clear cookies
    cookieStore.delete(this.STATE_COOKIE)
    cookieStore.delete(this.VERIFIER_COOKIE)

    if (!storedState || !codeVerifier || storedState !== state) {
      return null
    }

    return codeVerifier
  }
}