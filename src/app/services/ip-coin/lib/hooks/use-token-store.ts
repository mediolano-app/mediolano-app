"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import mockData, { mockIpTokens, mockUserPortfolio } from "@/app/services/ip-coin/lib/mock-data"

interface TokenState {
  // User portfolio
  portfolio: typeof mockUserPortfolio

  // All available tokens
  tokens: typeof mockIpTokens

  // User actions
  buyToken: (tokenId: number, amount: number, ethAmount: string) => void
  sellToken: (tokenId: number, amount: number, ethAmount: string) => void
  createToken: (tokenData: any) => void
  likeToken: (tokenId: number) => void
  saveToken: (tokenId: number) => void
  shareToken: (tokenId: number) => void
  commentOnToken: (tokenId: number, comment: string) => void

  // Token data
  getToken: (tokenId: number) => any
  getTrendingTokens: (limit?: number) => any[]
  getRecentTokens: (limit?: number) => any[]
  getUserTokens: () => any[]

  // Search
  searchTokens: (query: string) => any[]
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set, get) => ({
      portfolio: mockUserPortfolio,
      tokens: mockIpTokens,

      buyToken: (tokenId, amount, ethAmount) => {
        const token = get().tokens.find((t) => t.id === tokenId)
        if (!token) return

        // Update portfolio
        set((state) => {
          const existingToken = state.portfolio.tokens.find((t) => t.id === tokenId)

          // Create new activity entry
          const newActivity = {
            id: Date.now(),
            type: "buy",
            token: token.symbol,
            amount: ethAmount,
            tokens: `${amount} ${token.symbol}`,
            time: "Just now",
          }

          if (existingToken) {
            // Update existing token
            return {
              portfolio: {
                ...state.portfolio,
                tokens: state.portfolio.tokens.map((t) =>
                  t.id === tokenId
                    ? { ...t, amount: t.amount + amount, value: `$${(t.amount + amount) * token.currentPrice * 1000}` }
                    : t,
                ),
                recentActivity: [newActivity, ...state.portfolio.recentActivity.slice(0, 9)],
              },
            }
          } else {
            // Add new token to portfolio
            const newToken = {
              id: token.id,
              name: token.title,
              symbol: token.symbol,
              amount: amount,
              value: `$${amount * token.currentPrice * 1000}`,
              price: `${token.currentPrice} ETH`,
              change: token.change,
              isPositive: token.isPositive,
            }

            return {
              portfolio: {
                ...state.portfolio,
                tokens: [...state.portfolio.tokens, newToken],
                recentActivity: [newActivity, ...state.portfolio.recentActivity.slice(0, 9)],
              },
            }
          }
        })

        // Update token data
        set((state) => ({
          tokens: state.tokens.map((t) =>
            t.id === tokenId
              ? {
                  ...t,
                  holders: t.holders + 1,
                  transactions: [
                    {
                      id: `tx-${Date.now()}`,
                      type: "buy",
                      user: "You",
                      amount: ethAmount,
                      tokens: `${amount} ${t.symbol}`,
                      tokenAmount: amount,
                      date: new Date(),
                      timeAgo: "Just now",
                      change: `+${amount}`,
                    },
                    ...t.transactions.slice(0, 19),
                  ],
                }
              : t,
          ),
        }))
      },

      sellToken: (tokenId, amount, ethAmount) => {
        const token = get().tokens.find((t) => t.id === tokenId)
        if (!token) return

        // Update portfolio
        set((state) => {
          const existingToken = state.portfolio.tokens.find((t) => t.id === tokenId)

          if (!existingToken || existingToken.amount < amount) return state

          // Create new activity entry
          const newActivity = {
            id: Date.now(),
            type: "sell",
            token: token.symbol,
            amount: ethAmount,
            tokens: `${amount} ${token.symbol}`,
            time: "Just now",
          }

          // If selling all tokens, remove from portfolio
          if (existingToken.amount === amount) {
            return {
              portfolio: {
                ...state.portfolio,
                tokens: state.portfolio.tokens.filter((t) => t.id !== tokenId),
                recentActivity: [newActivity, ...state.portfolio.recentActivity.slice(0, 9)],
              },
            }
          }

          // Otherwise update amount
          return {
            portfolio: {
              ...state.portfolio,
              tokens: state.portfolio.tokens.map((t) =>
                t.id === tokenId
                  ? { ...t, amount: t.amount - amount, value: `$${(t.amount - amount) * token.currentPrice * 1000}` }
                  : t,
              ),
              recentActivity: [newActivity, ...state.portfolio.recentActivity.slice(0, 9)],
            },
          }
        })

        // Update token data
        set((state) => ({
          tokens: state.tokens.map((t) =>
            t.id === tokenId
              ? {
                  ...t,
                  transactions: [
                    {
                      id: `tx-${Date.now()}`,
                      type: "sell",
                      user: "You",
                      amount: ethAmount,
                      tokens: `${amount} ${t.symbol}`,
                      tokenAmount: amount,
                      date: new Date(),
                      timeAgo: "Just now",
                      change: `-${amount}`,
                    },
                    ...t.transactions.slice(0, 19),
                  ],
                }
              : t,
          ),
        }))
      },

      createToken: (tokenData) => {
        const newId = Math.max(...get().tokens.map((t) => t.id)) + 1
        const newToken = {
          id: newId,
          title: tokenData.tokenName,
          slug: tokenData.tokenName.toLowerCase().replace(/\s+/g, "-"),
          creator: mockData.users[0], // Assuming first user is current user
          symbol: tokenData.tokenSymbol,
          initialPrice: 0.001,
          currentPrice: 0.001,
          marketCap: "$0",
          marketCapValue: 0,
          volume: "$0",
          volumeValue: 0,
          change: "0%",
          changeValue: 0,
          holders: 1,
          totalSupply: Number.parseInt(tokenData.initialSupply),
          createdAt: new Date(),
          category: tokenData.contentType || "Article",
          tags: ["new", "token"],
          description: tokenData.description,
          excerpt: tokenData.description.substring(0, 150) + "...",
          content: tokenData.contentBody || "Content to be added",
          priceHistory: [
            {
              date: new Date().toISOString().split("T")[0],
              price: 0.001,
              formattedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            },
          ],
          volumeHistory: [
            {
              date: new Date().toISOString().split("T")[0],
              volume: 0,
              formattedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            },
          ],
          transactions: [],
          holders: [
            {
              id: "holder-1",
              address: "You",
              amount: Number.parseInt(tokenData.initialSupply),
              percentage: "100.0",
              isCreator: true,
            },
          ],
          comments: [],
          likes: 0,
          saves: 0,
          shares: 0,
          isPositive: true,
        }

        set((state) => ({
          tokens: [newToken, ...state.tokens],
        }))

        return newId
      },

      likeToken: (tokenId) => {
        set((state) => ({
          tokens: state.tokens.map((t) => (t.id === tokenId ? { ...t, likes: t.likes + 1 } : t)),
        }))
      },

      saveToken: (tokenId) => {
        set((state) => ({
          tokens: state.tokens.map((t) => (t.id === tokenId ? { ...t, saves: t.saves + 1 } : t)),
        }))
      },

      shareToken: (tokenId) => {
        set((state) => ({
          tokens: state.tokens.map((t) => (t.id === tokenId ? { ...t, shares: t.shares + 1 } : t)),
        }))
      },

      commentOnToken: (tokenId, comment) => {
        set((state) => ({
          tokens: state.tokens.map((t) =>
            t.id === tokenId
              ? {
                  ...t,
                  comments: [
                    {
                      id: `comment-${Date.now()}`,
                      user: "you",
                      userName: "You",
                      content: comment,
                      date: new Date(),
                      timeAgo: "Just now",
                      likes: 0,
                    },
                    ...t.comments,
                  ],
                }
              : t,
          ),
        }))
      },

      getToken: (tokenId) => {
        return get().tokens.find((t) => t.id === tokenId)
      },

      getTrendingTokens: (limit = 3) => {
        return [...get().tokens].sort((a, b) => b.changeValue - a.changeValue).slice(0, limit)
      },

      getRecentTokens: (limit = 6) => {
        return [...get().tokens].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit)
      },

      getUserTokens: () => {
        // In a real app, this would filter by the current user
        // For mock data, we'll return the first 3 tokens
        return get().tokens.slice(0, 3)
      },

      searchTokens: (query) => {
        if (!query) return []

        return get().tokens.filter(
          (token) =>
            token.title.toLowerCase().includes(query.toLowerCase()) ||
            token.symbol.toLowerCase().includes(query.toLowerCase()) ||
            token.description.toLowerCase().includes(query.toLowerCase()) ||
            token.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
        )
      },
    }),
    {
      name: "ip-coin-storage",
    },
  ),
)
