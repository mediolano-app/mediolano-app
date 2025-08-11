"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Shield, Eye, Lock, Users, Globe, Cookie, ArrowUp, Database, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const tableOfContentsPP = [
  { id: "information", title: "Introduction", icon: Database },
  { id: "philosophy", title: "Data Philosophy", icon: Eye },
  { id: "data_disclosure", title: "Voluntary Data Disclosure", icon: Users },
  { id: "security", title: "Data Security", icon: Lock },
  { id: "transparency", title: "Transparency", icon: UserCheck },
  { id: "records", title: "Licensing & Ownership Records", icon: Database },
  { id: "cookies", title: "Cookies and Tracking", icon: Cookie },
  { id: "interactions", title: "Third-Party Interactions", icon: Globe },
  { id: "dao", title: "DAO Governance", icon: Shield },
  { id: "sovereignty", title: "Security & Sovereignty", icon: Shield },
  { id: "legal", title: "Legal Framework", icon: Shield },
  { id: "changes", title: "Privacy Policy Updates", icon: Eye },
  { id: "contact", title: "Contact Us", icon: Users },
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
                  <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your
                    personal information when you use NFT Manager.
                  </p>
                </div>

                {/* Section 1 */}
                <section id="information" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Database className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">1. Introduction</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Welcome to Mediolano, a permissionless intellectual property provider built on Starknet. This Privacy Policy explains how data is handled across our decentralized ecosystem, in alignment with our commitment to user sovereignty, transparency, and compliance with international IP standards.
                    </p>

                    
                  </div>
                </section>

                {/* Section 2 */}
                <section id="philosophy" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">2. Data Philosophy</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">Mediolano is designed to operate with minimal data collection:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          title: "Privacy by Design",
                          desc: "No personal identifiers are required to access core features",
                          color: "blue",
                        },
                        {
                          title: "Decentralized Identity",
                          desc: "No centralized accounts, passwords, or KYC processes",
                          color: "green",
                        },
                        {
                          title: "Minimal Data Collection",
                          desc: "No default cookies, trackers, or behavioral analytics",
                          color: "blue",
                        },
                      ].map((item, index) => (
                        <Card key={index} className={`p-4 border-l-4 border-l-${item.color}-500`}>
                          <h4 className="font-medium mb-2">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </Card>
                      ))}
                      <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 mb-6">
                      <p className="text-blue-800 dark:text-blue-200 font-medium">
                        We believe privacy is a right—not a feature.
                      </p>
                    </Card>
                    </div>
                  </div>
                </section>

                {/* Section 3 */}
                <section id="data_disclosure" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">3. Voluntary Data Disclosure</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                   
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Users may choose to share limited data when engaging with optional services:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Wallet addresses for DAO participation or licensing agreements.",
                        "IP metadata (e.g., title, description, licensing terms).",
                        "DAO governance inputs, such as votes or proposals.",
                        "Transaction data for royalty distribution or IP management.",
                        "User-generated content (e.g., interactions, reviews) in social media.",
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
                <section id="security" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">4. Data Security</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      We implement appropriate technical and organizational measures to protect your personal
                      information:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { icon: Lock, title: "Encryption", desc: "Data encrypted in transit and at rest" },
                        { icon: Shield, title: "Security Audits", desc: "Regular security audits and assessments" },
                        {
                          icon: UserCheck,
                          title: "Access Controls",
                          desc: "Strict access controls and authentication",
                        },
                        {
                          icon: Database,
                          title: "Secure Integration",
                          desc: "Secure blockchain integration protocols",
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

                {/* Section 5 */}
                <section id="transparency" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">5. Blockchain Transparency</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Starknet leverages STARK proofs and the Cairo VM to process transactions off-chain, then submits them to Ethereum for final settlement. This significantly increases transaction throughput and reduces costs for users
                    </p>
                  <div className="space-y-4">
                      {[
                        "Tokenized IP assets, licensing contracts, and ownership proofs are public.",
                        "Zero-knowledge proofs may be used to preserve confidentiality while ensuring verifiability.",
                        "Mediolano cannot modify or delete blockchain records.",
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
                <section id="records" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">6. Licensing & Ownership Records</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Through smart contract integrations, users can:
                    </p>
                  <div className="space-y-4">
                      {[
                        "Create and sign IP licensing agreements permissionlessly.",
                        "Generate Proof of Ownership and Proof of Licensing records.",
                        "Store metadata publicly for transparency and legal recognition.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed mt-6 mb-6">
                      These records are timestamped, immutable, and accessible via the dApp interface.
                    </p>
                  </div>
                </section>



                {/* Section 6 */}
                <section id="cookies" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Cookie className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">7. Cookies and Tracking</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We avoid cookies and similar technologies to protect your privacy on the dapp.
                    </p>
                    <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                      <p className="text-yellow-800 dark:text-yellow-200">
                        For detailed information, please see our <strong>Cookie Policy</strong>.
                      </p>
                    </Card>
                  </div>
                </section>

                {/* Remaining sections with similar structure... */}
                <section id="interactions" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">8. Third-Party Ecosystem Interactions</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                     Mediolano may interface with external platforms (e.g., games, marketplaces, AI agents)
                    </p>
                    <div className="space-y-4">
                      {[
                        "These integrations are opt-in and operate independently.",
                        "Users are responsible for reviewing third-party privacy policies.",
                        "Mediolano does not share or sell user data to third parties.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </section>





                <section id="dao" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">9. DAO Governance & Public Participation</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Mediolano is governed by a decentralized autonomous organization (DAO):
                    </p>
                    <div className="space-y-4">
                      {[
                        "All proposals, votes, and governance actions are recorded on-chain.",
                        "Participation is pseudonymous and open to any wallet holder.",
                        "No centralized moderation or surveillance is conducted.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>



                <section id="sovereignty" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">10. Security & Sovereignty</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      We prioritize cryptographic security and user control:
                    </p>
                    <div className="space-y-4">
                      {[
                        "No custodial access to assets or identity.",
                        "Smart contracts enforce permissions and asset integrity.",
                        "Users retain full control over their IP, wallet, and licensing terms.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>



                <section id="legal" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">11. Legal Framework</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Mediolano aligns with the Berne Convention (1886):
                    </p>
                    <div className="space-y-4">
                      {[
                        "Tokenized IP assets are recognized in 181 countries as proof of authorship",
                        "Ownership validity spans 50 to 70 years, depending on jurisdiction.",
                        "Mediolano does not offer legal advice or representation.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>


                <section id="changes" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">12. Privacy Policy Updates</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      As a decentralized protocol, updates to this Privacy Policy may be Proposed and ratified by the DAO with community consensus.</p>
                  </div>
                </section>

                <section id="contact" className="mb-8 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">Contact Us</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <Card className="p-6">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        If you have questions about this Privacy Policy or our data practices, please contact us at:
                      </p>
                      <div className="space-y-2">
                        <p className="font-medium">Email: mediolanoapp@gmail.com</p>
                        <p className="text-sm text-muted-foreground">
                          We aim to respond to all inquiries within 48 hours
                        </p>
                      </div>
                    </Card>
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
