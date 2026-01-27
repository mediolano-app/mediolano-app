"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { ArrowUp, BookOpen, Users, Globe, Shield, Scale, Heart, Zap, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocsNavigation } from "@/components/docs/docs-navigation"

export default function MediolanoDAOContent() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    const [showBackToTop, setShowBackToTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100 // Offset for header
            window.scrollTo({ top: y, behavior: "smooth" })
        }
    }

    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-foreground">
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 origin-left z-50"
                style={{ scaleX }}
            />

            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <div className="sticky top-24">
                            <div className="backdrop-blur-xl bg-background/60 border border-border/40 shadow-2xl rounded-2xl p-6 transition-all duration-300 hover:shadow-primary/5">
                                <h2 className="font-semibold mb-6 flex items-center space-x-2 text-foreground/90">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    <span>DAOSystem</span>
                                </h2>
                                <nav className="space-y-1">
                                    {[
                                        { id: "intro", label: "Introduction" },
                                        { id: "mission", label: "Our Mission" },
                                        { id: "governance", label: "Governance Model" },
                                        { id: "commitments", label: "Core Commitments" },
                                        { id: "participation", label: "Participation" },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className="w-full text-left px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 pb-24">
                        <div className="backdrop-blur-xl bg-background/40 border border-border/40 shadow-2xl rounded-3xl p-8 md:p-12 md:pb-24 overflow-hidden relative">

                            {/* Header */}
                            <div className="mb-12">
                                <div className="inline-flex items-center space-x-2 mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                    <Users className="w-4 h-4" />
                                    <span>Decentralized Autonomous Organization</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    Mediolano DAO
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    Ensuring transparency, permissionless participation, and truly decentralized governance for the Integrity Web.
                                </p>
                            </div>

                            {/* Section 1: Introduction */}
                            <section id="intro" className="mb-16 scroll-mt-32">
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-lg leading-relaxed text-foreground/80">
                                        Mediolano adopts the <strong>DAO (Decentralized Autonomous Organization)</strong> governance model to ensure that the platform remains transparent, permissionless, and community-driven. Through Web3 technology and principles, we aim to remove the traditional dilemmas between agents and principals, reducing bureaucracy while increasing trust.
                                    </p>
                                </div>
                            </section>

                            {/* Section 2: Mission */}
                            <section id="mission" className="mb-16 scroll-mt-32">
                                <h2 className="text-3xl font-bold mb-8 flex items-center space-x-3">
                                    <Globe className="w-8 h-8 text-blue-500" />
                                    <span>Our Mission</span>
                                </h2>
                                <div className="bg-background/40 border border-border/50 rounded-2xl p-8 mb-8">
                                    <p className="text-lg text-foreground/90 leading-relaxed italic">
                                        &quot;To decentralize the governance and decisions of the Mediolano ecosystem in order to act in the common interest of network participants, from service customers to investors.&quot;
                                    </p>
                                </div>
                                <p className="text-muted-foreground">
                                    We encourage active defense of the protocol&apos;s development through products, services, and partnerships that add and ensure value for the entire network.
                                </p>
                            </section>

                            {/* Section 3: Governance Model */}
                            <section id="governance" className="mb-16 scroll-mt-32">
                                <h2 className="text-3xl font-bold mb-8 flex items-center space-x-3">
                                    <Scale className="w-8 h-8 text-amber-500" />
                                    <span>The Governance Model</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-2xl bg-gradient-to-br from-background/60 to-background/20 border border-border/50">
                                        <h3 className="text-xl font-semibold mb-3 flex items-center">
                                            <Shield className="w-5 h-5 text-green-500 mr-2" />
                                            Trust & Transparency
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            The DAO model provides higher levels of trust by reducing the need for intermediaries. All organizational management is fully transparent and verifiable on-chain.
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-gradient-to-br from-background/60 to-background/20 border border-border/50">
                                        <h3 className="text-xl font-semibold mb-3 flex items-center">
                                            <Users className="w-5 h-5 text-purple-500 mr-2" />
                                            Democratic Participation
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Decision-making is democratized, allowing stakeholders to influence the direction of the protocol. This reduces bureaucracy and empowers the community.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: Core Commitments */}
                            <section id="commitments" className="mb-16 scroll-mt-32">
                                <h2 className="text-3xl font-bold mb-8 flex items-center space-x-3">
                                    <Heart className="w-8 h-8 text-rose-500" />
                                    <span>Core Commitments</span>
                                </h2>
                                <p className="text-muted-foreground mb-6">Mediolano DAO is an entity deeply committed to the following principles:</p>

                                <div className="space-y-4">
                                    <div className="flex items-start p-4 rounded-xl hover:bg-background/40 transition-colors">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary mr-4 mt-1">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg mb-1">Uninterrupted Development</h4>
                                            <p className="text-sm text-muted-foreground">Ensuring the continuous improvement and sustainability of the Mediolano protocol and its services.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start p-4 rounded-xl hover:bg-background/40 transition-colors">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 mr-4 mt-1">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg mb-1">Technology for Public Good</h4>
                                            <p className="text-sm text-muted-foreground">Promoting the use of our open-source technology to benefit the broader public and creator economy.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start p-4 rounded-xl hover:bg-background/40 transition-colors">
                                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 mr-4 mt-1">
                                            <Network className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg mb-1">Information Sovereignty</h4>
                                            <p className="text-sm text-muted-foreground">Supporting true ownership of data with a decentralized infrastructure that cannot be censored.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start p-4 rounded-xl hover:bg-background/40 transition-colors">
                                        <div className="p-2 bg-green-500/10 rounded-lg text-green-500 mr-4 mt-1">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg mb-1">Security & Control</h4>
                                            <p className="text-sm text-muted-foreground">Promoting robust information security and transparent control mechanisms for all participants.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start p-4 rounded-xl hover:bg-background/40 transition-colors">
                                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500 mr-4 mt-1">
                                            <Heart className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg mb-1">Privacy as a Human Right</h4>
                                            <p className="text-sm text-muted-foreground">Upholding privacy as a fundamental basic human right in the digital age.</p>
                                        </div>
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
