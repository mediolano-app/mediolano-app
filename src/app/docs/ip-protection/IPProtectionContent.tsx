"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Shield, Lock, Scale, Users, Server, Coins, ArrowUp, Fingerprint, Globe, FileKey, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocsNavigation } from "@/components/docs/docs-navigation"
import { AiAgentOverview } from "@/components/docs/ai-agent-overview"

const tableOfContents = [
    { id: "intro", title: "Introduction", icon: Shield },
    { id: "cryptographic", title: "Cryptographic", icon: Lock },
    { id: "compliance", title: "Compliance Framework", icon: Scale },
    { id: "social", title: "Social & DAO", icon: Users },
    { id: "technological", title: "Technological", icon: Server },
    { id: "economic", title: "Economic", icon: Coins },
]

export default function IPProtectionContent() {
    const [activeSection, setActiveSection] = useState("intro")
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
        <div className="min-h-screen relative selection:bg-primary/30 selection:text-foreground">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[100px]" />
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
                            <div id="intro" className="mb-16 relative scroll-mt-32">
                                <div className="inline-flex items-center space-x-2 mb-6 backdrop-blur-md bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full text-sm font-medium text-sky-500">
                                    <Shield className="w-4 h-4" />
                                    <span>Protocol + Platform</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    How does Mediolano protect IP
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl text-balance">
                                    Mediolano protects your Intellectual Property through a robust "Built for the Integrity Web" strategy, combining immutable cryptography, international legal frameworks, and community governance.
                                </p>
                            </div>

                            {/* Cryptographic Protection */}
                            <section id="cryptographic" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Lock className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Cryptographic Protection</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed mb-6">
                                        At the core of the Integrity Web is mathematical certainty.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                            <h3 className="text-lg font-medium text-foreground mb-2 flex items-center">
                                                <Fingerprint className="w-4 h-4 mr-2 text-blue-500" />
                                                Immutable Proof
                                            </h3>
                                            <p className="text-sm">
                                                Every asset mint creates a permanent timestamped record on Starknet. This serves as undeniable proof of existence and initial ownership at a specific point in time.
                                            </p>
                                        </div>
                                        <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                            <h3 className="text-lg font-medium text-foreground mb-2 flex items-center">
                                                <FileKey className="w-4 h-4 mr-2 text-blue-500" />
                                                Non-Fungible Tokens (NFTs)
                                            </h3>
                                            <p className="text-sm">
                                                The ERC721 token acts as the <strong>Key</strong> to the IP. Only the holder of the private key controlling the token address can manage, license, or transfer the rights.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Compliance Framework */}
                            <section id="compliance" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <Scale className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Compliance Framework</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                        Code is law, but we also respect human law. Mediolano is built to be compliant with international copyright treaties, specifically aligned with the <strong>Berne Convention</strong>.
                                    </p>

                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-foreground mb-3">The Berne Convention (1886)</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Administered by WIPO, this landmark agreement ensures that creators from member nations receive the same copyright protections abroad as they do in their home countries.
                                        </p>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                                                <span><strong>National Treatment:</strong> Works from one member state must be protected in all other member states.</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                                                <span><strong>Automatic Protection:</strong> Copyright is granted the moment a work is "fixed". No registration required.</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                                                <span><strong>Independence of Protection:</strong> Rights are independent of protection in the country of origin.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-muted/30 p-4 rounded-xl border-l-4 border-purple-500 mb-6">
                                        <h3 className="text-md font-medium text-foreground mb-2">Minimum Standards</h3>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                            <li className="flex items-center"><ChevronRight className="w-3 h-3 text-purple-500 mr-1" /> Protected Works (Art, Science, Literature)</li>
                                            <li className="flex items-center"><ChevronRight className="w-3 h-3 text-purple-500 mr-1" /> Exclusive Rights (Reproduction, Adaptation)</li>
                                            <li className="flex items-center"><ChevronRight className="w-3 h-3 text-purple-500 mr-1" /> Moral Rights (Authorship, Integrity)</li>
                                            <li className="flex items-center"><ChevronRight className="w-3 h-3 text-purple-500 mr-1" /> Duration (Author's Life + 50 years)</li>
                                        </ul>
                                    </div>

                                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                        <Globe className="w-4 h-4 text-purple-500" />
                                        <span>Recognized in <strong>181 signatory countries</strong> (including most WTO members via TRIPS).</span>
                                    </div>
                                </div>
                            </section>

                            {/* Social Protection */}
                            <section id="social" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 rotate-1 transition-transform hover:rotate-2">
                                        <Users className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Social & DAO Governance</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed mb-4">
                                        A protocol owned by its users is inherently more protective of their rights than a corporate platform.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-muted/20 p-4 rounded-xl">
                                            <h4 className="font-semibold text-foreground mb-2">Community Watch</h4>
                                            <p className="text-sm">
                                                The Mediolano community actively monitors for IP infringement. The DAO can vote to flag malicious actors or delist infringing content from the frontend (though the on-chain record remains, tagged as disputed).
                                            </p>
                                        </div>
                                        <div className="bg-muted/20 p-4 rounded-xl">
                                            <h4 className="font-semibold text-foreground mb-2">Dispute Resolution</h4>
                                            <p className="text-sm">
                                                Future roadmap items include decentralized dispute resolution mechanisms where token holders can serve as jurors for IP conflicts.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Technological Protection */}
                            <section id="technological" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/5 -rotate-1 transition-transform hover:-rotate-2">
                                        <Server className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Technological Protection</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        We ensure that your IP data cannot be deleted, altered, or gatekept.
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-center">
                                            <div className="p-1.5 bg-green-500/10 rounded-lg mr-3 text-green-500"><Globe className="w-4 h-4" /></div>
                                            <span className="text-sm"><strong>Decentralized Storage:</strong> IPFS & Arweave ensure data permanence.</span>
                                        </li>
                                        <li className="flex items-center">
                                            <div className="p-1.5 bg-green-500/10 rounded-lg mr-3 text-green-500"><Eye className="w-4 h-4" /></div>
                                            <span className="text-sm"><strong>Open Source:</strong> The entire stack is verifiable. No hidden backdoors.</span>
                                        </li>
                                        <li className="flex items-center">
                                            <div className="p-1.5 bg-green-500/10 rounded-lg mr-3 text-green-500"><Server className="w-4 h-4" /></div>
                                            <span className="text-sm"><strong>Censorship Resistance:</strong> No central server to shut down.</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>




                            <AiAgentOverview
                                title="Automated Rights Enforcement"
                                summary="For AI agents, 'protection' means 'verification'. Mediolano provides the cryptographic proofs necessary for an autonomous agent to verify that it is interacting with the legitimate owner of an asset, and to respect the license constraints (e.g., 'commercial_use: false') programmatically before ingestion or modification."
                                roles={["Rights Verifier", "Royalty Disburser", "Dispute Oracle"]}
                                contracts={[
                                    { name: "IPCollection", address: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS || "0x...", network: "Starknet Mainnet" }
                                ]}
                                codeSnippet={{
                                    language: "json",
                                    code: `{\n  "verification_status": "verified",\n  "proof_type": "starknet_tx_hash",\n  "timestamp": "1738072800",\n  "license_check": "passed"\n}`,
                                    description: "Agent Verification Output"
                                }}
                            />

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
                    aria-label="Back to top"
                >
                    <ArrowUp className="w-5 h-5" />
                </Button>
            )}
        </div>
    )
}
