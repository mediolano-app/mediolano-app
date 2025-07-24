"use client"
import { useState, useEffect } from "react"
import { ChevronRight, FileText, Shield, Users, Gavel, AlertCircle, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"



const tableOfContents = [
  { id: "acceptance", title: "Acceptance of Terms", icon: FileText },
  { id: "description", title: "Platform Description", icon: Shield },
  { id: "responsibilities", title: "Eligibility & Access", icon: Users },
  { id: "ip-rights", title: "Intellectual Property Rights", icon: Gavel },
  { id: "prohibited", title: "Licensing & Monetization", icon: AlertCircle },
  { id: "availability", title: "Usage Guidelines", icon: Shield },
  { id: "liability", title: "DAO Governance", icon: Gavel },
  { id: "changes", title: "Privacy & Data Sovereignty", icon: FileText },
  { id: "contact", title: "Security & Risk Disclosure", icon: Users },
  { id: "security_risk", title: "Legal Recognition & Jurisdiction", icon: Gavel },
  { id: "amendments", title: "Amendments & Versioning", icon: Users },
]

export default function TermsOfUsePage() {
  const [activeSection, setActiveSection] = useState("acceptance")
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)

      // Update active section based on scroll position
      const sections = tableOfContents.map((item) => item.id)
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
                  <FileText className="w-4 h-4" />
                  <span>Contents</span>
                </h2>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => {
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
                    Legal Document
                  </Badge>
                  <h1 className="text-4xl font-bold mb-4">Terms of Use</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Welcome to Mediolano. These Terms of Use govern your access to and use of our intellectual
                    property management platform. Please read them carefully.
                  </p>
                </div>

                {/* Section 1 */}
                <section id="acceptance" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      By accessing or interacting with the Mediolano protocol or dApp, you agree to these Terms of Use. These terms are governed by decentralized consensus and may be amended through DAO proposals. If you do not agree, you must refrain from using the platform.
                    </p>
          
                  </div>
                </section>

                {/* Section 2 */}
                <section id="description" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">2. Platform Description</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Mediolano is a permissionless, open-source protocol built on Starknet. It enables creators to tokenize, license, and monetize intellectual property (IP) in alignment with the Berne Convention (1886). Mediolano is governed by Mediolano DAO.
                    </p>

                  </div>
                </section>

                {/* Section 3 */}
                <section id="responsibilities" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">3. Eligibility & Access</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      As a user of our platform, you agree to:
                    </p>
                    <div className="space-y-3">
                      {[
                        "No personal identification or KYC is required.",
                        "Access is granted to any user with a compatible crypto wallet.",
                        "You are responsible for ensuring compliance with local laws regarding IP and blockchain usage",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section 4 */}
                <section id="ip-rights" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Gavel className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">4. Intellectual Property Rights</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      You retain ownership of all intellectual property rights in the content you create and upload to
                      our platform. By using our services, you grant us a limited license to:
                    </p>
                    <div className="space-y-3">
                      {[
                        "You retain full ownership of any IP registered or tokenized.",
                        "Mediolano does not claim rights over your content.",
                        "Tokenized IP is recognized under the Berne Convention, recognized in 173 countries and protected for 50–70 years depending on jurisdiction",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section 5 */}
                <section id="prohibited" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">5. Licensing & Monetization</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <div className="space-y-3">
                      {[
                        "You may issue licenses for personal, commercial, or derivative use.",
                        "Licensing terms are programmable via smart contracts.",
                        "Royalties, usage fees, and attribution models can be customized.",
                        "Records are stored immutably on Starknet (with Ethereum settlement).",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section 6 */}
                <section id="availability" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">6. Usage Guidelines</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      You agree not to use the platform for any illegal activities, including but not limited to:
                    </p>
                    <div className="space-y-3">
                      {[
                        "Tokenize or license content you do not own or have rights to.",
                        "Use the platform for illegal, fraudulent, or infringing activities.",
                        "Exploit vulnerabilities or attempt unauthorized access to smart contracts.",
                        "Records are stored immutably on Starknet (with Ethereum settlement).",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                     <p className="text-muted-foreground leading-relaxed">
                      Violations may result in DAO-led proposals to restrict access or revoke access.
                    </p>
                  </div>
                </section>

                {/* Section 7 */}
                <section id="liability" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Gavel className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">7. DAO Governance</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <div className="space-y-3">
                      {[
                        "All protocol upgrades, policy changes, and treasury decisions are made via DAO proposals and votes.",
                        "Participation is pseudonymous and open to all wallet holders.",
                        "Governance actions are recorded on-chain and publicly auditable.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section 8 */}
                <section id="changes" className="mb-12 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">8. Privacy & Data Sovereignty</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                   <div className="space-y-3">
                      {[
                        "Mediolano does not collect personal data or deploy trackers.",
                        "All user interactions are pseudonymous and stored on-chain.",
                        "Zero-knowledge proofs may be used to preserve confidentiality while ensuring verifiability.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section 9 */}
                <section id="contact" className="mb-8 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">9. Security & Risk Disclosure</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                   <div className="space-y-3">
                      {[
                        "Mediolano does not collect personal data or deploy trackers.",
                        "All user interactions are pseudonymous and stored on-chain.",
                        "Zero-knowledge proofs may be used to preserve confidentiality while ensuring verifiability.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  </div>
                </section>


                {/* Section 10 */}
                <section id="security_risk" className="mb-8 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">10. Legal Recognition & Jurisdiction</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                   <div className="space-y-3">
                      {[
                        "IP registered onchain is legally recognized under the Berne Convention.",
                        "Mediolano does not provide legal advice or representation.",
                        "Jurisdictional enforcement of IP rights remains the responsibility of the creator.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  </div>
                </section>


                {/* Section 11 */}
                <section id="amendments" className="mb-8 scroll-mt-24">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold">11. Amendments & Versioning</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                   <div className="space-y-3">
                      {[
                        "These Terms may be amended through DAO governance.",
                        "Updates will be proposed, voted on, and published transparently.",
                        "Continued use of the protocol after ratification constitutes acceptance.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  </div>
                </section>





              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 shadow-lg"
          size="icon"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
