"use client"
import { useState, useEffect } from "react"
import {
  ChevronRight,
  FileText,
  Shield,
  Users,
  Gavel,
  AlertCircle,
  ArrowUp,
  WholeWord,
  Landmark,
  BookOpenCheck,
  Lock,
  Scale
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DocsNavigation } from "@/components/docs/docs-navigation"

const tableOfContents = [
  { id: "acceptance", title: "Acceptance of Terms", icon: FileText },
  { id: "description", title: "Platform Description", icon: Shield },
  { id: "responsibilities", title: "Eligibility & Access", icon: Users },
  { id: "ip-rights", title: "Intellectual Property Rights", icon: BookOpenCheck },
  { id: "prohibited", title: "Licensing & Monetization", icon: BookOpenCheck },
  { id: "availability", title: "Usage Guidelines", icon: WholeWord },
  { id: "liability", title: "DAO Governance", icon: Landmark },
  { id: "changes", title: "Privacy & Data Sovereignty", icon: Lock },
  { id: "contact", title: "Security & Risk Disclosure", icon: Shield },
  { id: "security_risk", title: "Legal Recognition", icon: Scale },
  { id: "amendments", title: "Amendments & Versioning", icon: FileText },
]

export default function TermsOfUsePage() {
  const [activeSection, setActiveSection] = useState("acceptance")
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)

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
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-foreground">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="backdrop-blur-xl bg-background/60 border border-border/40 shadow-2xl rounded-2xl p-6 transition-all duration-300 hover:shadow-primary/5">
                <h2 className="font-semibold mb-6 flex items-center space-x-2 text-foreground/90">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Contents</span>
                </h2>
                <nav className="space-y-1">
                  {tableOfContents.map((item) => {
                    const Icon = item.icon
                    const isActive = activeSection === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center space-x-3 group relative overflow-hidden ${isActive
                          ? "text-primary font-medium bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-md" />
                        )}
                        <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                        <span className="text-sm">{item.title}</span>
                        {isActive && <ChevronRight className="w-4 h-4 ml-auto text-primary animate-in slide-in-from-left-2" />}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 pb-24">
            <div className="backdrop-blur-xl bg-background/40 border border-border/40 shadow-2xl rounded-3xl p-8 md:p-12 md:pb-24 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

              {/* Introduction */}
              <div className="mb-16 relative">
                <div className="inline-flex items-center space-x-2 mb-6 backdrop-blur-md bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-sm font-medium text-primary">
                  <Scale className="w-4 h-4" />
                  <span>Legal</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  Terms of Use
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl text-balance">
                  Welcome to Mediolano. These Terms of Use govern your access to and use of our intellectual
                  property management platform. Please read them carefully.
                </p>
              </div>

              {/* Section 1 */}
              <section id="acceptance" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5 rotate-2 transition-transform hover:rotate-3">
                    <FileText className="w-6 h-6 text-blue-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">1. Acceptance of Terms</h2>
                </div>
                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                  <p className="leading-relaxed">
                    By accessing or interacting with the Mediolano protocol or dApp, you agree to these Terms of Use. These terms are governed by decentralized consensus and may be amended through DAO proposals. If you do not agree, you must refrain from using the platform.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section id="description" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/5 -rotate-2 transition-transform hover:-rotate-3">
                    <Shield className="w-6 h-6 text-purple-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">2. Platform Description</h2>
                </div>
                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                  <p className="leading-relaxed">
                    Mediolano is a permissionless, open-source protocol built on Starknet. It enables creators to tokenize, license, and monetize intellectual property (IP) in alignment with the Berne Convention (1886). Mediolano is governed by Mediolano DAO.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section id="responsibilities" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/5 rotate-1 transition-transform hover:rotate-2">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">3. Eligibility & Access</h2>
                </div>

                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <p className="text-muted-foreground mb-4">As a user of our platform, you agree to:</p>
                  <ul className="space-y-4">
                    {[
                      "No personal identification or KYC is required.",
                      "Access is granted to any user with a compatible crypto wallet.",
                      "You are responsible for ensuring compliance with local laws regarding IP and blockchain usage",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section id="ip-rights" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 -rotate-1 transition-transform hover:-rotate-2">
                    <Gavel className="w-6 h-6 text-orange-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">4. Intellectual Property Rights</h2>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You retain ownership of all intellectual property rights in the content you create and upload to
                    our platform. By using our services, you grant us a limited license to:
                  </p>
                  <ul className="space-y-4">
                    {[
                      "You retain full ownership of any IP registered or tokenized.",
                      "Mediolano does not claim rights over your content.",
                      "Tokenized IP is recognized under the Berne Convention, recognized in 173 countries and protected for 50–70 years depending on jurisdiction",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 5 */}
              <section id="prohibited" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/5 rotate-2 transition-transform hover:rotate-3">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">5. Licensing & Monetization</h2>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <ul className="space-y-4">
                    {[
                      "You may issue licenses for personal, commercial, or derivative use.",
                      "Licensing terms are programmable via smart contracts.",
                      "Royalties, usage fees, and attribution models can be customized.",
                      "Records are stored immutably on Starknet (with Ethereum settlement).",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 6 */}
              <section id="availability" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/5 -rotate-2 transition-transform hover:-rotate-3">
                    <Shield className="w-6 h-6 text-indigo-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">6. Usage Guidelines</h2>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You agree not to use the platform for any illegal activities, including but not limited to:
                  </p>
                  <ul className="space-y-4 mb-6">
                    {[
                      "Tokenize or license content you do not own or have rights to.",
                      "Use the platform for illegal, fraudulent, or infringing activities.",
                      "Exploit vulnerabilities or attempt unauthorized access to smart contracts.",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    Violations may result in DAO-led proposals to restrict access or revoke access.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section id="liability" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/5 rotate-1 transition-transform hover:rotate-2">
                    <Landmark className="w-6 h-6 text-pink-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">7. DAO Governance</h2>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <ul className="space-y-4">
                    {[
                      "All protocol upgrades, policy changes, and treasury decisions are made via DAO proposals and votes.",
                      "Participation is pseudonymous and open to all wallet holders.",
                      "Governance actions are recorded on-chain and publicly auditable.",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 8 */}
              <section id="changes" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/5 -rotate-1 transition-transform hover:-rotate-2">
                    <Lock className="w-6 h-6 text-teal-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">8. Privacy & Data Sovereignty</h2>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <ul className="space-y-4">
                    {[
                      "Mediolano does not collect personal data or deploy trackers.",
                      "All user interactions are pseudonymous and stored on-chain.",
                      "Zero-knowledge proofs may be used to preserve confidentiality while ensuring verifiability.",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 9 */}
              <section id="contact" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/5 rotate-2 transition-transform hover:rotate-3">
                    <Shield className="w-6 h-6 text-amber-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">9. Security & Risk Disclosure</h2>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <ul className="space-y-4">
                    {[
                      "Smart contracts are audited but carry inherent risks.",
                      "Users are responsible for securing their own private keys and wallets.",
                      "The DAO is not liable for losses due to user error or network failures.",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>


              {/* Section 10 */}
              <section id="security_risk" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/5 -rotate-2 transition-transform hover:-rotate-3">
                    <Scale className="w-6 h-6 text-cyan-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">10. Legal Recognition</h2>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <ul className="space-y-4">
                    {[
                      "IP registered onchain is legally recognized under the Berne Convention.",
                      "Mediolano does not provide legal advice or representation.",
                      "Jurisdictional enforcement of IP rights remains the responsibility of the creator.",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>


              {/* Section 11 */}
              <section id="amendments" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-slate-500/10 border border-slate-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-500/5 rotate-1 transition-transform hover:rotate-2">
                    <FileText className="w-6 h-6 text-slate-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">11. Amendments & Versioning</h2>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <ul className="space-y-4">
                    {[
                      "These Terms may be amended through DAO governance.",
                      "Updates will be proposed, voted on, and published transparently.",
                      "Continued use of the protocol after ratification constitutes acceptance.",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <DocsNavigation />

            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 shadow-txl bg-background/80 backdrop-blur-xl border border-border text-foreground hover:bg-background/90"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  )
}
