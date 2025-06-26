import { useState, useCallback, useEffect } from "react"
import type { 
  TwitterUser, 
  TwitterPost, 
  TwitterPostsResponse, 
  TokenizedPost, 
  TwitterIntegrationState,
  TwitterConnectionState 
} from "@/types/twitter"
import { useStarknetWallet } from "@/hooks/useStarknetWallet"
import { StarknetMintingService } from "@/lib/starknet-minting"

// Real API functions for Twitter integration
const connectTwitterAccount = async (): Promise<{ success: boolean; user?: TwitterUser; authUrl?: string }> => {
  try {
    // First, check if user is already authenticated
    const sessionResponse = await fetch('/api/twitter?action=session')
    const sessionData = await sessionResponse.json()
    
    if (sessionData.authenticated) {
      // User is already authenticated, fetch their profile
      const userResponse = await fetch('/api/twitter?action=user-profile')
      if (userResponse.ok) {
        const userData = await userResponse.json()
        return { success: true, user: userData }
      }
    }

    // Generate auth URL for new authentication
    const response = await fetch('/api/twitter?action=auth-url')
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate auth URL')
    }

    // Redirect to Twitter OAuth
    window.location.href = data.authUrl
    
    return { success: true, authUrl: data.authUrl }
  } catch (error) {
    console.error('Connection error:', error)
    return { 
      success: false, 
      user: undefined,
      authUrl: undefined
    }
  }
}

const checkAuthenticationStatus = async (): Promise<{ success: boolean; user?: TwitterUser }> => {
  try {
    console.log('=== checkAuthenticationStatus: Starting ===')
    const response = await fetch('/api/twitter?action=session')
    console.log('Session API response status:', response.status)
    console.log('Session API response ok:', response.ok)
    
    const data = await response.json()
    console.log('Session API response data:', data)
    
    if (!data.authenticated) {
      console.log('Session shows not authenticated')
      return { success: false }
    }

    console.log('Session shows authenticated, fetching user profile...')
    // If authenticated, fetch the complete user profile
    try {
      const userResponse = await fetch('/api/twitter?action=user-profile')
      console.log('User profile API response status:', userResponse.status)
      console.log('User profile API response ok:', userResponse.ok)
      
      if (userResponse.ok) {
        const userData = await userResponse.json()
        console.log('User profile data received:', userData)
        return { success: true, user: userData }
      } else {
        const errorText = await userResponse.text()
        console.error('User profile API error:', errorText)
      }
    } catch (profileError) {
      console.error('Failed to fetch user profile:', profileError)
    }

    // Fallback: create minimal user object from session data
    console.log('Using fallback user object from session data')
    const user: TwitterUser = {
      id: data.userId,
      username: data.username,
      name: data.username,
      profile_image_url: '',
      verified: false,
      public_metrics: {
        followers_count: 0,
        following_count: 0,
        tweet_count: 0
      }
    }

    return { success: true, user }
  } catch (error) {
    console.error('Authentication check error:', error)
    return { success: false }
  }
}

const fetchUserTwitterPosts = async (userId: string): Promise<TwitterPostsResponse> => {
    const params = new URLSearchParams({
    // MAX POSTS RESULTS FROM X API FETCH CALL
    max_results: '10',
    exclude_replies: 'true',
    exclude_retweets: 'false'
  })

  const response = await fetch(`/api/twitter?action=user-posts&${params.toString()}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch posts')
  }

  return response.json()
}

const logoutTwitter = async (): Promise<void> => {
  await fetch('/api/twitter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'logout' })
  })
}

const tokenizeTwitterPost = async (
  post: TwitterPost, 
  user: TwitterUser, 
  walletAddress: string, 
  contractAddress: string
): Promise<TokenizedPost> => {
  console.log("🚀 Starting Twitter post tokenization with real blockchain minting...")
  console.log("📋 TOKENIZATION DEBUG INFO:")
  console.log("  - Post ID:", post.id)
  console.log("  - Post text preview:", post.text.substring(0, 50) + "...")
  console.log("  - User:", user.username)
  console.log("  - Wallet Address:", walletAddress)
  console.log("  - Contract Address:", contractAddress)
  console.log("  - Contract Address Type:", typeof contractAddress)
  console.log("  - Contract Address Length:", contractAddress?.length || 0)
  console.log("  - Is Contract Address Valid:", contractAddress && contractAddress !== "0x0" && contractAddress.startsWith("0x"))
  
  // Log environment variables for debugging
  console.log("🌍 ENVIRONMENT VARIABLES DEBUG:")
  console.log("  - NEXT_PUBLIC_CONTRACT_ADDRESS_MIP:", process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP)
  console.log("  - NEXT_PUBLIC_MIP_CONTRACT_ADDRESS:", process.env.NEXT_PUBLIC_MIP_CONTRACT_ADDRESS)
  console.log("  - NEXT_PUBLIC_IPCOLLECTION_ADDRESS:", process.env.NEXT_PUBLIC_IPCOLLECTION_ADDRESS)
  
  const postData = {
    postId: post.id,
    text: post.text,
    author: user.name,
    authorUsername: user.username,
    createdAt: post.created_at,
    metrics: post.public_metrics,
    hashtags: post.entities?.hashtags?.map(h => h.tag) || [],
    mentions: post.entities?.mentions?.map(m => m.username) || [],
    urls: post.entities?.urls?.map(u => u.expanded_url) || [],
    mediaUrls: [],
    // Add wallet and contract info for real minting
    walletAddress,
    contractAddress
  }

  console.log("📤 POST DATA TO BE SENT:")
  console.log("  - Contract Address in payload:", postData.contractAddress)
  console.log("  - Wallet Address in payload:", postData.walletAddress)

  try {
    console.log("📤 Step 1: Uploading metadata to IPFS...")
    
    // Upload to IPFS via API
    const response = await fetch("/api/twitter/tokenize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })

    console.log("📡 API Response Status:", response.status)
    console.log("📡 API Response Headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorData = await response.json()
      console.error("❌ API Error Response:", errorData)
      throw new Error(errorData.message || "Failed to upload metadata to IPFS")
    }

    const data = await response.json()
    console.log("✅ IPFS upload completed:", data)

    if (!data.success || !data.ipfsData) {
      throw new Error("IPFS upload failed")
    }

    console.log("⛓️ Step 2: Minting NFT on Starknet blockchain...")
    
    // Note: Real minting will be handled by the frontend component
    // since we need access to the user's wallet account
    return {
      postId: post.id,
      tokenId: `pending_${Date.now()}`, // Will be updated after minting
      transactionHash: `pending_${Date.now()}`, // Will be updated after minting
      ipfsHash: data.ipfsData.hash,
      createdAt: new Date().toISOString(),
      status: 'pending', // Will be updated to confirmed after minting
      ipfsUrl: data.ipfsData.url,
      pinataUrl: data.ipfsData.pinataUrl,
      starknetUrl: undefined, // Will be set after minting
      // Add metadata for frontend minting
      _mintingData: {
        contractAddress,
        recipientAddress: walletAddress,
        metadata: data.metadata,
        ipfsHash: data.ipfsData.hash,
        ipfsUrl: data.ipfsData.url
      }
    }
  } catch (error) {
    console.error("❌ Tokenization error:", error)
    throw error
  }
}

// Export the hook interface for the context
export interface TwitterIntegrationContextType {
  state: TwitterConnectionState
  user: TwitterUser | null
  posts: TwitterPost[]
  selectedPost: TwitterPost | null
  tokenizedPosts: TokenizedPost[]
  isLoadingPosts: boolean
  isTokenizing: boolean
  error: string | null
  connect: () => Promise<void>
  verify: (username: string) => Promise<boolean>
  reset: () => void
  loadUserPosts: () => Promise<void>
  selectPost: (post: TwitterPost | null) => void
  tokenizeSelectedPost: () => Promise<TokenizedPost | undefined>
  getIntegrationState: () => TwitterIntegrationState
  setTokenizedPosts: React.Dispatch<React.SetStateAction<TokenizedPost[]>> // Add this line
}

export const useTwitterIntegration = () => {
  const [state, setState] = useState<TwitterConnectionState>("idle")
  const [user, setUser] = useState<TwitterUser | null>(null)
  const [posts, setPosts] = useState<TwitterPost[]>([])
  const [selectedPost, setSelectedPost] = useState<TwitterPost | null>(null)
  const [tokenizedPosts, setTokenizedPosts] = useState<TokenizedPost[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [isTokenizing, setIsTokenizing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get Starknet wallet info
  const { 
    account, 
    address: walletAddress, 
    isConnected: isWalletConnected,
    mipContract 
  } = useStarknetWallet()

  // Load tokenized posts from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedTokenizedPosts = localStorage.getItem('twitter-tokenized-posts')
        if (storedTokenizedPosts) {
          const parsedPosts = JSON.parse(storedTokenizedPosts) as TokenizedPost[]
          setTokenizedPosts(parsedPosts)
          console.log('Loaded tokenized posts from localStorage:', parsedPosts.length)
        }
      } catch (error) {
        console.error('Failed to load tokenized posts from localStorage:', error)
      }
    }
  }, [])

  // Save tokenized posts to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && tokenizedPosts.length > 0) {
      try {
        localStorage.setItem('twitter-tokenized-posts', JSON.stringify(tokenizedPosts))
        console.log('Saved tokenized posts to localStorage:', tokenizedPosts.length)
      } catch (error) {
        console.error('Failed to save tokenized posts to localStorage:', error)
      }
    }
  }, [tokenizedPosts])

  // Check authentication status on mount and when URL changes (for OAuth callback)
  useEffect(() => {
    const checkAuth = async () => {
      console.log('=== useTwitterIntegration: checkAuth started ===')
      console.log('Current URL:', window.location.href)
      console.log('Current state:', state)
      console.log('Current user:', user?.username || 'none')
      
      const urlParams = new URLSearchParams(window.location.search)
      const success = urlParams.get('success')
      const username = urlParams.get('username')
      const error = urlParams.get('error')
      const errorDescription = urlParams.get('error_description')

      console.log('URL parameters:', { success, username, error, errorDescription })

      if (error) {
        console.log('OAuth error detected, setting error state')
        setState("error")
        setError(errorDescription || error)
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname)
        return
      }

      if (success && username) {
        console.log('OAuth success detected, checking for session data...')
        // OAuth callback success
        setState("verifying")
        
        // Check if we have session data in the URL
        const sessionDataParam = urlParams.get('session_data')
        if (sessionDataParam) {
          console.log('Session data found in URL, creating session...')
          try {
            // Create session from the encoded data
            const createSessionResponse = await fetch(`/api/twitter?action=create-session&session_data=${encodeURIComponent(sessionDataParam)}`)
            const createSessionResult = await createSessionResponse.json()
            
            if (createSessionResponse.ok && createSessionResult.success) {
              console.log('Session created successfully via API')
              
              // Now check authentication status
              const result = await checkAuthenticationStatus()
              console.log('Authentication check result:', result)
              
              if (result.success && result.user) {
                console.log('Setting user and verified state:', result.user.username)
                setUser(result.user)
                setState("verified")
                console.log('State should now be verified')
              } else {
                console.log('Authentication check failed after session creation')
                setState("error")
                setError("Failed to verify authentication after session creation")
              }
            } else {
              console.error('Failed to create session:', createSessionResult)
              setState("error")
              setError("Failed to create session")
            }
          } catch (sessionError) {
            console.error('Error creating session:', sessionError)
            setState("error")
            setError("Failed to create session")
          }
        } else {
          console.log('No session data in URL, falling back to authentication check...')
          // Fallback to old method
          const result = await checkAuthenticationStatus()
          console.log('Authentication check result:', result)
          
          if (result.success && result.user) {
            console.log('Setting user and verified state:', result.user.username)
            setUser(result.user)
            setState("verified")
            console.log('State should now be verified')
          } else {
            console.log('Authentication check failed despite success parameter')
            setState("error")
            setError("Failed to verify authentication")
          }
        }
        
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname)
        return
      }

      // Check existing session
      console.log('Checking existing session...')
      const result = await checkAuthenticationStatus()
      console.log('Existing session check result:', result)
      
      if (result.success && result.user) {
        console.log('Found existing session, setting verified state:', result.user.username)
        setUser(result.user)
        setState("verified")
      } else {
        console.log('No existing session found, staying in idle state')
      }
    }

    checkAuth()
  }, [])

  const verify = useCallback(async (username: string) => {
    // This function is kept for compatibility but not used in OAuth flow
    setState("verifying")
    setError(null)
    try {
      setState("verified")
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setState("error")
      return false
    }
  }, [])

  const connect = useCallback(async () => {
    setState("connecting")
    setError(null)
    try {
      const result = await connectTwitterAccount()
      if (result.success) {
        if (result.user) {
          // User was already authenticated
          setUser(result.user)
          setState("verified")
        } else if (result.authUrl) {
          // User will be redirected to Twitter OAuth
          // State will be updated after redirect
        }
      } else {
        throw new Error("Failed to connect Twitter account")
      }
    } catch (err) {
      console.error("Connection error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setState("error")
      setUser(null)
    }
  }, [])

  const loadUserPosts = useCallback(async () => {
    if (!user) {
      setError("User not connected")
      return
    }

    setIsLoadingPosts(true)
    setError(null)
    try {
      const response = await fetchUserTwitterPosts(user.id)
      setPosts(response.data || [])
    } catch (err) {
      console.error("Failed to load posts:", err)
      
      // Handle rate limit errors specifically
      if (err instanceof Error && err.message.includes('429')) {
        setError("Twitter API rate limit exceeded. Basic plan allows 1 request per 15 minutes. Please wait before trying again.")
      } else {
        setError(err instanceof Error ? err.message : "Failed to load posts")
      }
    } finally {
      setIsLoadingPosts(false)
    }
  }, [user])

  const selectPost = useCallback((post: TwitterPost | null) => {
    setSelectedPost(post)
  }, [])

  const tokenizeSelectedPost = useCallback(async () => {
    if (!selectedPost || !user) {
      setError("No post selected or user not connected")
      return
    }

    setIsTokenizing(true)
    setError(null)
    try {
      // Ensure wallet is connected before tokenization
      if (!isWalletConnected) {
        setError("Please connect your Starknet wallet first")
        setIsTokenizing(false)
        return
      }

      // Perform tokenization with real minting
      const tokenizedPost = await tokenizeTwitterPost(selectedPost, user, walletAddress, mipContract?.address || "")
      setTokenizedPosts(prev => [...prev, tokenizedPost])
      setSelectedPost(null)
      return tokenizedPost
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to tokenize post")
      throw err
    } finally {
      setIsTokenizing(false)
    }
  }, [selectedPost, user, isWalletConnected, walletAddress, mipContract])

  const reset = useCallback(async () => {
    await logoutTwitter()
    setState("idle")
    setUser(null)
    setPosts([])
    setSelectedPost(null)
    setTokenizedPosts([])
    setError(null)
    
    // Clear tokenized posts from localStorage when disconnecting
    // if (typeof window !== 'undefined') {
    //   try {
    //     localStorage.removeItem('twitter-tokenized-posts')
    //     console.log('Cleared tokenized posts from localStorage')
    //   } catch (error) {
    //     console.error('Failed to clear tokenized posts from localStorage:', error)
    //   }
    // }
  }, [])

  const getIntegrationState = useCallback((): TwitterIntegrationState => ({
    isConnected: state === "verified",
    user,
    posts,
    selectedPost,
    isLoading: isLoadingPosts || isTokenizing,
    error,
    tokenizedPosts
  }), [state, user, posts, selectedPost, isLoadingPosts, isTokenizing, error, tokenizedPosts])

  return { 
    state, 
    user,
    posts,
    selectedPost,
    tokenizedPosts,
    setTokenizedPosts, // Add this line
    isLoadingPosts,
    isTokenizing,
    error, 
    connect, 
    verify, 
    reset,
    loadUserPosts,
    selectPost,
    tokenizeSelectedPost,
    getIntegrationState
  }
}
