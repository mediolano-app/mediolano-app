"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Vote, Users, Scale, Coins, FileText, ArrowUp, Flag, Landmark, Gavel, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocsNavigation } from "@/components/docs/docs-navigation"

const tableOfContentsGov = [
    { id: "preamble", title: "Preamble", icon: BookOpen },
    { id: "mission", title: "Mission & Values", icon: Flag },
    { id: "membership", title: "Membership & Voting Rights", icon: Users },
    { id: "proposals", title: "Proposal Process", icon: FileText },
    { id: "voting", title: "Voting Mechanisms", icon: Vote },
    { id: "treasury", title: "Treasury Management", icon: Coins },
    { id: "conduct", title: "Code of Conduct", icon: Scale },
    { id: "disputes", title: "Dispute Resolution", icon: Gavel },
    { id: "amendments", title: "Amendments", icon: FileText },
]

export default function GovernanceCharterContent() {
    const [activeSection, setActiveSection] = useState("preamble")
    const [showBackToTop, setShowBackToTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400)

            const sections = tableOfContentsGov.map((item) => item.id)
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
                <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="backdrop-blur-xl bg-background/60 border border-border/40 shadow-2xl rounded-2xl p-6 transition-all duration-300 hover:shadow-primary/5">
                                <h2 className="font-semibold mb-6 flex items-center space-x-2 text-foreground/90">
                                    <Landmark className="w-5 h-5 text-primary" />
                                    <span>Contents</span>
                                </h2>
                                <nav className="space-y-1">
                                    {tableOfContentsGov.map((item) => {
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
                                    <Vote className="w-4 h-4" />
                                    <span>DAO</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    Governance Charter
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl text-balance">
                                    This Charter establishes the principles, processes, and structures for the decentralized governance
                                    of Mediolano.
                                </p>
                            </div>

                            {/* Section 1 */}
                            <section id="preamble" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <BookOpen className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">1. Preamble</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed">
                                        Mediolano DAO is a collective of creators, developers, and enthusiasts dedicated to building a fair
                                        and open intellectual property ecosystem on Starknet.
                                    </p>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section id="mission" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <Flag className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">2. Mission & Values</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        We are guided by:
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Sovereignty: Users own their data and IP.",
                                            "Transparency: Governance is open and verifiable.",
                                            "Innovation: Continuous improvement of the protocol.",
                                            "Inclusivity: Anyone can participate.",
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
                            <section id="membership" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/5 rotate-1 transition-transform hover:rotate-2">
                                        <Users className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">3. Membership & Voting Rights</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Membership is defined by holding the Mediolano Governance Token (MGT).
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "One token, one vote.",
                                            "Delegation of voting power is supported.",
                                            "Minimum holding requirements may apply for proposal submission.",
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
                            <section id="proposals" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/5 -rotate-1 transition-transform hover:-rotate-2">
                                        <FileText className="w-6 h-6 text-red-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">4. Proposal Process</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        The lifecycle of a proposal:
                                    </p>
                                    <div className="space-y-4">
                                        {[
                                            { step: "1. Discussion", desc: "Forums and community calls." },
                                            { step: "2. Submission", desc: "Formal on-chain proposal." },
                                            { step: "3. Voting", desc: "Token-weighted voting period." },
                                            { step: "4. Execution", desc: "Automatic or timelocked implementation via smart contract." },
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-center space-x-4 p-4 bg-muted/20 rounded-xl">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{item.step}</h4>
                                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Section 5 */}
                            <section id="voting" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Vote className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">5. Voting Mechanisms</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        We use Quadratic Voting or other mechanisms to prevent plutocracy and ensure broader community
                                        alignment (subject to technical implementation).
                                    </p>
                                </div>
                            </section>

                            {/* Section 6 */}
                            <section id="treasury" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <Coins className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">6. Treasury Management</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        DAO funds are used for:
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Protocol development and maintenance.",
                                            "Marketing and ecosystem grants.",
                                            "Liquidity provision.",
                                            "Direct compensation for contributors.",
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* Section 7 */}
                            <section id="conduct" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/5 rotate-1 transition-transform hover:rotate-2">
                                        <Scale className="w-6 h-6 text-teal-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">7. Code of Conduct</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        All DAO members must adhere to the Community Guidelines. Malicious behavior may result in slashing mechanisms (if applicable) or social ostracization.
                                    </p>
                                </div>
                            </section>

                            {/* Section 8 */}
                            <section id="disputes" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/5 -rotate-1 transition-transform hover:-rotate-2">
                                        <Gavel className="w-6 h-6 text-pink-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">8. Dispute Resolution</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Disputes are resolved through on-chain arbitration protocols (e.g., Kleros integration, if planned)
                                        or DAO voting.
                                    </p>
                                </div>
                            </section>

                            {/* Section 9 */}
                            <section id="amendments" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-slate-500/10 border border-slate-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <FileText className="w-6 h-6 text-slate-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">9. Amendments</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        This Charter may be amended by a supermajority vote (implementation detail) of the DAO.
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
