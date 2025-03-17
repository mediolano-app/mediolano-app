import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Zap, Globe, Clock, Lock, Coins, Code, Users } from "lucide-react"

const features = [
  {
    title: "Global Protection",
    description:
      "Automatic protection in 181 countries under The Berne Convention, ensuring your IP is safeguarded worldwide.",
    icon: Globe,
  },
  {
    title: "Instant Tokenization",
    description:
      "Your IP is tokenized immediately upon registration, creating a permanent and immutable record on the blockchain.",
    icon: Zap,
  },
  {
    title: "Long-term Validity",
    description:
      "Copyright valid for 50-70 years, depending on jurisdiction, providing long-lasting protection for your creative works.",
    icon: Clock,
  },
  {
    title: "Permissionless Registration",
    description: "Anyone can register their IP assets without restrictions, democratizing access to IP protection.",
    icon: Lock,
  },
  {
    title: "Diverse Asset Types",
    description:
      "Support for a wide range of IP assets including artwork, video, music, literature, AI models, software, and more.",
    icon: Shield,
  },
  {
    title: "Programmable Licensing",
    description: "Create flexible and customizable licensing options with total sovereignty over your IP assets.",
    icon: Coins,
  },
  {
    title: "Smart Contract Integration",
    description:
      "Leverage Starknet's smart contract capabilities for advanced IP management and automated royalty distribution.",
    icon: Code,
  },
  {
    title: "Community-Driven",
    description:
      "Join a growing community of creators and innovators, collaborating to shape the future of IP in the digital world.",
    icon: Users,
  },
]

export default function Features() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl text-center tracking-tighter sm:text-3xl md:text-4xl">Features</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="bg-background/40">
            <CardHeader>
              <feature.icon className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

