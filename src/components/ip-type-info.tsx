"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Music,
  Palette,
  FileText,
  Hexagon,
  Video,
  Award,
  MessageSquare,
  BookOpen,
  Building,
  Code,
  Settings,
  Info,
  Download,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Clock,
  Calendar,
  Hash,
  FileCode,
  Database,
  Cpu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchIPFSMetadata, getKnownCids, combineData, AssetType, IPFSMetadata } from "@/utils/ipfs"
import { determineIPType } from "@/utils/ip-type-detection"
import { IPType } from "@/lib/types"
import { mockIPTypeData } from "@/lib/mockData"


export type IPTypeDataType = Record<string, unknown>;


const asText = (value: unknown, fallback = ""): string => {
  if (value === null || value === undefined) return fallback
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value)
  return fallback
}


const getField = (obj: Record<string, unknown> | undefined, key: string): string => {
  return asText(obj?.[key])
}

const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((v) => typeof v === "string")

type Trait = { trait_type: string; value: string }
const isTraitArray = (value: unknown): value is Trait[] => Array.isArray(value) && value.every((v) => v && typeof v === "object" && "trait_type" in v && "value" in v)


type AudioData = {
  duration?: string
  genre?: string
  bpm?: number
  key?: string
  releaseDate?: string
  audioFormat?: string
  sampleRate?: string
  channels?: number
  composer?: string
  publisher?: string
  isrc?: string
}

type ArtData = {
  medium?: string
  dimensions?: string
  style?: string
  creationDate?: string
  colorPalette?: string[]
  software?: string
  printEditions?: number
  materials?: string[]
  technique?: string
  exhibition?: string
}

type NFTData = {
  tokenStandard?: string
  blockchain?: string
  tokenId?: string | number
  contractAddress?: string
  mintDate?: string
  traits?: Trait[]
  editions?: number
  rarity?: string
  marketplace?: string
  previousOwners?: number
}

type VideoData = {
  duration?: string
  resolution?: string
  frameRate?: string
  codec?: string
  director?: string
  releaseDate?: string
  genre?: string
  cast?: string[]
  aspectRatio?: string
  language?: string
  subtitles?: string[]
}

type PostsData = {
  platform?: string
  publicationDate?: string
  wordCount?: number
  readTime?: string
  category?: string
  License?: string
  license?: string
  ["Commercial Use"]?: string
  Modifications?: string
  Attribution?: string
  ["Protection Status"]?: string
  ["Protection Scope"]?: string
  ["IP Version"]?: string
  protection_duration?: string
  collection?: string
  creator?: string
  registration_date?: string
  Tags?: string
}

type SoftwareData = {
  softwareType?: string
  version?: string
  releaseDate?: string
  license?: string
  platforms?: string[]
  programmingLanguages?: string[]
  dependencies?: string[]
  features?: string[]
  sourceCodeRepository?: string
  apiDocumentation?: string
}

const toNumber = (v: unknown): number | undefined => {
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined
  if (typeof v === "string") {
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
  }
  return undefined
}

// Pickers that coerce unknown data to typed shapes
const pickAudio = (d: IPTypeDataType): AudioData => ({
  duration: asText(d.duration),
  genre: asText(d.genre),
  bpm: toNumber(d.bpm),
  key: asText(d.key),
  releaseDate: asText(d.releaseDate),
  audioFormat: asText(d.audioFormat),
  sampleRate: asText(d.sampleRate),
  channels: toNumber(d.channels),
  composer: asText(d.composer),
  publisher: asText(d.publisher),
  isrc: asText(d.isrc),
})

const pickArt = (d: IPTypeDataType): ArtData => ({
  medium: asText(d.medium),
  dimensions: asText(d.dimensions),
  style: asText(d.style),
  creationDate: asText(d.creationDate),
  colorPalette: isStringArray(d.colorPalette) ? d.colorPalette : [],
  software: asText(d.software),
  printEditions: toNumber(d.printEditions),
  materials: isStringArray(d.materials) ? d.materials : [],
  technique: asText(d.technique),
  exhibition: asText(d.exhibition),
})

const pickNFT = (d: IPTypeDataType): NFTData => ({
  tokenStandard: asText(d.tokenStandard),
  blockchain: asText(d.blockchain),
  tokenId: asText(d.tokenId),
  contractAddress: asText(d.contractAddress),
  mintDate: asText(d.mintDate),
  traits: isTraitArray(d.traits) ? (d.traits as Trait[]) : [],
  editions: toNumber(d.editions),
  rarity: asText(d.rarity),
  marketplace: asText(d.marketplace),
  previousOwners: toNumber(d.previousOwners),
})

const pickVideo = (d: IPTypeDataType): VideoData => ({
  duration: asText(d.duration),
  resolution: asText(d.resolution),
  frameRate: asText(d.frameRate),
  codec: asText(d.codec),
  director: asText(d.director),
  releaseDate: asText(d.releaseDate),
  genre: asText(d.genre),
  cast: isStringArray(d.cast) ? d.cast : [],
  aspectRatio: asText(d.aspectRatio),
  language: asText(d.language),
  subtitles: isStringArray(d.subtitles) ? d.subtitles : [],
})

const pickPosts = (d: IPTypeDataType): PostsData => ({
  platform: asText(d.platform),
  publicationDate: asText(d.publicationDate),
  wordCount: toNumber(d.wordCount),
  readTime: asText(d.readTime),
  category: asText(d.category),
  License: getField(d as Record<string, unknown>, "License"),
  license: getField(d as Record<string, unknown>, "license"),
  ["Commercial Use"]: getField(d as Record<string, unknown>, "Commercial Use"),
  Modifications: getField(d as Record<string, unknown>, "Modifications"),
  Attribution: getField(d as Record<string, unknown>, "Attribution"),
  ["Protection Status"]: getField(d as Record<string, unknown>, "Protection Status"),
  ["Protection Scope"]: getField(d as Record<string, unknown>, "Protection Scope"),
  ["IP Version"]: getField(d as Record<string, unknown>, "IP Version"),
  protection_duration: getField(d as Record<string, unknown>, "protection_duration"),
  collection: asText(d.collection),
  creator: asText(d.creator),
  registration_date: getField(d as Record<string, unknown>, "registration_date"),
  Tags: getField(d as Record<string, unknown>, "Tags"),
})

const pickSoftware = (d: IPTypeDataType): SoftwareData => ({
  softwareType: asText(d.softwareType),
  version: asText(d.version),
  releaseDate: asText(d.releaseDate),
  license: asText(d.license),
  platforms: isStringArray(d.platforms) ? d.platforms : [],
  programmingLanguages: isStringArray(d.programmingLanguages) ? d.programmingLanguages : [],
  dependencies: isStringArray(d.dependencies) ? d.dependencies : [],
  features: isStringArray(d.features) ? d.features : [],
  sourceCodeRepository: asText(d.sourceCodeRepository),
  apiDocumentation: asText(d.apiDocumentation),
})



interface IPTypeInfoProps {
  asset: AssetType; 
}

export function IPTypeInfo({ asset }: IPTypeInfoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [isLoading, setIsLoading] = useState(true)
  const [ipfsMetadata, setIpfsMetadata] = useState<IPFSMetadata | null>(null)
  const [mergedData, setMergedData] = useState<AssetType | null>(null)
  const [ipType, setIpType] = useState<IPType>("Generic")
  const [ipfsError, setIpfsError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadIPFSData() {
      if (!asset) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        let cid = asset.ipfsCid
        
        if (!cid) {
          const knownCids = getKnownCids()
          cid = knownCids[asset.id]
        }
        
        let fetchedMetadata: IPFSMetadata | null = null
        if (cid) {
          fetchedMetadata = await fetchIPFSMetadata(cid)
        }
        
        if (fetchedMetadata) {
          let detectedType: IPType = "Generic"
      
          detectedType = determineIPType(asset, fetchedMetadata)
          
          const finalData = combineData(fetchedMetadata, asset)
          
          setIpfsMetadata(fetchedMetadata)
          setMergedData(finalData)
          setIpType(detectedType)
        } else {
          // When no IPFS metadata, default to Generic 
          setIpfsMetadata(null)
          setMergedData(asset)
          setIpType("Generic")
        }
      } catch (error) {
        console.error("Error loading IPFS data:", error)
        setIpfsError(error as Error)
        
        // On error, also default to Generic
        setIpfsMetadata(null)
        setMergedData(asset)
        setIpType("Generic")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadIPFSData()
  }, [asset])

  

  const getTypeData = (): IPTypeDataType => {
    if (!mergedData) {
      return mockIPTypeData[ipType] || mockIPTypeData.Generic;
    }
    
    // Extract data from IPFS metadata attributes and properties
    const extractedData: IPTypeDataType = {}
    
    if (ipfsMetadata?.attributes && Array.isArray(ipfsMetadata.attributes)) {
      ipfsMetadata.attributes.forEach(attr => {
        if (attr.trait_type && attr.value) {
          extractedData[attr.trait_type] = attr.value
        }
      })
    }
    
    if (ipfsMetadata?.properties && typeof ipfsMetadata.properties === 'object') {
      Object.entries(ipfsMetadata.properties).forEach(([key, value]) => {
        extractedData[key] = value
      })
    }
      
    return {
      ...mockIPTypeData[ipType],
      ...extractedData,
      // Include basic metadata coerced to text
      name: asText(ipfsMetadata?.name ?? mergedData.name),
      description: asText(ipfsMetadata?.description ?? mergedData.description),
      image: asText(ipfsMetadata?.image ?? mergedData.image),
    } as IPTypeDataType;
  }

  const typeData = getTypeData()
  // typed view of the data for the current ipType
  const typedData = useMemo(() => {
    switch (ipType) {
      case "Audio":
        return pickAudio(typeData) as AudioData
      case "Art":
        return pickArt(typeData) as ArtData
      case "NFT":
        return pickNFT(typeData) as NFTData
      case "Video":
        return pickVideo(typeData) as VideoData
      case "Posts":
        return pickPosts(typeData) as PostsData
      case "Software":
        return pickSoftware(typeData) as SoftwareData
      default:
        return typeData
    }
  }, [ipType, typeData])
  void typedData
  // Coerce potentially unknown values for JSX conditionals
  const sourceCodeRepository = asText((typeData as Record<string, unknown>).sourceCodeRepository)
  const apiDocumentation = asText((typeData as Record<string, unknown>).apiDocumentation)

  const getIconComponent = (type: IPType) => {
    switch (type) {
      case "Audio":
        return Music
      case "Art":
        return Palette
      case "Documents":
        return FileText
      case "NFT":
        return Hexagon
      case "Video":
        return Video
      case "Patents":
        return Award
      case "Posts":
        return MessageSquare
      case "Publications":
        return BookOpen
      case "RWA":
        return Building
      case "Software":
        return Code
      case "Custom":
        return Settings
      default:
        return FileText
    }
  }

  const IconComponent = getIconComponent(ipType)

  const getColorClasses = (type: IPType) => {
    switch (type) {
      case "Audio":
        return {
          bgLight: "bg-blue-50 dark:bg-blue-950/30",
          text: "text-blue-600 dark:text-blue-400",
          border: "border-blue-200 dark:border-blue-800",
        }
      case "Art":
        return {
          bgLight: "bg-purple-50 dark:bg-purple-950/30",
          text: "text-purple-600 dark:text-purple-400",
          border: "border-purple-200 dark:border-purple-800",
        }
      case "Documents":
        return {
          bgLight: "bg-gray-50 dark:bg-gray-900/30",
          text: "text-gray-600 dark:text-gray-400",
          border: "border-gray-200 dark:border-gray-700",
        }
      case "NFT":
        return {
          bgLight: "bg-teal-50 dark:bg-teal-950/30",
          text: "text-teal-600 dark:text-teal-400",
          border: "border-teal-200 dark:border-teal-800",
        }
      case "Video":
        return {
          bgLight: "bg-red-50 dark:bg-red-950/30",
          text: "text-red-600 dark:text-red-400",
          border: "border-red-200 dark:border-red-800",
        }
      case "Patents":
        return {
          bgLight: "bg-amber-50 dark:bg-amber-950/30",
          text: "text-amber-600 dark:text-amber-400",
          border: "border-amber-200 dark:border-amber-800",
        }
      case "Posts":
        return {
          bgLight: "bg-sky-50 dark:bg-sky-950/30",
          text: "text-sky-600 dark:text-sky-400",
          border: "border-sky-200 dark:border-sky-800",
        }
      case "Publications":
        return {
          bgLight: "bg-indigo-50 dark:bg-indigo-950/30",
          text: "text-indigo-600 dark:text-indigo-400",
          border: "border-indigo-200 dark:border-indigo-800",
        }
      case "RWA":
        return {
          bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
          text: "text-emerald-600 dark:text-emerald-400",
          border: "border-emerald-200 dark:border-emerald-800",
        }
      case "Software":
        return {
          bgLight: "bg-violet-50 dark:bg-violet-950/30",
          text: "text-violet-600 dark:text-violet-400",
          border: "border-violet-200 dark:border-violet-800",
        }
      case "Custom":
        return {
          bgLight: "bg-slate-50 dark:bg-slate-900/30",
          text: "text-slate-600 dark:text-slate-400",
          border: "border-slate-200 dark:border-slate-700",
        }
      default:
        return {
          bgLight: "bg-gray-50 dark:bg-gray-900/30",
          text: "text-gray-600 dark:text-gray-400",
          border: "border-gray-200 dark:border-gray-700",
        }
    }
  }

  const colorClasses = getColorClasses(ipType)

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="animate-pulse">
          <div className="h-6 w-32 bg-muted rounded"></div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="h-4 w-3/4 bg-muted rounded"></div>
            <div className="h-4 w-1/2 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderIPTypeContent = () => {
    switch (ipType) {
      case "Audio":
        return (
          <div className="space-y-4">
            <div className={cn("rounded-lg p-4", colorClasses.bgLight)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Music className={colorClasses.text} />
                  <h3 className="font-medium">Audio Preview</h3>
                </div>
                <Badge variant="outline" className={cn(colorClasses.border, colorClasses.text)}>
                  {asText(typeData.audioFormat)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="h-12 bg-muted rounded-md flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <div className="text-sm">
                      <span className="font-medium">00:00</span>
                      <span className="mx-1">/</span>
                      <span>{asText(typeData.duration)}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
                <Progress value={0} className="h-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {asText(typeData.duration)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Genre</p>
                <p className="font-medium">{asText(typeData.genre)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">BPM</p>
                <p className="font-medium">{asText(typeData.bpm)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Key</p>
                <p className="font-medium">{asText(typeData.key)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Release Date</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {asText(typeData.releaseDate)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">ISRC</p>
                <p className="font-medium">{asText(typeData.isrc)}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Technical Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Sample Rate</p>
                  <p className="font-medium">{asText(typeData.sampleRate)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Channels</p>
                  <p className="font-medium">{asText(typeData.channels)}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Credits</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Composer</p>
                  <p className="font-medium">{asText(typeData.composer)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Publisher</p>
                  <p className="font-medium">{asText(typeData.publisher)}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Audio
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                View Lyrics
              </Button>
            </div>
          </div>
        )

      case "Art":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Medium</p>
                <p className="font-medium">{asText(typeData.medium)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Dimensions</p>
                <p className="font-medium">{asText(typeData.dimensions)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Style</p>
                <p className="font-medium">{asText(typeData.style)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Creation Date</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {asText(typeData.creationDate)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Color Palette</h3>
              <div className="flex gap-2">
                {isStringArray(typeData.colorPalette) && typeData.colorPalette.map((color, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full border" style={{ backgroundColor: color }}></div>
                    <span className="text-xs mt-1">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Technical Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Software Used</p>
                  <p className="font-medium">{asText(typeData.software)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Print Editions</p>
                  <p className="font-medium">{asText(typeData.printEditions)}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Materials & Technique</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Materials</p>
                  <div className="flex flex-wrap gap-1">
                    {isStringArray(typeData.materials) && typeData.materials.map((material, index) => (
                      <Badge key={index} variant="outline">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Technique</p>
                  <p className="font-medium">{asText(typeData.technique)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Exhibition History</p>
              <p className="font-medium">{asText(typeData.exhibition)}</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download High-Res
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View in AR
              </Button>
            </div>
          </div>
        )

      case "NFT":
        return (
          <div className="space-y-4">
            <div className={cn("rounded-lg p-4", colorClasses.bgLight)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Hexagon className={colorClasses.text} />
                  <h3 className="font-medium">Token Information</h3>
                </div>
                <Badge variant="outline" className={cn(colorClasses.border, colorClasses.text)}>
                  {asText(typeData.tokenStandard)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Blockchain</p>
                  <p className="font-medium">{asText(typeData.blockchain)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Token ID</p>
                  <p className="font-medium flex items-center gap-1">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    {asText(typeData.tokenId)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Contract Address</p>
                  <p className="font-mono text-xs truncate">{asText(typeData.contractAddress)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mint Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {asText(typeData.mintDate)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Traits</h3>
              <div className="grid grid-cols-3 gap-2">
                {isTraitArray(typeData.traits) && typeData.traits.map((trait, index) => (
                  <div key={index} className="rounded-lg border p-2 text-center">
                    <p className="text-xs text-muted-foreground">{trait.trait_type}</p>
                    <p className="font-medium truncate">{trait.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Editions</p>
                <p className="font-medium">{asText(typeData.editions)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Rarity</p>
                <p className="font-medium">{asText(typeData.rarity)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Marketplace</p>
                <p className="font-medium">{asText(typeData.marketplace)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Previous Owners</p>
                <p className="font-medium">{asText(typeData.previousOwners)}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View on {asText(typeData.marketplace) || "Marketplace"}
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View on Etherscan
              </Button>
            </div>
          </div>
        )

      case "Video":
        return (
          <div className="space-y-4">
            <div className={cn("rounded-lg p-4", colorClasses.bgLight)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Video className={colorClasses.text} />
                  <h3 className="font-medium">Video Preview</h3>
                </div>
                <Badge variant="outline" className={cn(colorClasses.border, colorClasses.text)}>
                  {asText(typeData.resolution)}
                </Badge>
              </div>

              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-background/80">
                  <Play className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {asText(typeData.duration)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Frame Rate</p>
                <p className="font-medium">{asText(typeData.frameRate)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Codec</p>
                <p className="font-medium">{asText(typeData.codec)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Aspect Ratio</p>
                <p className="font-medium">{asText(typeData.aspectRatio)}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Production Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Director</p>
                  <p className="font-medium">{asText(typeData.director)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Release Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {asText(typeData.releaseDate)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Cast & Language</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Cast</p>
                  <div className="flex flex-wrap gap-1">
                    {isStringArray(typeData.cast) && typeData.cast.map((actor, index) => (
                      <Badge key={index} variant="outline">
                        {actor}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Language & Subtitles</p>
                  <p className="font-medium">{asText(typeData.language)}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {isStringArray(typeData.subtitles) && typeData.subtitles.map((language, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Preview
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Full Video
              </Button>
            </div>
          </div>
        )

      case "Posts":
        return (
          <div className="space-y-4">
            <div className={cn("rounded-lg p-4", colorClasses.bgLight)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className={colorClasses.text} />
                  <h3 className="font-medium">Post Information</h3>
                </div>
                <Badge variant="outline" className={cn(colorClasses.border, colorClasses.text)}>
                  {asText(typeData.platform) || "Blog Post"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Publication Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {asText((typeData as Record<string, unknown>).publicationDate) || getField(typeData as Record<string, unknown>, "registration_date") || "Not specified"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Word Count</p>
                  <p className="font-medium">{asText(typeData.wordCount) || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Read Time</p>
                  <p className="font-medium">{asText(typeData.readTime) || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{asText(typeData.category) || "Not specified"}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">License & Rights</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">License Type</p>
                  <p className="font-medium">{getField(typeData as Record<string, unknown>, "License") || getField(typeData as Record<string, unknown>, "license") || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Commercial Use</p>
                  <p className="font-medium">{getField(typeData as Record<string, unknown>, "Commercial Use") === "true" ? "Allowed" : "Not Allowed"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Modifications</p>
                  <p className="font-medium">{getField(typeData as Record<string, unknown>, "Modifications") === "true" ? "Allowed" : "Not Allowed"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Attribution Required</p>
                  <p className="font-medium">{getField(typeData as Record<string, unknown>, "Attribution") === "true" ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Protection Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Protection Status</p>
                  <p className="font-medium">{getField(typeData as Record<string, unknown>, "Protection Status") || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Protection Scope</p>
                  <p className="font-medium">{getField(typeData as Record<string, unknown>, "Protection Scope") || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">IP Version</p>
                  <p className="font-medium">{getField(typeData as Record<string, unknown>, "IP Version") || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Protection Duration</p>
                  <p className="font-medium">{getField(typeData as Record<string, unknown>, "protection_duration") || "Not specified"}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Collection Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Collection</p>
                  <p className="font-medium">{asText(typeData.collection) || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Creator</p>
                  <p className="font-medium">{asText(typeData.creator) || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Registration Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {getField(typeData as Record<string, unknown>, "registration_date") || "Not specified"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tags</p>
                  <p className="font-medium">{getField(typeData as Record<string, unknown>, "Tags") || "No tags"}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Original Post
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Content
              </Button>
            </div>
          </div>
        )

      case "Software":
        return (
          <div className="space-y-4">
            <div className={cn("rounded-lg p-4", colorClasses.bgLight)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code className={colorClasses.text} />
                  <h3 className="font-medium">Software Information</h3>
                </div>
                <Badge variant="outline" className={cn(colorClasses.border, colorClasses.text)}>
                  {asText(typeData.softwareType)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Version</p>
                  <p className="font-medium">{asText(typeData.version)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Release Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {asText(typeData.releaseDate)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">License</p>
                  <p className="font-medium">{asText(typeData.license)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Platforms</p>
                  <div className="flex flex-wrap gap-1">
                    {isStringArray(typeData.platforms) && typeData.platforms.map((platform, index) => (
                      <Badge key={index} variant="outline">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Technical Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Programming Languages</p>
                  <div className="flex flex-wrap gap-1">
                    {isStringArray(typeData.programmingLanguages) && typeData.programmingLanguages.map((lang, index) => (
                      <Badge key={index} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Dependencies</p>
                  <div className="flex flex-wrap gap-1">
                    {isStringArray(typeData.dependencies) && typeData.dependencies.map((dep, index) => (
                      <Badge key={index} variant="outline">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Features</h3>
              <div className="flex flex-wrap gap-1">
                {isStringArray(typeData.features) && typeData.features.map((feature, index) => (
                  <Badge key={index} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Resources</h3>
              <div className="grid grid-cols-1 gap-2">
                {sourceCodeRepository && (
                  <div className="flex items-center justify-between rounded-md border p-2">
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Source Code Repository</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="text-xs">GitHub</span>
                    </Button>
                  </div>
                )}
                {apiDocumentation && (
                  <div className="flex items-center justify-between rounded-md border p-2">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">API Documentation</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="text-xs">View Docs</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Technical Specs
              </Button>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            {ipfsMetadata && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This asset&apos;s metadata was retrieved from IPFS {asset.ipfsCid ? "(" + asset.ipfsCid.substring(0, 8) + "...)" : ""}.
                </AlertDescription>
              </Alert>
            )}
            
            {ipfsError && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Using fallback metadata. Could not retrieve data from IPFS.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {typeData && Object.entries(typeData as Record<string, unknown>)
                .filter(([key]) => !['id', 'image', 'name', 'description'].includes(key))
                .map(([key, value]) => {
                  if (typeof value === 'object' && value !== null) {
                    return null 
                  }
                  
                  return (
                    <div key={key} className="space-y-1">
                      <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="font-medium">{String((value as string | number | boolean | null | undefined) ?? '')}</p>
                    </div>
                  )
                })}
            </div>
          </div>
        )
    }
  }

  return (
    <Card>
      <CardHeader className={cn("pb-3", colorClasses.bgLight)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-full bg-background", colorClasses.border)}>
              <IconComponent className={cn("h-6 w-6", colorClasses.text)} />
            </div>
            <CardTitle className="text-xl">{ipType} IP Template</CardTitle>
          </div>
          <Badge variant="outline" className={cn(colorClasses.border, colorClasses.text)}>
            #{Number(asset.tokenId)}
          </Badge>
        </div>
        
        {ipfsMetadata && (
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <Hexagon className="h-3 w-3 mr-1" />
            <span>IPFS Metadata Available</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Template Details</TabsTrigger>
            <TabsTrigger value="metadata">Raw Metadata</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-4">
            {renderIPTypeContent()}
          </TabsContent>
          <TabsContent value="metadata" className="mt-4">
            <div className="rounded-lg border bg-muted/20 p-4 font-mono text-sm overflow-auto max-h-[400px]">
              {/* Mostrar metadatos de IPFS si están disponibles, o metadata combinados */}
              <pre>{JSON.stringify(ipfsMetadata || typeData, null, 2)}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}