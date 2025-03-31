'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { twitterService } from '@/services/twitterService';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/buttonx';
import Spinner from '@/components/ui/spinner';

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
  };
}

export default function TwitterPosts() {
  const [posts, setPosts] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Tweet | null>(null);
  const { userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchTweets = async () => {
      if (!userProfile?.twitterAccessToken) {
        setError('Twitter connection required');
        setLoading(false);
        return;
      }

      try {
        const tweetsData = await twitterService.getUserTweets(userProfile.twitterAccessToken);
        setPosts(tweetsData);
      } catch (err) {
        setError('Failed to load tweets. Please reconnect your Twitter account.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [userProfile]);

  const handleSelectPost = (post: Tweet) => {
    setSelectedPost(post);
  };

  const handleTokenize = () => {
    if (selectedPost) {
      router.push(`/tokenize/twitter/${selectedPost.id}`);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">{error}</p>
        <Button onClick={() => router.push('/twitter/connect')}>
          Connect Twitter
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-2 text-[#1da1f2]">Select a Tweet to Tokenize</h2>
      <p className="mb-6">Choose one of your tweets to create as an NFT</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        {posts.length === 0 ? (
          <p>No tweets found on your account.</p>
        ) : (
          posts.map(post => (
            <div 
              key={post.id} 
              className={`border rounded-xl p-4 cursor-pointer transition-all bg-white hover:shadow-md
                ${selectedPost?.id === post.id ? 'border-2 border-[#1da1f2] shadow-md shadow-[rgba(29,161,242,0.2)]' : 'border-gray-200'}`}
              onClick={() => handleSelectPost(post)}
            >
              <p className="text-xs text-gray-500 mb-2">{new Date(post.created_at).toLocaleDateString()}</p>
              <p className="mb-3 leading-relaxed">{post.text}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>{post.public_metrics.like_count} likes</span>
                <span>{post.public_metrics.retweet_count} retweets</span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="flex justify-between mt-6">
        <Button onClick={() => router.back()} className="hover:bg-gray-200">Back</Button>
        <Button 
          onClick={handleTokenize} 
          disabled={!selectedPost}
          className={`bg-[#1da1f2] text-white hover:bg-[#1a91da] 
          ${!selectedPost && 'bg-gray-300 cursor-not-allowed hover:bg-gray-300'}`}
        >
          Tokenize Selected Tweet
        </Button>
      </div>
    </div>
  );
}