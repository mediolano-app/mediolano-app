import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface TokenResponseSuccess {
  access_token: string;
  username: string;
  expires_in: number;
}

interface TokenResponseError {
  error: string;
}

type TokenResponse = TokenResponseSuccess | TokenResponseError;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TokenResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;
    
    const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
    const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
    const TWITTER_REDIRECT_URI = process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI;
    
    const tokenUrl = 'https://api.twitter.com/2/oauth2/token';
    const data = new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: TWITTER_CLIENT_ID as string,
      redirect_uri: TWITTER_REDIRECT_URI as string,
      code_verifier: 'challenge', // In production, use a proper PKCE code challenge
    });
    
    const authHeader = Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString('base64');
    
    const response = await axios.post(tokenUrl, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authHeader}`
      }
    });
    
    // Get user data to include username in response
    const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`
      }
    });
    
    res.json({
      access_token: response.data.access_token,
      username: userResponse.data.data.username,
      expires_in: response.data.expires_in
    });
  } catch (error: any) {
    console.error('Twitter token error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to obtain access token' });
  }
}
