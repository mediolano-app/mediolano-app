import axios from 'axios';

const TWITTER_API_BASE_URL = process.env.REACT_APP_TWITTER_API_BASE_URL;
const TWITTER_CLIENT_ID = process.env.REACT_APP_TWITTER_CLIENT_ID;
const TWITTER_REDIRECT_URI = process.env.REACT_APP_TWITTER_REDIRECT_URI;

export const twitterService = {
  // Generate authorization URL for Twitter OAuth
  getAuthUrl: () => {
    const scope = encodeURIComponent('tweet.read users.read');
    return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(TWITTER_REDIRECT_URI)}&scope=${scope}&state=state&code_challenge=challenge&code_challenge_method=plain`;
  },

  // Exchange code for access token
  getAccessToken: async (code) => {
    try {
      const response = await axios.post('/api/twitter/token', { code });
      return response.data;
    } catch (error) {
      console.error('Error getting Twitter access token:', error);
      throw error;
    }
  },

  // Get user's tweets
  getUserTweets: async (accessToken) => {
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
  getTweetById: async (accessToken, tweetId) => {
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
