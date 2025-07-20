"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Search, Info, Sparkles } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TemplateCard } from "@/components/template-card"
import { TemplateDetails } from "@/components/template-details"
import { Badge } from "@/components/ui/badge"
import { templates } from "@/lib/templates"

const categories = [
  { id: "all", name: "All Templates", icon: "Sparkles" },
  { id: "popular", name: "Popular", icon: "TrendingUp" },
  { id: "media", name: "Media & Creative", icon: "Palette" },
  { id: "blockchain", name: "Blockchain & NFT", icon: "Hexagon" },
  { id: "tech", name: "Technology", icon: "Code" },
  { id: "legal", name: "Legal & IP", icon: "Award" },
  { id: "other", name: "Other", icon: "Settings" },
]

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")

  // Filter templates based on search query and category
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      activeCategory === "all" ||
      (activeCategory === "popular" && template.id === "audio") ||
      template.id === "art" ||
      template.id === "nft" ||
      template.category === activeCategory

    return matchesSearch && matchesCategory
  })

  // Get the selected template object
  const selectedTemplateObject = templates.find((template) => template.id === selectedTemplate)

  return (
    <div className="min-h-screen">
     
      <main className="container mx-auto p-4 py-8">
        <div className="mb-8 space-y-6">
          <Alert className="border-primary/20 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertTitle>Optimized IP Registration</AlertTitle>
            <AlertDescription>
              Our templates are designed for different types of intellectual property, providing specialized fields and
              blockchain registration using Starknet and Ethereum security.
            </AlertDescription>
          </Alert>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates by name, type, or use case..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
          {/* Template Categories & Selection */}
          <div className="xl:col-span-3 space-y-6">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <span>{category.name}</span>
                  {category.id === "popular" && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-xs">
                      3
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.length === 0 ? (
                <div className="col-span-full p-12 text-center border-2 border-dashed rounded-lg">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">No templates found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or browse different categories.
                  </p>
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate === template.id}
                    onSelect={() => setSelectedTemplate(template.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Template Details Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-24 space-y-6">
              {selectedTemplateObject ? (
                <>
                  <TemplateDetails template={selectedTemplateObject} />

                  <div className="space-y-3">
                    <Link href={`/create/templates/${selectedTemplateObject.id}`}>
                      <Button className="w-full" size="lg">
                        Use {selectedTemplateObject.name} Template
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>

                    <Link href="/create/asset">
                      <Button variant="outline" className="w-full bg-transparent" size="lg">
                        Create Custom Asset
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl font-medium">Select a Template</h3>
                    <p className="text-muted-foreground mb-4">
                      Choose a template to see detailed information and specialized features for your IP type.
                    </p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Optimized metadata fields</p>
                      <p>• Blockchain registration</p>
                      <p>• Legal protection features</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Platform Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Templates</span>
                      <span className="font-medium">{templates.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Most Popular</span>
                      <span className="font-medium">Audio & Art</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assets Created</span>
                      <span className="font-medium">12.5k+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
