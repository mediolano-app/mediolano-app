import { NextRequest, NextResponse } from "next/server"
import { TwitterOAuth, TwitterAPI } from "@/lib/twitter-api"

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
      
    }
    
    // Check all cookies for debugging
    const allCookies = Array.from(request.cookies.getAll())

    if (!originalState && !stateData) {
      console.error('No state found in either encoded parameter or cookies')
      throw new Error('Invalid state parameter or expired PKCE challenge')
    }

    if (!codeVerifier) {
      console.error('No code verifier found in either encoded parameter or cookies')
      throw new Error('Invalid state parameter or expired PKCE challenge')
    }

    if (!stateData) {
      // Only validate state match if we're using cookie fallback
      if (originalState !== state) {
        console.error('State mismatch (cookie fallback):', { expected: state, received: originalState })
        throw new Error('Invalid state parameter or expired PKCE challenge')
      }
    }


    // Exchange code for access token
    const oauth = new TwitterOAuth()
    const tokenResponse = await oauth.exchangeCodeForToken(code, codeVerifier)

    // Get user information
    const api = new TwitterAPI(tokenResponse.access_token)
    const user = await api.getUser()

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