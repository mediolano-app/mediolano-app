import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Only enable in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Debug endpoint only available in development' }, { status: 403 })
  }

  const envCheck = {
    X_CLIENT_ID: process.env.X_CLIENT_ID ? `SET (length: ${process.env.X_CLIENT_ID.length})` : 'MISSING',
    X_API_KEY_SECRET: process.env.X_API_KEY_SECRET ? `SET (length: ${process.env.X_API_KEY_SECRET.length})` : 'MISSING',
    X_BEARER_TOKEN: process.env.X_BEARER_TOKEN ? `SET (length: ${process.env.X_BEARER_TOKEN.length})` : 'MISSING',
    NEXT_PUBLIC_X_REDIRECT_URI: process.env.NEXT_PUBLIC_X_REDIRECT_URI || 'MISSING',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? `SET (length: ${process.env.NEXTAUTH_SECRET.length})` : 'MISSING',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
  }

  // Test OAuth URL generation
  let testOAuthUrl = 'Error generating URL'
  try {
    const { TwitterOAuth } = await import('@/lib/twitter-api')
    const oauth = new TwitterOAuth()
    const { codeChallenge } = oauth.generatePKCE()
    testOAuthUrl = oauth.getAuthorizationUrl('test-state', codeChallenge)
  } catch (error) {
    testOAuthUrl = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
  }

  console.log('Environment variables check:', envCheck)
  console.log('Generated OAuth URL:', testOAuthUrl)

  return NextResponse.json({
    message: 'Environment variables check',
    variables: envCheck,
    testOAuthUrl,
    clientIdDetails: {
      value: process.env.X_CLIENT_ID?.substring(0, 8) + '...' || 'MISSING',
      type: typeof process.env.X_CLIENT_ID,
      isNumeric: process.env.X_CLIENT_ID ? /^\d+$/.test(process.env.X_CLIENT_ID) : false
    },
    note: 'Check your .env.local file and restart the dev server after changes'
  })
}