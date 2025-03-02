const express = require('express');
const axios = require('axios');
const router = express.Router();

// Twitter API credentials
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
const TWITTER_REDIRECT_URI = process.env.TWITTER_REDIRECT_URI;

// Exchange code for access token
router.post('/token', async (req, res) => {
  try {
    const { code } = req.body;
    
    const tokenUrl = 'https://api.twitter.com/2/oauth2/token';
    const data = new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: TWITTER_CLIENT_ID,
      redirect_uri: TWITTER_REDIRECT_URI,
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
  } catch (error) {
    console.error('Twitter token error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to obtain access token' });
  }
});

// Get user tweets
router.get('/tweets', async (req, res) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    
    const response = await axios.get('https://api.twitter.com/2/users/me/tweets', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        'tweet.fields': 'created_at,public_metrics,attachments',
        'max_results': 20,
        'exclude': 'retweets,replies'
      }
    });
    
    res.json(response.data.data || []);
  } catch (error) {
    console.error('Twitter tweets error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
});

// Get tweet by ID
router.get('/tweets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const accessToken = req.headers.authorization.split(' ')[1];
    
    const response = await axios.get(`https://api.twitter.com/2/tweets/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        'tweet.fields': 'created_at,public_metrics,attachments',
        'expansions': 'attachments.media_keys',
        'media.fields': 'url,preview_image_url'
      }
    });
    
    const tweet = response.data.data;
    
    // Add media URLs to the tweet object if available
    if (tweet.attachments && response.data.includes?.media) {
      const mediaMap = {};
      response.data.includes.media.forEach(media => {
        mediaMap[media.media_key] = media.url || media.preview_image_url;
      });
      
      tweet.attachments.media_keys = tweet.attachments.media_keys.map(key => mediaMap[key] || key);
    }
    
    res.json(tweet);
  } catch (error) {
    console.error('Twitter tweet error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch tweet' });
  }
});

module.exports = router;
