"use client"

import { useState, useEffect } from "react"
import { ChevronRight, HelpCircle, User, Zap, Lock, Coins, ArrowUp, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DocsNavigation } from "@/components/docs/docs-navigation"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const tableOfContents = [
    { id: "general", title: "General", icon: HelpCircle },
    { id: "creators", title: "For Creators", icon: User },
    { id: "fees", title: "Fees & Payment", icon: Coins },
    { id: "technical", title: "Technical", icon: Zap },
    { id: "security", title: "Security", icon: Lock },
]

export default function FAQContent() {
    const [activeSection, setActiveSection] = useState("general")
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
                <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="backdrop-blur-xl bg-background/60 border border-border/40 shadow-2xl rounded-2xl p-6 transition-all duration-300 hover:shadow-primary/5">
                                <h2 className="font-semibold mb-6 flex items-center space-x-2 text-foreground/90">
                                    <HelpCircle className="w-5 h-5 text-primary" />
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
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Support</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    Frequently Asked Questions
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl text-balance">
                                    Find answers to common questions about Mediolano, IP tokenization, and our platform.
                                </p>
                            </div>

                            {/* General */}
                            <section id="general" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <HelpCircle className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">General</h2>
                                </div>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>What is Mediolano?</AccordionTrigger>
                                        <AccordionContent>
                                            Mediolano is a permissionless protocol dedicated to the tokenization and management of intellectual property (IP). It allows creators to register their work on the blockchain, proving ownership and enabling new forms of monetization.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>Who can use Mediolano?</AccordionTrigger>
                                        <AccordionContent>
                                            Anyone! Mediolano is built as a public good for the open internet. Artists, musicians, developers, writers, and institutions can all use the platform to protect and manage their IP assets.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </section>

                            {/* For Creators */}
                            <section id="creators" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <User className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">For Creators</h2>
                                </div>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>What types of files can I upload?</AccordionTrigger>
                                        <AccordionContent>
                                            We support a wide range of file types including images (JPG, PNG, SVG), audio (MP3, WAV), video (MP4), and even 3D models and PDF documents.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>Can I edit my IP after minting?</AccordionTrigger>
                                        <AccordionContent>
                                            The core IP asset (the token execution) is immutable to ensure trust. However, certain metadata fields can be updated if the asset logic permits it, or you can release a new version linked to the original.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </section>

                            {/* Fees & Payment */}
                            <section id="fees" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/5 rotate-1 transition-transform hover:rotate-2">
                                        <Coins className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Fees & Payment</h2>
                                </div>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-5">
                                        <AccordionTrigger>Does it cost money to use Mediolano?</AccordionTrigger>
                                        <AccordionContent>
                                            The Mediolano protocol itself charges **zero fees**. You only pay the network gas fees required by Starknet, which are extremely low (typically cents).
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-6">
                                        <AccordionTrigger>Which wallets do you support?</AccordionTrigger>
                                        <AccordionContent>
                                            We support all major Starknet wallets, including Argent X and Braavos.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </section>

                            {/* Technical */}
                            <section id="technical" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 -rotate-1 transition-transform hover:-rotate-2">
                                        <Zap className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Technical</h2>
                                </div>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-7">
                                        <AccordionTrigger>Why Starknet?</AccordionTrigger>
                                        <AccordionContent>
                                            Starknet is a Validity Rollup (ZK-Rollup) over Ethereum. It offers massive scalability and low costs without compromising on Ethereum&apos;s battle-tested security.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-8">
                                        <AccordionTrigger>Is my data on-chain?</AccordionTrigger>
                                        <AccordionContent>
                                            Yes. Ownership and critical logic are stored on the Starknet blockchain. Large media files are stored on decentralized storage networks like IPFS or Arweave, with their content hashes recorded on-chain.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </section>

                            {/* Security */}
                            <section id="security" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Lock className="w-6 h-6 text-red-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Security</h2>
                                </div>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-9">
                                        <AccordionTrigger>Are the smart contracts audited?</AccordionTrigger>
                                        <AccordionContent>
                                            Yes, our core contracts undergo rigorous auditing by top-tier security firms. You can view the reports in the Security & Audits section.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
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
