import { NextRequest, NextResponse } from "next/server"
import { TwitterOAuth, TwitterAPI } from "@/lib/twitter-api"
import { TwitterSessionManager } from "@/lib/twitter-session"

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
    console.log('Redirecting to:', redirectUrl.toString())
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
    console.log('=== Validating PKCE State ===')
    console.log('Received encoded state:', state)
    
    // First, try to decode the state parameter to get PKCE data
    let stateData: any = null
    let codeVerifier: string | undefined = undefined
    let originalState: string | undefined = undefined
    
    try {
      // Decode the state parameter
      const decodedStateJson = Buffer.from(state, 'base64url').toString()
      stateData = JSON.parse(decodedStateJson)
      codeVerifier = stateData.codeVerifier
      originalState = stateData.state
      
      console.log('Successfully decoded state parameter')
      console.log('Original state:', originalState)
      console.log('Code verifier found in state:', codeVerifier ? 'YES' : 'NO')
      console.log('Code verifier length:', codeVerifier?.length || 0)
      console.log('Timestamp:', new Date(stateData.timestamp).toISOString())
      
      // Check if the state data is not too old (10 minutes max)
      const maxAge = 10 * 60 * 1000 // 10 minutes in ms
      if (Date.now() - stateData.timestamp > maxAge) {
        throw new Error('State data has expired')
      }
      
    } catch (decodeError) {
      console.error('Failed to decode state parameter:', decodeError)
      
      // Fallback to reading cookies (old method)
      console.log('Falling back to cookie-based PKCE validation...')
      const storedState = request.cookies.get('twitter-oauth-state')?.value
      codeVerifier = request.cookies.get('twitter-code-verifier')?.value
      originalState = storedState
      
      console.log('Fallback - Stored state from cookies:', storedState)
      console.log('Fallback - Code verifier from cookies:', codeVerifier ? 'YES' : 'NO')
    }
    
    // Check all cookies for debugging
    const allCookies = Array.from(request.cookies.getAll())
    console.log('All cookies:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })))

    if (!originalState && !stateData) {
      console.error('No state found in either encoded parameter or cookies')
      throw new Error('Invalid state parameter or expired PKCE challenge')
    }

    if (!codeVerifier) {
      console.error('No code verifier found in either encoded parameter or cookies')
      throw new Error('Invalid state parameter or expired PKCE challenge')
    }

    // If we decoded from state parameter, we don't need to validate state match
    // since the state parameter itself contains the verification data
    if (!stateData) {
      // Only validate state match if we're using cookie fallback
      if (originalState !== state) {
        console.error('State mismatch (cookie fallback):', { expected: state, received: originalState })
        throw new Error('Invalid state parameter or expired PKCE challenge')
      }
    }

    console.log('PKCE validation successful')

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
    // Store session data temporarily in a way that survives the redirect
    // We'll encode the session data in the redirect URL parameters
    const sessionData = {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      userId: user.id,
      username: user.username,
      expiresAt: Date.now() + (tokenResponse.expires_in * 1000)
    }
    
    // Encode session data for the redirect
    const encodedSessionData = Buffer.from(JSON.stringify(sessionData)).toString('base64url')
    
    // Create redirect response 
    const redirectUrl = new URL('/x', 'http://127.0.0.1:3000')
    redirectUrl.searchParams.set('success', 'true')
    redirectUrl.searchParams.set('username', user.username)
    redirectUrl.searchParams.set('session_data', encodedSessionData)
    
    const response = NextResponse.redirect(redirectUrl)
    
    // Clear PKCE cookies
    response.cookies.delete('twitter-oauth-state')
    response.cookies.delete('twitter-code-verifier')
    
    console.log('Redirecting to:', redirectUrl.toString())
    console.log('Session data encoded in URL parameters')
    return response

  } catch (error) {
    console.error('OAuth callback error:', error)
    console.error('Error details:', error instanceof Error ? error.stack : error)
    
    // Create redirect response and clear cookies on error
    const redirectUrl = new URL('/x', request.url)
    redirectUrl.searchParams.set('error', 'server_error')
    redirectUrl.searchParams.set('error_description', 
      error instanceof Error ? error.message : 'Failed to complete authentication'
    )
    
    const response = NextResponse.redirect(redirectUrl)
    
    // Clear PKCE cookies
    response.cookies.delete('twitter-oauth-state')
    response.cookies.delete('twitter-code-verifier')
    
    return response
  }
}