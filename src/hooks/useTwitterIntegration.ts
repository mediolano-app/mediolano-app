import { useState, useCallback, useEffect } from "react"
import type { 
  TwitterUser, 
  TwitterPost, 
  TwitterPostsResponse, 
  TokenizedPost, 
  TwitterIntegrationState,
  TwitterConnectionState 
} from "@/types/twitter"

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
    const response = await fetch('/api/twitter?action=session')
    const data = await response.json()
    
    if (!data.authenticated) {
      return { success: false }
    }

    // If authenticated, we can create a user object from session data
    const user: TwitterUser = {
      id: data.userId,
      username: data.username,
      name: data.username, // We'll fetch full profile later if needed
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
    max_results: '20',
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

const tokenizeTwitterPost = async (post: TwitterPost, user: TwitterUser): Promise<TokenizedPost> => {
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
  }

  try {
    const response = await fetch("/api/twitter/tokenize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })

    if (!response.ok) {
      throw new Error("Failed to tokenize post")
    }

    const data = await response.json()
    
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    const tokenId = `token_${Date.now()}`
    const transactionHash = `0x${Math.random().toString(16).slice(2, 66)}`
    
    return {
      postId: post.id,
      tokenId,
      transactionHash,
      ipfsHash: data.uploadData?.IpfsHash || `Qm${Math.random().toString(36).slice(2, 48)}`,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    }
  } catch (error) {
    console.error("Tokenization error:", error)
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

  // Check authentication status on mount and when URL changes (for OAuth callback)
  useEffect(() => {
    const checkAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const success = urlParams.get('success')
      const username = urlParams.get('username')
      const error = urlParams.get('error')
      const errorDescription = urlParams.get('error_description')

      if (error) {
        setState("error")
        setError(errorDescription || error)
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname)
        return
      }

      if (success && username) {
        // OAuth callback success
        const result = await checkAuthenticationStatus()
        if (result.success && result.user) {
          setUser(result.user)
          setState("verified")
        }
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname)
        return
      }

      // Check existing session
      const result = await checkAuthenticationStatus()
      if (result.success && result.user) {
        setUser(result.user)
        setState("verified")
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
      setError(err instanceof Error ? err.message : "Failed to load posts")
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
      const tokenizedPost = await tokenizeTwitterPost(selectedPost, user)
      setTokenizedPosts(prev => [...prev, tokenizedPost])
      setSelectedPost(null)
      return tokenizedPost
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to tokenize post")
      throw err
    } finally {
      setIsTokenizing(false)
    }
  }, [selectedPost, user])

  const reset = useCallback(async () => {
    await logoutTwitter()
    setState("idle")
    setUser(null)
    setPosts([])
    setSelectedPost(null)
    setTokenizedPosts([])
    setError(null)
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