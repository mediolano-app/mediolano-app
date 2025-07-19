"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Share2, Eye, ArrowRight, Shield, Sparkles } from "lucide-react"
import Link from "next/link"

interface AssetConfirmationProps {
  formState: any
  template: any
}

export function AssetConfirmation({ formState, template }: AssetConfirmationProps) {
  const assetId = "asset_" + Math.random().toString(36).substr(2, 9)
  const blockchainTxId = "0x" + Math.random().toString(36).substr(2, 40)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Programmable IP</h1>
            <p className="text-muted-foreground">
              Your {template.name.toLowerCase()} has been registered and protected on the blockchain
            </p>
          </div>
        </div>

        {/* Asset Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Asset Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Asset Preview */}
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                {formState.mediaPreviewUrl && formState.mediaPreviewUrl !== "/placeholder.svg?height=600&width=600" ? (
                  <img
                    src={formState.mediaPreviewUrl || "/placeholder.svg"}
                    alt="Asset"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <template.icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{formState.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{formState.description}</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">{template.name}</Badge>
                  {formState.tags?.slice(0, 2).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Asset Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Asset ID:</span>
                <p className="font-mono font-medium">{assetId}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Template:</span>
                <p className="font-medium">{template.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">License:</span>
                <p className="font-medium">
                  {formState.licenseType === "all-rights-reserved" && "All Rights Reserved"}
                  {formState.licenseType === "cc-by" && "CC BY"}
                  {formState.licenseType === "cc-by-sa" && "CC BY-SA"}
                  {formState.licenseType === "cc-by-nc" && "CC BY-NC"}
                  {formState.licenseType === "custom" && "Custom License"}
                  {!formState.licenseType && "All Rights Reserved"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Protection:</span>
                <p className="font-medium flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Blockchain Verified
                </p>
              </div>
            </div>

            <Separator />

            {/* Blockchain Info */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Blockchain Registration
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono text-xs">{blockchainTxId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network:</span>
                  <span className="font-medium">Starknet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default" className="bg-green-500 text-white">
                    Confirmed
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Eye className="h-4 w-4" />
            View Asset
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download Certificate
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Share2 className="h-4 w-4" />
            Share Asset
          </Button>
        </div>

        {/* Next Steps */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">What's Next?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Your asset is now protected</p>
                  <p className="text-sm text-muted-foreground">
                    Immutable proof of ownership has been recorded on the blockchain
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Share and distribute</p>
                  <p className="text-sm text-muted-foreground">
                    Your licensing terms are now enforceable and verifiable
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Monitor and manage</p>
                  <p className="text-sm text-muted-foreground">
                    Track usage and manage your intellectual property portfolio
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link href="/create">
            <Button variant="outline">Create Another Asset</Button>
          </Link>
          <Link href="/">
            <Button className="flex items-center gap-2">
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
