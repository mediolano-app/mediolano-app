"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, User, ExternalLink, CheckCircle, Copy, Link2, Building2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Asset } from "@/types/asset"
import { useState } from "react"

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

export function ProofCertificate({ asset, ownershipHistory = [] }: ProofCertificateProps) {
  const [copied, setCopied] = useState<string>("")

  const handleCopyAddress = async (address: string, type: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(type)
      setTimeout(() => setCopied(""), 2000)
    } catch (error) {
      console.error("Error copying:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden glass-card">
        <CardContent className="p-0">
          <div className="p-6 sm:p-8 border-b bg-foreground/[0.02]">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <Badge variant="outline" className="mb-3">
                  {asset.type}
                </Badge>
                <Link href={`/asset/${asset.id}`} className="group">
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {asset.name}
                  </h3>
                </Link>
              </div>
              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                <CheckCircle className="h-3 w-3 mr-1.5" />
                Verified
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="relative w-full sm:w-48 aspect-square overflow-hidden rounded-lg bg-muted">
                <Link href={`/asset/${asset.id}`}>
                  <Image
                    src={asset.image || "/placeholder.svg"}
                    alt={asset.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 192px"
                    priority
                  />
                </Link>
              </div>

              <div className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{asset.description}</p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="font-normal">
                    <Calendar className="h-3 w-3 mr-1.5" />
                    {asset.registrationDate}
                  </Badge>
                  <Link href={`/asset/${asset.id}`}>
                    <Badge variant="secondary" className="font-normal">
                      <Link2 className="h-3 w-3 mr-1.5" />
                      {asset.id.substring(0, 6)}...{asset.id.slice(-4)}
                    </Badge>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Current Owner */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">Owner</h4>
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-foreground/[0.02]">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={asset.owner.avatar || "/placeholder.svg"} alt={asset.owner.name} />
                  <AvatarFallback>{asset.owner.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{asset.owner.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs text-muted-foreground font-mono">
                      {asset.owner.address.substring(0, 6)}...{asset.owner.address.slice(-4)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleCopyAddress(asset.owner.address, "owner")}
                    >
                      {copied === "owner" ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Original Creator */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Original Creator</h4>
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-foreground/[0.02]">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={asset.creator.avatar || "/placeholder.svg"} alt={asset.creator.name} />
                  <AvatarFallback>{asset.creator.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{asset.creator.name}</p>
                    {asset.creator.verified && <CheckCircle className="h-4 w-4 text-blue-600" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs text-muted-foreground font-mono">
                      {asset.creator.address.substring(0, 6)}...{asset.creator.address.slice(-4)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleCopyAddress(asset.creator.address, "creator")}
                    >
                      {copied === "creator" ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">License</h4>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{asset.licenseInfo.type}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Commercial Use</span>
                    <Badge variant={asset.licenseInfo.allowCommercial ? "default" : "secondary"} className="text-xs">
                      {asset.licenseInfo.allowCommercial ? "Allowed" : "Not Allowed"}
                    </Badge>
                  </div>

                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Blockchain</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Network</span>
                    <Badge variant="outline" className="text-xs">
                      {asset.blockchain}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Standard</span>
                    <Badge variant="outline" className="text-xs">
                      {asset.tokenStandard}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Contract</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 truncate">
                        {asset.contract.substring(0, 8)}...{asset.contract.slice(-6)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleCopyAddress(asset.contract, "contract")}
                      >
                        {copied === "contract" ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {ownershipHistory.length > 0 && (
        <Card className="glass-card">
          <CardContent className="p-6 sm:p-8">
            <h3 className="font-medium mb-6">Ownership History</h3>

            <div className="space-y-3">
              {ownershipHistory.map((record, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:border-foreground/20 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-medium text-sm">{record.event}</p>
                      <span className="text-xs text-muted-foreground">{record.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {record.from} → {record.to}
                    </p>
                  </div>
                  {record.verified && <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />}
                </div>
              ))}

              {/* Genesis */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-foreground/[0.02] border">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
                  <User className="h-4 w-4 text-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-medium text-sm">Created</p>
                    <Badge variant="outline" className="text-xs">
                      Genesis
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {asset.creator.name} • {asset.registrationDate}
                  </p>
                </div>
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Immutable ID: <code className="text-xs font-mono ml-1">{asset.id}</code>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link href={`/provenance/${asset.id}`}>
                <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                  View Provenance
                </Button>
              </Link>
              <Button size="sm" className="w-full sm:w-auto">
                View on Explorer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
