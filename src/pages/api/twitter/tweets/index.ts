import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Tweet } from '@/services/twitterService';

type ApiResponse = Tweet[] | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const accessToken = authHeader.split(' ')[1];
    
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
  } catch (error: any) {
    console.error('Twitter tweets error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
}
