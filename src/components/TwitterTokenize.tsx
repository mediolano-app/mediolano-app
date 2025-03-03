'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { twitterService } from '@/services/twitterService';
import { mintService } from '@/services/mintService';
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
  attachments?: {
    media_keys: string[];
  };
}

export default function TwitterTokenize() {
  const params = useParams();
  const tweetId = params.tweetId as string;
  
  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [loading, setLoading] = useState(true);
  const [mintLoading, setMintLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchTweetDetails = async () => {
      if (!userProfile?.twitterAccessToken) {
        setError('Twitter connection required');
        setLoading(false);
        return;
      }

      try {
        const tweetData = await twitterService.getTweetById(
          userProfile.twitterAccessToken,
          tweetId
        );
        setTweet(tweetData);
      } catch (err) {
        setError('Failed to load tweet details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTweetDetails();
  }, [tweetId, userProfile]);

  const handleMintNFT = async () => {
    if (!tweet) return;

    setMintLoading(true);
    setError(null);
    
    try {
      const metadata = {
        name: `Tweet by ${userProfile.twitterUsername}`,
        description: tweet.text,
        external_url: `https://twitter.com/${userProfile.twitterUsername}/status/${tweet.id}`,
        image: tweet.attachments?.media_keys?.[0] || '', // If tweet has an image
        attributes: [
          {
            trait_type: 'Date',
            value: new Date(tweet.created_at).toISOString()
          },
          {
            trait_type: 'Likes',
            value: tweet.public_metrics.like_count
          },
          {
            trait_type: 'Retweets',
            value: tweet.public_metrics.retweet_count
          },
          {
            trait_type: 'Source',
            value: 'Twitter'
          }
        ]
      };
      
      const result = await mintService.mintNFT(metadata);
      setTxHash(result.txHash);
      setMintSuccess(true);
    } catch (err) {
      setError('Failed to mint NFT. Please try again.');
      console.error(err);
    } finally {
      setMintLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">{error}</p>
        <Button onClick={() => router.push('/twitter/posts')}>
          Back to Tweets
        </Button>
      </div>
    );
  }

  if (mintSuccess) {
    return (
      <div className="text-center py-10 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">NFT Created Successfully!</h2>
        <p className="mb-6">Your tweet has been tokenized as an NFT.</p>
        
        {txHash && (
          <div className="my-6 p-4 bg-gray-50 rounded-lg break-all">
            <p className="mb-2">Transaction Hash:</p>
            <a 
              href={`https://etherscan.io/tx/${txHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#1da1f2] hover:underline"
            >
              {txHash}
            </a>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button onClick={() => router.push('/my-nfts')}>
            View My NFTs
          </Button>
          <Button onClick={() => router.push('/twitter/posts')}>
            Tokenize Another Tweet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-2 text-[#1da1f2]">Create NFT from Tweet</h2>
      <p className="mb-6">Review and confirm the tweet you want to tokenize</p>
      
      {tweet && (
        <div className="border border-gray-200 rounded-xl p-4 my-6 bg-white">
          <div className="flex justify-between mb-3">
            <p className="font-bold">@{userProfile.twitterUsername}</p>
            <p className="text-sm text-gray-500">{new Date(tweet.created_at).toLocaleDateString()}</p>
          </div>
          
          <div className="mb-4">
            <p className="leading-relaxed">{tweet.text}</p>
            
            {tweet.attachments?.media_keys && (
              <div className="mt-3">
                <img 
                  src={tweet.attachments.media_keys[0]} 
                  alt="Tweet media" 
                  className="rounded-lg max-w-full"
                />
              </div>
            )}
          </div>
          
          <div className="flex gap-4 text-sm text-gray-500">
            <span>{tweet.public_metrics.like_count} likes</span>
            <span>{tweet.public_metrics.retweet_count} retweets</span>
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <Button onClick={() => router.push('/twitter/posts')}>
          Back
        </Button>
        <Button 
          onClick={handleMintNFT} 
          disabled={mintLoading} 
          className={`bg-[#1da1f2] text-white hover:bg-[#1a91da] 
          ${mintLoading && 'bg-gray-300 cursor-not-allowed hover:bg-gray-300'}`}
        >
          {mintLoading ? 'Creating NFT...' : 'Create NFT'}
        </Button>
      </div>
    </div>
  );
}