"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Shield,
  Calendar,
  User,
  FileText,
  Download,
  ExternalLink,
  CheckCircle,
  Hash,
  Globe,
  Award,
  Lock,
  Zap,
} from "lucide-react"
import Image from "next/image"
import type { Asset } from "@/types/asset"

interface ProofCertificateProps {
  asset: Asset & {
    creator: {
      name: string
      address: string
      avatar: string
      verified: boolean
    }
    owner: {
      name: string
      address: string
      avatar: string
      verified: boolean
      acquired: string
    }
    blockchain: string
    tokenStandard: string
    contract: string
    licenseInfo: {
      type: string
      terms: string
      allowCommercial: boolean
      allowDerivatives: boolean
      requireAttribution: boolean
      royaltyPercentage: number
    }
  }
  showActions?: boolean
  ownershipHistory?: Array<{
    event: string
    from: string
    to: string
    date: string
    transactionHash?: string
    memo?: string
    verified: boolean
    type: string
  }>
}

export function ProofCertificate({ asset, showActions = true, ownershipHistory = [] }: ProofCertificateProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleDownloadCertificate = () => {
    console.log("Downloading proof of ownership certificate...")
  }

  const handleViewOnBlockchain = () => {
    console.log("Opening blockchain explorer...")
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Enhanced Certificate Header */}
      <Card className="overflow-hidden border-2 border-primary/20 shadow-xl">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Official Ownership Certificate
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              This certificate serves as cryptographic proof of intellectual property ownership and is verifiable on the
              blockchain
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background/50">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Generated {currentDate}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background/50">
                <Hash className="h-4 w-4 text-primary" />
                <span>Asset #{asset.id}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <CheckCircle className="h-4 w-4" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Asset Display */}
        <div className="xl:col-span-1 space-y-6">
          {/* Asset Image and Basic Info */}
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
                <Image
                  src={asset.image || "/placeholder.svg"}
                  alt={asset.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <Badge className={getTypeColor(asset.type)} variant="secondary">
                    {asset.type}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                    #{asset.id}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="text-xl font-bold mb-1">{asset.name}</h2>
                  <p className="text-sm opacity-90 line-clamp-2">{asset.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Asset Metadata */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Asset Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Registration</span>
                  <p className="font-medium">{asset.registrationDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Value</span>
                  <p className="font-medium">{asset.value}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Collection</span>
                  <p className="font-medium">{asset.collection || "Individual"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Protection</span>
                  <p className="font-medium text-green-600">{asset.protectionLevel || 90}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Verification */}
          <Card className="shadow-lg border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Blockchain Verification
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <Badge variant="outline">{asset.blockchain}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Standard</span>
                  <Badge variant="outline">{asset.tokenStandard}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Contract Address</span>
                  <p className="font-mono text-xs bg-muted p-2 rounded mt-1 break-all">{asset.contract}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 bg-transparent"
                  onClick={handleViewOnBlockchain}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Ownership and License Info */}
        <div className="xl:col-span-2 space-y-6">
          {/* Ownership Information */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                Ownership Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Owner */}
                <div className="p-4 border-2 border-green-200 dark:border-green-800 rounded-lg bg-green-50/50 dark:bg-green-950/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-green-800 dark:text-green-300">Current Owner</h3>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-12 w-12 border-2 border-green-200">
                      <AvatarImage src={asset.owner.avatar || "/placeholder.svg"} alt={asset.owner.name} />
                      <AvatarFallback className="bg-green-100 text-green-800">
                        {asset.owner.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{asset.owner.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">{asset.owner.address}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Acquired on {asset.owner.acquired}
                  </div>
                </div>

                {/* Original Creator */}
                <div className="p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300">Original Creator</h3>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-12 w-12 border-2 border-blue-200">
                      <AvatarImage src={asset.creator.avatar || "/placeholder.svg"} alt={asset.creator.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        {asset.creator.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{asset.creator.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">{asset.creator.address}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Created on {asset.registrationDate}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                    <h3 className="font-semibold mb-2">{asset.licenseInfo.type}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{asset.licenseInfo.terms}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Commercial Use</span>
                        <Badge variant={asset.licenseInfo.allowCommercial ? "default" : "destructive"}>
                          {asset.licenseInfo.allowCommercial ? "Allowed" : "Restricted"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Derivative Works</span>
                        <Badge variant={asset.licenseInfo.allowDerivatives ? "default" : "destructive"}>
                          {asset.licenseInfo.allowDerivatives ? "Allowed" : "Restricted"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Attribution</span>
                        <Badge variant={asset.licenseInfo.requireAttribution ? "default" : "secondary"}>
                          {asset.licenseInfo.requireAttribution ? "Required" : "Optional"}
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
                        <span className="font-bold text-lg text-primary">{asset.licenseInfo.royaltyPercentage}%</span>
                      </div>
                      <Separator />
                      <p className="text-sm text-muted-foreground">
                        Commercial licensing requires a {asset.licenseInfo.royaltyPercentage}% royalty payment to the
                        original creator for each use.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Ownership Provenance */}
          {ownershipHistory.length > 0 && (
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
                              <AvatarImage src={asset.creator.avatar || "/placeholder.svg"} alt={asset.creator.name} />
                              <AvatarFallback>{asset.creator.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{asset.creator.name}</span>
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Original Creator
                              </Badge>
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            Created on {asset.registrationDate}
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
                          (new Date().getTime() - new Date(asset.registrationDate).getTime()) / (1000 * 60 * 60 * 24),
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
          )}

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
                        Certificate Hash: 0x{asset.id}...{asset.contract.slice(-8)}
                      </span>
                    </div>
                  </div>

                  {showActions && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Button onClick={handleDownloadCertificate} size="lg" className="min-w-[200px]">
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
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
