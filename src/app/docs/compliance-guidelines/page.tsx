"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ShieldCheck, Scale, AlertOctagon, FileCheck, Globe, Lock, Coins, ArrowUp, Briefcase, Gavel, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DocsNavigation } from "@/components/docs/docs-navigation"

const tableOfContentsCompl = [
  { id: "overview", title: "Compliance Overview", icon: ShieldCheck },
  { id: "kyc_aml", title: "KYC/AML Policy", icon: UserCheck },
  { id: "securities", title: "Securities Regulations", icon: Coins },
  { id: "ip_compliance", title: "Intellectual Property", icon: BookOpen },
  { id: "taxation", title: "Taxation", icon: Briefcase },
  { id: "sanctions", title: "Sanctions Compliance", icon: AlertOctagon },
  { id: "data_protection", title: "Data Protection", icon: Lock },
  { id: "consumer", title: "Consumer Protection", icon: UserCheck },
  { id: "dao", title: "DAO Liability", icon: Gavel },
]

import { UserCheck } from "lucide-react" // Importing again inside component file scope isn't ideal but for single file copy paste it works. 
// Ideally imports should be top level.
// Let's fix the imports above to include UserCheck and remove the re-import.

export default function ComplianceGuidelinesPage() {
  const [activeSection, setActiveSection] = useState("overview")
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)

      const sections = tableOfContentsCompl.map((item) => item.id)
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
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-slate-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="backdrop-blur-xl bg-background/60 border border-border/40 shadow-2xl rounded-2xl p-6 transition-all duration-300 hover:shadow-primary/5">
                <h2 className="font-semibold mb-6 flex items-center space-x-2 text-foreground/90">
                  <Scale className="w-5 h-5 text-primary" />
                  <span>Contents</span>
                </h2>
                <nav className="space-y-1">
                  {tableOfContentsCompl.map((item) => {
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
                  <ShieldCheck className="w-4 h-4" />
                  <span>Compliance</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  Compliance Guidelines
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl text-balance">
                  Mediolano operates at the intersection of blockchain technology and intellectual property law. These
                  guidelines outline our approach to regulatory compliance.
                </p>
              </div>

              {/* Section 1 */}
              <section id="overview" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5 rotate-2 transition-transform hover:rotate-3">
                    <Scale className="w-6 h-6 text-blue-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">1. Compliance Overview</h2>
                </div>
                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                  <p className="leading-relaxed">
                    Our decentralized architecture aims to comply with applicable laws while preserving user privacy and
                    freedom. We monitor global regulatory developments to ensure ongoing adherence.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section id="kyc_aml" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/5 -rotate-2 transition-transform hover:-rotate-3">
                    <UserCheck className="w-6 h-6 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">2. KYC/AML Policy</h2>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    As a non-custodial protocol:
                  </p>
                  <ul className="space-y-4">
                    {[
                      "We do not hold user funds.",
                      "We do not perform Know Your Customer (KYC) checks on general users.",
                      "We implement wallet screening tools to block addresses associated with illicit activities.",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section id="securities" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/5 rotate-1 transition-transform hover:rotate-2">
                    <Coins className="w-6 h-6 text-purple-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">3. Securities Regulations</h2>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    IP tokens generated on Mediolano are utility tokens representing ownership or licensing rights.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "They are not designed as investment contracts.",
                      "Users should consult legal counsel before fractionalizing or selling IP tokens to ensure compliance.",
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
              <section id="ip_compliance" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/5 -rotate-1 transition-transform hover:-rotate-2">
                    <BookOpen className="w-6 h-6 text-red-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">4. Intellectual Property</h2>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We uphold international IP standards:
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Berne Convention for the Protection of Literary and Artistic Works.",
                      "WIPO Copyright Treaty.",
                      "DMCA (Digital Millennium Copyright Act) takedown procedures for the dApp interface.",
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
              <section id="taxation" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/5 rotate-2 transition-transform hover:rotate-3">
                    <Briefcase className="w-6 h-6 text-amber-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">5. Taxation</h2>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Users are responsible for determining and paying any applicable taxes on earnings from IP licensing
                    or sales. Mediolano does not withhold taxes or provide tax advice.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section id="sanctions" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/5 -rotate-2 transition-transform hover:-rotate-3">
                    <AlertOctagon className="w-6 h-6 text-indigo-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">6. Sanctions Compliance</h2>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We comply with OFAC (Office of Foreign Assets Control) sanctions and other international
                    restrictions. Access from sanctioned jurisdictions or by sanctioned individuals is prohibited.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section id="data_protection" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/5 rotate-1 transition-transform hover:rotate-2">
                    <Lock className="w-6 h-6 text-teal-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">7. Data Protection</h2>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Please refer to our <strong>Privacy Policy</strong> for details on GDPR and CCPA compliance.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section id="consumer" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/5 -rotate-1 transition-transform hover:-rotate-2">
                    <UserCheck className="w-6 h-6 text-pink-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">8. Consumer Protection</h2>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We strive for transparency and fairness. Users have access to all smart contract code and
                    transaction history to verify system integrity.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section id="dao" className="mb-20 scroll-mt-32">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-slate-500/10 border border-slate-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-500/5 rotate-2 transition-transform hover:rotate-3">
                    <Gavel className="w-6 h-6 text-slate-500" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">9. DAO Liability</h2>
                </div>
                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    The Mediolano DAO is a decentralized collective. Contributors and voters are not personally liable
                    for the actions of the protocol, to the extent permitted by law.
                  </p>
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
          className="fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 shadow-2xl bg-background/80 backdrop-blur-xl border border-border text-foreground hover:bg-background/90"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  )
}
