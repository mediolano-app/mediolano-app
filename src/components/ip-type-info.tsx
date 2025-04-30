"use client"

import { useState } from "react"
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
  Globe,
  Layers,
  FileCode,
  Database,
  Cpu,
  BookMarked,
  Landmark,
  Scale,
  Lightbulb,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Define the possible IP types
type IPType =
  | "Audio"
  | "Art"
  | "Documents"
  | "NFT"
  | "Video"
  | "Patents"
  | "Posts"
  | "Publications"
  | "RWA"
  | "Software"
  | "Custom"

// Mock data for each IP type
const mockIPTypeData = {
  Audio: {
    duration: "3:45",
    genre: "Electronic",
    bpm: 128,
    key: "C Minor",
    releaseDate: "2025-01-15",
    audioFormat: "WAV",
    sampleRate: "48kHz",
    channels: 2,
    composer: "John Doe",
    publisher: "Electronic Music Ltd",
    isrc: "USRC17607839",
    lyrics: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    previewUrl: "/placeholder.mp3",
  },
  Art: {
    medium: "Digital",
    dimensions: "3000x2000 px",
    style: "Abstract",
    colorPalette: ["#FF5733", "#33FF57", "#3357FF", "#F3FF33"],
    creationDate: "2024-12-10",
    software: "Adobe Photoshop",
    printEditions: 10,
    exhibition: "Digital Art Expo 2025",
    materials: ["Digital Canvas", "Procedural Textures"],
    technique: "Digital Painting",
  },
  Documents: {
    documentType: "Legal Agreement",
    pageCount: 24,
    wordCount: 5432,
    language: "English",
    creationDate: "2025-02-20",
    lastModified: "2025-03-05",
    signatories: ["Alice Corp", "Bob LLC"],
    jurisdiction: "Delaware, USA",
    fileFormat: "PDF",
    keywords: ["contract", "agreement", "terms", "conditions"],
  },
  NFT: {
    blockchain: "Ethereum",
    tokenStandard: "ERC-721",
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    tokenId: "42",
    mintDate: "2025-01-30",
    editions: 1,
    rarity: "Legendary",
    traits: [
      { trait_type: "Background", value: "Cosmic" },
      { trait_type: "Character", value: "Robot" },
      { trait_type: "Accessory", value: "Laser Sword" },
    ],
    marketplace: "OpenSea",
    previousOwners: 3,
  },
  Video: {
    duration: "12:34",
    resolution: "4K (3840x2160)",
    frameRate: "60 fps",
    codec: "H.265/HEVC",
    director: "Jane Smith",
    releaseDate: "2025-02-15",
    genre: "Sci-Fi",
    cast: ["Actor One", "Actor Two", "Actor Three"],
    aspectRatio: "16:9",
    language: "English",
    subtitles: ["English", "Spanish", "French"],
    previewUrl: "/placeholder.mp4",
  },
  Patents: {
    patentType: "Utility",
    filingDate: "2024-11-05",
    publicationDate: "2025-05-10",
    grantDate: "2025-08-15",
    patentNumber: "US 12,345,678",
    inventors: ["Inventor One", "Inventor Two"],
    assignee: "Tech Innovations Inc.",
    jurisdiction: "United States",
    classification: "G06F 21/00",
    status: "Granted",
    expirationDate: "2045-11-05",
    claims: 15,
  },
  Posts: {
    platform: "Medium",
    publicationDate: "2025-03-01",
    wordCount: 1250,
    readTime: "5 min",
    category: "Technology",
    tags: ["blockchain", "crypto", "web3", "nft"],
    views: 12500,
    likes: 843,
    comments: 56,
    url: "https://medium.com/@author/article-title",
    lastUpdated: "2025-03-02",
  },
  Publications: {
    publicationType: "Book",
    publisher: "Tech Publishing House",
    publicationDate: "2025-01-20",
    isbn: "978-3-16-148410-0",
    edition: "First Edition",
    pageCount: 320,
    language: "English",
    genre: "Non-fiction",
    format: ["Hardcover", "eBook", "Audiobook"],
    contributors: ["Editor: Jane Editor", "Illustrator: John Artist"],
    reviews: 4.8,
  },
  RWA: {
    assetType: "Real Estate",
    location: "123 Main St, New York, NY",
    acquisitionDate: "2024-12-15",
    value: "$1,250,000",
    tokenizationDate: "2025-01-10",
    fractionalized: true,
    totalShares: 1000,
    regulatoryCompliance: ["SEC", "FINRA"],
    insurancePolicy: "POL-12345-XYZ",
    custodian: "Digital Asset Trust",
    lastValuation: "2025-03-01",
    appreciationRate: "5.2% annually",
  },
  Software: {
    softwareType: "Mobile Application",
    version: "2.1.0",
    releaseDate: "2025-02-10",
    programmingLanguages: ["Swift", "Kotlin"],
    platforms: ["iOS", "Android"],
    license: "Proprietary",
    dependencies: ["React Native", "Firebase", "Redux"],
    apiDocumentation: "https://api.example.com/docs",
    sourceCodeRepository: "https://github.com/example/app",
    buildInstructions: "See README.md in repository",
    features: ["Authentication", "Push Notifications", "Offline Mode"],
  },
  Custom: {
    customType: "Mixed Media Installation",
    dimensions: "3m x 4m x 2.5m",
    materials: ["Digital Displays", "Sculptural Elements", "Interactive Sensors"],
    creationDate: "2025-01-25",
    exhibition: "Future Art Biennale 2025",
    interactivity: true,
    powerRequirements: "220V, 15A",
    installationGuide: "Available upon request",
    maintenanceSchedule: "Quarterly",
    components: ["Visual Display", "Audio System", "Motion Sensors", "Custom Software"],
  },
}

interface IPTypeInfoProps {
  asset: any // In a real app, you would define a proper type for the asset
}

export function IPTypeInfo({ asset }: IPTypeInfoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  // In a real app, you would extract the IP type from the asset metadata
  // For now, we'll determine it based on the asset name or other properties
  const determineIPType = (asset: any): IPType => {
    const name = asset.name.toLowerCase()

    if (name.includes("audio") || name.includes("music") || name.includes("sound")) return "Audio"
    if (name.includes("art") || name.includes("painting") || name.includes("abstract")) return "Art"
    if (name.includes("document") || name.includes("paper") || name.includes("contract")) return "Documents"
    if (name.includes("nft") || name.includes("token") || name.includes("crypto")) return "NFT"
    if (name.includes("video") || name.includes("film") || name.includes("movie")) return "Video"
    if (name.includes("patent") || name.includes("invention")) return "Patents"
    if (name.includes("post") || name.includes("article") || name.includes("blog")) return "Posts"
    if (name.includes("book") || name.includes("publication") || name.includes("journal")) return "Publications"
    if (name.includes("real") || name.includes("property") || name.includes("asset")) return "RWA"
    if (name.includes("software") || name.includes("app") || name.includes("code")) return "Software"

    // For demo purposes, we'll assign types based on asset ID to show different templates
    const id = Number.parseInt(asset.id)
    const types: IPType[] = [
      "Audio",
      "Art",
      "Documents",
      "NFT",
      "Video",
      "Patents",
      "Posts",
      "Publications",
      "RWA",
      "Software",
      "Custom",
    ]
    return types[id % types.length]
  }

  const ipType = determineIPType(asset)
  const typeData = mockIPTypeData[ipType]

  // Get the icon for the IP type
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

  // Get color classes for the IP type
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

  // Render different content based on IP type
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
                  {typeData.audioFormat}
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
                      <span>{typeData.duration}</span>
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
                  {typeData.duration}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Genre</p>
                <p className="font-medium">{typeData.genre}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">BPM</p>
                <p className="font-medium">{typeData.bpm}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Key</p>
                <p className="font-medium">{typeData.key}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Release Date</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {typeData.releaseDate}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">ISRC</p>
                <p className="font-medium">{typeData.isrc}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Technical Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Sample Rate</p>
                  <p className="font-medium">{typeData.sampleRate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Channels</p>
                  <p className="font-medium">{typeData.channels}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Credits</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Composer</p>
                  <p className="font-medium">{typeData.composer}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Publisher</p>
                  <p className="font-medium">{typeData.publisher}</p>
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
                <p className="font-medium">{typeData.medium}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Dimensions</p>
                <p className="font-medium">{typeData.dimensions}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Style</p>
                <p className="font-medium">{typeData.style}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Creation Date</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {typeData.creationDate}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Color Palette</h3>
              <div className="flex gap-2">
                {typeData.colorPalette.map((color, index) => (
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
                  <p className="font-medium">{typeData.software}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Print Editions</p>
                  <p className="font-medium">{typeData.printEditions}</p>
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
                    {typeData.materials.map((material, index) => (
                      <Badge key={index} variant="outline">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Technique</p>
                  <p className="font-medium">{typeData.technique}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Exhibition History</p>
              <p className="font-medium">{typeData.exhibition}</p>
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
                  {typeData.tokenStandard}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Blockchain</p>
                  <p className="font-medium">{typeData.blockchain}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Token ID</p>
                  <p className="font-medium flex items-center gap-1">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    {typeData.tokenId}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Contract Address</p>
                  <p className="font-mono text-xs truncate">{typeData.contractAddress}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mint Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {typeData.mintDate}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Traits</h3>
              <div className="grid grid-cols-3 gap-2">
                {typeData.traits.map((trait, index) => (
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
                <p className="font-medium">{typeData.editions}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Rarity</p>
                <p className="font-medium">{typeData.rarity}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Marketplace</p>
                <p className="font-medium">{typeData.marketplace}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Previous Owners</p>
                <p className="font-medium">{typeData.previousOwners}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View on {typeData.marketplace}
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
                  {typeData.resolution}
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
                  {typeData.duration}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Frame Rate</p>
                <p className="font-medium">{typeData.frameRate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Codec</p>
                <p className="font-medium">{typeData.codec}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Aspect Ratio</p>
                <p className="font-medium">{typeData.aspectRatio}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Production Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Director</p>
                  <p className="font-medium">{typeData.director}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Release Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {typeData.releaseDate}
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
                    {typeData.cast.map((actor, index) => (
                      <Badge key={index} variant="outline">
                        {actor}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Language & Subtitles</p>
                  <p className="font-medium">{typeData.language}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {typeData.subtitles.map((language, index) => (
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

      case "Patents":
        return (
          <div className="space-y-4">
            <div className={cn("rounded-lg p-4", colorClasses.bgLight)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className={colorClasses.text} />
                  <h3 className="font-medium">Patent Information</h3>
                </div>
                <Badge variant="outline" className={cn(colorClasses.border, colorClasses.text)}>
                  {typeData.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Patent Number</p>
                  <p className="font-medium">{typeData.patentNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Patent Type</p>
                  <p className="font-medium">{typeData.patentType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Filing Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {typeData.filingDate}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Grant Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {typeData.grantDate}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Inventors & Assignee</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Inventors</p>
                  <div className="flex flex-wrap gap-1">
                    {typeData.inventors.map((inventor, index) => (
                      <Badge key={index} variant="outline">
                        {inventor}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Assignee</p>
                  <p className="font-medium">{typeData.assignee}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Jurisdiction</p>
                <p className="font-medium flex items-center gap-1">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {typeData.jurisdiction}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Classification</p>
                <p className="font-medium">{typeData.classification}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Expiration Date</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {typeData.expirationDate}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Claims</p>
                <p className="font-medium">{typeData.claims}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Patent PDF
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                View Claims
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
                  {typeData.platform}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Publication Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {typeData.publicationDate}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{typeData.lastUpdated}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Word Count</p>
                  <p className="font-medium">{typeData.wordCount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Read Time</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {typeData.readTime}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Categories & Tags</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{typeData.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {typeData.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Engagement</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Views</p>
                  <p className="font-medium">{typeData.views.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Likes</p>
                  <p className="font-medium">{typeData.likes.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Comments</p>
                  <p className="font-medium">{typeData.comments.toLocaleString()}</p>
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
                Download as PDF
              </Button>
            </div>
          </div>
        )

      case "Publications":
        return (
          <div className="space-y-4">
            <div className={cn("rounded-lg p-4", colorClasses.bgLight)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className={colorClasses.text} />
                  <h3 className="font-medium">Publication Information</h3>
                </div>
                <Badge variant="outline" className={cn(colorClasses.border, colorClasses.text)}>
                  {typeData.publicationType}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Publisher</p>
                  <p className="font-medium">{typeData.publisher}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Publication Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {typeData.publicationDate}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">ISBN</p>
                  <p className="font-medium">{typeData.isbn}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Edition</p>
                  <p className="font-medium">{typeData.edition}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Page Count</p>
                <p className="font-medium">{typeData.pageCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Language</p>
                <p className="font-medium">{typeData.language}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Genre</p>
                <p className="font-medium">{typeData.genre}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="font-medium">{typeData.reviews} / 5</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Available Formats</h3>
              <div className="flex flex-wrap gap-2">
                {typeData.format.map((format, index) => (
                  <Badge key={index} variant="outline">
                    {format}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Contributors</h3>
              <ul className="space-y-1">
                {typeData.contributors.map((contributor, index) => (
                  <li key={index} className="text-sm">
                    {contributor}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <BookMarked className="h-4 w-4" />
                Preview Contents
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Publisher Page
              </Button>
            </div>
          </div>
        )

      case "RWA":
        return (
          <div className="space-y-4">
            <div className={cn("rounded-lg p-4", colorClasses.bgLight)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Building className={colorClasses.text} />
                  <h3 className="font-medium">Real World Asset Information</h3>
                </div>
                <Badge variant="outline" className={cn(colorClasses.border, colorClasses.text)}>
                  {typeData.assetType}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium flex items-center gap-1">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    {typeData.location}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="font-medium">{typeData.value}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Acquisition Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {typeData.acquisitionDate}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tokenization Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {typeData.tokenizationDate}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Tokenization Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Fractionalized</p>
                  <p className="font-medium">{typeData.fractionalized ? "Yes" : "No"}</p>
                </div>
                {typeData.fractionalized && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Shares</p>
                    <p className="font-medium">{typeData.totalShares.toLocaleString()}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Custodian</p>
                  <p className="font-medium">{typeData.custodian}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Valuation</p>
                  <p className="font-medium">{typeData.lastValuation}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Regulatory & Insurance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Regulatory Compliance</p>
                  <div className="flex flex-wrap gap-1">
                    {typeData.regulatoryCompliance.map((reg, index) => (
                      <Badge key={index} variant="outline">
                        {reg}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Insurance Policy</p>
                  <p className="font-medium">{typeData.insurancePolicy}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Appreciation Rate</p>
              <p className="font-medium">{typeData.appreciationRate}</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Landmark className="h-4 w-4" />
                View Ownership Records
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                View Legal Documents
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
                  {typeData.softwareType}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Version</p>
                  <p className="font-medium">{typeData.version}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Release Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {typeData.releaseDate}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">License</p>
                  <p className="font-medium">{typeData.license}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Platforms</p>
                  <div className="flex flex-wrap gap-1">
                    {typeData.platforms.map((platform, index) => (
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
                    {typeData.programmingLanguages.map((lang, index) => (
                      <Badge key={index} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Dependencies</p>
                  <div className="flex flex-wrap gap-1">
                    {typeData.dependencies.map((dep, index) => (
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
                {typeData.features.map((feature, index) => (
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

      case "Custom":
        return (
          <div className="space-y-4">
            <div className={cn("rounded-lg p-4", colorClasses.bgLight)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Settings className={colorClasses.text} />
                  <h3 className="font-medium">Custom IP Information</h3>
                </div>
                <Badge variant="outline" className={cn(colorClasses.border, colorClasses.text)}>
                  {typeData.customType}
                </Badge>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This is a custom IP type with specialized metadata fields tailored to this specific asset.
                </AlertDescription>
              </Alert>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Dimensions</p>
                <p className="font-medium">{typeData.dimensions}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Creation Date</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {typeData.creationDate}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Exhibition</p>
                <p className="font-medium">{typeData.exhibition}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Interactive</p>
                <p className="font-medium">{typeData.interactivity ? "Yes" : "No"}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Materials</h3>
              <div className="flex flex-wrap gap-1">
                {typeData.materials.map((material, index) => (
                  <Badge key={index} variant="outline">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Components</h3>
              <div className="grid grid-cols-2 gap-2">
                {typeData.components.map((component, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
                    <span className="text-sm">{component}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Power Requirements</p>
                <p className="font-medium">{typeData.powerRequirements}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Maintenance</p>
                <p className="font-medium">{typeData.maintenanceSchedule}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Installation Guide
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                View Components
              </Button>
            </div>
          </div>
        )

      default:
        return (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">No template-specific information available for this asset.</p>
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
            #{asset.id}
          </Badge>
        </div>
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
              <pre>{JSON.stringify(typeData, null, 2)}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
