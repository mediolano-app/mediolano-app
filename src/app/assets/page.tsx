"use client"

import { useState, useEffect } from "react"
import { CardContent } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import NFTCard from "@/components/assets/nft-card"
import NFTSkeleton from "@/components/assets/nft-skeleton"
import { Button } from "@/components/ui/button"
import {
  PlusCircle,
  Filter,
  Search,
  Send,
  FileText,
  LayoutGrid,
  LayoutList,
  ChevronDown,
  Clock,
  TrendingUp,
  Zap,
  BarChart3,
  Wallet,
  Shield,
  Sparkles,
  Layers,
  Palette,
  Music,
  Code,
  Hexagon,
  Video,
  Lightbulb,
  BadgeCheck,
  Box,
  DollarSign,
  ExternalLink,
  Verified,
  CircleHelp,
  Globe,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import type { IPType } from "@/types/asset"
import { 
  getKnownCids, 
  loadIPFSMetadataInBackground 
} from '@/utils/ipfs';

// temporary data - would be mixed with IPFS data if is necessary
import { assets as mockAssets, recentActivity, collections, templates, calculatePortfolioStats } from "@/app/assets/lib/mock-data"

interface EnhancedAsset {
  id: string;
  name: string;
  creator: string;
  verified?: boolean;
  image: string;
  collection?: string;
  licenseType?: string;
  description: string;
  registrationDate: string;
  type: IPType;
  templateType?: string;
  protectionLevel?: number;
  value?: string;
  ipfsCid?: string; 
}

export default function AssetsPage() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "value">("newest")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCollection, setFilterCollection] = useState<string>("all")
  const [filterLicense, setFilterLicense] = useState<string>("all")
  const [filterTemplate, setFilterTemplate] = useState<string>("all")
  const [assets, setAssets] = useState<EnhancedAsset[]>([])

  console.log(assets);

  useEffect(() => {
    // Cargar datos y enriquecerlos con información de IPFS
    const loadAssetsWithIPFS = async () => {
      setLoading(true);
      try {
        // Obtener los CIDs conocidos
        const knownCids = getKnownCids();

        // Enriquecer los assets mock con información de IPFS
        const enhancedAssets = mockAssets.map((asset) => {
          const ipfsCid = knownCids[asset.id] || null;
          
          // Retornar el asset enriquecido
          return {
            ...asset,
            ...(ipfsCid && { ipfsCid })
          } as EnhancedAsset;
        });

        // Actualizar el estado con los assets enriquecidos inmediatamente
        setAssets(enhancedAssets);
        setLoading(false);

        // Cargar metadatos de IPFS en segundo plano
        loadIPFSMetadataInBackground(
          enhancedAssets,
          (updatedAssets) => {
            setAssets(updatedAssets);
          }
        );
      } catch (error) {
        console.error("Error loading assets with IPFS data:", error);
        // En caso de error, usar los datos mock sin modificar
        setAssets(mockAssets as EnhancedAsset[]);
        setLoading(false);
      }
    };

    loadAssetsWithIPFS();
  }, []);



  // Get unique collections, types, licenses, and templates for filters
  const uniqueCollections = Array.from(new Set(assets.map((asset) => asset.collection)))
  const uniqueTypes = Array.from(new Set(assets.map((asset) => asset.type)))
  const uniqueLicenses = Array.from(new Set(assets.map((asset) => asset.licenseType)))
  const uniqueTemplates = Array.from(new Set(assets.map((asset) => asset.templateType).filter(Boolean)))



  // Calculate portfolio statistics
  const portfolioStats = calculatePortfolioStats(assets)






  // Filter assets based on search query and filters
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      searchQuery === "" ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.collection && asset.collection.toLowerCase().includes(searchQuery.toLowerCase())) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.templateType && asset.templateType.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = filterType === "all" || asset.type === filterType
    const matchesCollection = filterCollection === "all" || asset.collection === filterCollection
    const matchesLicense = filterLicense === "all" || asset.licenseType === filterLicense
    const matchesTemplate = filterTemplate === "all" || asset.templateType === filterTemplate

    return matchesSearch && matchesType && matchesCollection && matchesLicense && matchesTemplate
  })



  // Sort assets
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
      case "oldest":
        return new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime()
      case "name":
        return a.name.localeCompare(b.name)
      case "value":
        return Number.parseFloat(b.value?.split(" ")[0] || "0") - Number.parseFloat(a.value?.split(" ")[0] || "0")
      default:
        return 0
    }
  })




  const renderActivityIcon = (type: string) => {
    switch (type) {
      case "view":
        return <Eye className="h-4 w-4 text-blue-500" />
      case "license":
        return <FileCheck className="h-4 w-4 text-green-500" />
      case "transfer":
        return <Send className="h-4 w-4 text-purple-500" />
      case "creation":
        return <PlusCircle className="h-4 w-4 text-amber-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }



  const renderTypeIcon = (type: IPType) => {
    switch (type) {
      case "Art":
        return <Palette className="h-4 w-4 text-purple-500" />
      case "Audio":
        return <Music className="h-4 w-4 text-blue-500" />
      case "Video":
        return <Video className="h-4 w-4 text-red-500" />
      case "Document":
        return <FileText className="h-4 w-4 text-yellow-500" />
      case "Software":
        return <Code className="h-4 w-4 text-violet-500" />
      case "NFT":
        return <Hexagon className="h-4 w-4 text-teal-500" />
      case "Patent":
        return <Lightbulb className="h-4 w-4 text-amber-500" />
      case "RWA":
        return <Globe className="h-4 w-4 text-green-500" />
      case "Trademark":
        return <BadgeCheck className="h-4 w-4 text-green-500" />
      default:
        return <Box className="h-4 w-4 text-gray-500" />
    }
  }

  const renderNFTCard = (asset: EnhancedAsset, index: number) => {
    return (
      <motion.div
        key={asset.id}
        className="masonry-item mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <div className="relative">
          {/* NFT Card estándar */}
          <NFTCard
            id={asset.id}
            name={asset.name}
            creator={asset.creator}
            verified={asset.verified}
            image={asset.image}
            collection={asset.collection}
            licenseType={asset.licenseType}
            description={asset.description}
            registrationDate={asset.registrationDate}
            type={asset.type as IPType}
            templateType={asset.templateType}
            protectionLevel={asset.protectionLevel}
          />
          
            {/* IPFS flag(if available) */}
          {asset.ipfsCid && (
            <div className="absolute top-3 right-3">
              <Badge variant="outline" className="bg-background/80 border-teal-500 text-teal-500">
                <Hexagon className="mr-1 h-3 w-3" />
                IPFS
              </Badge>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  const renderNFTCardList = (asset: EnhancedAsset, index: number) => {
    return (
      <motion.div
        key={asset.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
      >
        <Card className="overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-48 h-48 sm:h-auto relative">
              <Image
                src={asset.image || "/placeholder.svg"}
                alt={asset.name}
                fill
                className="object-cover"
              />
              {asset.ipfsCid && (
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="bg-background/80 border-teal-500 text-teal-500">
                    <Hexagon className="mr-1 h-3 w-3" />
                    IPFS
                  </Badge>
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{asset.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    by {asset.creator}{" "}
                    {asset.verified && <Verified className="h-3.5 w-3.5 text-blue-400" />}
                  </p>
                </div>
                <Badge variant="outline">{asset.value}</Badge>
              </div>

              {/* Template Type - Highlighted */}
              <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/30 mb-3 max-w-xs">
                <div
                  className={`rounded-md p-1.5 ${
                    asset.type === "Art"
                      ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800/30"
                      : asset.type === "Audio"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
                        : asset.type === "Software"
                          ? "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200 dark:border-violet-800/30"
                          : asset.type === "NFT"
                            ? "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800/30"
                            : asset.type === "Patent"
                              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/30"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800/30"
                  }`}
                >
                  {renderTypeIcon(asset.type as IPType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">Template</div>
                  <div className="text-sm font-medium truncate" title={asset.templateType}>
                    {asset.templateType}
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{asset.description}</p>

              <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm mb-4">
                <div>
                  <span className="text-muted-foreground">Collection:</span>{" "}
                  <span className="font-medium">{asset.collection}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">License:</span>{" "}
                  <span className="font-medium">{asset.licenseType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Registered:</span>{" "}
                  <span className="font-medium">{asset.registrationDate}</span>
                </div>
              </div>

              <div className="mt-auto flex justify-end gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Asset Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Proof of Ownership</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Send className="mr-2 h-4 w-4" />
                      <span>Transfer Asset</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <FileCheck className="mr-2 h-4 w-4" />
                      <span>Licensing Options</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Asset Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <DollarSign className="mr-2 h-4 w-4" />
                      <span>Monetize</span>
                    </DropdownMenuItem>
                    {asset.ipfsCid && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                          <Hexagon className="mr-2 h-4 w-4" />
                          <a
                            href={`https://gateway.pinata.cloud/ipfs/${asset.ipfsCid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                          >
                            View on IPFS
                          </a>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href={`/assets/${asset.id}`}>
                  <Button size="sm">
                    View IP
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
     
      
      <main className="container mx-auto p-4 py-6">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Welcome and Stats */}
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-bold">Welcome back</h2>
                <p className="text-muted-foreground">Manage your intellectual property portfolio</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Card className="bg-blue/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Assets</h3>
                      <Box className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">{portfolioStats.totalAssets}</p>
                  </CardContent>
                </Card>

                <Card className="bg-green-500/5 border-green-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Collections</h3>
                      <Layers className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">1</p>
                  </CardContent>
                </Card>

                <Card className="bg-purple-500/5 border-purple-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Licensings</h3>
                      <FileCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">45</p>
                    </div>
                  </CardContent>
                </Card>
              </div>


              <Card className="bg-gradient-to-br from-blue/5 to-purple/10 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue/20 p-3">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Intellectual Property Protection Onchain</h3>
                      <p className="text-sm text-muted-foreground">Your portfolio is well-protected with Mediolano Proof of Ownership</p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Permissionless Protection</span>
                      <span className="font-medium">{portfolioStats.protectionLevel}%</span>
                    </div>
                    <Progress value={portfolioStats.protectionLevel} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Protection under The Bernie Sanders Act and The Copyright Act of 1976, valid in 181 countries for 50 to 70 years, according to jurisdiction.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Recent Activity</h3>
                    <Badge variant="outline" className="text-xs">
                     Preview
                    </Badge>
                  </div>
                  <ScrollArea className="h-[180px]">
                    <div className="space-y-3">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="mt-0.5">{renderActivityIcon(activity.type)}</div>
                          <div>
                            <p className="text-sm font-medium">
                              {activity.type === "creation"
                                ? "Created"
                                : activity.type === "view"
                                  ? "Viewed by"
                                  : activity.type === "license"
                                    ? "Licensed by"
                                    : "Transferred to"}{" "}
                              {activity.user !== "You" && activity.user}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.assetName} • {activity.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions and Trending */}
            <div className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                
                <Link href="/create">
                  <Card className="hover:bg-blue/5 transition-colors cursor-pointer h-full">
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="rounded-full bg-blue/10 w-10 h-10 flex items-center justify-center mb-3">
                        <PlusCircle className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium">Create New IP</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Register and protect your intellectual property
                      </p>
                      <div className="mt-auto pt-2">
                        <Badge variant="outline" className="text-xs">
                          {templates.length} templates
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/portfolio">
                  <Card className="hover:bg-blue/5 transition-colors cursor-pointer h-full">
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="rounded-full bg-blue/10 w-10 h-10 flex items-center justify-center mb-3">
                        <Send className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium">My Portfolio</h3>
                      <p className="text-sm text-muted-foreground mt-1">View and manage your assets;</p>
                      <div className="mt-auto pt-2">
                        <Badge variant="outline" className="text-xs">
                          Open Portfolio
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>



                <Link href="/lisensing">
                  <Card className="hover:bg-blue/5 transition-colors cursor-pointer h-full">
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="rounded-full bg-blue/10 w-10 h-10 flex items-center justify-center mb-3">
                        <PlusCircle className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium">Create Licensing</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Create a licensing agreement for your IP
                      </p>
                      <div className="mt-auto pt-2">
                        <Badge variant="outline" className="text-xs">
                          New licensing
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/transfer">
                  <Card className="hover:bg-blue/5 transition-colors cursor-pointer h-full">
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="rounded-full bg-blue/10 w-10 h-10 flex items-center justify-center mb-3">
                        <Send className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium">Transfer Assets</h3>
                      <p className="text-sm text-muted-foreground mt-1">Transfer ownership of your IP assets</p>
                      <div className="mt-auto pt-2">
                        <Badge variant="outline" className="text-xs">
                          Secure transfer
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                

                
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Trending Templates
                    </h3>
                    <Link href="/create/templates">
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        View all
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {templates.slice(0, 4).map((template) => (
                      <div
                        key={template.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div
                          className={`rounded-md p-2 ${
                            template.type === "Art"
                              ? "bg-purple-100 dark:bg-purple-900/30"
                              : template.type === "Audio"
                                ? "bg-blue-100 dark:bg-blue-900/30"
                                : template.type === "Software"
                                  ? "bg-violet-100 dark:bg-violet-900/30"
                                  : template.type === "NFT"
                                    ? "bg-teal-100 dark:bg-teal-900/30"
                                    : template.type === "Patent"
                                      ? "bg-amber-100 dark:bg-amber-900/30"
                                      : "bg-gray-100 dark:bg-gray-900/30"
                          }`}
                        >
                          {renderTypeIcon(template.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{template.name}</p>
                          <p className="text-xs text-muted-foreground">{template.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              
            </div>
          </motion.div>
        </div>

        {/* Mobile Quick Actions */}
        <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <Link href="/create/templates">
            <Button size="sm" className="flex items-center gap-2 whitespace-nowrap">
              <PlusCircle className="h-4 w-4" />
              Create New IP
            </Button>
          </Link>
          <Link href="/transfer">
            <Button variant="outline" size="sm" className="flex items-center gap-2 whitespace-nowrap">
              <Send className="h-4 w-4" />
              Transfer
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="flex items-center gap-2 whitespace-nowrap">
            <FileText className="h-4 w-4" />
            Templates
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 whitespace-nowrap">
            <Zap className="h-4 w-4" />
            Quick Protect
          </Button>
        </div>



        {/* Asset Management Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Programmable IP</h2>
              <p className="text-muted-foreground">Manage your intellectual property and licensing</p>
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    <Badge className="ml-2" variant="secondary">
                      {(filterType !== "all" ? 1 : 0) +
                        (filterCollection !== "all" ? 1 : 0) +
                        (filterLicense !== "all" ? 1 : 0) +
                        (filterTemplate !== "all" ? 1 : 0)}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter Assets</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuLabel>Asset Type</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem checked={filterType === "all"} onCheckedChange={() => setFilterType("all")}>
                    All Types
                  </DropdownMenuCheckboxItem>
                  {uniqueTypes.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={filterType === type}
                      onCheckedChange={() => setFilterType(type)}
                    >
                      <span className="flex items-center gap-1.5">
                        {renderTypeIcon(type as IPType)}
                        {type}
                      </span>
                    </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuLabel>Template</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filterTemplate === "all"}
                    onCheckedChange={() => setFilterTemplate("all")}
                  >
                    All Templates
                  </DropdownMenuCheckboxItem>
                  {uniqueTemplates.map((template) => (
                    <DropdownMenuCheckboxItem
                      key={template}
                      checked={filterTemplate === template}
                      onCheckedChange={() => template && setFilterTemplate(template)}
                    >
                      {template}
                    </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuLabel>Collection</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filterCollection === "all"}
                    onCheckedChange={() => setFilterCollection("all")}
                  >
                    All Collections
                  </DropdownMenuCheckboxItem>
                  {uniqueCollections.map((collection) => (
                    <DropdownMenuCheckboxItem
                      key={collection}
                      checked={filterCollection === collection}
                      onCheckedChange={() => setFilterCollection(collection)}
                    >
                      {collection}
                    </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuLabel>License Type</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filterLicense === "all"}
                    onCheckedChange={() => setFilterLicense("all")}
                  >
                    All Licenses
                  </DropdownMenuCheckboxItem>
                  {uniqueLicenses.map((license) => (
                    <DropdownMenuCheckboxItem
                      key={license}
                      checked={filterLicense === license}
                      onCheckedChange={() => setFilterLicense(license)}
                    >
                      {license}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/create/templates">
                <Button className="h-9">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New IP
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search assets by name, creator, or collection..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="value">Value (High-Low)</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none h-10 w-10"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" />
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none h-10 w-10"
                  onClick={() => setViewMode("list")}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Assets</TabsTrigger>
              <TabsTrigger value="licensed">Licensed</TabsTrigger>
              <TabsTrigger value="created">Created</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {loading ? (
                <div className="grid grid-cols-3 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <NFTSkeleton key={i} />
                    ))}
                </div>
              ) : sortedAssets.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No assets found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    We couldn't find any assets matching your search criteria. Try adjusting your filters or search
                    query.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setFilterType("all")
                      setFilterCollection("all")
                      setFilterLicense("all")
                      setFilterTemplate("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="masonry-grid grid grid-cols-3 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {sortedAssets.map((asset, index) => renderNFTCard(asset, index))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedAssets.map((asset, index) => renderNFTCardList(asset, index))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="licensed">
              <div className="rounded-lg border p-8 text-center">
                <h3 className="text-xl font-medium mb-2">No Licensed Assets</h3>
                <p className="text-muted-foreground mb-4">You haven't licensed any IP assets yet.</p>
                <Button>Browse Marketplace</Button>
              </div>
            </TabsContent>

            <TabsContent value="created">
              <div className={viewMode === "grid" ? "masonry-grid" : "space-y-4"}>
                {assets
                  .filter((a) => a.creator === "0xArtist")
                  .map((asset, index) => (
                    <div key={asset.id} className={viewMode === "grid" ? "masonry-item mb-6" : ""}>
                      {viewMode === "grid" 
                        ? renderNFTCard(asset, index)
                        : renderNFTCardList(asset, index)
                      }
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="collections">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {collections.map((collection) => (
                  <Card key={collection.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <Image
                        src={collection.coverImage || "/placeholder.svg"}
                        alt={collection.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div className="p-4 text-white">
                          <h3 className="text-xl font-bold">{collection.name}</h3>
                          <p className="text-sm opacity-90">{collection.assetCount} assets</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Value</p>
                          <p className="font-medium">{collection.totalValue}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`flex items-center gap-1 ${
                            collection.type === "Art"
                              ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                              : collection.type === "Audio"
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                : collection.type === "Software"
                                  ? "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                                  : collection.type === "NFT"
                                    ? "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
                                    : collection.type === "Patent"
                                      ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                      : "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400"
                          }`}
                        >
                          {renderTypeIcon(collection.type as IPType)}
                          {collection.type}
                        </Badge>
                      </div>
                      <Button variant="outline" className="w-full">
                        View Collection
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}

function Eye(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function FileCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  )
}