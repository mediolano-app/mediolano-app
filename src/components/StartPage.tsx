import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Briefcase, FileText, Zap, Users, Layers, Lock, Music, Palette, Video, Book, DollarSign, Repeat, Search, Key, ChevronRight, Bitcoin, CircleDollarSign } from 'lucide-react'
import { SharePopup } from '@/components/share-popup'
import { mockAssets, mockCollections } from '@/lib/mockData'
import { useState } from 'react'













function TrendingAssetsSection() {
  const trendingAssets = mockAssets.sort((a, b) => b.views - a.views).slice(0, 4)

  return (
    <section className="py-20 ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-center mb-12">Trending Assets</h2>
        <div className="overflow-x-auto bg-background/80 rounded-lg shadow-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Asset Name</th>
                <th className="text-left p-4">Type</th>
                <th className="text-right p-4">Views</th>
                <th className="text-right p-4">Likes</th>
                <th className="text-center p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {trendingAssets.map((asset) => (
                <tr key={asset.id} className="border-b hover:/50 transition-colors">
                  <td className="p-4">{asset.name}</td>
                  <td className="p-4">{asset.type}</td>
                  <td className="p-4 text-right">{asset.views.toLocaleString()}</td>
                  <td className="p-4 text-right">{asset.likes.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <Link href={`/asset/${asset.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}













function HeroSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const features = [
    { title: "Tokenize Your IP", description: "Convert your intellectual property into blockchain-based digital assets.", icon: <Shield className="w-12 h-12" /> },
    { title: "Smart Licensing", description: "Create and manage programmable licenses with ease.", icon: <FileText className="w-12 h-12" /> },
    { title: "Secure Transactions", description: "Execute IP transactions using smart contracts.", icon: <Lock className="w-12 h-12" /> },
    { title: "Global Marketplace", description: "Connect with creators and licensees worldwide.", icon: <Users className="w-12 h-12" /> },
  ];

  return (
    <section className="relative py-8 overflow-hidden mb-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap8 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
              Programmable IP for the Integrity Web
            </h1>
            <p className="text-xl mb-8 text-muted-foreground">
              Mediolano empowers creators to tokenize their IP using cutting-edge blockchain and Zero-Knowledge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Portfolio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
          </div>
          <div className="relative">
            
              <Image 
                src="/background.jpg" 
                alt="Mediolano" 
                width={800} 
                height={800} 
                className="rounded-lg"
              />
          </div>
        </div>
      </div>
    </section>
  )
}


















function FeaturesSection() {
  const features = [
    { icon: <Shield className="w-12 h-12 mb-4 text-primary" />, title: "IP Protection", description: "Secure your intellectual property on the blockchain" },
    { icon: <Briefcase className="w-12 h-12 mb-4 text-primary" />, title: "Portfolio Manager", description: "Manage all your IP assets in one place" },
    { icon: <FileText className="w-12 h-12 mb-4 text-primary" />, title: "IP Licensing", description: "Create and manage programmable licenses" },
    { icon: <Zap className="w-12 h-12 mb-4 text-primary" />, title: "Smart Transactions", description: "Execute IP transactions with smart contracts" },
    { icon: <Users className="w-12 h-12 mb-4 text-primary" />, title: "Collaboration Tools", description: "Work seamlessly with team members and partners" },
    { icon: <Layers className="w-12 h-12 mb-4 text-primary" />, title: "Unbeatable Cost", description: "literally a fraction of a cent to use" },
  ]

  return (
    <section className="py-8 mb-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-center mb-12">Powerful Features for Your IP</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center bg-background/60">
              <CardHeader>
                <div className="flex justify-center">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}












function HowItWorksSection() {
  const steps = [
    { icon: <Shield className="w-12 h-12 text-primary" />, title: "Secure Registration", description: "Register your IP on the blockchain with just a few clicks." },
    { icon: <Key className="w-12 h-12 text-primary" />, title: "Programmable IP", description: "Create programmable licenses for flexible monetization." },
    { icon: <Briefcase className="w-12 h-12 text-primary" />, title: "Portfolio Management", description: "Manage all your IP assets in one secure platform." },
    { icon: <CircleDollarSign className="w-12 h-12 text-primary" />, title: "Monetization", description: "Onchain opportunities for tokenized IP." },
  ]

  return (
    <section id="how-it-works" className="py-8 mb-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-center mb-12">How Mediolano Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center bg-background/60">
              <CardHeader>
                <div className="flex justify-center mb-4">{step.icon}</div>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{step.description}</p>
              </CardContent>
              {index < steps.length - 1 && (
                <div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
























function ProgrammableIPSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Programmable IP Assets</h2>
            <p className="text-lg md:text-xl mb-6">
              Transform your intellectual property into dynamic, programmable assets on the blockchain. Mediolano's permissionless approach offers:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>Control and sovereignty over digital assets.</li>
              <li>Portfolio Management and IP Licensing</li>
              <li>Smart Transactions with Programmable IP</li>
              <li>Industry standards interoperability</li>
              <li>Direct exposure to the global market</li>
            </ul>
            <Link href="https://mediolano.app">
              <Button>Discover our vision</Button>
            </Link>
          </div>
          <div className="md:w-1/2">
            <Image 
              src="/background.jpg" 
              alt="Programmable IP Assets Visualization" 
              width={800} 
              height={800} 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}











function UserCollectionsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-center mb-12">Featured User Collections</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCollections.map((collection) => (
            <Card key={collection.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-background/80">
              <div className="relative">
                <Image 
                  src={`/background.jpg`}
                  alt={collection.name} 
                  width={400} 
                  height={300} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <SharePopup 
                    title={`Check out the ${collection.name} collection on Mediolano`}
                    url={`/background.jpg`}
                  />
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{collection.name}</CardTitle>
                  <Badge variant="secondary">{collection.assets.length} Items</Badge>
                </div>
                <CardDescription>Owned by {collection.owner}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <Link href={`/collection/${collection.id}`}>
                  <Button variant="outline">View Collection</Button>
                </Link>
                <span className="text-sm text-muted-foreground">Last updated: {collection.lastUpdated}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="#">
            <Button size="lg">
              Explore All Collections
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}







function SocialFeaturesSection() {
  const features = [
    { title: "Collaborative Workspaces", description: "Create and manage projects with team members and partners." },
    { title: "IP Marketplace", description: "Discover, buy, and sell intellectual property assets." },
    { title: "Community Forums", description: "Engage in discussions and share knowledge with other creators." },
    { title: "Expert Network", description: "Connect with IP professionals for advice and services." },
  ]

  return (
    <section className="py-20 mb-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Connect and Collaborate</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card className="bg-background/60" key={index}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}









function CTASection() {
  return (
    <section className="py-20 rounded-lg shadow-lg bg-background/60 text-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl mb-6">Ready to leverage the power of tokenized intelligence on the global market?</h2>
        <p className="text-lg md:text-xl mb-8">Join Mediolano today and take control of your intellectual property on the Integrity Web.</p>
        <Link href="/register">
          <Button size="lg" variant="secondary">Get Started Now</Button>
        </Link>
      </div>
    </section>
  )
}







function LicensingProgrammableIPSection() {
  const features = [
    { icon: <Music className="w-8 h-8 text-primary" />, title: "Music", description: "Music and compositions tokenization opens new opportunities for artists" },
    { icon: <Palette className="w-8 h-8 text-primary" />, title: "Art", description: "Register and control how your digital art is used and monetized" },
    { icon: <Video className="w-8 h-8 text-primary" />, title: "Video", description: "Manage distribution rights and revenue sharing" },
    { icon: <Book className="w-8 h-8 text-primary" />, title: "Publishing", description: "Set up flexible licensing terms for your written content." },
    { icon: <DollarSign className="w-8 h-8 text-primary" />, title: "RWA", description: "Explore the unique potential of Programmable IP for Real World Assets" },
    { icon: <Repeat className="w-8 h-8 text-primary" />, title: "Property Rights", description: "Easily trade or transfer partial or full rights to your IP." },
  ]

  return (
    <section className="py-20 ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-center mb-6">Licensing Programmable IP</h2>
        <p className="text-xl text-center mb-12">Empower artists to take control of their IP with flexible, programmable licensing options.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card className="bg-background/60" key={index}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/licensing">
            <Button size="lg">
              New Licensing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}







function RegisteringIPSection() {
  const benefits = [
    { icon: <Lock className="w-8 h-8 text-primary" />, title: "Clear Ownership", description: "Establish indisputable ownership claims on the blockchain." },
    { icon: <Search className="w-8 h-8 text-primary" />, title: "Enhanced Discovery", description: "Make your IP easily discoverable on the market." },
    { icon: <Zap className="w-8 h-8 text-primary" />, title: "Active Control", description: "Maintain control on your assets." },
    { icon: <Layers className="w-8 h-8 text-primary" />, title: "Modular Assets", description: "Transform static IP into modular, programmable assets." },
  ]

  return (
    <section className="py-20 ">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl mb-6">Registering IP on Mediolano</h2>
            <p className="text-lg mb-8">
              Transform your static intellectual property into dynamic, programmable digital assets. Mediolano's registration process empowers creators with unprecedented control and flexibility.
            </p>
            <Link href="/register">
              <Button size="lg">
                Register Your IP
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <Card className="bg-background/60" key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    {benefit.icon}
                    <CardTitle>{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}






export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      
      <ProgrammableIPSection />
      <LicensingProgrammableIPSection />
      <RegisteringIPSection />
      <TrendingAssetsSection />
      
      <UserCollectionsSection />
      <SocialFeaturesSection />
      <CTASection />
    </div>
  )
}

