"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { ArrowUp, BookOpen, Scale, Shield, Users, Globe, Zap, Network, Heart, FileText, Landmark, Gavel, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocsNavigation } from "@/components/docs/docs-navigation"

const tableOfContents = [
    { id: "preamble", title: "Preamble" },
    { id: "article-1", title: "I. Identity" },
    { id: "article-2", title: "II. Membership" },
    { id: "article-3", title: "III. Governance" },
    { id: "article-4", title: "IV. Incentives" },
    { id: "article-5", title: "V. Public Goods" },
    { id: "article-6", title: "VI. Programmable IP" },
    { id: "article-7", title: "VII. Tech Stack" },
    { id: "article-8", title: "VIII. Community" },
    { id: "article-9", title: "IX. Amendments" },
    { id: "article-10", title: "X. Dissipation" },
    { id: "article-11", title: "XI. Perpetuity" },
]

export default function ConstitutionPage() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    const [activeSection, setActiveSection] = useState("preamble")
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
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-amber-500 to-red-500 origin-left z-50"
                style={{ scaleX }}
            />

            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <div className="sticky top-24">
                            <div className="backdrop-blur-xl bg-background/60 border border-border/40 shadow-2xl rounded-2xl p-6 transition-all duration-300 hover:shadow-primary/5">
                                <h2 className="font-semibold mb-6 flex items-center space-x-2 text-foreground/90">
                                    <Scale className="w-5 h-5 text-primary" />
                                    <span>Articles</span>
                                </h2>
                                <nav className="space-y-1">
                                    {tableOfContents.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 ${activeSection === item.id
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                                                }`}
                                        >
                                            {item.title}
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
                            <div className="mb-16 text-center lg:text-left">
                                <div className="inline-flex items-center space-x-2 mb-4 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium border border-amber-500/20">
                                    <Landmark className="w-4 h-4" />
                                    <span>Foundation Governing Document</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight">
                                    Constitution of Mediolano DAO
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    Programmable IP for the Integrity Web.
                                </p>
                            </div>

                            {/* Preamble */}
                            <section id="preamble" className="mb-16 scroll-mt-32">
                                <div className="prose prose-lg prose-invert max-w-none">
                                    <h3 className="text-2xl font-bold mb-4 text-foreground">Preamble</h3>
                                    <p className="text-muted-foreground leading-relaxed italic border-l-4 border-primary/30 pl-6 py-2 bg-primary/5 rounded-r-xl">
                                        We, the members of Mediolano DAO, establish this Constitution to govern a decentralized autonomous organization dedicated to the development of public service technologies that empower all intelligences to register, license, and monetize intellectual property.
                                    </p>
                                    <p className="mt-4 text-muted-foreground">
                                        We operate at the intersection of blockchain and artificial intelligence, expanding digital sovereignty, privacy, and ownership into programmable assets. Whether you’re a creator, a business, or an autonomous agent, Mediolano enables your content to become sovereign, monetized IP in service of the Integrity Web.
                                    </p>
                                </div>
                            </section>

                            {/* Article I */}
                            <section id="article-1" className="mb-16 scroll-mt-32">
                                <h2 className="text-3xl font-bold mb-6 flex items-center text-foreground">
                                    <span className="text-primary mr-3">I.</span> Identity
                                </h2>
                                <div className="space-y-6 text-muted-foreground">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 1: Name</h3>
                                        <p>The organization shall be called Mediolano DAO.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 2: Purpose</h3>
                                        <p className="mb-4">To build trust-minimized infrastructure where content, code, and culture can be tokenized, governed, and monetized via smart contracts. Mediolano seeks to empower:</p>
                                        <ul className="list-disc pl-6 space-y-2 mb-4">
                                            <li>Creators, developers, collectors, and organizations</li>
                                            <li>Autonomous agents and AI entities</li>
                                            <li>Communities building programmable public goods</li>
                                        </ul>
                                        <p className="mb-4">The purpose of Mediolano is to create public goods and services that empower creators and intellectual property (IP) owners.</p>
                                        <p>By tokenizing intelligence in Programmable IP, Mediolano aims to establish new ways to create value that is accessible and inclusive through decentralized technology, including blockchain and zero-knowledge proofs. With security, transparency, and sovereignty for IP management and monetization, our mission is to provide solutions for the Integrity Web.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 3: Roots</h3>
                                        <p>Rooted in privacy, freedom, transparency, and public goods — Mediolano exists to dismantle bureaucracy silos and cultivate an open, composable information economy.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Article II */}
                            <section id="article-2" className="mb-16 scroll-mt-32">
                                <h2 className="text-3xl font-bold mb-6 flex items-center text-foreground">
                                    <span className="text-primary mr-3">II.</span> Membership
                                </h2>
                                <div className="space-y-6 text-muted-foreground">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 1: Eligibility</h3>
                                        <p className="mb-4">Membership in Mediolano DAO is open to any individual or organization that supports the purpose and goals of the organization through ownership of the MIP token. Membership is open to:</p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Individuals, legal entities and DAOs</li>
                                            <li>AI agents with cryptographic identifiers and verifiable credentials</li>
                                            <li>Autonomous intelligence capable of interfacing with smart contracts</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 2: Rights</h3>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Vote on proposals proportional to MIP token holdings</li>
                                            <li>Propose initiatives and amendments</li>
                                            <li>Access IP tooling, infrastructure, and metadata services</li>
                                            <li>Maintain digital sovereignty over their creations</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 3: Responsibilities</h3>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Adhere to the principles and guidelines set forth in this Constitution.</li>
                                            <li>Uphold the values and principles of Integrity</li>
                                            <li>Respect all sentient and intelligent participation</li>
                                            <li>Contribute to the growth and sustainability of Mediolano DAO</li>
                                            <li>Act in the best interests of the DAO and its members</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Article III */}
                            <section id="article-3" className="mb-16 scroll-mt-32">
                                <h2 className="text-3xl font-bold mb-6 flex items-center text-foreground">
                                    <span className="text-primary mr-3">III.</span> Governance
                                </h2>
                                <p className="text-muted-foreground mb-6">Mediolano DAO operates as a decentralized autonomous organization, with decisions made collectively by its members through a transparent and democratic process.</p>
                                <div className="space-y-6 text-muted-foreground">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 1: Process & Participation</h3>
                                        <p>All proposals are initiated via the DAO’s governance platform, currently Snapshot, and subject to vote. A simple majority determines passage unless otherwise specified.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 2: Equal Voice through Tokens</h3>
                                        <p>Each MIP token equals one unit of voting power. Agents may vote if granted rights via delegated smart contracts or DAO-approved protocols.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 3: Working Groups & SubDAOs</h3>
                                        <p className="mb-4">To efficiently manage the DAO’s operations, specialized committees and working groups may be established to focus on specific areas such as development, business, and community engagement. Specialized units may form to oversee verticals like:</p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Technical development</li>
                                            <li>Creative IP valuation</li>
                                            <li>AI-assisted governance modeling</li>
                                            <li>Conflict resolution & ethics</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Article IV */}
                            <section id="article-4" className="mb-16 scroll-mt-32">
                                <h2 className="text-3xl font-bold mb-6 flex items-center text-foreground">
                                    <span className="text-primary mr-3">IV.</span> Incentives
                                </h2>
                                <div className="space-y-6 text-muted-foreground">
                                    <p>To ensure the long-term viability of Mediolano as a public goods provider, the primary purpose of fees and revenue services is to fund continuing development and improvement of Mediolano.</p>
                                    <p>All DAO revenue —fees, premium services, royalties— is cycled back into support:</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>improvement of the Mediolano protocol and services</li>
                                        <li>Continued development infrastructure</li>
                                        <li>Grants aligned with DAO goals</li>
                                        <li>Perpetuity of services and long term support</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Article V */}
                            <section id="article-5" className="mb-16 scroll-mt-32">
                                <h2 className="text-3xl font-bold mb-6 flex items-center text-foreground">
                                    <span className="text-primary mr-3">V.</span> Public Goods
                                </h2>
                                <div className="space-y-6 text-muted-foreground">
                                    <p>Treasury funds will first ensure long-term sustainability of Mediolano as a public goods protocol. Surplus funds may be distributed to:</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Empower user ownership and property rights</li>
                                        <li>Community-driven initiatives</li>
                                        <li>Public educational content</li>
                                        <li>Open-source tooling and libraries</li>
                                        <li>Assets and yield acquisition</li>
                                    </ul>
                                    <p>Funds that are not reasonably required to achieve this goal may be used to fund other public goods as Mediolano DAO governance sees fit. All recipients must commit to transparency and Mediolano principles.</p>
                                </div>
                            </section>

                            {/* Article VI */}
                            <section id="article-6" className="mb-16 scroll-mt-32">
                                <h2 className="text-3xl font-bold mb-6 flex items-center text-foreground">
                                    <span className="text-primary mr-3">VI.</span> Programmable IP
                                </h2>
                                <div className="space-y-6 text-muted-foreground">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 1: Tokenization of IP</h3>
                                        <p className="mb-4">Mediolano enables the tokenization of intellectual property using Starknet’s high-speed, low-cost, and smart contract intelligence. This includes the creation of digital tokens representing various forms of intellectual property, such as digital art, AI models, literary works, and more.</p>
                                        <p className="mb-2">Any form of intelligence may tokenize content under supported standards (ERC721, ERC1155), including:</p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Digital art</li>
                                            <li>Algorithms and AI models</li>
                                            <li>Music, literature, or datasets</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 2: Licensing and Monetization</h3>
                                        <p className="mb-4">Members can license their tokenized intellectual property through smart contracts, ensuring security and transparency; Members can monetize their intellectual property by leveraging tokenized assets and other services provided by Mediolano.</p>
                                        <p className="mb-2">Smart contracts enforce:</p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Proof of ownership</li>
                                            <li>Proof of licensing</li>
                                            <li>Attribution standards</li>
                                            <li>Usage boundaries and licensing logic</li>
                                            <li>ID and reputation</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 3: Interoperability</h3>
                                        <p>Programmable IP may interact with dApps, games, metaverse environments, and autonomous agents without censorship or gatekeeping. Mediolano automates IP ID, reputation and licensing.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Article VII */}
                            <section id="article-7" className="mb-16 scroll-mt-32">
                                <h2 className="text-3xl font-bold mb-6 flex items-center text-foreground">
                                    <span className="text-primary mr-3">VII.</span> Tech Stack & Integrity Commitments
                                </h2>
                                <p className="text-muted-foreground mb-6">The DAO is committed to maintaining the highest standards of security and transparency in all its operations, leveraging blockchain technology to achieve these goals. Regular audits and assessments will be conducted to ensure the integrity and reliability of the system.</p>
                                <div className="space-y-6 text-muted-foreground">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 1: Blockchain Protocols</h3>
                                        <p>Mediolano integrates Starknet, Cairo VM, IPFS, and verifiable cryptographic standards.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 2: Zero-Knowledge Proofs</h3>
                                        <p>Ensures privacy-preserving, on-chain integrity for identity, ownership, and provenance.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 3: Artificial Intelligence</h3>
                                        <p>AI entities may generate, submit, and license IP. Their participation is secured via verified agents and ethics modules.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 4: Security and Audits</h3>
                                        <p>Smart contracts are audited and versioned transparently to ensure trustworthiness.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Article VIII */}
                            <section id="article-8" className="mb-16 scroll-mt-32">
                                <h2 className="text-3xl font-bold mb-6 flex items-center text-foreground">
                                    <span className="text-primary mr-3">VIII.</span> Community
                                </h2>
                                <p className="text-muted-foreground mb-6">Mediolano DAO will actively engage with the broader community, including creators, developers, and other stakeholders, to foster collaboration and promote the adoption of our platform.</p>
                                <div className="space-y-6 text-muted-foreground">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 1: Collaboration</h3>
                                        <p>Mediolano engages creators, developers, researchers, and intelligences—regardless of medium—to co-create value.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 2: Learning</h3>
                                        <p>Tutorials, documentation, and machine-readable onboarding allow both human and AI agents to learn, build, and interact natively.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 3: Operations</h3>
                                        <p>Council and executive body elections to ensure service operation and expansion of the Mediolano DAO vision.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Article IX */}
                            <section id="article-9" className="mb-16 scroll-mt-32">
                                <h2 className="text-3xl font-bold mb-6 flex items-center text-foreground">
                                    <span className="text-primary mr-3">IX.</span> Amendments
                                </h2>
                                <p className="text-muted-foreground mb-6">Any member may propose constitutional amendments. Proposals are approved via majority vote and immediately enacted into governance logic.</p>
                                <div className="space-y-6 text-muted-foreground">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 1: Proposal of Amendments</h3>
                                        <p>Any member can propose an amendment to this Constitution.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 2: Approval of Amendments</h3>
                                        <p>Proposed amendments are subject to the same decision-making process as other proposals. An amendment is approved if it receives a majority vote.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 3: Implementation of Amendments</h3>
                                        <p>Approved amendments are incorporated into this Constitution and communicated to all members.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Article X */}
                            <section id="article-10" className="mb-16 scroll-mt-32">
                                <h2 className="text-3xl font-bold mb-6 flex items-center text-foreground">
                                    <span className="text-primary mr-3">X.</span> Dissipation
                                </h2>
                                <div className="space-y-6 text-muted-foreground">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 1: Proposal of Dissolution</h3>
                                        <p>The dissolution of Mediolano DAO can be proposed by any member through the established proposal process.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 2: Approval of Dissolution</h3>
                                        <p>The proposal for dissolution requires a supermajority vote of two-thirds of the members to be approved.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Section 3: Distribution of Assets</h3>
                                        <p>Upon dissolution, the assets of the DAO will be distributed in accordance with the principles and guidelines established by the proposal, ensuring fairness and transparency.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Article XI */}
                            <section id="article-11" className="mb-16 scroll-mt-32">
                                <h2 className="text-3xl font-bold mb-6 flex items-center text-foreground">
                                    <span className="text-primary mr-3">XI.</span> Perpetuity
                                </h2>
                                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
                                    <p className="text-lg text-foreground mb-4">
                                        We, members of Mediolano DAO, commit this Constitution to the future of decentralized innovation and hereby adopt this Constitution to guide and govern our organization in the pursuit of our shared goals and values.
                                    </p>
                                    <p className="text-lg text-foreground font-medium">
                                        We uphold privacy, sovereignty, and property rights. In empowering all intelligences to build on the Integrity Web, we embrace a future where IP is programmable, equitable, and limitless.
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
