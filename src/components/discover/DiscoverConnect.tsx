import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Twitter, Github } from "lucide-react"
import Link from "next/link"

const connectOptions = [
  {
    title: "Email Support",
    description: "Get in touch with our support team via email.",
    icon: Mail,
    action: "Email Us",
    link: "mailto:support@mediolano.app",
  },
  {
    title: "Live Chat",
    description: "Chat with our support team in real-time, available 24/7.",
    icon: MessageSquare,
    action: "Start Chat",
    link: "#",
  },
  {
    title: "Twitter",
    description: "Follow us on Twitter for updates and announcements.",
    icon: Twitter,
    action: "Follow @mediolanoapp",
    link: "https://twitter.com/mediolanoapp",
  },
  {
    title: "GitHub",
    description: "Explore our open-source projects and contribute.",
    icon: Github,
    action: "View GitHub",
    link: "https://github.com/mediolano-app",
  },
]

export default function DiscoverConnect() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Connect With Us</h2>
      <p className="text-xl text-muted-foreground max-w-3xl">
        Stay connected with the Mediolano community. Whether you need support, want to follow our latest updates, or
        contribute to our open-source projects, we're here for you.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {connectOptions.map((option, index) => (
          <Card key={index}>
            <CardHeader>
              <option.icon className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>{option.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{option.description}</CardDescription>
              <Button className="mt-4" variant="outline" asChild>
                <Link href={option.link} target="_blank" rel="noopener noreferrer">
                  {option.action}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

