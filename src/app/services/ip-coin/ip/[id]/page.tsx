"use client"

import Link from "next/link"
import type React from "react"
import { useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useTokenStore } from "@/app/services/ip-coin/lib/hooks/use-token-store"
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Clock,
  Users,
  DollarSign,
  Upload,
  X,
  FileText,
  ImageIcon,
  Film,
  PlusCircle,
  Download,
} from "lucide-react"
import { TokenChart } from "@/app/services/ip-coin/components/token-chart"
import { TokenTransactions } from "@/app/services/ip-coin/components/token-transactions"
import { TokenHolders } from "@/app/services/ip-coin/components/token-holders"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function IPPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const { getToken, buyToken, sellToken, likeToken, saveToken, shareToken, commentOnToken } = useTokenStore()

  const [buyAmount, setBuyAmount] = useState("0.001")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [activeMediaTab, setActiveMediaTab] = useState("content")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get token data
  const token = getToken(Number(id))

  // Handle if token not found
  if (!token) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Token Not Found</h1>
        <p className="text-muted-foreground mb-8">The IP Coin you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/explore")}>Explore IP Coins</Button>
      </div>
    )
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setUploadedFiles((prev) => [...prev, ...newFiles])
      toast({
        title: "Files Added",
        description: `${newFiles.length} file(s) added to this IP Coin`,
      })
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    toast({
      title: "File Removed",
      description: "The file has been removed from this IP Coin",
    })
  }

  const getFileIcon = (file: File) => {
    const fileType = file.type.split("/")[0]
    switch (fileType) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Film className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleBuy = () => {
    setIsSubmitting(true)

    // Simulate purchase with a delay
    setTimeout(() => {
      const tokenAmount = Math.floor(Number.parseFloat(buyAmount) / token.currentPrice)
      buyToken(token.id, tokenAmount, buyAmount)
      toast({
        title: "Purchase Successful",
        description: `You bought ${tokenAmount} ${token.symbol} tokens for ${buyAmount} STRK`,
      })
      setIsSubmitting(false)
    }, 1500)
  }

  const handleSell = () => {
    setIsSubmitting(true)

    // Simulate sale with a delay
    setTimeout(() => {
      const tokenAmount = Math.floor(Number.parseFloat(buyAmount) / token.currentPrice)
      sellToken(token.id, tokenAmount, buyAmount)
      toast({
        title: "Sale Successful",
        description: `You sold ${tokenAmount} ${token.symbol} tokens for ${buyAmount} STRK`,
      })
      setIsSubmitting(false)
    }, 1500)
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setIsSubmitting(true)

    // Simulate adding comment with a delay
    setTimeout(() => {
      commentOnToken(token.id, comment)
      setComment("")
      toast({
        title: "Comment Added",
        description: "Your comment has been posted successfully",
      })
      setIsSubmitting(false)
    }, 1000)
  }

  const handleLike = () => {
    likeToken(token.id)
    toast({
      title: "Content Liked",
      description: "You liked this content",
    })
  }

  const handleSave = () => {
    saveToken(token.id)
    toast({
      title: "Content Saved",
      description: "This content has been saved to your collection",
    })
  }

  const handleShare = () => {
    shareToken(token.id)

    // Copy URL to clipboard
    navigator.clipboard.writeText(window.location.href)

    toast({
      title: "Link Copied",
      description: "URL has been copied to clipboard",
    })
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={token.creator.avatar || "/placeholder.svg"} alt={token.creator.displayName} />
              <AvatarFallback>{token.creator.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{token.title}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>By {token.creator.displayName}</span>
                <span>•</span>
                <span>@{token.creator.username}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(token.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline">{token.category}</Badge>
            {token.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <Tabs value={activeMediaTab} onValueChange={setActiveMediaTab} className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="media">
                Media Files {uploadedFiles.length > 0 && `(${uploadedFiles.length})`}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <Card>
                <CardContent className="p-6">
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: token.content }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="media">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Media Files</h3>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          className="hidden"
                          multiple
                          accept="image/*,video/*,application/pdf,text/plain"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2"
                        >
                          <PlusCircle className="h-4 w-4" />
                          Add Files
                        </Button>
                      </div>
                    </div>

                    {uploadedFiles.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
                        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium mb-2">No media files yet</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload images, videos, or documents related to this IP Coin
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2"
                        >
                          <PlusCircle className="h-4 w-4" />
                          Add Files
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {uploadedFiles.map((file, index) => {
                          const isImage = file.type.startsWith("image/")
                          const fileUrl = isImage ? URL.createObjectURL(file) : null

                          return (
                            <div key={index} className="border rounded-lg overflow-hidden">
                              <div className="p-4 flex items-center justify-between bg-muted/30">
                                <div className="flex items-center gap-2">
                                  {getFileIcon(file)}
                                  <span className="font-medium truncate max-w-[150px]">{file.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-600"
                                    onClick={() => removeFile(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="p-4">
                                {isImage ? (
                                  <div className="aspect-video bg-muted rounded-md overflow-hidden">
                                    <img
                                      src={fileUrl || ""}
                                      alt={file.name}
                                      className="w-full h-full object-cover"
                                      onLoad={() => URL.revokeObjectURL(fileUrl!)}
                                    />
                                  </div>
                                ) : (
                                  <div className="aspect-video bg-muted rounded-md flex flex-col items-center justify-center">
                                    {getFileIcon(file)}
                                    <p className="text-sm mt-2">{file.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className="px-4 py-2 bg-muted/30 text-xs text-muted-foreground">
                                Added {new Date().toLocaleDateString()} • {(file.size / 1024).toFixed(1)} KB
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleLike}>
              <Heart className="h-4 w-4" />
              <span>Like ({token.likes})</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>Comment ({token.comments.length})</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              <span>Share ({token.shares})</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 ml-auto" onClick={handleSave}>
              <Bookmark className="h-4 w-4" />
              <span>Save ({token.saves})</span>
            </Button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Comments</h3>

            <form onSubmit={handleComment} className="flex gap-2 mb-6">
              <Input
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1"
                disabled={isSubmitting}
              />
              <Button type="submit" disabled={!comment.trim() || isSubmitting}>
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </form>

            <div className="space-y-4">
              {token.comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{comment.user.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{comment.userName}</span>
                    <span className="text-xs text-muted-foreground">@{comment.user}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{comment.timeAgo}</span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}

              {token.comments.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{token.symbol} Token</h3>
                <Badge variant={token.changeValue > 0 ? "success" : "destructive"}>{token.change}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-xl font-bold">{token.currentPrice} STRK</p>
                  <p className={`text-sm ${token.changeValue > 0 ? "text-green-500" : "text-red-500"}`}>
                    {token.change} from initial
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-xl font-bold">{token.marketCap}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">24h Volume</p>
                  <p className="text-lg font-medium">{token.volume}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Holders</p>
                  <p className="text-lg font-medium">{token.holders.length}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Buy Amount (STRK)</p>
                </div>
                <Input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  step="0.001"
                  min="0.001"
                  disabled={isSubmitting}
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setBuyAmount("0.001")}>
                    0.001
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setBuyAmount("0.01")}>
                    0.01
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setBuyAmount("0.1")}>
                    0.1
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                    onClick={handleBuy}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Buy Now"}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleSell} disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Sell"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <TokenChart priceHistory={token.priceHistory} volumeHistory={token.volumeHistory} symbol={token.symbol} />

          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="transactions">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="transactions">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger value="holders">
                    <Users className="h-4 w-4 mr-2" />
                    Holders
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="transactions" className="pt-4">
                  <TokenTransactions transactions={token.transactions} symbol={token.symbol} />
                </TabsContent>
                <TabsContent value="holders" className="pt-4">
                  <TokenHolders holders={token.holders} symbol={token.symbol} totalSupply={token.totalSupply} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">About the Creator</h3>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={token.creator.avatar || "/placeholder.svg"} alt={token.creator.displayName} />
                  <AvatarFallback>{token.creator.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{token.creator.displayName}</p>
                  <p className="text-sm text-muted-foreground">@{token.creator.username}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{token.creator.bio}</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/profile/${token.creator.username}`}>View Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
