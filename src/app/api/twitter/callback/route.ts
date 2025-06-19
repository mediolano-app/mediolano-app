import { NextRequest, NextResponse } from "next/server"
import { TwitterOAuth, TwitterAPI } from "@/lib/twitter-api"
import { TwitterSessionManager, PKCEStateManager } from "@/lib/twitter-session"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // Add debugging logs
  console.log('=== OAuth Callback Debug Info ===')
  console.log('Environment variables check:')
  console.log('X_CLIENT_ID:', process.env.X_CLIENT_ID ? 'SET' : 'MISSING')
  console.log('X_API_KEY_SECRET:', process.env.X_API_KEY_SECRET ? 'SET' : 'MISSING')
  console.log('NEXT_PUBLIC_X_REDIRECT_URI:', process.env.NEXT_PUBLIC_X_REDIRECT_URI)
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING')
  console.log('Callback parameters:')
  console.log('code:', code ? 'PRESENT' : 'MISSING')
  console.log('state:', state ? 'PRESENT' : 'MISSING')
  console.log('error:', error || 'NONE')

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
    console.log('Full URL:', request.url)
    console.log('All search params:', Array.from(searchParams.entries()))
    
    const redirectUrl = new URL('/x', request.url)
    redirectUrl.searchParams.set('error', 'invalid_request')
    redirectUrl.searchParams.set('error_description', 'Missing authorization code or state')
    
    return NextResponse.redirect(redirectUrl)
  }

  try {
    console.log('Validating PKCE state...')
    // Validate state and get code verifier
    const codeVerifier = await PKCEStateManager.validateAndGetVerifier(state)
    
    if (!codeVerifier) {
      console.error('Invalid state parameter or expired PKCE challenge')
      throw new Error('Invalid state parameter or expired PKCE challenge')
    }

    console.log('Exchanging code for token...')
    // Exchange code for access token
    const oauth = new TwitterOAuth()
    const tokenResponse = await oauth.exchangeCodeForToken(code, codeVerifier)
    console.log('Token exchange successful')

    console.log('Fetching user information...')
    // Get user information
    const api = new TwitterAPI(tokenResponse.access_token)
    const user = await api.getUser()
    console.log('User info retrieved:', user.username)

    console.log('Creating session...')
    // Create session
    await TwitterSessionManager.createSession({
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      userId: user.id,
      username: user.username,
      expiresAt: Date.now() + (tokenResponse.expires_in * 1000)
    })
    console.log('Session created successfully')

    // Redirect to success page
    const redirectUrl = new URL('/x', request.url)
    redirectUrl.searchParams.set('success', 'true')
    redirectUrl.searchParams.set('username', user.username)
    
    console.log('Redirecting to:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)

  } catch (error) {
    console.error('OAuth callback error:', error)
    console.error('Error details:', error instanceof Error ? error.stack : error)
    
    // Redirect to frontend with error
    const redirectUrl = new URL('/x', request.url)
    redirectUrl.searchParams.set('error', 'server_error')
    redirectUrl.searchParams.set('error_description', 
      error instanceof Error ? error.message : 'Failed to complete authentication'
    )
    
    return NextResponse.redirect(redirectUrl)
  }
}