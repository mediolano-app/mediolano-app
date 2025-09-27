"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowRight,
  Calendar,
  FileText,
  CheckCircle,
  Hash,
  Lock,
  Zap,
  Copy,
  ExternalLink,
  Download,
  Share2,
  Clock,
  MapPin,
  Fingerprint,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Shield,
  Users,
  Activity,
} from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ProvenanceEvent {
  id: string
  type: "creation" | "transfer" | "license" | "modification" | "verification" | "dispute"
  title: string
  description: string
  from?: string
  to?: string
  date: string
  timestamp: string
  transactionHash?: string
  blockNumber?: number
  gasUsed?: number
  memo?: string
  verified: boolean
  location?: string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
}

interface AssetInfo {
  id: string
  name: string
  type: string
  creator: {
    name: string
    address: string
    avatar?: string
    verified: boolean
  }
  currentOwner: {
    name: string
    address: string
    avatar?: string
    verified: boolean
  }
  creationDate: string
  registrationDate: string
  blockchain: string
  contract: string
  tokenId: string
  image: string
  description: string
  fingerprint: string
  fileSize?: string
  dimensions?: string
  format?: string
}

interface AssetProvenanceProps {
  asset: AssetInfo
  events: ProvenanceEvent[]
  showActions?: boolean
  compact?: boolean
}

export function AssetProvenance({ asset, events, showActions = true, compact = false }: AssetProvenanceProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [showAllEvents, setShowAllEvents] = useState(false)

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${asset.name} - Asset Provenance`,
          text: `View the complete ownership history of ${asset.name}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      handleCopy(window.location.href, "url")
    }
  }

  const getEventIcon = (type: ProvenanceEvent["type"]) => {
    switch (type) {
      case "creation":
        return <FileText className="h-4 w-4" />
      case "transfer":
        return <ArrowRight className="h-4 w-4" />
      case "license":
        return <Lock className="h-4 w-4" />
      case "modification":
        return <Zap className="h-4 w-4" />
      case "verification":
        return <CheckCircle className="h-4 w-4" />
      case "dispute":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getEventColor = (type: ProvenanceEvent["type"]) => {
    switch (type) {
      case "creation":
        return "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/20 dark:border-blue-800"
      case "transfer":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/20 dark:border-green-800"
      case "license":
        return "text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-950/20 dark:border-purple-800"
      case "modification":
        return "text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950/20 dark:border-orange-800"
      case "verification":
        return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-800"
      case "dispute":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/20 dark:border-red-800"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950/20 dark:border-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const displayEvents = showAllEvents ? events : events.slice(0, 5)
  const hasMoreEvents = events.length > 5

  return (
    <div className="space-y-6">
      {/* Mobile-Optimized Asset Overview */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="relative w-full sm:w-20 h-48 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={asset.image || "/placeholder.svg"}
                alt={asset.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 80px"
              />
            </div>
            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 break-words">{asset.name}</h2>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{asset.description}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {asset.type}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Hash className="h-3 w-3 mr-1" />
                      {asset.tokenId}
                    </Badge>
                  </div>
                </div>
                {showActions && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="w-full sm:w-auto bg-transparent"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Mobile-First Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Creator Info */}
            <div className="space-y-3 p-4 rounded-lg bg-background/50 border">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Original Creator</h3>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={asset.creator.avatar || "/placeholder.svg"} alt={asset.creator.name} />
                  <AvatarFallback className="text-xs">{asset.creator.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{asset.creator.name}</p>
                    {asset.creator.verified && <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground font-mono">{truncateAddress(asset.creator.address)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => handleCopy(asset.creator.address, "creator")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {copied === "creator" && <span className="text-xs text-green-600">Copied!</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Owner */}
            <div className="space-y-3 p-4 rounded-lg bg-background/50 border">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Current Owner</h3>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={asset.currentOwner.avatar || "/placeholder.svg"} alt={asset.currentOwner.name} />
                  <AvatarFallback className="text-xs">{asset.currentOwner.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{asset.currentOwner.name}</p>
                    {asset.currentOwner.verified && <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground font-mono">
                      {truncateAddress(asset.currentOwner.address)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => handleCopy(asset.currentOwner.address, "owner")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {copied === "owner" && <span className="text-xs text-green-600">Copied!</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Info */}
            <div className="space-y-3 p-4 rounded-lg bg-background/50 border sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Blockchain</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Network</span>
                  <Badge variant="outline" className="text-xs">
                    {asset.blockchain}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Contract</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono flex-1 truncate">
                    {truncateAddress(asset.contract)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 flex-shrink-0"
                    onClick={() => handleCopy(asset.contract, "contract")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Fingerprint */}
          <Separator className="my-6" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Fingerprint className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Digital Fingerprint:</span>
            </div>
            <code className="text-xs bg-background px-3 py-2 rounded font-mono flex-1 break-all">
              {asset.fingerprint}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 flex-shrink-0"
              onClick={() => handleCopy(asset.fingerprint, "fingerprint")}
            >
              <Copy className="h-3 w-3" />
            </Button>
            {copied === "fingerprint" && <span className="text-xs text-green-600 ml-2">Copied!</span>}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Mobile Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Provenance
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete history of all events and transactions for this asset
          </p>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {displayEvents.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Mobile-optimized timeline connector */}
                {index < displayEvents.length - 1 && <div className="absolute left-6 top-16 w-0.5 h-12 bg-border" />}

                <div className="flex items-start gap-4">
                  {/* Enhanced event icon */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getEventColor(event.type)}`}
                  >
                    {getEventIcon(event.type)}
                  </div>

                  {/* Mobile-first event content */}
                  <div className="flex-1 min-w-0">
                    <div className={`p-4 rounded-lg border-2 ${getEventColor(event.type)}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <h3 className="font-semibold text-sm sm:text-base">{event.title}</h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(event.timestamp)}
                          </Badge>
                          {event.verified && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>

                      {/* Transfer details - mobile optimized */}
                      {(event.from || event.to) && (
                        <div className="grid grid-cols-1 gap-3 mb-3">
                          {event.from && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                              <div className="text-xs text-muted-foreground font-medium">FROM</div>
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">{event.from.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium truncate">{event.from}</span>
                            </div>
                          )}

                          {event.to && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                              <div className="text-xs text-muted-foreground font-medium">TO</div>
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">{event.to.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium truncate">{event.to}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Transaction details - collapsible on mobile */}
                      {event.transactionHash && (
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-full justify-between p-2 h-auto">
                              <span className="text-xs">Transaction Details</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-2 mt-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg bg-background/30">
                              <span className="text-xs text-muted-foreground">Hash:</span>
                              <code className="text-xs bg-muted px-2 py-1 rounded font-mono flex-1 break-all">
                                {event.transactionHash}
                              </code>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleCopy(event.transactionHash!, "tx")}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                                  <a
                                    href={`https://etherscan.io/tx/${event.transactionHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </Button>
                              </div>
                            </div>

                            {(event.blockNumber || event.gasUsed) && (
                              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground px-3">
                                {event.blockNumber && <span>Block: {event.blockNumber.toLocaleString()}</span>}
                                {event.gasUsed && <span>Gas: {event.gasUsed.toLocaleString()}</span>}
                              </div>
                            )}
                          </CollapsibleContent>
                        </Collapsible>
                      )}

                      {/* Additional info */}
                      {(event.location || event.memo) && (
                        <div className="space-y-2 mt-3 pt-3 border-t border-border/50">
                          {event.location && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                          )}

                          {event.memo && (
                            <div className="text-sm italic text-muted-foreground bg-muted/30 p-3 rounded">
                              "{event.memo}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Show more button */}
            {hasMoreEvents && !showAllEvents && (
              <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={() => setShowAllEvents(true)}>
                  Show {events.length - 5} More Events
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {showAllEvents && hasMoreEvents && (
              <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={() => setShowAllEvents(false)}>
                  Show Less
                  <ChevronUp className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Enhanced Summary Statistics */}
          <Separator className="my-8" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold text-primary">{events.length}</p>
              <p className="text-xs text-muted-foreground">Total Events</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold text-primary">{events.filter((e) => e.type === "transfer").length}</p>
              <p className="text-xs text-muted-foreground">Transfers</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold text-primary">{events.filter((e) => e.verified).length}</p>
              <p className="text-xs text-muted-foreground">Verified</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold text-primary">
                {Math.floor((new Date().getTime() - new Date(asset.creationDate).getTime()) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-xs text-muted-foreground">Days Old</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
