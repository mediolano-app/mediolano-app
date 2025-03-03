import axios from 'axios';

interface TwitterTokenResponse {
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
  // Generate authorization URL for Twitter OAuth
  getAuthUrl: (): string => {
    const TWITTER_CLIENT_ID = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID;
    const TWITTER_REDIRECT_URI = process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI;
    
    const scope = encodeURIComponent('tweet.read users.read');
    return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(TWITTER_REDIRECT_URI as string)}&scope=${scope}&state=state&code_challenge=challenge&code_challenge_method=plain`;
  },

  // Exchange code for access token
  getAccessToken: async (code: string): Promise<TwitterTokenResponse> => {
    try {
      const response = await axios.post('/api/twitter/token', { code });
      return response.data;
    } catch (error) {
      console.error('Error getting Twitter access token:', error);
      throw error;
    }
  },

  // Get user's tweets
  getUserTweets: async (accessToken: string): Promise<Tweet[]> => {
    try {
      const response = await axios.get('/api/twitter/tweets', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user tweets:', error);
      throw error;
    }
  },

  // Get a single tweet by ID
  getTweetById: async (accessToken: string, tweetId: string): Promise<Tweet> => {
    try {
      const response = await axios.get(`/api/twitter/tweets/${tweetId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tweet details:', error);
      throw error;
    }
  }
};

export default twitterService;
