interface TwitterToken {
  access_token: string;
  username: string;
  expires_in: number;
}

interface TwitterPublicMetrics {
  like_count: number;
  retweet_count: number;
  reply_count: number;
  quote_count: number;
}

interface TwitterAttachments {
  media_keys?: string[];
}

export interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: TwitterPublicMetrics;
  attachments?: TwitterAttachments;
}

export const twitterService = {
  // Get Twitter OAuth authentication URL
  getAuthUrl(): string {
    const clientId = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI || '');
    const scopes = encodeURIComponent('tweet.read users.read');
    const state = Math.random().toString(36).substring(7);
    const codeChallenge = state; // In production, use a proper PKCE code challenge
    
    return `https://twitter.com/i/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}&response_type=code&code_challenge_method=plain&code_challenge=${codeChallenge}`;
  },

  // Exchange OAuth code for access token
  async getAccessToken(code: string): Promise<TwitterToken> {
    try {
      const response = await fetch('/api/twitter/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to get Twitter access token');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting Twitter access token:', error);
      throw error;
    }
  },

  // Get user's tweets
  async getUserTweets(accessToken: string): Promise<Tweet[]> {
    try {
      const response = await fetch('/api/twitter/tweets', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tweets');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tweets:', error);
      throw error;
    }
  },

  // Get a specific tweet by ID
  async getTweetById(accessToken: string, tweetId: string): Promise<Tweet> {
    try {
      const response = await fetch(`/api/twitter/tweet/${tweetId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tweet');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tweet:', error);
      throw error;
    }
  }
};

export default twitterService;
