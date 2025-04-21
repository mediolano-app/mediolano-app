import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, BarChart3, Layers, Zap } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: <Coins className="h-10 w-10 text-blue-600" />,
      title: "Create Your IP Coin",
      description:
        "Tokenize your intellectual property by creating an ERC20-compliant token that represents your content.",
    },
    {
      icon: <Layers className="h-10 w-10 text-blue-600" />,
      title: "Establish Liquidity",
      description: "Set up a liquidity pool on Ekubo to enable trading and establish a market for your IP Coin.",
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-blue-600" />,
      title: "Monetize Your Content",
      description: "Earn from your intellectual property through token sales, trading fees, and value appreciation.",
    },
    {
      icon: <Zap className="h-10 w-10 text-blue-600" />,
      title: "Grow Your Network",
      description: "Connect with other creators and collectors in the IP COIN ecosystem to expand your reach.",
    },
  ]

  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">How IP COIN Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tokenize your intellectual property and unlock new monetization opportunities in four simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <div className="mb-2">{step.icon}</div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
