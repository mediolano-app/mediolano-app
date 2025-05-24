'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { twitterService } from '@/services/twitterService';
import { useAuth } from '@/hooks/useAuth';
import buttonVariants from '@/components/ui/button';

export default function TwitterConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { updateUserProfile } = useAuth();

  // Handle the OAuth callback from Twitter
  useEffect(() => {
    const handleTwitterCallback = async () => {
      const code = searchParams.get('code');
      
      if (code) {
        setIsConnecting(true);
        setError(null);
        
        try {
          const tokenData = await twitterService.getAccessToken(code);
          
          // Store Twitter access token in user profile or state management
          updateUserProfile({
            twitterConnected: true,
            twitterAccessToken: tokenData.access_token,
            twitterUsername: tokenData.username
          });
          
          router.push('/twitter/posts');
        } catch (err) {
          setError('Failed to connect to Twitter. Please try again.');
          console.error(err);
        } finally {
          setIsConnecting(false);
        }
      }
    };
    
    handleTwitterCallback();
  }, [searchParams, router, updateUserProfile]);

  const handleConnectTwitter = () => {
    window.location.href = twitterService.getAuthUrl();
  };

  return (
    <div className="max-w-lg mx-auto p-5">
      <h2 className="text-2xl font-bold mb-2 text-[#1da1f2]">Connect to Twitter</h2>
      <p className="mb-6">Connect your Twitter account to create NFTs from your tweets.</p>
      
      {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}
      
      <Button 
        onClick={handleConnectTwitter} 
        disabled={isConnecting}
        className="w-full bg-[#1da1f2] text-white hover:bg-[#1a91da]"
      >
        {isConnecting ? 'Connecting...' : 'Connect Twitter Account'}
      </Button>
    </div>
  );
}