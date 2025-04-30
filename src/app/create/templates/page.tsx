"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Search, Info, ExternalLink } from "lucide-react"
import Link from "next/link"

import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { TemplateCard } from "@/components/template-card"
import { TemplateDetails } from "@/components/template-details"

// Template data
const templates = [
  {
    id: "art",
    name: "Art",
    icon: "Palette",
    description: "Register digital or physical artwork, illustrations, paintings, and other visual creations.",
    examples: ["Digital illustrations", "Paintings", "Sculptures", "Photography", "Graphic designs"],
    fields: ["Title", "Artist", "Medium", "Dimensions", "Creation date", "Style"],
    popular: true,
    color: "purple",
  },
  {
    id: "audio",
    name: "Audio",
    icon: "Music",
    description: "Register audio files, music, sound effects, podcasts, and other audio content.",
    examples: ["Music tracks", "Sound effects", "Podcasts", "Voice recordings", "Audio books"],
    fields: ["Title", "Creator", "Duration", "Genre", "Release date", "BPM", "Key"],
    popular: true,
    color: "blue",
  },
  {
    id: "document",
    name: "Documents",
    icon: "FileText",
    description: "Register written documents, contracts, agreements, and other text-based content.",
    examples: ["Legal documents", "Contracts", "Research papers", "Manuscripts", "Technical documentation"],
    fields: ["Title", "Author", "Document type", "Page count", "Creation date", "Version"],
    popular: false,
    color: "gray",
  },
  {
    id: "nft",
    name: "NFT",
    icon: "Hexagon",
    description: "Register non-fungible tokens and blockchain-based digital assets.",
    examples: ["Digital collectibles", "Crypto art", "Virtual real estate", "Game assets", "Tokenized media"],
    fields: ["Title", "Creator", "Blockchain", "Token standard", "Collection name", "Mint date"],
    popular: true,
    color: "teal",
  },
  {
    id: "video",
    name: "Video",
    icon: "Video",
    description: "Register video content, films, animations, and other moving image media.",
    examples: ["Short films", "Animations", "Video clips", "Tutorials", "Documentaries"],
    fields: ["Title", "Director", "Duration", "Resolution", "Release date", "Genre"],
    popular: false,
    color: "red",
  },
  {
    id: "patents",
    name: "Patents",
    icon: "Award",
    description: "Register patents, inventions, and novel technological solutions.",
    examples: ["Inventions", "Technological processes", "Industrial designs", "Utility models", "Improvements"],
    fields: ["Title", "Inventor", "Patent type", "Filing date", "Priority date", "Classification"],
    popular: false,
    color: "amber",
  },
  {
    id: "post",
    name: "Posts",
    icon: "MessageSquare",
    description: "Register social media posts, articles, and other short-form content.",
    examples: ["Blog posts", "Social media content", "Short articles", "Forum posts", "Comments"],
    fields: ["Title", "Author", "Platform", "Publication date", "Category", "Word count"],
    popular: false,
    color: "sky",
  },
  {
    id: "publication",
    name: "Publications",
    icon: "BookOpen",
    description: "Register books, journals, magazines, and other published materials.",
    examples: ["Books", "E-books", "Journals", "Magazines", "Academic papers"],
    fields: ["Title", "Author", "Publisher", "ISBN", "Publication date", "Edition", "Genre"],
    popular: false,
    color: "indigo",
  },
  {
    id: "rwa",
    name: "RWA",
    icon: "Building",
    description: "Register real-world assets that have been tokenized or digitally represented.",
    examples: ["Real estate", "Commodities", "Collectibles", "Vehicles", "Luxury goods"],
    fields: ["Asset name", "Owner", "Asset type", "Value", "Location", "Acquisition date"],
    popular: false,
    color: "emerald",
  },
  {
    id: "software",
    name: "Software",
    icon: "Code",
    description: "Register software applications, code, algorithms, and digital tools.",
    examples: ["Applications", "Games", "Algorithms", "Libraries", "Frameworks"],
    fields: ["Title", "Developer", "Version", "Programming language", "Release date", "License type"],
    popular: true,
    color: "violet",
  },
  {
    id: "asset",
    name: "Custom",
    icon: "Settings",
    description: "Create a custom template for your unique intellectual property needs.",
    examples: ["Mixed media", "Hybrid assets", "Novel IP types", "Specialized content", "Experimental works"],
    fields: ["Custom fields", "Flexible structure", "Adaptable metadata", "Personalized attributes"],
    popular: false,
    color: "slate",
  },
]

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "popular">("all")

  // Filter templates based on search query
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter templates based on active tab
  const displayedTemplates =
    activeTab === "popular" ? filteredTemplates.filter((template) => template.popular) : filteredTemplates

  // Get the selected template object
  const selectedTemplateObject = templates.find((template) => template.id === selectedTemplate)

  return (
    <div className="min-h-screen">

      <header className="top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">IP Templates</h1>
          <div className="flex items-center gap-4">
            <Link href="/support" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Support
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Button>
        </Link>

        <div className="mb-8 space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Choose an IP Template</h2>
            <p className="text-muted-foreground">
              Select a template to streamline your intellectual property registration process
            </p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Why use templates?</AlertTitle>
            <AlertDescription>
              Templates provide pre-configured fields and settings optimized for different types of intellectual
              property, saving you time and ensuring you capture all relevant information.
            </AlertDescription>
          </Alert>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column - Template selection */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "all" | "popular")}
            >
              <TabsList>
                <TabsTrigger value="all">All Templates</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {displayedTemplates.length === 0 ? (
                    <div className="col-span-full p-8 text-center border rounded-lg">
                      <p className="text-muted-foreground">No templates found matching your search criteria.</p>
                    </div>
                  ) : (
                    displayedTemplates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        isSelected={selectedTemplate === template.id}
                        onSelect={() => setSelectedTemplate(template.id)}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="popular" className="mt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {displayedTemplates.length === 0 ? (
                    <div className="col-span-full p-8 text-center border rounded-lg">
                      <p className="text-muted-foreground">No popular templates found matching your search criteria.</p>
                    </div>
                  ) : (
                    displayedTemplates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        isSelected={selectedTemplate === template.id}
                        onSelect={() => setSelectedTemplate(template.id)}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Selected template details */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {selectedTemplateObject ? (
                <TemplateDetails template={selectedTemplateObject} />
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Info className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-xl font-medium">Select a Template</h3>
                    <p className="text-muted-foreground">
                      Choose a template from the left to see more details and continue with your IP registration.
                    </p>
                  </CardContent>
                </Card>
              )}

              {selectedTemplateObject && (
                <Link href={`/create/${selectedTemplateObject.id}`}>
                <Button className="w-full" size="lg">
                  Continue with {selectedTemplateObject.name} Template
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
