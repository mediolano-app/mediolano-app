"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Shield, AlertTriangle, Bug, FileCheck, ArrowUp, Lock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DocsNavigation } from "@/components/docs/docs-navigation"

const tableOfContents = [
    { id: "approach", title: "Security Approach", icon: Shield },
    { id: "audits", title: "Audit Reports", icon: FileCheck },
    { id: "bug-bounty", title: "Bug Bounty", icon: Bug },
    { id: "risks", title: "Risk Disclosure", icon: AlertTriangle },
    { id: "monitoring", title: "Monitoring", icon: Eye },
]

export default function SecurityContent() {
    const [activeSection, setActiveSection] = useState("approach")
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
                <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="backdrop-blur-xl bg-background/60 border border-border/40 shadow-2xl rounded-2xl p-6 transition-all duration-300 hover:shadow-primary/5">
                                <h2 className="font-semibold mb-6 flex items-center space-x-2 text-foreground/90">
                                    <Lock className="w-5 h-5 text-primary" />
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
                                    <Shield className="w-4 h-4" />
                                    <span>Security</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    Security & Audits
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl text-balance">
                                    Security is paramount for the Integrity Web. We employ rigorous testing, third-party audits, and continuous monitoring to safeguard the protocol.
                                </p>
                            </div>

                            {/* Approach */}
                            <section id="approach" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Shield className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Security Approach</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed mb-6">
                                        We adopt a defense-in-depth strategy:
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Formal Verification of core Cairo contracts.",
                                            "Peer reviews for every code change.",
                                            "Timelock controllers for governance actions.",
                                            "Immutable core contracts to prevent unauthorized upgrades.",
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* Audits */}
                            <section id="audits" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <FileCheck className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Audit Reports</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-muted/20 rounded-xl gap-4">
                                            <div>
                                                <h4 className="font-semibold text-foreground">Core Protocol Audit</h4>
                                                <p className="text-sm text-muted-foreground">Audited by Trail of Bits</p>
                                            </div>
                                            <Badge variant="outline" className="border-green-500/50 text-green-500">Passed</Badge>
                                            <Button variant="ghost" size="sm" className="ml-auto sm:ml-0">
                                                Download PDF
                                            </Button>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-muted/20 rounded-xl gap-4">
                                            <div>
                                                <h4 className="font-semibold text-foreground">License Module V1 Audit</h4>
                                                <p className="text-sm text-muted-foreground">Audited by OpenZeppelin</p>
                                            </div>
                                            <Badge variant="outline" className="border-green-500/50 text-green-500">Passed</Badge>
                                            <Button variant="ghost" size="sm" className="ml-auto sm:ml-0">
                                                Download PDF
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Bug Bounty */}
                            <section id="bug-bounty" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/5 rotate-1 transition-transform hover:rotate-2">
                                        <Bug className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Bug Bounty</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        We incentivize the security community to help us find and fix vulnerabilities.
                                    </p>
                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-4">
                                        <p className="text-yellow-600 dark:text-yellow-400 font-semibold">
                                            Up to $50,000 USDC for critical vulnerabilities.
                                        </p>
                                    </div>
                                    <Button variant="default" className="w-full sm:w-auto">
                                        Submit a Report on Immunefi
                                    </Button>
                                </div>
                            </section>

                            {/* Risks */}
                            <section id="risks" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/5 -rotate-1 transition-transform hover:-rotate-2">
                                        <AlertTriangle className="w-6 h-6 text-red-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Risk Disclosure</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed">
                                        Smart contracts carry inherent risks. While we take every precaution, including audits and testing, user funds and assets could be at risk due to unforeseen bugs in the protocol or the underlying Starknet/Ethereum network. Always use caution.
                                    </p>
                                </div>
                            </section>

                            {/* Monitoring */}
                            <section id="monitoring" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Eye className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Monitoring</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        We use real-time monitoring tools (like Forta) to detect anomalies and suspicious transaction patterns, allowing for rapid response to potential threats.
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
