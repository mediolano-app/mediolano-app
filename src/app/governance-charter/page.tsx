"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Shield, Eye, Lock, Users, Globe, Cookie, ArrowUp, Database, UserCheck, NotebookPen, Sparkle, Cog, User, AtSign, Award, Blocks, Building, Album, Pencil, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const tableOfContentsPP = [
  { id: "information", title: "Introduction", icon: NotebookPen },
  { id: "principles", title: "Core Principles", icon: Sparkle },
  { id: "participation", title: "Participation", icon: Users },
  { id: "tokens", title: "Governance Tokens", icon: Coins },
  { id: "proposal", title: "Proposal Lifecycle", icon: Pencil },
  { id: "domains", title: "Governance Domains", icon: Building },
  { id: "working", title: "Working Groups", icon: Users },
  { id: "treasury", title: "Treasury & Funding", icon: Globe },
  { id: "resolution", title: "Conflict Resolution", icon: Shield },
  { id: "amendments", title: "Amendments & Evolution", icon: Pencil },
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
                  <h1 className="text-4xl font-bold mb-4">Governance Charter</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Mediolano DAO exists to unlock intellectual property for the Integrity Web. Our governance framework ensures that creators, contributors, and communities can collaborate transparently, equitably, and autonomously.
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
                    This Charter defines how decisions are made, responsibilities are shared, and the protocol evolves—guided by the principles of decentralization, creator sovereignty, and long-term sustainability.
                    </p>
                    
                    
                  </div>
                </section>

                {/* Section 2 */}
                <section id="principles" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Sparkle className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">2. Core Principles</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      We are governed by values that reflect our commitment to a fair and open digital future:
                      </p>
                    <div className="space-y-4">
                      {[
                        "Decentralization: decisions are made collectively.",
                        "Transparency: governance actions are recorded on-chain.",
                        "Sovereignty: creators retain full control over their IP and participation.",
                        "Inclusivity: participation is open to all users.",
                        "Integrity: we uphold ethical standards in all protocol and community actions.",
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
                <section id="participation" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">3. Participation</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                   
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Anyone with a compatible wallet may participate in Mediolano DAO. No KYC or registration is required. Members may:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Submit proposals and vote on governance decisions.",
                        "Join working groups and community initiatives",
                        "Contribute to protocol development, education, business",
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
                <section id="tokens" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Coins className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">4. Governance Tokens</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                   
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Governance tokens may be used to:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Propose changes to the protocol or governance structure.",
                        "Vote on proposals, protocol upgrades and business decisions.",
                        "Participate in working groups and community initiatives.",
                        "Access contributor rewards and reputation systems.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                     <p className="text-muted-foreground leading-relaxed mb-6 mt-6">
                      Token distribution and voting mechanisms are defined by smart contracts and may evolve through DAO consensus.
                    </p>
                  </div>
                </section>


                {/* Section 5 */}
                <section id="proposal" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Pencil className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">5. Proposal Lifecycle</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                     Decisions follow a transparent, structured process:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Submission: Any member may submit a proposal using the DAO template.",
                        "Discussion: Community feedback is gathered via communication channels.",
                        "Voting: Proposals are voted on using governance tokens or delegated voting.",
                        "Execution: Approved proposals are implemented via smart contracts or working groups.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-6 mt-6">
                     Minimum quorum and majority thresholds are enforced by protocol logic.
                    </p>

                  </div>
                </section>



              
                {/* Section 6 */}
                <section id="domains" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Building className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">6. Governance Domains</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      The DAO governs key areas of the Mediolano ecosystem:
                    </p>
                  <div className="space-y-4">
                      {[
                        "Protocol Upgrades: Smart contract changes and feature enhancements.",
                        "Treasury Management: Grants, bounties, and ecosystem funding.",
                        "Business Development: Business operations to build clients and commercial partnerships.",
                        "Community Initiatives: Events, education, and outreach programs.",
                        "Support: user and business LTS support, bug fixes, products and services.",
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
                <section id="working" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">7. Working Groups</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      To scale governance and empower contributors, the DAO may delegate responsibilities to working groups: Task-specific teams (e.g., Business, Development, Creator Relations, Marketing and Communications).
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Working group operates transparently and reports to the DAO.
                    </p>
 
                  </div>
                </section>



                {/* Section 8 */}
                <section id="treasury" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">8. Treasury & Funding</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                     The DAO treasury is managed via smart contracts or multisig wallets:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Funds are allocated through approved proposals.",
                        "All transactions are publicly auditable.",
                        "Treasury inflows may include services fees, donations, or royalties.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>




                 {/* Section 9 */}
                <section id="resolution" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">9. Conflict Resolution</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Disputes are resolved through:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Open discussion and mediation.",
                        "Proposal-based arbitration mechanisms.",
                        "Optional integration with decentralized dispute resolution protocols.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>


                {/* Section 10 */}
                <section id="amendments" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Pencil className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">10. Amendments & Evolution</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      This Charter may be amended through DAO proposals:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Changes require quorum and supermajority approval.",
                        "Decisions and updates are recorded on-chain for transparency.",
                        "The DAO may evolve its structure through progressive decentralization",
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
