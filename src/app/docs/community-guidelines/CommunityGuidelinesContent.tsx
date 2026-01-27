"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Users, MessageSquare, Shield, AlertTriangle, UserCheck, HeartHandshake, ArrowUp, Flag, Gavel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocsNavigation } from "@/components/docs/docs-navigation"

const tableOfContentsCG = [
    { id: "introduction", title: "Introduction", icon: Users },
    { id: "respect", title: "Respect & Inclusivity", icon: HeartHandshake },
    { id: "content_standards", title: "Content Standards", icon: MessageSquare },
    { id: "prohibited_conduct", title: "Prohibited Conduct", icon: AlertTriangle },
    { id: "safety", title: "Safety & Privacy", icon: Shield },
    { id: "reporting", title: "Reporting Violations", icon: Flag },
    { id: "enforcement", title: "Enforcement", icon: Gavel },
    { id: "appeals", title: "Appeals", icon: UserCheck },
]

export default function CommunityGuidelinesContent() {
    const [activeSection, setActiveSection] = useState("introduction")
    const [showBackToTop, setShowBackToTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400)

            const sections = tableOfContentsCG.map((item) => item.id)
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
                <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="backdrop-blur-xl bg-background/60 border border-border/40 shadow-2xl rounded-2xl p-6 transition-all duration-300 hover:shadow-primary/5">
                                <h2 className="font-semibold mb-6 flex items-center space-x-2 text-foreground/90">
                                    <Users className="w-5 h-5 text-primary" />
                                    <span>Contents</span>
                                </h2>
                                <nav className="space-y-1">
                                    {tableOfContentsCG.map((item) => {
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
                                    <Users className="w-4 h-4" />
                                    <span>Community</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    Community Guidelines
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl text-balance">
                                    Mediolano is a community-driven platform. These guidelines are designed to foster a safe, inclusive, and respectful environment for all creators and collectors.
                                </p>
                            </div>

                            {/* Section 1 */}
                            <section id="introduction" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Users className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">1. Introduction</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed">
                                        Our mission is to empower creators through decentralized technology. To achieve this, we rely on a
                                        community that upholds values of integrity, respect, and collaboration.
                                    </p>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section id="respect" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <HeartHandshake className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">2. Respect & Inclusivity</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        We serve a diverse, global community. We expect all users to:
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Treat others with dignity and respect.",
                                            "Welcome diverse perspectives and backgrounds.",
                                            "Engage in constructive and professional dialogue.",
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
                            <section id="content_standards" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/5 rotate-1 transition-transform hover:rotate-2">
                                        <MessageSquare className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">3. Content Standards</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        All content uploaded or linked to the platform must comply with these standards:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            "No illegal content or facilitation of illegal acts.",
                                            "No hate speech, harassment, or threats.",
                                            "No sexually explicit content without appropriate tagging (if supported).",
                                            "No malware, viruses, or malicious code.",
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-start space-x-3 p-3 bg-background/50 rounded-xl">
                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                                <span className="text-sm text-muted-foreground">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section id="prohibited_conduct" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/5 -rotate-1 transition-transform hover:-rotate-2">
                                        <AlertTriangle className="w-6 h-6 text-red-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">4. Prohibited Conduct</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        The following activities are strictly prohibited:
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Impersonating others or misrepresenting affiliation.",
                                            "Spamming, phishing, or deceptive practices.",
                                            "Market manipulation or wash trading.",
                                            "Interfering with the operation or security of the platform.",
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
                            <section id="safety" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Shield className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">5. Safety & Privacy</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Protect yourself and others:
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Do not share private keys or seed phrases.",
                                            "Do not doxx or reveal personal information of others without consent.",
                                            "Report suspicious activity immediately.",
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
                            <section id="reporting" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <Flag className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">6. Reporting Violations</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        If you witness a violation of these guidelines, please report it via:
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button variant="outline" className="justify-start gap-2">
                                            <Flag className="w-4 h-4" />
                                            DAO Governance Proposal
                                        </Button>
                                        <Button variant="outline" className="justify-start gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Community Discord
                                        </Button>
                                    </div>
                                </div>
                            </section>

                            {/* Section 7 */}
                            <section id="enforcement" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/5 rotate-1 transition-transform hover:rotate-2">
                                        <Gavel className="w-6 h-6 text-teal-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">7. Enforcement</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Violations are handled through community governance and may result in:
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Warnings issued by community moderators.",
                                            "Removal of content from the dApp interface (content remains on-chain).",
                                            "Blacklisting of wallet addresses from the dApp interface.",
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
                            <section id="appeals" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/5 -rotate-1 transition-transform hover:-rotate-2">
                                        <UserCheck className="w-6 h-6 text-pink-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">8. Appeals</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed">
                                        Users who believe enforcement actions were taken in error may submit an appeal proposal to the DAO for
                                        review and voting.
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
