import { NextRequest, NextResponse } from "next/server"
import { TwitterOAuth, TwitterAPI } from "@/lib/twitter-api"
import { TwitterSessionManager, PKCEStateManager } from "@/lib/twitter-session"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // Handle OAuth errors
  if (error) {
    const errorDescription = searchParams.get('error_description') || 'Unknown error'
    console.error('OAuth error:', error, errorDescription)
    
    // Redirect to frontend with error
    const redirectUrl = new URL('/x', request.url)
    redirectUrl.searchParams.set('error', error)
    redirectUrl.searchParams.set('error_description', errorDescription)
    
    return NextResponse.redirect(redirectUrl)
  }

  if (!code || !state) {
    console.error('Missing code or state parameter')
    
    const redirectUrl = new URL('/x', request.url)
    redirectUrl.searchParams.set('error', 'invalid_request')
    redirectUrl.searchParams.set('error_description', 'Missing authorization code or state')
    
    return NextResponse.redirect(redirectUrl)
  }

  try {
    // Validate state and get code verifier
    const codeVerifier = await PKCEStateManager.validateAndGetVerifier(state)
    
    if (!codeVerifier) {
      throw new Error('Invalid state parameter or expired PKCE challenge')
    }

    // Exchange code for access token
    const oauth = new TwitterOAuth()
    const tokenResponse = await oauth.exchangeCodeForToken(code, codeVerifier)

    // Get user information
    const api = new TwitterAPI(tokenResponse.access_token)
    const user = await api.getUser()

    // Create session
    await TwitterSessionManager.createSession({
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      userId: user.id,
      username: user.username,
      expiresAt: Date.now() + (tokenResponse.expires_in * 1000)
    })

    // Redirect to success page
    const redirectUrl = new URL('/x', request.url)
    redirectUrl.searchParams.set('success', 'true')
    redirectUrl.searchParams.set('username', user.username)
    
    return NextResponse.redirect(redirectUrl)

  } catch (error) {
    console.error('OAuth callback error:', error)
    
    // Redirect to frontend with error
    const redirectUrl = new URL('/x', request.url)
    redirectUrl.searchParams.set('error', 'server_error')
    redirectUrl.searchParams.set('error_description', 
      error instanceof Error ? error.message : 'Failed to complete authentication'
    )
    
    return NextResponse.redirect(redirectUrl)
  }
}