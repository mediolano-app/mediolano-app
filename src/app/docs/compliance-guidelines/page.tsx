"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Shield, Eye, Lock, Users, Globe, Cookie, ArrowUp, Database, UserCheck, NotebookPen, Sparkle, Cog, User, AtSign, Award, Blocks, Building, Album, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const tableOfContentsPP = [
  { id: "information", title: "Introduction", icon: NotebookPen },
  { id: "purpose", title: "Purpose & Scope", icon: Sparkle },
  { id: "compliance", title: "Global IP Compliance", icon: Cog },
  { id: "blockchain", title: "Blockchain & Data", icon: Blocks },
  { id: "governance", title: "Governance & Responsibility", icon: Album },
  { id: "regulatory", title: "Regulatory Awareness", icon: UserCheck },
  { id: "resolution", title: "Dispute Resolution", icon: Shield },
  { id: "management", title: "Risk Management", icon: Shield },
  { id: "resources", title: "Resources & References", icon: Shield },
  { id: "report", title: "Report Content", icon: Pencil },
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
                  <h1 className="text-4xl font-bold mb-4">Compliance Guidelines</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    These guidelines are designed to ensure integrity, compliance, and a commitment to the core values of decentralization and creator sovereignty. By participating in Mediolano, you agree to adhere to these principles.  
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
                <section id="purpose" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Sparkle className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">2. Purpose & Scope</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      This resource hub equips Mediolano users with the legal knowledge and tools needed to navigate:
                      </p>
                    <div className="space-y-4">
                      {[
                        "Global intellectual property (IP) protections.",
                        "Blockchain and data compliance.",
                        "DAO governance responsibilities.",
                        "Licensing and monetization standards.",
                        "Risk mitigation and dispute resolution.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      These resources are educational and community-driven. Mediolano does not provide legal advice or representation.
                      </p>
                  </div>
                </section>

                {/* Section 3 */}
                <section id="compliance" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Cog className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">3. Global IP Compliance</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                   
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Mediolano aligns with the Berne Convention (1886), covering 181 countries:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Automatic protection: No registration required for authorship recognition.",
                        "Duration: 50–70 years depending on jurisdiction.",
                        "Scope: Literary, artistic, musical, and intellectual works.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6 mt-6">
                      Creators are responsible for:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Ensuring originality and non-infringement.",
                        "Defining licensing terms clearly.",
                        "Using accurate metadata for ownership and usage rights.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6 mt-6">
                      For enhanced protection, creators may optionally register their works with national IP offices or use timestamped blockchain records as supplementary evidence.
                    </p>
                  </div>
                </section>

                {/* Section 4 */}
                <section id="blockchain" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Blocks className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">4. Blockchain & Data</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                   
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Mediolano operates on Starknet and Ethereum using smart contracts and zero-knowledge proofs. Key compliance features:
                    </p>
                    <div className="space-y-4">
                      {[
                        "On-chain transparency: All IP registrations and licenses are public and immutable.",
                        "Metadata stored on IPFS (decentralized storage).",
                        "Privacy: no personal data is required for core protocol use.",
                        "Zero-knowledge proofs: verify without revealing information.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                     <p className="text-muted-foreground leading-relaxed mb-6 mt-6">
                      Users should be aware of:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Jurisdictional differences in crypto regulation.",
                        "Risks of pseudonymous interactions.",
                        "Limitations of blockchain immutability.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>


                {/* Section 5 */}
                <section id="governance" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Album className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">5. Governance & Responsibility</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                     Mediolano is governed by a DAO. While decentralized, participants may face legal scrutiny in some jurisdictions:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Contributors must comply with local laws and regulations.",
                        "Proposal authors may be viewed as initiators of protocol changes.",
                        "DAO members are responsible for their actions and decisions.",
                        "Disputes should be resolved through community discussion and on-chain voting.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-6 mt-6">
                     To mitigate risk:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Operate transparently and document decisions.",
                        "Avoid centralized control or collusion.",
                        "Consider legal wrappers or jurisdictional guidance.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                      </div>
                  </div>
                </section>



              
                {/* Section 6 */}
                <section id="regulatory" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">6. Regulatory Awareness</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Mediolano does not require KYC or AML procedures for core protocol use. However:
                    </p>
                  <div className="space-y-4">
                      {[
                        "Third-party integrations (e.g., marketplaces, social login) may impose compliance requirements.",
                        "DAO treasury operations should avoid exposure to sanctioned entities or illicit flows.",
                        "Contributors should stay informed about evolving crypto regulations in their region.",
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
                <section id="resolution" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">7. Dispute Resolution</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Mediolano does not mediate disputes. Creators may pursue enforcement through:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Proof of Ownership: on-chain evidence (e.g., timestamped IP registration).",
                        "Off-chain legal channels (e.g., DMCA takedowns, copyright claims)",
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
                <section id="management" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">8. Risk Management & Best Practices</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                     To protect your intellectual property and contributions:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Use secure wallets and do not share your passwords.",
                        "Document decisions and agreements.",
                        "Stay informed about international IP and regulations.",
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
                <section id="moderation" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">9. Legal Resources & References</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Explore these sources for deeper guidance:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Berne Convention Overview: https://www.wipo.int/treaties/en/ip/berne/",
                        "WIPO IP Portal: https://www.wipo.int/about-ip/en/",
                        "TRIPS Agreement Summary: https://www.wto.org/english/tratop_e/trips_e/trips_e.htm",
                        "Legal Nodes Playbook for Web3: https://legalnodes.com/",
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
                <section id="report" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Pencil className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">10. Report Content</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      To report content for legal reasons, you need to identify the specific asset address where the content appears, select the relevant legal reason, and provide detailed information about the content and why it's illegal, including URLs and supporting evidence.
                    </p>
                    <div className="space-y-4">
                      {[
                        "Use the 'Report Content' button on the asset page.",
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
