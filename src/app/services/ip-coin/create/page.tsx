"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Info, Upload, Check, TrendingUp, Clock, X, FileText, ImageIcon, Film } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock data for content categories and tags
const contentCategories = [
  "Research",
  "Article",
  "Tutorial",
  "Analysis",
  "Guide",
  "Report",
  "Case Study",
  "Review",
  "Opinion",
  "Documentation",
]

const contentTags = [
  "blockchain",
  "web3",
  "defi",
  "nft",
  "dao",
  "tokenomics",
  "crypto",
  "ethereum",
  "bitcoin",
  "metaverse",
  "gaming",
  "finance",
  "technology",
  "investment",
  "trading",
  "development",
  "research",
  "analysis",
]

// Mock current user for preview
const currentUser = {
  username: "web3innovator",
  displayName: "Web3 Innovator",
  avatar: "/placeholder.svg?height=200&width=200",
}

export default function CreatePage() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("token")
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [initialSupply, setInitialSupply] = useState("1000000")
  const [description, setDescription] = useState("")
  const [contentTitle, setContentTitle] = useState("")
  const [contentBody, setContentBody] = useState("")
  const [contentType, setContentType] = useState("Article")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [liquidityPercentage, setLiquidityPercentage] = useState([50])
  const [enableLiquidity, setEnableLiquidity] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setUploadedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!tokenName || !tokenSymbol || !initialSupply || !description || !contentTitle || !contentBody) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Create token with mock data
    const tokenData = {
      tokenName: contentTitle || tokenName,
      tokenSymbol: tokenSymbol.toUpperCase(),
      initialSupply,
      description,
      contentTitle,
      contentBody,
      contentType,
      tags: selectedTags,
      liquidityPercentage: liquidityPercentage[0],
      enableLiquidity,
    }

    // Simulate token creation process
    setTimeout(() => {
      try {
        setIsSuccess(true)

        toast({
          title: "Token Created Successfully",
          description: "Your IP Coin has been created and is now available on the platform",
        })

        // Redirect after a short delay
        setTimeout(() => {
          router.push(`/services/ip-coin/dashboard`)
        }, 2000)
      } catch (error) {
        toast({
          title: "Error Creating Token",
          description: "There was an error creating your token. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }, 2000)
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tag])
      } else {
        toast({
          title: "Tag Limit Reached",
          description: "You can select up to 5 tags",
          variant: "destructive",
        })
      }
    }
  }

  // Format date for preview
  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-6 dark:bg-green-900/20">
          <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">IP Coin Created Successfully!</h1>
        <p className="text-muted-foreground mb-8">
          Your intellectual property has been tokenized and is now available on the platform.
        </p>
        <div className="flex flex-col gap-4">
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            onClick={() => router.push(`/services/ip-coin/dashboard`)}
          >
            View Your IP Coin
          </Button>
          <Button variant="outline" onClick={() => router.push("/services/ip-coin/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Your IP Coin</h1>
        <p className="text-muted-foreground mt-2">
          Tokenize your intellectual property and establish a market for your content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="token">Token Details</TabsTrigger>
              <TabsTrigger value="content">Content & Liquidity</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="token">
                <Card>
                  <CardHeader>
                    <CardTitle>Token Information</CardTitle>
                    <CardDescription>Define the basic properties of your IP Coin</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="token-name">Token Name</Label>
                      <Input
                        id="token-name"
                        placeholder="e.g., My Creative Content Token"
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="token-symbol">Token Symbol</Label>
                      <Input
                        id="token-symbol"
                        placeholder="e.g., MCT"
                        maxLength={5}
                        value={tokenSymbol}
                        onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                        required
                      />
                      <p className="text-xs text-muted-foreground">3-5 characters recommended for your token symbol</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="initial-supply">Initial Supply</Label>
                      <Input
                        id="initial-supply"
                        type="number"
                        placeholder="e.g., 1000000"
                        value={initialSupply}
                        onChange={(e) => setInitialSupply(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        The total number of tokens that will be created initially
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Token Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your token and its purpose..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={() => router.push("/services/ip-coin/dashboard")}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={() => setActiveTab("content")}>
                      Next: Content & Liquidity
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <CardTitle>Content & Liquidity</CardTitle>
                    <CardDescription>
                      Add your intellectual property content and configure liquidity settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Content Information</h3>

                      <div className="space-y-2">
                        <Label htmlFor="content-title">Content Title</Label>
                        <Input
                          id="content-title"
                          placeholder="e.g., My Research Paper"
                          value={contentTitle}
                          onChange={(e) => setContentTitle(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content-body">Content Body</Label>
                        <Textarea
                          id="content-body"
                          placeholder="Your intellectual property content..."
                          value={contentBody}
                          onChange={(e) => setContentBody(e.target.value)}
                          rows={6}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content-type">Content Type</Label>
                        <Select value={contentType} onValueChange={setContentType}>
                          <SelectTrigger id="content-type">
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                          <SelectContent>
                            {contentCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Tags (select up to 5)</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {contentTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant={selectedTags.includes(tag) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => toggleTag(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Media Files (Optional)</Label>
                          <p className="text-xs text-muted-foreground">{uploadedFiles.length} file(s) selected</p>
                        </div>

                        <div className="flex items-center gap-2 p-4 border rounded-md">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Upload Files</p>
                            <p className="text-xs text-muted-foreground">
                              Attach images, videos, or documents related to your content
                            </p>
                          </div>
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
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Browse
                          </Button>
                        </div>

                        {uploadedFiles.length > 0 && (
                          <div className="space-y-2 mt-2">
                            <p className="text-sm font-medium">Selected Files:</p>
                            <div className="max-h-40 overflow-y-auto space-y-2 p-2 border rounded-md">
                              {uploadedFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                                >
                                  <div className="flex items-center gap-2">
                                    {getFileIcon(file)}
                                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {(file.size / 1024).toFixed(1)} KB
                                    </span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => removeFile(index)}
                                  >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Remove</span>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Liquidity Settings</h3>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="enable-liquidity"
                              checked={enableLiquidity}
                              onCheckedChange={setEnableLiquidity}
                            />
                            <Label htmlFor="enable-liquidity">Enable Liquidity Pool</Label>
                          </div>
                        </div>

                        {enableLiquidity && (
                          <>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="liquidity-percentage">Initial Liquidity Percentage</Label>
                                <span className="text-sm font-medium">{liquidityPercentage[0]}%</span>
                              </div>
                              <Slider
                                id="liquidity-percentage"
                                min={10}
                                max={90}
                                step={5}
                                value={liquidityPercentage}
                                onValueChange={setLiquidityPercentage}
                              />
                              <p className="text-xs text-muted-foreground">
                                Percentage of tokens allocated to the initial liquidity pool
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="platform">Liquidity Platform</Label>
                              <Select defaultValue="ekubo">
                                <SelectTrigger id="platform">
                                  <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ekubo">Ekubo</SelectItem>
                                  <SelectItem value="jediswap">JediSwap</SelectItem>
                                  <SelectItem value="myswap">mySwap</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <Alert variant="default" className="bg-muted/50">
                              <Info className="h-4 w-4" />
                              <AlertTitle>About Liquidity Pools</AlertTitle>
                              <AlertDescription className="text-xs">
                                Liquidity pools enable trading of your IP Coin. They provide efficient trading with
                                lower fees and better price stability for your tokenized intellectual property.
                              </AlertDescription>
                            </Alert>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={() => setActiveTab("token")}>
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create IP Coin"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </form>
          </Tabs>
        </div>

        {/* Preview Column */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <h3 className="text-lg font-medium mb-4">IP Coin Preview</h3>
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="p-4 pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.displayName} />
                      <AvatarFallback>{currentUser.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{currentUser.displayName}</p>
                      <p className="text-xs text-muted-foreground">@{currentUser.username}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{tokenSymbol || "SYMBOL"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-xl mb-2">{contentTitle || tokenName || "Your IP Coin Title"}</CardTitle>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {description || "Your IP Coin description will appear here..."}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{contentType}</Badge>
                  {selectedTags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {selectedTags.length === 0 && (
                    <Badge variant="outline" className="opacity-50">
                      Add tags
                    </Badge>
                  )}
                </div>
                <div className="h-32 bg-muted rounded-md flex flex-col items-center justify-center mb-4">
                  {uploadedFiles.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">{uploadedFiles.length} file(s) attached</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Content Preview</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Initial Supply</p>
                    <p className="font-medium">{Number(initialSupply || 0).toLocaleString()} tokens</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="font-medium">{formatDate()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Initial Price</p>
                  <p className="font-medium">0.001 STRK</p>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">New</span>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                  disabled
                >
                  Preview
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Preview Notes</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• This is how your IP Coin will appear on the platform</li>
                <li>• Initial price is set to 0.001 STRK by default</li>
                <li>• You'll be the initial holder of 100% of the tokens</li>
                <li>• Market cap and volume data will appear after trading begins</li>
                {enableLiquidity && (
                  <li>• {liquidityPercentage[0]}% of tokens will be allocated to the initial liquidity pool</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
