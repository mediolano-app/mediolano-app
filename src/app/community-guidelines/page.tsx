"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Shield, Eye, Lock, Users, Globe, Cookie, ArrowUp, Database, UserCheck, NotebookPen, Sparkle, Cog, User, AtSign, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const tableOfContentsPP = [
  { id: "information", title: "Introduction", icon: NotebookPen },
  { id: "ethos", title: "Purpose & Ethos", icon: Sparkle },
  { id: "principles", title: "Core Principles", icon: Cog },
  { id: "conduct", title: "Code of Conduct", icon: Lock },
  { id: "journey", title: "Contributor Journey", icon: User },
  { id: "standarts", title: "Contributor Standards", icon: UserCheck },
  { id: "channels", title: "Communication Channels", icon: AtSign },
  { id: "incentives", title: "Recognition & Incentives", icon: Award },
  { id: "moderation", title: "Moderation & Enforcement", icon: Shield },
  { id: "decentralization", title: "Decentralization", icon: Globe },
]

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("information")
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)

      const sections = tableOfContentsPP.map((item) => item.id)
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen">

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4 flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Contents</span>
                </h2>
                <nav className="space-y-2">
                  {tableOfContentsPP.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                          activeSection === item.id
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{item.title}</span>
                        {activeSection === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl">
              <CardContent className="p-8 md:p-12">
                {/* Introduction */}
                <div className="mb-12">
                  <Badge variant="secondary" className="mb-4">
                    Mediolano
                  </Badge>
                  <h1 className="text-4xl font-bold mb-4">Community Guidelines</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Welcome to Mediolano, a decentralized protocol for creators and communities. These guidelines are designed to foster a respectful, inclusive, and collaborative environment for all participants.
                  </p>
                </div>

                {/* Section 1 */}
                <section id="information" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <NotebookPen className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">1. Introduction</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                    Mediolano is not a product—it’s infrastructure for humanity:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Free to use, fork, and build on.",
                        "Open-source and auditable.",
                        "Designed for global accessibility.",
                        "Committed to ethical innovation and decentralization.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                    
                  </div>
                </section>

                {/* Section 2 */}
                <section id="ethos" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Sparkle className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">2. Purpose & Ethos</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">Mediolano is more than a protocol—it’s a movement to empower creators through decentralized intellectual property. These guidelines are designed to:</p>
                    <div className="space-y-4">
                      {[
                        "Foster a respectful, inclusive, and collaborative environment.",
                        "Encourage open-source innovation and DAO participation.",
                        "Protect the integrity of creative works and governance processes.",
                        "Align community behavior with the values of sovereignty, transparency, and equity.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section 3 */}
                <section id="principles" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Cog className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">3. Core Principles</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                   
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      We uphold the following foundational values:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Creator Sovereignty: Every contributor retains full control over their work and identity",
                        "Decentralized Integrity: Actions are made transparently, without centralized gatekeepers.",
                        "Open Collaboration: Contributions are welcomed from all skill levels and backgrounds.",
                        "Respectful Dialogue: Disagreement is welcome; disrespect is not.",
                        "Public Good Orientation: Mediolano is a protocol for collective benefit, not private gain.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section 4 */}
                <section id="conduct" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">4. Code of Conduct</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                   
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      All participants agree to:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Engage with empathy, professionalism, and integrity",
                        "Avoid harassment, hate speech, or discriminatory behavior.",
                        "Refrain from spamming, trolling, or disruptive conduct.",
                        "Respect licensing terms and intellectual property rights.",
                        "Use pseudonymous identities responsibly and ethically.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                     <p className="text-muted-foreground leading-relaxed mb-6 mt-6">
                      Violations may result in moderation actions or DAO-led proposals for restriction.
                    </p>
                  </div>
                </section>


                {/* Section 5 */}
                <section id="conduct" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">5. Contributor Journey</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                     Mediolano welcomes contributions across multiple domains:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { icon: UserCheck, title: "Creators", desc: "Tokenize and license original works" },
                        { icon: UserCheck, title: "Developers", desc: "Build smart contracts, dApps, and services" },
                        {
                          icon: UserCheck,
                          title: "Curators",
                          desc: "Organize, promote, and contextualize IP assets",
                        },
                        {
                          icon: UserCheck,
                          title: "Governors",
                          desc: "Propose and vote on upgrades and policies",
                        },
                        {
                          icon: UserCheck,
                          title: "Educators",
                          desc: "Create tutorials, guides, and documentation",
                        },
                        {
                          icon: UserCheck,
                          title: "Community",
                          desc: "Host events, moderate forums, and grow the ecosystem",
                        },
                        {
                          icon: UserCheck,
                          title: "Researchers",
                          desc: "Analyze trends, metrics, and impact of the protocol",
                        },
                        {
                          icon: UserCheck,
                          title: "Business",
                          desc: "Services, partnerships, integrations, and monetization opportunities",
                        },

                      ].map((item, index) => {
                        const Icon = item.icon
                        return (
                          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-3 mb-2">
                              <Icon className="w-5 h-5 text-blue-500" />
                              <h4 className="font-medium">{item.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </section>



              
                {/* Section 6 */}
                <section id="standarts" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">6. Contributor Standards</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      To maintain quality and trust:
                    </p>
                  <div className="space-y-4">
                      {[
                        "Follow Mediolano’s documentation and licensing protocols.",
                        "Submit code with clear commit history and comments.",
                        "Attribute third-party assets and respect open-source licenses.",
                        "Engage in governance with thoughtful proposals and votes.",
                        "Disclose conflicts of interest when relevant to DAO decisions.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>



                {/* Section 7 */}
                <section id="channels" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">7. Communication Channels</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We encourage open dialogue across platforms:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Discord / Telegram: Real-time support and discussion.",
                        "GitHub: For code contributions, issue tracking.",
                        "Social Media: Amplify updates and creator stories.",
                        "Email: For formal communications and inquiries.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                      </div>
                  </div>
                </section>



                {/* Section 8 */}
                <section id="incentives" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">8. Recognition & Incentives</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                     Contributors may be rewarded through:
                    </p>
                    <div className="space-y-4">
                      {[
                        "DAO grants and bounties.",
                        "Governance token allocations.",
                        "Reputation scores or contributor badges.",
                        "Public acknowledgment in releases and documentation.",
                        "Token distribution/airdrops.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                     All incentives are subject to DAO approval and transparent reporting.
                    </p>
                  </div>
                </section>




                 {/* Section 9 */}
                <section id="moderation" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">9. Moderation & Enforcement</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      While Mediolano is permissionless, community spaces may be moderated to:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Remove harmful or illegal content.",
                        "Enforce these guidelines.",
                        "Protect the integrity of governance and collaboration.",
                        "Address spam, trolling, or disruptive behavior.",
                        "Ensure network protection.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Moderation actions may be appealed via DAO proposals.
                    </p>
                  </div>
                </section>


                {/* Section 10 */}
                <section id="decentralization" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">10. Decentralization</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      As Mediolano evolves:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Governance power will shift increasingly to the community.",
                        "Contributor roles may expand through subDAOs and working groups.",
                        "Guidelines will be updated through transparent, on-chain proposals.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>



          
              </CardContent>
            </Card>
          </div>
        </div>
      </div>


    </div>
  )
}
