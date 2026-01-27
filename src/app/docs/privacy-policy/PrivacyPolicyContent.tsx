"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Shield, Eye, Lock, Users, Globe, Cookie, ArrowUp, Database, UserCheck, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocsNavigation } from "@/components/docs/docs-navigation"

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
    { id: "legal", title: "Legal Framework", icon: Scale },
    { id: "changes", title: "Privacy Policy Updates", icon: Eye },
    { id: "contact", title: "Contact Us", icon: Users },
]

export default function PrivacyPolicyContent() {
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
        <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-foreground">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="backdrop-blur-xl bg-background/60 border border-border/40 shadow-2xl rounded-2xl p-6 transition-all duration-300 hover:shadow-primary/5">
                                <h2 className="font-semibold mb-6 flex items-center space-x-2 text-foreground/90">
                                    <Shield className="w-5 h-5 text-primary" />
                                    <span>Contents</span>
                                </h2>
                                <nav className="space-y-1">
                                    {tableOfContentsPP.map((item) => {
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
                                    <Lock className="w-4 h-4" />
                                    <span>Privacy</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    Privacy Policy
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl text-balance">
                                    Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your
                                    personal information when you use Mediolano IP Creator.
                                </p>
                            </div>

                            {/* Section 1 */}
                            <section id="information" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Database className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">1. Introduction</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed">
                                        Welcome to Mediolano, a permissionless intellectual property provider built on Starknet. This Privacy Policy explains how data is handled across our decentralized ecosystem, in alignment with our commitment to user sovereignty, transparency, and compliance with international IP standards.
                                    </p>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section id="philosophy" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <Eye className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">2. Data Philosophy</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {[
                                        {
                                            title: "Privacy by Design",
                                            desc: "No personal identifiers are required to access core features",
                                            icon: Lock
                                        },
                                        {
                                            title: "Decentralized Identity",
                                            desc: "No centralized accounts, passwords, or KYC processes",
                                            icon: UserCheck
                                        },
                                        {
                                            title: "Minimal Data Collection",
                                            desc: "No default cookies, trackers, or behavioral analytics",
                                            icon: Database
                                        },
                                    ].map((item, index) => {
                                        const Icon = item.icon
                                        return (
                                            <div key={index} className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl hover:bg-card/50 transition-colors">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <Icon className="w-5 h-5 text-primary" />
                                                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="backdrop-blur-md bg-primary/10 border border-primary/20 p-6 rounded-2xl">
                                    <p className="text-primary font-medium text-center">
                                        We believe privacy is a right—not a feature.
                                    </p>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section id="data_disclosure" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/5 rotate-1 transition-transform hover:rotate-2">
                                        <Users className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">3. Voluntary Data Disclosure</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Users may choose to share limited data when engaging with optional services:
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Wallet addresses for DAO participation or licensing agreements.",
                                            "IP metadata (e.g., title, description, licensing terms).",
                                            "DAO governance inputs, such as votes or proposals.",
                                            "Transaction data for royalty distribution or IP management.",
                                            "User-generated content (e.g., interactions, reviews) in social media.",
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
                            <section id="security" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/5 -rotate-1 transition-transform hover:-rotate-2">
                                        <Lock className="w-6 h-6 text-red-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">4. Data Security</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            <div key={index} className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl hover:bg-card/50 transition-colors">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <Icon className="w-5 h-5 text-primary" />
                                                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>

                            {/* Section 5 */}
                            <section id="transparency" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <UserCheck className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">5. Blockchain Transparency</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Starknet leverages STARK proofs and the Cairo VM to process transactions off-chain, then submits them to Ethereum for final settlement.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Tokenized IP assets, licensing contracts, and ownership proofs are public.",
                                            "Zero-knowledge proofs may be used to preserve confidentiality while ensuring verifiability.",
                                            "Mediolano cannot modify or delete blockchain records.",
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
                            <section id="records" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <Database className="w-6 h-6 text-pink-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">6. Licensing & Ownership Records</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Through smart contract integrations, users can:
                                    </p>
                                    <ul className="space-y-4 mb-4">
                                        {[
                                            "Create and sign IP licensing agreements permissionlessly.",
                                            "Generate Proof of Ownership and Proof of Licensing records.",
                                            "Store metadata publicly for transparency and legal recognition.",
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-muted-foreground text-sm">
                                        These records are timestamped, immutable, and accessible via the dApp interface.
                                    </p>
                                </div>
                            </section>



                            {/* Section 7 */}
                            <section id="cookies" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/5 rotate-1 transition-transform hover:rotate-2">
                                        <Cookie className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">7. Cookies and Tracking</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        We avoid cookies and similar technologies to protect your privacy on the dapp.
                                    </p>
                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                        <p className="text-yellow-600 dark:text-yellow-400">
                                            For detailed information, please see our <strong>Cookie Policy</strong>.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 8 */}
                            <section id="interactions" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/5 -rotate-1 transition-transform hover:-rotate-2">
                                        <Globe className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">8. Third-Party Interactions</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Mediolano may interface with external platforms (e.g., games, marketplaces, AI agents)
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "These integrations are opt-in and operate independently.",
                                            "Users are responsible for reviewing third-party privacy policies.",
                                            "Mediolano does not share or sell user data to third parties.",
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
                            <section id="dao" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Shield className="w-6 h-6 text-teal-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">9. DAO Governance</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Mediolano is governed by a decentralized autonomous organization (DAO):
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "All proposals, votes, and governance actions are recorded on-chain.",
                                            "Participation is pseudonymous and open to any wallet holder.",
                                            "No centralized moderation or surveillance is conducted.",
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
                            <section id="sovereignty" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <Lock className="w-6 h-6 text-cyan-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">10. Security & Sovereignty</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        We prioritize cryptographic security and user control:
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "No custodial access to assets or identity.",
                                            "Smart contracts enforce permissions and asset integrity.",
                                            "Users retain full control over their IP, wallet, and licensing terms.",
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
                            <section id="legal" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-slate-500/10 border border-slate-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-500/5 rotate-1 transition-transform hover:rotate-2">
                                        <Scale className="w-6 h-6 text-slate-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">11. Legal Framework</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Mediolano aligns with the Berne Convention (1886):
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Tokenized IP assets are recognized in 181 countries as proof of authorship",
                                            "Ownership validity spans 50 to 70 years, depending on jurisdiction.",
                                            "Mediolano does not offer legal advice or representation.",
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>


                            {/* Section 12 */}
                            <section id="changes" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/5 -rotate-1 transition-transform hover:-rotate-2">
                                        <Eye className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">12. Privacy Policy Updates</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed">
                                        As a decentralized protocol, updates to this Privacy Policy may be Proposed and ratified by the DAO with community consensus.</p>
                                </div>
                            </section>

                            {/* Section 13 */}
                            <section id="contact" className="mb-12 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Contact Us</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                        If you have questions about this Privacy Policy or our data practices, please contact us at:
                                    </p>
                                    <div className="space-y-2">
                                        <p className="font-medium flex items-center gap-2"><div className="w-2 h-2 bg-primary rounded-full" /> Email: mediolanoapp@gmail.com</p>
                                        <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg inline-block">
                                            We aim to respond to all inquiries within 48 hours
                                        </p>
                                    </div>
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
