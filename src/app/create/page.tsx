"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Sparkles,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Shield,
  Music,
  Palette,
  FileText,
  Video,
  Code,
} from "lucide-react"
import Link from "next/link"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreationOptionCard } from "@/components/create/creation-option-card"
import { CreationOptionDetails } from "@/components/create/creation-option-details"

const creationOptions = [
  {
    id: "asset",
    title: "Create Your Programmable IP",
    description: "Register and protect your intellectual property with comprehensive metadata and licensing options.",
    icon: "Shield",
    color: "blue",
    category: "core",
    trending: true,
    popular: true,
    estimatedTime: "1-5 min",
    successRate: 99,
    userCount: "55",
    benefits: [
      "Comprehensive IP protection",
      "Decentralized Authorship",
      "Proof of Ownership",
      "Global Reach and Recognition",
    ],
    process: [
      "Upload your asset and add basic information",
      "Configure metadata and licensing terms",
      "Review and confirm registration",
      "Self custody your IP onchain",
    ],
    href: "/create/asset",
    useCase: "Perfect for creators who want to customize their Programmable IP.",
    gradient: "from-blue-500 to-blue-700",
    iconColor: "text-blue-500",
    requirements: ["Original work", "Metadata"],
    timeEstimate: "1-5 min",
    tags: ["IP", "Asset", "Protection"],
    featured: true,
    complexity: "Medium",
    useCases: ["Custom IP registration", "Metadata management"],
    completionRate: 95,
  },
  {
    id: "templates",
    title: "Creat with IP Template",
    description: "Choose from optimized templates designed for specific types of content.",
    icon: "Grid3X3",
    color: "purple",
    category: "core",
    trending: true,
    popular: true,
    estimatedTime: "1-5 min",
    successRate: 99,
    userCount: "28",
    benefits: [
      "Pre-configured for your asset type",
      "Industry-specific metadata fields",
      "Optimized licensing templates",
      "Faster registration process",
    ],
    process: [
      "Select the template that matches your asset type",
      "Fill in template-specific information",
      "Customize licensing and metadata",
      "Complete registration with optimized settings",
    ],
    href: "/create/templates",
    useCase: "Ideal for creators working with specific asset types who want streamlined registration.",
    gradient: "from-purple-500 to-purple-700",
    iconColor: "text-purple-500",
    requirements: ["Template selection"],
    timeEstimate: "2-5 min",
    tags: ["Template", "IP", "Creator"],
    featured: false,
    complexity: "Low",
    useCases: ["Quick IP registration", "Industry templates"],
    completionRate: 99,
  },
  {
    id: "collection",
    title: "Create Collection",
    description: "Group related assets together for better organization and batch management.",
    icon: "BookOpen",
    color: "green",
    category: "organization",
    trending: false,
    popular: false,
    estimatedTime: "1-2 min",
    successRate: 97,
    userCount: "89",
    benefits: ["Organize related assets", "Batch licensing options", "Unified branding", "Easier portfolio management"],
    process: [
      "Define collection details and theme",
      "Set collection-wide licensing terms",
      "Add assets to your collection",
      "Publish and manage your collection",
    ],
    href: "/create/collection",
    useCase: "Great for creators with multiple related works or series of assets.",
    gradient: "from-green-500 to-green-700",
    iconColor: "text-green-500",
    requirements: ["Multiple assets"],
    timeEstimate: "1-2 min",
    tags: ["Collection", "Batch", "Organization"],
    featured: false,
    complexity: "Low",
    useCases: ["Showcase assets", "Portfolio organization"],
    completionRate: 92,
  },
]

const templates = [
  {
    id: "audio",
    name: "Audio",
    icon: "Music",
    description: "Music, podcasts, sound effects, and audio content",
    color: "blue",
    category: "media",
    count: "42",
  },
  {
    id: "art",
    name: "Art",
    icon: "Palette",
    description: "Digital art, illustrations, paintings, and visual creations",
    color: "purple",
    category: "media",
    count: "12",
  },
  {
    id: "video",
    name: "Video",
    icon: "Video",
    description: "Films, animations, tutorials, and video content",
    color: "red",
    category: "media",
    count: "61",
  },
  {
    id: "software",
    name: "Software",
    icon: "Code",
    description: "Applications, code, algorithms, and digital tools",
    color: "violet",
    category: "tech",
    count: "37",
  },
  {
    id: "documents",
    name: "Documents",
    icon: "FileText",
    description: "Contracts, agreements, manuals, and written content",
    color: "gray",
    category: "legal",
    count: "29",
  },
  {
    id: "nft",
    name: "NFT",
    icon: "Hexagon",
    description: "Non-fungible tokens and blockchain assets",
    color: "teal",
    category: "blockchain",
    count: "84",
  },
]

const categories = [
  { id: "all", name: "All", count: 6 },
  { id: "core", name: "Core", count: 3 },
  { id: "organization", name: "Organization", count: 1 },
  { id: "advanced", name: "Advanced", count: 2 },
]

export default function CreatePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popularity")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const filteredOptions = creationOptions.filter((option) => {
    const matchesSearch =
      option.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.useCase?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || option.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const sortedOptions = [...filteredOptions].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return Number.parseInt(b.userCount.replace("k", "")) - Number.parseInt(a.userCount.replace("k", ""))
      case "time":
        return Number.parseInt(a.estimatedTime.split("-")[0]) - Number.parseInt(b.estimatedTime.split("-")[0])
      case "success":
        return b.successRate - a.successRate
      case "name":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  // ✨ NEW – always search in the full list to guarantee a match
  const selectedOptionData = creationOptions.find((opt) => opt.id === selectedOption)

  return (
    <div className="min-h-screen">
    

      <main className="container mx-auto p-4 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center py-8 md:py-12">
          <div className="inline-flex items-center gap-2 bg-blue/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
            
            Programmable IP for the Integrity Web
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Protect Your{" "}
            <span className="text-blue-600">
              Creative Work
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Register, protect, and monetize your intellectual property with our comprehensive platform. Zero fees, full
            ownership, instant protection.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Zero</div>
              <div className="text-sm text-muted-foreground">Fees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Self</div>
              <div className="text-sm text-muted-foreground"> Custody</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Onchain</div>
              <div className="text-sm text-muted-foreground">Authorship</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Global</div>
              <div className="text-sm text-muted-foreground">Protection</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link href="/create/asset">
              <Button size="lg" className="w-full sm:w-auto">
                <Shield className="mr-2 h-5 w-5" />
                Create IP Asset
              </Button>
            </Link>
            <Link href="/create/templates">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <Grid3X3 className="mr-2 h-5 w-5" />
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search creation options..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px] h-12">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px] h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popular</SelectItem>
                  <SelectItem value="time">Fastest</SelectItem>
                 
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <div className="hidden md:flex border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="h-8"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Options Grid */}
          <div className="lg:col-span-3">
            {sortedOptions.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No options found matching your search.</p>
                  <p className="text-sm">Try adjusting your filters or search terms.</p>
                </div>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </Card>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
                {sortedOptions.map((option) => (
                  <CreationOptionCard
                    key={option.id}
                    option={option}
                    viewMode={viewMode}
                    isSelected={selectedOption === option.id}
                    onSelect={() => setSelectedOption(selectedOption === option.id ? null : option.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {selectedOptionData ? (
                <CreationOptionDetails option={selectedOptionData} />
              ) : (
                <>
                  {/* Popular Templates */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Popular Templates
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {templates.slice(0, 4).map((template) => {
                        const getIconComponent = (iconName: string) => {
                          switch (iconName) {
                            case "Music":
                              return <Music className="h-4 w-4" />
                            case "Palette":
                              return <Palette className="h-4 w-4" />
                            case "Video":
                              return <Video className="h-4 w-4" />
                            case "Code":
                              return <Code className="h-4 w-4" />
                            default:
                              return <FileText className="h-4 w-4" />
                          }
                        }

                        return (
                          <Link key={template.id} href={`/create/templates/${template.id}`}>
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                              <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                                {getIconComponent(template.icon)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">{template.name}</div>
                                {/*<div className="text-xs text-muted-foreground">{template.count} created</div>*/}
                              </div>
                              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          </Link>
                        )
                      })}
                      <Link href="/create/templates">
                        <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                          View All Templates
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Help Card 
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Need Help?
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        New to IP protection? Our guide will help you choose the right option for your needs.
                      </p>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        View Getting Started Guide
                      </Button>
                    </CardContent>
                  </Card>*/}

                  {/* Benefits */}
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Why register with Mediolano?</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Zero fees protocol and dapp</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Full ownership onchain</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Instant tokenization</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Powered on Starknet Blockchain</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
