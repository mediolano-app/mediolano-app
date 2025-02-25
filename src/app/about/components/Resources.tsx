import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Book, Video } from "lucide-react"

const resources = [
  {
    title: "Documentation",
    description: "Comprehensive guides and API references",
    icon: FileText,
    link: "#",
  },
  {
    title: "Tutorials",
    description: "Step-by-step tutorials for beginners and advanced users",
    icon: Book,
    link: "#",
  },
  {
    title: "Video Guides",
    description: "Visual walkthroughs of Mediolano features",
    icon: Video,
    link: "#",
  },
]

export default function Resources() {
  return (
    <section className="space-y-6 mb-20">
      <h2 className="text-2xl text-center tracking-tighter sm:text-3xl md:text-4xl">Resources (Upcoming)</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, index) => (
          <Card key={index} className="bg-background/40">
            <CardHeader>
              <resource.icon className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>{resource.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{resource.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

