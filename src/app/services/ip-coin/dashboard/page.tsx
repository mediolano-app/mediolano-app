"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTokenStore } from "@/app/services/ip-coin/lib/hooks/use-token-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { mockUsers } from "@/app/services/ip-coin/lib/mock-data"
import Link from "next/link"
import {
  PenLine,
  BookOpen,
  BarChart3,
  MessageSquare,
  Heart,
  Eye,
  Clock,
  Calendar,
  FileText,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Share2,
  ExternalLink,
  Sparkles,
  Lightbulb,
  Zap,
  TrendingUp,
  CheckCircle2,
  Search,
  Filter,
  Coins,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  const router = useRouter()
  const { tokens, portfolio } = useTokenStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("projects")

  // Mock projects data
  const projects = [
    {
      id: 1,
      title: "DeFi Explained Simply",
      description: "Breaking down complex DeFi concepts into simple explanations that anyone can understand.",
      status: "published",
      category: "Education",
      tags: ["defi", "education", "finance", "crypto"],
      coverImage: "/placeholder.svg?height=400&width=600",
      progress: 100,
      tokenSymbol: "DEFI",
      tokenPrice: "0.0025 STRK",
      marketCap: "$3,200",
      views: 1245,
      likes: 132,
      comments: 12,
      lastUpdated: "2 days ago",
      collaborators: [mockUsers[0], mockUsers[2]],
    },
    {
      id: 2,
      title: "NFT Market Analysis",
      description: "Data-driven analysis of NFT market trends, valuations, and future projections.",
      status: "published",
      category: "Analysis",
      tags: ["nft", "market", "analysis", "trends"],
      coverImage: "/placeholder.svg?height=400&width=600",
      progress: 100,
      tokenSymbol: "NFTA",
      tokenPrice: "0.0022 STRK",
      marketCap: "$2,780",
      views: 932,
      likes: 93,
      comments: 9,
      lastUpdated: "5 days ago",
      collaborators: [mockUsers[0], mockUsers[4]],
    },
    {
      id: 3,
      title: "Web3 Gaming Guide",
      description: "A comprehensive guide to blockchain gaming and play-to-earn models.",
      status: "draft",
      category: "Guide",
      tags: ["gaming", "blockchain", "play-to-earn", "nft"],
      coverImage: "/placeholder.svg?height=400&width=600",
      progress: 65,
      tokenSymbol: "GAME",
      tokenPrice: "N/A",
      marketCap: "N/A",
      views: 0,
      likes: 0,
      comments: 0,
      lastUpdated: "1 day ago",
      collaborators: [mockUsers[0]],
    },
    {
      id: 4,
      title: "Metaverse Architecture",
      description: "Exploring design principles for virtual spaces in the metaverse.",
      status: "in-progress",
      category: "Research",
      tags: ["metaverse", "architecture", "design", "virtual-reality"],
      coverImage: "/placeholder.svg?height=400&width=600",
      progress: 40,
      tokenSymbol: "META",
      tokenPrice: "N/A",
      marketCap: "N/A",
      views: 0,
      likes: 0,
      comments: 0,
      lastUpdated: "Just now",
      collaborators: [mockUsers[0], mockUsers[1]],
    },
  ]

  // Mock ideas data
  const ideas = [
    {
      id: 1,
      title: "Tokenized Music Licensing Guide",
      description: "A guide to using blockchain for music rights management and licensing.",
      category: "Guide",
      createdAt: "3 days ago",
      status: "to-develop",
    },
    {
      id: 2,
      title: "DAO Governance Models",
      description: "Analysis of different governance structures for decentralized autonomous organizations.",
      category: "Research",
      createdAt: "1 week ago",
      status: "to-develop",
    },
    {
      id: 3,
      title: "Zero Knowledge Proofs Explained",
      description: "Simplifying ZK proofs for a non-technical audience.",
      category: "Education",
      createdAt: "2 weeks ago",
      status: "to-develop",
    },
  ]

  // Mock analytics data
  const analyticsData = {
    totalViews: 2177,
    totalLikes: 225,
    totalComments: 21,
    totalShares: 87,
    topPerforming: {
      title: "DeFi Explained Simply",
      views: 1245,
      engagement: 10.6,
    },
    recentActivity: [
      {
        type: "view",
        project: "DeFi Explained Simply",
        count: 45,
        time: "Today",
      },
      {
        type: "like",
        project: "NFT Market Analysis",
        count: 12,
        time: "Yesterday",
      },
      {
        type: "comment",
        project: "DeFi Explained Simply",
        count: 3,
        time: "2 days ago",
      },
    ],
  }

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  // Handle creating a new project
  const handleCreateProject = () => {
    router.push("/create")
  }

  // Handle developing an idea into a project
  const handleDevelopIdea = (ideaId: number) => {
    toast({
      title: "Idea Development Started",
      description: "Your idea has been moved to projects as a draft.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Creator Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your intellectual property and content</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setActiveTab("ideas")}>
              <Lightbulb className="h-4 w-4" />
              Idea Bank
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              onClick={handleCreateProject}
            >
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <PenLine className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Ideas</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            {/* Projects Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <span>Sort</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Newest First</DropdownMenuItem>
                    <DropdownMenuItem>Oldest First</DropdownMenuItem>
                    <DropdownMenuItem>Most Popular</DropdownMenuItem>
                    <DropdownMenuItem>Recently Updated</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Project Status Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Published</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                    <PenLine className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Drafts</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden flex flex-col">
                    <div className="relative h-40 bg-muted">
                      <img
                        src={project.coverImage || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status === "published"
                            ? "Published"
                            : project.status === "draft"
                              ? "Draft"
                              : "In Progress"}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/ip/${project.id}`)}>
                              <ExternalLink className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="mr-2 h-4 w-4" /> Share
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription className="mt-2 line-clamp-2">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary">{project.category}</Badge>
                        {project.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 2 && <Badge variant="outline">+{project.tags.length - 2}</Badge>}
                      </div>

                      {project.status !== "published" && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                      )}

                      {project.status === "published" && (
                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                          <div>
                            <p className="text-muted-foreground">Token</p>
                            <p className="font-medium">{project.tokenSymbol}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Price</p>
                            <p className="font-medium">{project.tokenPrice}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Market Cap</p>
                            <p className="font-medium">{project.marketCap}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Views</p>
                            <p className="font-medium">{project.views.toLocaleString()}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{project.lastUpdated}</span>
                        </div>
                        <div className="flex -space-x-2">
                          {project.collaborators.map((user, index) => (
                            <Avatar key={index} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName} />
                              <AvatarFallback>{user.displayName.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <Edit className="h-4 w-4" />
                        {project.status === "published" ? "Update" : "Edit"}
                      </Button>
                      <Button
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                        asChild
                      >
                        <Link href={`/ip/${project.id}`}>
                          <ExternalLink className="h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No projects found</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  {searchQuery
                    ? `No results for "${searchQuery}". Try a different search term.`
                    : "You haven't created any projects yet."}
                </p>
                <Button onClick={handleCreateProject}>Create Your First Project</Button>
              </div>
            )}
          </TabsContent>

          {/* Ideas Tab */}
          <TabsContent value="ideas" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Ideas List */}
              <Card className="flex-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Idea Bank</CardTitle>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" /> Add Idea
                    </Button>
                  </div>
                  <CardDescription>Capture and develop your content ideas</CardDescription>
                </CardHeader>
                <CardContent>
                  {ideas.length > 0 ? (
                    <div className="space-y-4">
                      {ideas.map((idea) => (
                        <Card key={idea.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{idea.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{idea.description}</p>
                                <div className="flex items-center gap-3 mt-2">
                                  <Badge variant="secondary">{idea.category}</Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {idea.createdAt}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDevelopIdea(idea.id)}
                              >
                                <Zap className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                          <div className="px-4 py-2 bg-muted flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Added {idea.createdAt}</span>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2"
                                onClick={() => handleDevelopIdea(idea.id)}
                              >
                                <Zap className="h-3 w-3 mr-1" /> Develop
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No ideas yet</h3>
                      <p className="text-muted-foreground mt-2 mb-4">
                        Start capturing your content ideas to develop later
                      </p>
                      <Button>Add Your First Idea</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Inspiration and Resources */}
              <div className="w-full md:w-80 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Trending Topics</CardTitle>
                    <CardDescription>Popular topics in your niche</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span>Zero Knowledge Proofs</span>
                        </div>
                        <Badge variant="outline">+124%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span>Account Abstraction</span>
                        </div>
                        <Badge variant="outline">+86%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span>Starknet Development</span>
                        </div>
                        <Badge variant="outline">+52%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span>Tokenized Real Assets</span>
                        </div>
                        <Badge variant="outline">+37%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Inspiration</CardTitle>
                    <CardDescription>Ideas to spark your creativity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">Tutorial Series</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Create a step-by-step guide on building a dApp on Starknet
                        </p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">Market Analysis</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Compare Layer 2 solutions and their growth potential
                        </p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">Case Study</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Analyze a successful tokenized content creator's strategy
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                    <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold">{analyticsData.totalViews.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                    <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Likes</p>
                    <p className="text-2xl font-bold">{analyticsData.totalLikes.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                    <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Comments</p>
                    <p className="text-2xl font-bold">{analyticsData.totalComments.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
                    <Share2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Shares</p>
                    <p className="text-2xl font-bold">{analyticsData.totalShares.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Content Performance</CardTitle>
                  <CardDescription>Views and engagement metrics for your content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {projects
                      .filter((project) => project.status === "published")
                      .map((project) => (
                        <div key={project.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{project.title}</span>
                            </div>
                            <Badge variant="outline">{project.tokenSymbol}</Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Views</p>
                              <p className="font-medium">{project.views.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Likes</p>
                              <p className="font-medium">{project.likes.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Comments</p>
                              <p className="font-medium">{project.comments.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Engagement</p>
                              <p className="font-medium">
                                {(((project.likes + project.comments) / project.views) * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <Progress value={(project.views / analyticsData.totalViews) * 100} className="h-2" />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing</CardTitle>
                  <CardDescription>Your best content by engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-medium">{analyticsData.topPerforming.title}</h3>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Views</p>
                          <p className="font-medium">{analyticsData.topPerforming.views.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Engagement</p>
                          <p className="font-medium">{analyticsData.topPerforming.engagement}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Recent Activity</h3>
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-2 pr-4">
                          {analyticsData.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3 pb-2">
                              <div
                                className={`p-2 rounded-full ${
                                  activity.type === "view"
                                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                    : activity.type === "like"
                                      ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                      : "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                }`}
                              >
                                {activity.type === "view" ? (
                                  <Eye className="h-3 w-3" />
                                ) : activity.type === "like" ? (
                                  <Heart className="h-3 w-3" />
                                ) : (
                                  <MessageSquare className="h-3 w-3" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">
                                    {activity.count} new {activity.type}
                                    {activity.count > 1 ? "s" : ""}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">{activity.project}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Token Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Token Performance</CardTitle>
                <CardDescription>Market metrics for your tokenized content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projects
                    .filter((project) => project.status === "published")
                    .map((project) => (
                      <div key={project.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Coins className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{project.tokenSymbol}</span>
                          </div>
                          <Badge variant="outline">{project.tokenPrice}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Market Cap</p>
                            <p className="font-medium">{project.marketCap}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Holders</p>
                            <p className="font-medium">{Math.floor(Math.random() * 100) + 50}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">24h Volume</p>
                            <p className="font-medium">${Math.floor(Math.random() * 1000) + 100}</p>
                          </div>
                        </div>
                        <Progress value={Math.random() * 100} className="h-2" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  )
}
