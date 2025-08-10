"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  Share2,
  Eye,
  Download,
  Plus,
  Home,
  ExternalLink,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function AssetCreatedSuccessPage() {
  const [copied, setCopied] = useState(false)
  const [assetUrl, setAssetUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAssetUrl(`${window.location.origin}/assets/asset_123`)
    }
  }, [])

  const asset = {
    id: "asset_" + Math.random().toString(36).substr(2, 9),
    title: "My New Asset",
    description: "A creative intellectual property asset",
    type: "General Asset",
    createdAt: new Date().toLocaleDateString(),
    url: assetUrl,
    license: "CC BY-NC-SA 4.0",
    royalty: "5%",
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(asset.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=Check out my new IP asset: ${asset.title}&url=${asset.url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${asset.url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${asset.url}`,
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto p-4 py-12 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Asset Created Successfully!</h1>
          <p className="text-muted-foreground text-lg">
            Your intellectual property has been registered and is now discoverable.
          </p>
        </div>

        {/* Asset Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Asset Details</span>
              <Badge variant="secondary">#{asset.id}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg">{asset.title}</h3>
                <p className="text-muted-foreground">{asset.description}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <Badge variant="outline">{asset.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{asset.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span>License:</span>
                  <span>{asset.license}</span>
                </div>
               
              </div>
            </div>

            <Separator />

            {/* Asset URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Asset URL</label>
              <div className="flex gap-2">
                <div className="flex-1 p-2 bg-muted rounded text-sm font-mono break-all">{asset.url}</div>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* View Asset */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Eye className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2">View Asset</h3>
              <p className="text-sm text-muted-foreground mb-4">See how your asset appears to others</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/asset/${asset.id}`}>
                  View Details
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Share Asset */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Share2 className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold mb-2">Share Asset</h3>
              <p className="text-sm text-muted-foreground mb-4">Let others discover your work</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" asChild>
                  <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Download Certificate */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Download className="h-8 w-8 mx-auto mb-3 text-purple-500" />
              <h3 className="font-semibold mb-2">Proof of Ownership</h3>
              <p className="text-sm text-muted-foreground mb-4">SHow your IP registration certificate</p>
              <Button variant="outline" className="w-full">
                Open Certificate
                <Download className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="font-semibold">Manage Your Asset</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Monitor usage and analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Update licensing terms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Track royalty payments</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Grow Your Portfolio</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Create more assets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Build collections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Connect with other creators</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button asChild size="lg">
            <Link href="/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Another Asset
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
