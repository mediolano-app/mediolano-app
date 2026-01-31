"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
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
  ExternalLink,
  Clock,
  Calendar,
  Hash,
  FileCode,
  Database,
  Camera,
} from "lucide-react"
import { SmartLinks, SmartLink } from "@/components/asset/smart-links"
import { cn } from "@/lib/utils"
import { fetchIPFSMetadata, getKnownCids, combineData, AssetType, IPFSMetadata } from "@/utils/ipfs"
import { determineIPType } from "@/utils/ip-type-detection"
import { IPType } from "@/lib/types"
import { mockIPTypeData } from "@/lib/dapp-data"


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
  instruments?: string
  containsSamples?: boolean
  spotifyUrl?: string
  youtubeUrl?: string
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
  allowPrints?: boolean
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
  allowClips?: boolean
  youtubeUrl?: string
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
  instagramUrl?: string
  tiktokUrl?: string
  youtubeUrl?: string
  facebookUrl?: string
  xUrl?: string
}

type SoftwareData = {
  softwareType?: string
  version?: string
  releaseDate?: string
  license?: string
  platform?: string
  programmingLanguage?: string
  dependencies?: string[]
  features?: string[]
  sourceCodeRepository?: string
  apiDocumentation?: string
  allowModifications?: boolean
}

type PhotographyData = {
  camera?: string
  lens?: string
  iso?: string
  aperture?: string
  shutterSpeed?: string
  focalLength?: string
  whiteBalance?: string
  flash?: string
  resolution?: string
  location?: string
  takenDate?: string
  software?: string
  exposureMode?: string
  fileFormat?: string
}

const toNumber = (v: unknown): number | undefined => {
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined
  if (typeof v === "string") {
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
  }
  return undefined
}

const toBoolean = (v: unknown): boolean | undefined => {
  if (typeof v === "boolean") return v;
  if (v === "true") return true;
  if (v === "false") return false;
  return undefined;
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
  instruments: asText(d.instruments),
  containsSamples: toBoolean(d.containsSamples),
  spotifyUrl: asText(d.spotifyUrl),
  youtubeUrl: asText(d.youtubeUrl)
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
  allowPrints: toBoolean(d.allowPrints)
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
  allowClips: toBoolean(d.allowClips),
  youtubeUrl: asText(d.youtubeUrl)
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
  instagramUrl: asText(d.instagramUrl),
  tiktokUrl: asText(d.tiktokUrl),
  youtubeUrl: asText(d.youtubeUrl),
  facebookUrl: asText(d.facebookUrl),
  xUrl: asText(d.xUrl)
})

const pickSoftware = (d: IPTypeDataType): SoftwareData => ({
  softwareType: asText(d.softwareType),
  version: asText(d.version),
  releaseDate: asText(d.releaseDate),
  license: asText(d.license),
  platform: asText(d.platform),
  programmingLanguage: asText(d.programmingLanguage),
  dependencies: isStringArray(d.dependencies) ? d.dependencies : [],
  features: isStringArray(d.features) ? d.features : [],
  sourceCodeRepository: asText(d.sourceCodeRepository),
  apiDocumentation: asText(d.apiDocumentation),
  allowModifications: toBoolean(d.allowModifications)
})

const pickPhotography = (d: IPTypeDataType): PhotographyData => ({
  camera: asText(d.camera),
  lens: asText(d.lens),
  iso: asText(d.iso),
  aperture: asText(d.aperture),
  shutterSpeed: asText(d.shutterSpeed),
  focalLength: asText(d.focalLength),
  whiteBalance: asText(d.whiteBalance),
  flash: asText(d.flash),
  resolution: asText(d.resolution),
  location: asText(d.location),
  takenDate: asText(d.takenDate),
  software: asText(d.software),
  exposureMode: asText(d.exposureMode),
  fileFormat: asText(d.fileFormat),
})



interface IPTypeInfoProps {
  asset: AssetType;
}

export function IPTypeInfo({ asset }: IPTypeInfoProps) {
  const [activeTab, setActiveTab] = useState("traits")
  const [isLoading, setIsLoading] = useState(true)
  const [ipfsMetadata, setIpfsMetadata] = useState<IPFSMetadata | null>(null)
  const [mergedData, setMergedData] = useState<AssetType | null>(null)
  const [ipType, setIpType] = useState<IPType>("Generic")

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
      ...extractedData,
      // Include basic metadata coerced to text
      name: asText(ipfsMetadata?.name ?? mergedData?.name),
      description: asText(ipfsMetadata?.description ?? mergedData?.description),
      image: asText(ipfsMetadata?.image ?? mergedData?.image),
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
      case "Photography":
        return pickPhotography(typeData) as PhotographyData
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
      case "Photography":
        return Camera
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
      case "Photography":
        return {
          bgLight: "bg-orange-50 dark:bg-orange-950/30",
          text: "text-orange-600 dark:text-orange-400",
          border: "border-orange-200 dark:border-orange-800",
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



  const RenderField = ({ label, value, icon: Icon, children }: { label: string, value?: string | number | null | React.ReactNode, icon?: any, children?: React.ReactNode }) => {
    // If it's a simple value, check if it's empty
    if ((value === undefined || value === null || value === "") && !children) return null;

    // If children are provided, we should ideally check if they result in null/empty,
    // but we'll rely on the parent to only pass children if data exists.
    if (!children && (value === undefined || value === null || value === "")) return null;

    return (
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="font-medium flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <span className="break-all">{children || value}</span>
        </div>
      </div>
    );
  };

  const RenderSection = ({ label, children }: { label: string, children: React.ReactNode }) => {
    if (!children) return null;
    return (
      <RenderField label={label} value="">
        {children}
      </RenderField>
    )
  }

  const renderExternalLinkButton = () => {
    const externalUrl = asText((typeData as Record<string, unknown>).externalUrl);
    if (!externalUrl) return null;

    let buttonLabel = "View External Resource";
    if (ipType === "Video") buttonLabel = "Watch Video";
    if (ipType === "Audio") buttonLabel = "Listen to Audio";
    if (ipType === "Documents") buttonLabel = "View Document";

    return (
      <Button variant="outline" className="w-full flex items-center gap-2 mt-4" onClick={() => window.open(externalUrl, "_blank")}>
        <ExternalLink className="h-4 w-4" />
        {buttonLabel}
      </Button>
    );
  };

  // Helper to truncate long strings like addresses
  const formatTraitValue = (val: string) => {
    if (val.length > 20 && (val.startsWith("0x") || !val.includes(" "))) {
      return val.substring(0, 6) + "..." + val.substring(val.length - 4);
    }
    return val;
  }

  const renderIPTypeContent = () => {
    switch (ipType) {
      case "Audio":
        return (
          <div className="space-y-4">
            <div className={cn("rounded-lg p-4", colorClasses.bgLight)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className={colorClasses.text} />
                  <h3 className="font-medium">Audio</h3>
                </div>
                <Badge variant="outline" className={cn(colorClasses.border, colorClasses.text)}>
                  {asText(typeData.audioFormat)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <RenderField label="Duration" value={asText(typeData.duration)} icon={Clock} />
              <RenderField label="Genre" value={asText(typeData.genre)} />
              <RenderField label="BPM" value={asText(typeData.bpm)} />
              <RenderField label="Key" value={asText(typeData.key)} />
              <RenderField label="Release Date" value={asText(typeData.releaseDate)} icon={Calendar} />
              <RenderField label="ISRC" value={asText(typeData.isrc)} />
            </div>

            {(asText(typeData.sampleRate) || asText(typeData.channels)) && (
              <RenderSection label="Technical Information">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <RenderField label="Sample Rate" value={asText(typeData.sampleRate)} />
                  <RenderField label="Channels" value={asText(typeData.channels)} />
                </div>
              </RenderSection>
            )}

            {(asText(typeData.composer) || asText(typeData.publisher)) && (
              <RenderSection label="Credits">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <RenderField label="Composer" value={asText(typeData.composer)} />
                  <RenderField label="Publisher" value={asText(typeData.publisher)} />
                </div>
              </RenderSection>
            )}

            <SmartLinks links={[
              { platform: "spotify", url: asText(typeData.spotifyUrl) },
              { platform: "youtube", url: asText(typeData.youtubeUrl) },
            ].filter(l => l.url)} />

            {renderExternalLinkButton()}
          </div>
        )

      case "Art":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <RenderField label="Medium" value={asText(typeData.medium)} />
              <RenderField label="Dimensions" value={asText(typeData.dimensions)} />
              <RenderField label="Style" value={asText(typeData.style)} />
              <RenderField label="Creation Date" value={asText(typeData.creationDate)} icon={Calendar} />
            </div>

            {isStringArray(typeData.colorPalette) && typeData.colorPalette.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Color Palette</h3>
                <div className="flex gap-2 flex-wrap">
                  {typeData.colorPalette.map((color, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full border shadow-sm" style={{ backgroundColor: color }}></div>
                      <span className="text-[10px] mt-1 text-muted-foreground">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(asText(typeData.software) || asText(typeData.printEditions)) && (
              <RenderSection label="Technical Details">
                <div className="grid grid-cols-1 gap-4 w-full">
                  <RenderField label="Software Used" value={asText(typeData.software)} />
                  <RenderField label="Print Editions" value={asText(typeData.printEditions)} />
                </div>
              </RenderSection>
            )}

            {((isStringArray(typeData.materials) && typeData.materials.length > 0) || asText(typeData.technique)) && (
              <RenderSection label="Materials & Technique">
                <div className="grid grid-cols-1 gap-4 w-full">
                  {isStringArray(typeData.materials) && typeData.materials.length > 0 && (
                    <RenderField label="Materials" value="">
                      <div className="flex flex-wrap gap-1">
                        {typeData.materials.map((material, index) => (
                          <Badge key={index} variant="outline">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </RenderField>
                  )}
                  <RenderField label="Technique" value={asText(typeData.technique)} />
                </div>
              </RenderSection>
            )}

            <RenderField label="Exhibition History" value={asText(typeData.exhibition)} />
            {renderExternalLinkButton()}
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

              <div className="grid grid-cols-1 gap-4">
                <RenderField label="Blockchain" value={asText(typeData.blockchain)} />
                <RenderField label="Token ID" value={asText(asset.tokenId)} icon={Hash} />
                <RenderField label="Contract Address" value={
                  asset.contractAddress ? (
                    <span className="font-mono text-xs">{formatTraitValue(asText(asset.contractAddress))}</span>
                  ) : null
                } />
                <RenderField label="Mint Date" value={asText(typeData.mintDate)} icon={Calendar} />
              </div>
            </div>

            <RenderField label="Traits" value={
              isTraitArray(asset.attributes) && asset.attributes.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
                  {asset.attributes.map((trait, index) => (
                    <div key={index} className="rounded-lg border p-2 text-center bg-card">
                      <p className="text-[10px] text-muted-foreground capitalize">{trait.trait_type}</p>
                      <p className="font-medium capitalize truncate text-sm" title={trait.value}>{formatTraitValue(trait.value)}</p>
                    </div>
                  ))}
                </div>
              ) : null
            } />

            <div className="grid grid-cols-1 gap-4">
              <RenderField label="Editions" value={asText(typeData.editions)} />
              <RenderField label="Rarity" value={asText(typeData.rarity)} />
              <RenderField label="Marketplace" value={asText(typeData.marketplace)} />
              <RenderField label="Previous Owners" value={asText(typeData.previousOwners)} />
            </div>


            {renderExternalLinkButton()}
          </div>
        )

      case "Video":
        return (
          <div className="space-y-4">
            <div className={cn("rounded-lg p-4", colorClasses.bgLight)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className={colorClasses.text} />
                  <h3 className="font-medium">Video</h3>
                </div>
                <Badge variant="outline" className={cn(colorClasses.border, colorClasses.text)}>
                  {asText(typeData.resolution)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <RenderField label="Duration" value={asText(typeData.duration)} icon={Clock} />
              <RenderField label="Frame Rate" value={asText(typeData.frameRate)} />
              <RenderField label="Codec" value={asText(typeData.codec)} />
              <RenderField label="Aspect Ratio" value={asText(typeData.aspectRatio)} />
            </div>

            {(asText((typeData as Record<string, unknown>).director) || asText((typeData as Record<string, unknown>).releaseDate)) && (
              <div className="grid grid-cols-2 gap-4">
                <RenderField label="Director" value={asText((typeData as Record<string, unknown>).director)} />
                <RenderField label="Release Date" value={asText((typeData as Record<string, unknown>).releaseDate)} icon={Calendar} />
              </div>
            )}

            <SmartLinks links={[
              { platform: "youtube", url: asText(typeData.youtubeUrl) },
            ].filter(l => l.url)} />

            {
              ((isStringArray(typeData.cast) && typeData.cast.length > 0) || asText(typeData.language) || (isStringArray(typeData.subtitles) && typeData.subtitles.length > 0)) && (
                <RenderSection label="Cast & Language">
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {isStringArray(typeData.cast) && typeData.cast.length > 0 && (
                      <RenderField label="Cast" value="">
                        <div className="flex flex-wrap gap-1">
                          {typeData.cast.map((actor, index) => (
                            <Badge key={index} variant="outline">
                              {actor}
                            </Badge>
                          ))}
                        </div>
                      </RenderField>
                    )}
                    <RenderField label="Language" value={asText(typeData.language)} />
                    {isStringArray(typeData.subtitles) && typeData.subtitles.length > 0 && (
                      <RenderField label="Subtitles" value="">
                        <div className="flex flex-wrap gap-1 mt-1">
                          {typeData.subtitles.map((language, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </RenderField>
                    )}
                  </div>
                </RenderSection>
              )
            }

            {renderExternalLinkButton()}
          </div >
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

              <div className="grid grid-cols-1 gap-4">
                <RenderField label="Publication Date" value={asText((typeData as Record<string, unknown>).publicationDate) || getField(typeData as Record<string, unknown>, "registration_date")} icon={Calendar} />
                <RenderField label="Word Count" value={asText(typeData.wordCount)} />
                <RenderField label="Read Time" value={asText(typeData.readTime)} />
                <RenderField label="Category" value={asText(typeData.category)} />
              </div>
            </div>

            {(getField(typeData as Record<string, unknown>, "License") || getField(typeData as Record<string, unknown>, "license") || getField(typeData as Record<string, unknown>, "Commercial Use") || getField(typeData as Record<string, unknown>, "Modifications") || getField(typeData as Record<string, unknown>, "Attribution")) && (
              <RenderSection label="License & Rights">
                <div className="grid grid-cols-1 gap-4 w-full">
                  <RenderField label="License Type" value={getField(typeData as Record<string, unknown>, "License") || getField(typeData as Record<string, unknown>, "license")} />
                  <RenderField label="Commercial Use" value={getField(typeData as Record<string, unknown>, "Commercial Use") ? (getField(typeData as Record<string, unknown>, "Commercial Use") === "true" ? "Allowed" : "Not Allowed") : null} />
                  <RenderField label="Modifications" value={getField(typeData as Record<string, unknown>, "Modifications") ? (getField(typeData as Record<string, unknown>, "Modifications") === "true" ? "Allowed" : "Not Allowed") : null} />
                  <RenderField label="Attribution Required" value={getField(typeData as Record<string, unknown>, "Attribution") ? (getField(typeData as Record<string, unknown>, "Attribution") === "true" ? "Yes" : "No") : null} />
                </div>
              </RenderSection>
            )}

            {(getField(typeData as Record<string, unknown>, "Protection Status") || getField(typeData as Record<string, unknown>, "Protection Scope") || getField(typeData as Record<string, unknown>, "IP Version") || getField(typeData as Record<string, unknown>, "protection_duration")) && (
              <RenderSection label="Protection Details">
                <div className="grid grid-cols-1 gap-4 w-full">
                  <RenderField label="Protection Status" value={getField(typeData as Record<string, unknown>, "Protection Status")} />
                  <RenderField label="Protection Scope" value={getField(typeData as Record<string, unknown>, "Protection Scope")} />
                  <RenderField label="IP Version" value={getField(typeData as Record<string, unknown>, "IP Version")} />
                  <RenderField label="Protection Duration" value={getField(typeData as Record<string, unknown>, "protection_duration")} />
                </div>
              </RenderSection>
            )}

            {(asText(typeData.collection) || asText(typeData.creator) || getField(typeData as Record<string, unknown>, "registration_date") || getField(typeData as Record<string, unknown>, "Tags")) && (
              <RenderSection label="Collection Information">
                <div className="grid grid-cols-1 gap-4 w-full">
                  <RenderField label="Collection" value={asText(typeData.collection)} />
                  <RenderField label="Creator" value={asText(typeData.creator)} />
                  <RenderField label="Registration Date" value={getField(typeData as Record<string, unknown>, "registration_date")} icon={Calendar} />
                  <RenderField label="Tags" value={getField(typeData as Record<string, unknown>, "Tags")} />
                </div>
              </RenderSection>
            )}


            {renderExternalLinkButton()}
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

              <div className="grid grid-cols-1 gap-4">
                <RenderField label="Version" value={asText(typeData.version)} />
                <RenderField label="Release Date" value={asText(typeData.releaseDate)} icon={Calendar} />
                <RenderField label="License" value={asText(typeData.license)} />
                <RenderField label="Platforms" value={
                  isStringArray(typeData.platforms) && typeData.platforms.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {typeData.platforms.map((platform, index) => (
                        <Badge key={index} variant="outline">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  ) : null
                } />
              </div>
            </div>

            {((isStringArray(typeData.programmingLanguages) && typeData.programmingLanguages.length > 0) || (isStringArray(typeData.dependencies) && typeData.dependencies.length > 0)) && (
              <RenderSection label="Technical Details">
                <div className="grid grid-cols-1 gap-4 w-full">
                  {isStringArray(typeData.programmingLanguages) && typeData.programmingLanguages.length > 0 && (
                    <RenderField label="Programming Languages" value="">
                      <div className="flex flex-wrap gap-1">
                        {typeData.programmingLanguages.map((lang, index) => (
                          <Badge key={index} variant="outline">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </RenderField>
                  )}
                  {isStringArray(typeData.dependencies) && typeData.dependencies.length > 0 && (
                    <RenderField label="Dependencies" value="">
                      <div className="flex flex-wrap gap-1">
                        {typeData.dependencies.map((dep, index) => (
                          <Badge key={index} variant="outline">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </RenderField>
                  )}
                </div>
              </RenderSection>
            )}

            {isStringArray(typeData.features) && typeData.features.length > 0 && (
              <RenderField label="Features" value="">
                <div className="flex flex-wrap gap-1">
                  {typeData.features.map((feature, index) => (
                    <Badge key={index} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </RenderField>
            )}

            {(sourceCodeRepository || apiDocumentation) && (
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Resources</h3>
                <div className="grid grid-cols-1 gap-2">
                  {sourceCodeRepository && (
                    <div className="flex items-center justify-between rounded-md border p-2">
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Source Code Repository</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => window.open(sourceCodeRepository, "_blank")}>
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
                      <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => window.open(apiDocumentation, "_blank")}>
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span className="text-xs">View Docs</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {renderExternalLinkButton()}
          </div>
        )



      case "Photography":
        return (
          <div className="space-y-4">
            <div className={cn("rounded-lg p-4", colorClasses.bgLight)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className={colorClasses.text} />
                  <h3 className="font-medium">Photography</h3>
                </div>
                <Badge variant="outline" className={cn(colorClasses.border, colorClasses.text)}>
                  {asText((typeData as Record<string, unknown>).fileFormat) || "Digital"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <RenderField label="Camera" value={asText((typeData as Record<string, unknown>).camera)} />
              <RenderField label="Lens" value={asText((typeData as Record<string, unknown>).lens)} />
              <RenderField label="Date Taken" value={asText((typeData as Record<string, unknown>).takenDate)} icon={Calendar} />
              <RenderField label="Location" value={asText((typeData as Record<string, unknown>).location)} />
            </div>

            {(asText((typeData as Record<string, unknown>).iso) || asText((typeData as Record<string, unknown>).aperture) || asText((typeData as Record<string, unknown>).shutterSpeed) || asText((typeData as Record<string, unknown>).focalLength)) && (
              <RenderSection label="Camera Settings">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <RenderField label="ISO" value={asText((typeData as Record<string, unknown>).iso)} />
                  <RenderField label="Aperture" value={asText((typeData as Record<string, unknown>).aperture)} />
                  <RenderField label="Shutter Speed" value={asText((typeData as Record<string, unknown>).shutterSpeed)} />
                  <RenderField label="Focal Length" value={asText((typeData as Record<string, unknown>).focalLength)} />
                </div>
              </RenderSection>
            )}

            {(asText((typeData as Record<string, unknown>).exposureMode) || asText((typeData as Record<string, unknown>).whiteBalance) || asText((typeData as Record<string, unknown>).flash)) && (
              <RenderSection label="Additional Settings">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <RenderField label="Exposure Mode" value={asText((typeData as Record<string, unknown>).exposureMode)} />
                  <RenderField label="White Balance" value={asText((typeData as Record<string, unknown>).whiteBalance)} />
                  <RenderField label="Flash" value={asText((typeData as Record<string, unknown>).flash)} />
                  <RenderField label="Resolution" value={asText((typeData as Record<string, unknown>).resolution)} />
                </div>
              </RenderSection>
            )}

            {asText((typeData as Record<string, unknown>).software) && (
              <RenderSection label="Post-Processing">
                <RenderField label="Software Used" value={asText((typeData as Record<string, unknown>).software)} />
              </RenderSection>
            )}

            {renderExternalLinkButton()}
          </div>
        )

      default:
        return (
          <div className="space-y-4">

            <div className="grid grid-cols-1 gap-4">
              {typeData && Object.entries(typeData as Record<string, unknown>)
                .filter(([key]) => !['id', 'image', 'name', 'description', 'externalUrl', 'attributes', 'properties'].includes(key))
                .map(([key, value]) => {
                  if (typeof value === 'object' && value !== null) {
                    return null
                  }

                  // Filter out empty values
                  if (value === undefined || value === null || value === "") return null;

                  return (
                    <div key={key} className="space-y-1">
                      <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="font-medium break-all">{String((value as string | number | boolean) ?? '')}</p>
                    </div>
                  )
                })}
            </div>
            {renderExternalLinkButton()}
          </div>
        )
    }
  }

  return (
    <Card className="glass">
      <CardHeader className={cn("bg-transparent rounded-xl pb-3", colorClasses.bgLight)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-xl", colorClasses.border)}>
              <IconComponent className={cn("h-6 w-6", colorClasses.text)} />
            </div>
            <CardTitle className="text-xl">{asset.name}</CardTitle>
          </div>
          <Badge variant="outline" className={cn(colorClasses.border, colorClasses.text)}>
            #{Number(asset.tokenId)}
          </Badge>
        </div>


      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">{ipType}</TabsTrigger>
            <TabsTrigger value="traits">Traits</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-4">
            {renderIPTypeContent()}
          </TabsContent>
          <TabsContent value="traits" className="mt-4">
            {asset.attributes && asset.attributes.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {asset.attributes.map((attr, i) => (
                  <div key={i} className="flex flex-col p-3 rounded-xl border">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{attr.trait_type}</span>
                    <span className="font-semibold break-all" title={attr.value}>{formatTraitValue(attr.value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No traits available for this asset.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}