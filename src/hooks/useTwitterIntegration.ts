import { useState, useCallback } from "react"
import type { 
  TwitterUser, 
  TwitterPost, 
  TwitterPostsResponse, 
  TokenizedPost, 
  TwitterIntegrationState,
  TwitterConnectionState 
} from "@/types/twitter"

// Mock API functions for Twitter integration
const connectTwitterAccount = async (): Promise<{ success: boolean; user: TwitterUser }> => {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  
  const mockUser: TwitterUser = {
    id: "123456789",
    username: "exampleUser",
    name: "Example User",
    profile_image_url: "https://pbs.twimg.com/profile_images/example.jpg",
    verified: false,
    public_metrics: {
      followers_count: 1250,
      following_count: 850,
      tweet_count: 3420
    }
  }
  
  return { success: true, user: mockUser }
}

const verifyTwitterIdentity = async (username: string) => {
  await new Promise((resolve) => setTimeout(resolve, username.length * 100))
  return { success: true, verified: true }
}

const fetchUserTwitterPosts = async (userId: string): Promise<TwitterPostsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  
  const mockPosts: TwitterPost[] = [
    {
      id: "1001",
      text: "Just launched my new NFT collection! 🚀 Check out these amazing digital artworks that represent the future of creativity. #NFT #DigitalArt #Blockchain",
      author_id: userId,
      created_at: "2024-01-15T10:30:00.000Z",
      public_metrics: {
        retweet_count: 15,
        like_count: 42,
        reply_count: 8,
        quote_count: 3
      },
      entities: {
        hashtags: [
          { tag: "NFT" },
          { tag: "DigitalArt" },
          { tag: "Blockchain" }
        ]
      }
    },
    {
      id: "1002", 
      text: "Working on some exciting new features for our DApp. The future of decentralized applications is here! 💻⚡",
      author_id: userId,
      created_at: "2024-01-14T15:45:00.000Z",
      public_metrics: {
        retweet_count: 8,
        like_count: 23,
        reply_count: 4,
        quote_count: 1
      }
    },
    {
      id: "1003",
      text: "Amazing sunset today! Sometimes you need to step away from the computer and appreciate nature 🌅 #sunset #nature #photography",
      author_id: userId,
      created_at: "2024-01-13T18:20:00.000Z", 
      public_metrics: {
        retweet_count: 3,
        like_count: 18,
        reply_count: 2,
        quote_count: 0
      },
      entities: {
        hashtags: [
          { tag: "sunset" },
          { tag: "nature" },
          { tag: "photography" }
        ]
      }
    },
    {
      id: "1004",
      text: "Thoughts on the latest developments in AI and machine learning. The intersection with blockchain technology is fascinating! 🤖🔗",
      author_id: userId,
      created_at: "2024-01-12T09:15:00.000Z",
      public_metrics: {
        retweet_count: 22,
        like_count: 67,
        reply_count: 12,
        quote_count: 5
      }
    },
    {
      id: "1005",
      text: "Coffee + Code = Productivity ☕️👨‍💻 What's your favorite coding fuel?",
      author_id: userId,
      created_at: "2024-01-11T08:00:00.000Z",
      public_metrics: {
        retweet_count: 5,
        like_count: 31,
        reply_count: 15,
        quote_count: 2
      }
    }
  ]

  return {
    data: mockPosts,
    meta: {
      result_count: mockPosts.length,
      newest_id: mockPosts[0]?.id,
      oldest_id: mockPosts[mockPosts.length - 1]?.id
    }
  }
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

  const verify = useCallback(async (username: string) => {
    setState("verifying")
    setError(null)
    try {
      const result = await verifyTwitterIdentity(username)
      if (result.success && result.verified) {
        setState("verified")
        return true
      } else {
        throw new Error("Failed to verify identity")
      }
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
        setUser(result.user)
        setState("connected")
        
        // Small delay to ensure state update
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Automatically verify the user
        setState("verifying")
        const verifyResult = await verifyTwitterIdentity(result.user.username)
        if (verifyResult.success && verifyResult.verified) {
          setState("verified")
        } else {
          throw new Error("Failed to verify identity")
        }
      } else {
        throw new Error("Failed to connect Twitter account")
      }
    } catch (err) {
      console.error("Connection/verification error:", err)
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
      setPosts(response.data)
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

  const reset = useCallback(() => {
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