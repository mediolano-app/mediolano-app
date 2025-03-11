"use client"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Image,
  FileIcon,
  Film,
  Music,
  Hexagon,
  FileCheck,
  BookOpen,
  Building,
  Code,
  ArrowRight,
} from "lucide-react"

const templates = [
  { name: "Custom", icon: FileText, href: "/new/asset" },
  { name: "Art", icon: Image, href: "/new/art" },
  { name: "Document", icon: FileIcon, href: "/new/document" },
  { name: "Video", icon: Film, href: "/new/video" },
  { name: "Music", icon: Music, href: "/new/music" },
  { name: "NFT", icon: Hexagon, href: "/new/nft" },
  { name: "Patent", icon: FileCheck, href: "/new/patent" },
  { name: "Publication", icon: BookOpen, href: "/new/publication" },
  { name: "Real World Assets", icon: Building, href: "/new/rwa" },
  { name: "Software", icon: Code, href: "/new/software" },
]

export function IPTemplates() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-background/30 rounded-lg shadow">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-3xl font-bold text-center">Start with an IP Template</h2>
        <p className="text-xl text-center mb-12">
          Select an IP Template to assist and optimize the intellectual property registration process.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <Link key={template.name} href={template.href} className="group">
              <Card className="h-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg bg-background/70">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <template.icon className="w-6 h-6 mr-2 text-blue-600" />
                      <span>{template.name}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Use this template to tokenize your {template.name.toLowerCase()} intellectual property.
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

