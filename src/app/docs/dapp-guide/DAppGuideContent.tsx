"use client"
import { useState, useEffect } from "react"
import {
    ChevronRight,
    FileText,
    ShieldCheck,
    Globe2,
    Zap,
    Scale,
    Layers,
    UserCircle,
    ArrowUp,
    CheckCircle2,
    Fingerprint,
    Wallet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DocsNavigation } from "@/components/docs/docs-navigation"

const tableOfContents = [
    { id: "intro", title: "Introduction", icon: FileText },
    { id: "permissionless", title: "Permissionless & Free", icon: Zap },
    { id: "protection", title: "Global Protection", icon: Globe2 },
    { id: "integrity-web", title: "Integrity Web", icon: ShieldCheck },
    { id: "features", title: "Key Features", icon: Layers },
    // { id: "monetization", title: "Monetization", icon: Coins }, // Removed as per request to focus on zero fees
    { id: "legal", title: "Legal Recognition", icon: Scale },
]

export default function DAppGuideContent() {
    const [activeSection, setActiveSection] = useState("intro")
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
        <div className="min-h-screen relative selection:bg-primary/30 selection:text-foreground">
            {/* Ambient Background - Subtle Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Table of Contents - Sidebar */}
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
                            {/* Decorative Top Border */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

                            {/* Introduction */}
                            <div className="mb-16 relative">
                                <div className="inline-flex items-center space-x-2 mb-6 backdrop-blur-md bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-sm font-medium text-primary">
                                    <Globe2 className="w-4 h-4" />
                                    <span>Official Documentation</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    Mediolano IP Creator
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl text-balance">
                                    The integrity web's permissionless provider for intellectual property. Tokenize, protect, and manage your creative assets with zero fees and full ownership.
                                </p>
                            </div>

                            {/* Section 1: Introduction */}
                            <section id="intro" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/5 transform rotate-3 transition-transform hover:rotate-6">
                                        <Fingerprint className="w-6 h-6 text-primary" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Introduction</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed mb-6">
                                        <strong className="text-foreground">Mediolano IP Creator</strong> provides seamless tokenization services for intellectual property, leveraging Starknet’s unparalleled high-speed, low-cost, and smart contract intelligence.
                                    </p>
                                    <p className="leading-relaxed">
                                        We empower creators, collectors, and organizations to protect and manage their digital assets effectively. By registering on Mediolano, your asset is automatically tokenized and protected in <strong className="text-foreground">181 countries</strong>, generating Proof of Ownership that guarantees recognition of authorship.
                                    </p>
                                </div>
                            </section>

                            {/* Section 2: Permissionless & Free */}
                            <section id="permissionless" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5 transform -rotate-2 transition-transform hover:-rotate-4">
                                        <Zap className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Permissionless & Free</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl hover:bg-card/50 transition-colors">
                                        <h3 className="text-xl font-medium mb-3 flex items-center">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse" />
                                            Zero Fees
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Mediolano offers permissionless services with zero fees for Programmable IP. Whether it's artwork, music, AI models, or software—keeping your ownership shouldn't cost you.
                                        </p>
                                    </div>
                                    <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl hover:bg-card/50 transition-colors">
                                        <h3 className="text-xl font-medium mb-3 flex items-center">
                                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse" />
                                            Zero Knowledge Proof
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Mediolano is built on zero-knowledge proofs to ensure the integrity of your intellectual property.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Global Protection */}
                            <section id="protection" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/5 rotate-1 transition-transform hover:rotate-3">
                                        <Globe2 className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Global Protection</h2>
                                </div>
                                <div className="backdrop-blur-md bg-background/50 border border-border/60 rounded-2xl p-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-500" />

                                    <div className="relative z-10 space-y-6">
                                        <p className="text-lg text-muted-foreground leading-relaxed">
                                            According to <strong className="text-foreground">The Berne Convention</strong> (1886), your tokenized assets are protected in 181 countries. Mediolano generates Proof of Ownership without the need for traditional WIPO registration.
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <Badge variant="outline" className="px-4 py-1.5 text-sm bg-background/50 backdrop-blur-sm">Valid for 50-70 Years</Badge>
                                            <Badge variant="outline" className="px-4 py-1.5 text-sm bg-background/50 backdrop-blur-sm">Ethereum Settlement</Badge>
                                            <Badge variant="outline" className="px-4 py-1.5 text-sm bg-background/50 backdrop-blur-sm">Immutable Timestamp</Badge>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: Integrity Web */}
                            <section id="integrity-web" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 -rotate-2 transform transition-transform hover:-rotate-3">
                                        <ShieldCheck className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Integrity Web</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed">
                                        Mediolano IP Creator serves as the infrastructure for the <strong>integrity web</strong>. We provide a tailored platform for the tokenization and management of intellectual property, enabling you to register, track, license, and monetize IP effortlessly.
                                    </p>
                                </div>
                            </section>

                            {/* Section 5: Key Features */}
                            <section id="features" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/5 rotate-2 transform transition-transform hover:rotate-3">
                                        <Layers className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Key Features</h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {[
                                        { title: "Fully Permissionless", desc: "Built for the integrity web, accessible to all.", icon: ShieldCheck },
                                        { title: "Decentralized Tokenization", desc: "Secure tokenization of creative works (art, music, code).", icon: Fingerprint },
                                        { title: "Encrypted Wallet", desc: "Own and manage digital assets with full control.", icon: Wallet },
                                        { title: "Onchain Reputation", desc: "Build your creator profile and showcase your work.", icon: UserCircle },
                                        { title: "NFT Interoperability", desc: "Uses industry standards for maximum compatibility.", icon: Layers },
                                        { title: "Asset Management", desc: "Create, Remix, and Transfer collections/assets onchain.", icon: CheckCircle2 },
                                    ].map((feature, index) => {
                                        const FeatureIcon = feature.icon
                                        return (
                                            <div key={index} className="group p-5 rounded-2xl bg-background/40 backdrop-blur-sm border border-border/40 hover:bg-background/60 hover:border-primary/20 transition-all duration-300">
                                                <div className="flex items-start space-x-4">
                                                    <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform duration-300">
                                                        <FeatureIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>

                            {/* Section 6: Legal Recognition */}
                            <section id="legal" className="mb-0 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/5 -rotate-1 transform transition-transform hover:-rotate-2">
                                        <Scale className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Legal Recognition</h2>
                                </div>
                                <div className="bg-gradient-to-br from-card to-background border border-border/50 rounded-2xl p-8 text-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none" />
                                    <h3 className="text-2xl font-bold mb-4 relative z-10">Protected by The Berne Convention</h3>
                                    <p className="text-muted-foreground max-w-2xl mx-auto mb-8 relative z-10 leading-relaxed">
                                        Your work is automatically protected in 181 countries without the need for formal registration. Mediolano provides the immutable proof you need to enforce these rights.
                                    </p>
                                    <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                                        Start Creating
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </section>

                            {/* Docs Navigation */}
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
