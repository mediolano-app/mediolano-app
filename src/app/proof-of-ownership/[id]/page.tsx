"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Share2,
  Download,
  ExternalLink,
  Shield,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Hash,
  Globe,
  Award,
  Lock,
  Zap,
  Eye,
  Copy,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getAssetById } from "@/lib/mock-data"

interface ProofOfOwnershipPageProps {
  params: {
    id: string
  }
}

export default function ProofOfOwnershipPage({ params }: ProofOfOwnershipPageProps) {
  const { id } = params
  const [isSharing, setIsSharing] = useState(false)
  const [copied, setCopied] = useState(false)

  // Get asset from mock data
  const asset = getAssetById(id)

  if (!asset) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Asset Not Found</h1>
          <p className="text-muted-foreground">The asset you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Enhanced asset object with additional properties for proof of ownership
  const enhancedAsset = {
    ...asset,
    creator: {
      name: asset.creator,
      address: "0x1a2b3c4d5e6f7g8h9i0j",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: asset.verified || true,
    },
    owner: {
      name: "CollectorDAO",
      address: "0x9i8h7g6f5e4d3c2b1a",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      acquired: "February 10, 2025",
    },
    blockchain: "Ethereum",
    tokenStandard: "ERC-721",
    contract: "0x1234567890abcdef1234567890abcdef12345678",
    licenseInfo: {
      type: asset.licenseType,
      terms: "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
      allowCommercial: false,
      allowDerivatives: true,
      requireAttribution: true,
      royaltyPercentage: 5,
    },
  }

  const ownershipHistory = [
    {
      event: "Ownership Transfer",
      from: "0xArtist",
      to: "CollectorDAO",
      date: "February 10, 2025",
      transactionHash: "0xabcd1234...ef567890",
      memo: "Initial acquisition for collection",
      verified: true,
      type: "transfer",
    },
    {
      event: "Commercial License",
      from: "0xArtist",
      to: "MediaCompany",
      date: "January 15, 2025",
      transactionHash: "0x1234abcd...90ef5678",
      memo: "Commercial license for advertising campaign",
      verified: true,
      type: "license",
    },
  ]

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleShare = async () => {
    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Proof of Ownership - ${enhancedAsset.name}`,
          text: `Verify the ownership of "${enhancedAsset.name}" on the blockchain`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      console.error("Error sharing:", error)
    } finally {
      setIsSharing(false)
    }
  }

  const handleDownloadProof = () => {
    console.log("Downloading proof of ownership document...")
  }

  const handleViewOnBlockchain = () => {
    console.log("Opening blockchain explorer...")
  }

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Error copying address:", error)
    }
  }

  const getTypeColor = (type: string) => {
    const colors = {
      Art: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Audio: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Video: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Document: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      Patent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      Software: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
      NFT: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
     

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        
        <Card className="mb-6 overflow-hidden border-2 border-primary/20 shadow-xl">
          <div className="bg-gradient-to-r from-primary/8 via-primary/4 to-primary/8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Asset Preview - Compact */}
              <div className="lg:col-span-1">
                <div className="relative aspect-square max-w-[280px] mx-auto overflow-hidden rounded-xl bg-gradient-to-br from-muted/50 to-muted shadow-lg">
                  <Image
                    src={enhancedAsset.image || "/placeholder.svg"}
                    alt={enhancedAsset.name}
                    fill
                    className="object-cover"
                    sizes="280px"
                    priority
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={getTypeColor(enhancedAsset.type)} variant="secondary">
                      {enhancedAsset.type}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur text-xs">
                      #{enhancedAsset.id}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                    <h2 className="text-white font-bold text-lg mb-1 line-clamp-1">{enhancedAsset.name}</h2>
                    <p className="text-white/90 text-sm line-clamp-2">{enhancedAsset.description}</p>
                  </div>
                </div>
              </div>

              {/* Certificate Information - Expanded */}
              <div className="lg:col-span-2 space-y-4">
                {/* Certificate Title */}
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                    <div className="p-2 rounded-full bg-primary/15">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      Proof of Ownership
                    </h1>
                  </div>
                  <p className="text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                    Cryptographic proof of intellectual property ownership, verifiable on the blockchain
                  </p>
                </div>

                {/* Certificate Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/60 backdrop-blur">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Generated</p>
                      <p className="text-sm font-medium">{currentDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/60 backdrop-blur">
                    <Hash className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Asset ID</p>
                      <p className="text-sm font-medium">#{enhancedAsset.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    <CheckCircle className="h-4 w-4" />
                    <div>
                      <p className="text-xs opacity-80">Status</p>
                      <p className="text-sm font-medium">Verified</p>
                    </div>
                  </div>
                </div>

                {/* Quick Ownership Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Owner - Compact */}
                  <div className="p-3 border border-green-200 dark:border-green-800 rounded-lg bg-green-50/50 dark:bg-green-950/20">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">Current Owner</h3>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-green-200">
                        <AvatarImage
                          src={enhancedAsset.owner.avatar || "/placeholder.svg"}
                          alt={enhancedAsset.owner.name}
                        />
                        <AvatarFallback className="bg-green-100 text-green-800 text-xs">
                          {enhancedAsset.owner.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{enhancedAsset.owner.name}</p>
                        <div className="flex items-center gap-1">
                          <p className="text-xs text-muted-foreground font-mono truncate">
                            {enhancedAsset.owner.address.substring(0, 8)}...{enhancedAsset.owner.address.slice(-4)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleCopyAddress(enhancedAsset.owner.address)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Original Creator - Compact */}
                  <div className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Original Creator</h3>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-blue-200">
                        <AvatarImage
                          src={enhancedAsset.creator.avatar || "/placeholder.svg"}
                          alt={enhancedAsset.creator.name}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                          {enhancedAsset.creator.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{enhancedAsset.creator.name}</p>
                        <div className="flex items-center gap-1">
                          <p className="text-xs text-muted-foreground font-mono truncate">
                            {enhancedAsset.creator.address.substring(0, 8)}...{enhancedAsset.creator.address.slice(-4)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleCopyAddress(enhancedAsset.creator.address)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Asset Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-2 rounded-lg bg-background/40">
                    <p className="text-xs text-muted-foreground">Registration</p>
                    <p className="text-sm font-medium">{enhancedAsset.registrationDate}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-background/40">
                    <p className="text-xs text-muted-foreground">Value</p>
                    <p className="text-sm font-medium">{enhancedAsset.value}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-background/40">
                    <p className="text-xs text-muted-foreground">Protection</p>
                    <p className="text-sm font-medium text-green-600">{enhancedAsset.protectionLevel || 90}%</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-background/40">
                    <p className="text-xs text-muted-foreground">Network</p>
                    <p className="text-sm font-medium">{enhancedAsset.blockchain}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Sidebar - Blockchain & Quick Info */}
          <div className="xl:col-span-1 space-y-4">
            {/* Blockchain Verification - Compact */}
            <Card className="shadow-lg border-primary/20">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Blockchain Info
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Network</span>
                    <Badge variant="outline" className="text-xs">
                      {enhancedAsset.blockchain}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Standard</span>
                    <Badge variant="outline" className="text-xs">
                      {enhancedAsset.tokenStandard}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Contract</span>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="font-mono text-xs bg-muted p-1.5 rounded flex-1 truncate">
                        {enhancedAsset.contract.substring(0, 10)}...{enhancedAsset.contract.slice(-8)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleCopyAddress(enhancedAsset.contract)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 bg-transparent text-xs"
                    onClick={handleViewOnBlockchain}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Explorer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs bg-transparent"
                    onClick={handleDownloadProof}
                  >
                    <Download className="h-3 w-3 mr-2" />
                    Download Certificate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs bg-transparent"
                    onClick={handleShare}
                  >
                    <Share2 className="h-3 w-3 mr-2" />
                    Share Certificate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs bg-transparent"
                    onClick={handleViewOnBlockchain}
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Blockchain Verify
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Main Information */}
          <div className="xl:col-span-3 space-y-6">
            {/* License Information */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Lock className="h-6 w-6 text-primary" />
                  License & Usage Rights
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <h3 className="font-semibold mb-2">{enhancedAsset.licenseInfo.type}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{enhancedAsset.licenseInfo.terms}</p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Commercial Use</span>
                          <Badge variant={enhancedAsset.licenseInfo.allowCommercial ? "default" : "destructive"}>
                            {enhancedAsset.licenseInfo.allowCommercial ? "Allowed" : "Restricted"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Derivative Works</span>
                          <Badge variant={enhancedAsset.licenseInfo.allowDerivatives ? "default" : "destructive"}>
                            {enhancedAsset.licenseInfo.allowDerivatives ? "Allowed" : "Restricted"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Attribution</span>
                          <Badge variant={enhancedAsset.licenseInfo.requireAttribution ? "default" : "secondary"}>
                            {enhancedAsset.licenseInfo.requireAttribution ? "Required" : "Optional"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Royalty Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Royalty Rate</span>
                          <span className="font-bold text-lg text-primary">
                            {enhancedAsset.licenseInfo.royaltyPercentage}%
                          </span>
                        </div>
                        <Separator />
                        <p className="text-sm text-muted-foreground">
                          Commercial licensing requires a {enhancedAsset.licenseInfo.royaltyPercentage}% royalty payment
                          to the original creator for each use.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Ownership Provenance */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Ownership Provenance
                </h2>

                <div className="space-y-6">
                  {/* Provenance Timeline */}
                  <div className="relative">
                    {ownershipHistory.map((record, index) => (
                      <div key={index} className="relative flex items-start gap-4 pb-6">
                        {/* Timeline line */}
                        {index < ownershipHistory.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-primary to-primary/30" />
                        )}

                        {/* Event icon */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                          {record.type === "transfer" ? (
                            <User className="h-5 w-5 text-primary" />
                          ) : (
                            <FileText className="h-5 w-5 text-primary" />
                          )}
                        </div>

                        {/* Event content */}
                        <div className="flex-1 min-w-0">
                          <div className="bg-muted/30 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{record.event}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {record.date}
                                </Badge>
                                {record.verified && (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">From</p>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">{record.from.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{record.from}</span>
                                </div>
                              </div>

                              <div>
                                <p className="text-xs text-muted-foreground mb-1">To</p>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">{record.to.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{record.to}</span>
                                </div>
                              </div>
                            </div>

                            {record.transactionHash && (
                              <div className="text-xs text-muted-foreground mb-2">
                                <span>Transaction: </span>
                                <code className="bg-muted px-2 py-1 rounded font-mono">{record.transactionHash}</code>
                              </div>
                            )}

                            {record.memo && (
                              <div className="text-sm italic text-muted-foreground bg-muted/50 p-2 rounded">
                                "{record.memo}"
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Genesis Event */}
                    <div className="relative flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">Asset Created</h3>
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              <Award className="h-3 w-3 mr-1" />
                              Genesis
                            </Badge>
                          </div>

                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={enhancedAsset.creator.avatar || "/placeholder.svg"}
                                alt={enhancedAsset.creator.name}
                              />
                              <AvatarFallback>{enhancedAsset.creator.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{enhancedAsset.creator.name}</span>
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Original Creator
                              </Badge>
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            Created on {enhancedAsset.registrationDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Provenance Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{ownershipHistory.length}</p>
                      <p className="text-xs text-muted-foreground">Total Events</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {Math.floor(
                          (new Date().getTime() - new Date(enhancedAsset.registrationDate).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">Days Old</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">100%</p>
                      <p className="text-xs text-muted-foreground">Verified</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">1</p>
                      <p className="text-xs text-muted-foreground">Current Owner</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certificate Authenticity */}
            <Card className="shadow-lg border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Certificate Authenticity</h2>
                  </div>

                  <div className="max-w-2xl mx-auto">
                    <p className="text-muted-foreground mb-6">
                      This proof of ownership certificate is cryptographically signed and verifiable on the blockchain.
                      Anyone can verify the authenticity of this certificate using the asset ID and contract address.
                    </p>

                    <div className="p-4 bg-muted/30 rounded-lg mb-6">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-mono">
                          Certificate Hash: 0x{enhancedAsset.id}...{enhancedAsset.contract.slice(-8)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Button onClick={handleDownloadProof} size="lg" className="min-w-[200px]">
                        <Download className="mr-2 h-5 w-5" />
                        Download Official Certificate
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleViewOnBlockchain}
                        size="lg"
                        className="min-w-[200px] bg-transparent"
                      >
                        <ExternalLink className="mr-2 h-5 w-5" />
                        Verify on Blockchain
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
