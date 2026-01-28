"use client"

import { useState, useEffect } from "react"
import { ChevronRight, FileText, Scale, Network, ShoppingBag, Globe, Repeat, Database, Settings, Shield, ArrowUp, Zap, Stars } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DocsNavigation } from "@/components/docs/docs-navigation"
import { AiAgentOverview } from "@/components/docs/ai-agent-overview"

const tableOfContents = [
    { id: "intro", title: "Introduction", icon: FileText },
    { id: "decentralized-metadata", title: "Decentralized & Immutable", icon: Database },
    { id: "industry-standards", title: "Industry Standards", icon: Globe },
    { id: "interoperability", title: "Compatibility", icon: Network },
    { id: "secondary-markets", title: "Secondary Markets", icon: ShoppingBag },
    { id: "ip-type", title: "IP Type & Templates", icon: Settings },
    { id: "remix-licensing", title: "Licensing with Remix", icon: Repeat },
]

export default function ProgrammableLicensingContent() {
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
                <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
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
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

                            {/* Introduction */}
                            <div id="intro" className="mb-16 relative scroll-mt-32">
                                <div className="inline-flex items-center space-x-2 mb-6 backdrop-blur-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-sm font-medium text-emerald-500">
                                    <Stars className="w-4 h-4" />
                                    <span>The Integrity Web</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    Programmable Licensing
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl text-balance">
                                    Define, verify, and enforce rights on-chain. Mediolano empowers creators with decentralized, immutable, and programmable licensing for the next generation of intellectual property.
                                </p>
                            </div>

                            {/* Decentralized & Immutable */}
                            <section id="decentralized-metadata" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Database className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Decentralized & Immutable Metadata</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed mb-6">
                                        When an IP asset is minted using the Mediolano IP Creator, the licensing terms are not stored on a centralized server. Instead, they are embedded directly into the asset's metadata, which is stored on decentralized storage networks like IPFS or Arweave.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                            <h3 className="text-lg font-medium text-foreground mb-2">On-Chain Proof</h3>
                                            <p className="text-sm">A hash of the metadata (and license) is committed to the blockchain (Starknet) within the ERC721 token URI. This creates an immutable proof of the license terms at the time of creation.</p>
                                        </div>
                                        <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                            <h3 className="text-lg font-medium text-foreground mb-2">Perpetual Access</h3>
                                            <p className="text-sm">Because the data is on IPFS/Arweave, the license terms remain accessible forever, independent of the Mediolano platform's existence. No vendor lock-in.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Industry Standards */}
                            <section id="industry-standards" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <Globe className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Industry Standards</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        We adhere to established web3 and legal standards to ensure your IP is recognized globally.
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                            <div>
                                                <span className="text-foreground font-medium">ERC-721:</span>
                                                <span className="text-muted-foreground"> The gold standard for Non-Fungible Tokens. Ensures your IP behaves like a standard NFT in wallets and marketplaces.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                            <div>
                                                <span className="text-foreground font-medium">JSON Metadata Schema:</span>
                                                <span className="text-muted-foreground"> Structured metadata that includes title, description, image, and custom attributes for licensing (e.g., `license_type`, `commercial_rights`).</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                            <div>
                                                <span className="text-foreground font-medium">Creative Commons (CC):</span>
                                                <span className="text-muted-foreground"> Compatibility with standard CC licenses (CC0, CC-BY) for clear, human-readable legal terms.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Compatibility */}
                            <section id="interoperability" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 rotate-1 transition-transform hover:rotate-2">
                                        <Network className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Compatibility & Interoperability</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed">
                                        Mediolano IP assets are designed to travel.
                                    </p>
                                    <ul className="space-y-2 mt-4">
                                        <li><strong>Wallets:</strong> Viewable in Argent X, Braavos, and any ERC-721 compatible wallet.</li>
                                        <li><strong>Marketplaces:</strong> Automatically compatible with major Starknet marketplaces (e.g., Element, Flex).</li>
                                        <li><strong>Bridges:</strong> Future-proofed for bridging to Ethereum L1 or other L2s via standard NFT bridges.</li>
                                        <li><strong>AI Agents:</strong> Metadata is machine-readable, allowing AI agents to autonomously verify rights before using content.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Secondary Markets */}
                            <section id="secondary-markets" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/5 -rotate-1 transition-transform hover:-rotate-2">
                                        <ShoppingBag className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Secondary Markets</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Intellectual Property should be tradable. When you sell a Mediolano IP Asset on a secondary market, the license travels with it (unless specified otherwise).
                                    </p>
                                    <div className="bg-muted/20 p-4 rounded-xl mb-4">
                                        <h4 className="font-semibold text-foreground mb-1">EIP-2981 Royalty Standard</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Mediolano implements the EIP-2981 royalty standard. Creators set their royalty percentage at minting. Marketplaces that respect this standard will automatically payout royalties to the original creator on every resale.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* IP Type & Templates */}
                            <section id="ip-type" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Settings className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">IP Type Component & Templates</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed mb-6">
                                        Intellectual Property is diverse. The metadata requirements for a musical composition differ vastly from those of a 3D model or a piece of open-source code. Mediolano solves this with a <strong>Modular Component System</strong> based on IP Types.
                                    </p>

                                    <h3 className="text-xl font-medium text-foreground mt-8 mb-4">Standardized Templates</h3>
                                    <p className="mb-6">
                                        We provide pre-built templates that enforce specific metadata schemas. This ensures that all assets of a certain type (e.g., Music) have consistent, queryable attributes.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                        <div className="bg-background/40 p-5 rounded-xl border border-border/40 hover:border-indigo-500/30 transition-colors">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">Visual Art</Badge>
                                            </div>
                                            <ul className="text-sm space-y-2">
                                                <li className="flex items-center"><ChevronRight className="w-3 h-3 text-indigo-500 mr-2" /> <span>Dimensions (px)</span></li>
                                                <li className="flex items-center"><ChevronRight className="w-3 h-3 text-indigo-500 mr-2" /> <span>Medium (e.g., Oil, Digital)</span></li>
                                                <li className="flex items-center"><ChevronRight className="w-3 h-3 text-indigo-500 mr-2" /> <span>Resolution (DPI)</span></li>
                                            </ul>
                                        </div>

                                        <div className="bg-background/40 p-5 rounded-xl border border-border/40 hover:border-pink-500/30 transition-colors">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <Badge variant="outline" className="bg-pink-500/10 text-pink-500 border-pink-500/20">Music / Audio</Badge>
                                            </div>
                                            <ul className="text-sm space-y-2">
                                                <li className="flex items-center"><ChevronRight className="w-3 h-3 text-pink-500 mr-2" /> <span>Duration (ms)</span></li>
                                                <li className="flex items-center"><ChevronRight className="w-3 h-3 text-pink-500 mr-2" /> <span>BPM & Key</span></li>
                                                <li className="flex items-center"><ChevronRight className="w-3 h-3 text-pink-500 mr-2" /> <span>ISRC Code</span></li>
                                            </ul>
                                        </div>

                                        <div className="bg-background/40 p-5 rounded-xl border border-border/40 hover:border-cyan-500/30 transition-colors">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <Badge variant="outline" className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20">Written Work</Badge>
                                            </div>
                                            <ul className="text-sm space-y-2">
                                                <li className="flex items-center"><ChevronRight className="w-3 h-3 text-cyan-500 mr-2" /> <span>Word Count</span></li>
                                                <li className="flex items-center"><ChevronRight className="w-3 h-3 text-cyan-500 mr-2" /> <span>Language (ISO code)</span></li>
                                                <li className="flex items-center"><ChevronRight className="w-3 h-3 text-cyan-500 mr-2" /> <span>ISBN (if applicable)</span></li>
                                            </ul>
                                        </div>

                                        <div className="bg-background/40 p-5 rounded-xl border border-border/40 hover:border-emerald-500/30 transition-colors">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Code / Software</Badge>
                                            </div>
                                            <ul className="text-sm space-y-2">
                                                <li className="flex items-center"><ChevronRight className="w-3 h-3 text-emerald-500 mr-2" /> <span>Repository URL</span></li>
                                                <li className="flex items-center"><ChevronRight className="w-3 h-3 text-emerald-500 mr-2" /> <span>Version (Semver)</span></li>
                                                <li className="flex items-center"><ChevronRight className="w-3 h-3 text-emerald-500 mr-2" /> <span>Commit Hash</span></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-muted/20 p-4 rounded-xl border-l-4 border-indigo-500">
                                        <h4 className="font-semibold text-foreground mb-1">Extensibility</h4>
                                        <p className="text-sm">
                                            Developers can propose and deploy new IP Type Templates via the DAO. Once approved, these templates become available to all users in the IP Creator DApp.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Licensing with Remix */}
                            <section id="remix-licensing" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <Repeat className="w-6 h-6 text-pink-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Licensing with Remix</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed mb-6">
                                        Creativity is iterative. Mediolano natively supports the "Remix" workflow, allowing creators to build upon existing work while automatically respecting the original license terms. This creates a transparent and fair <strong>Remix Graph</strong>.
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                                        <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                            <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                                                <Network className="w-5 h-5 mr-2 text-pink-500" />
                                                The Genealogy of Ideas
                                            </h3>
                                            <p className="text-sm mb-4">
                                                Every time an asset is remixed, a parent-child relationship is recorded on-chain. This provenance chain is immutable and public, meaning the history of an idea can always be traced back to its source.
                                            </p>
                                            <div className="flex items-center space-x-2 text-xs bg-muted/30 p-2 rounded-lg">
                                                <span className="font-mono text-pink-500">Asset A (Root)</span>
                                                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                                                <span className="font-mono text-pink-500">Asset B (Remix)</span>
                                                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                                                <span className="font-mono text-pink-500">Asset C (Remix of B)</span>
                                            </div>
                                        </div>

                                        <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                            <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                                                <Shield className="w-5 h-5 mr-2 text-pink-500" />
                                                Automated Compliance
                                            </h3>
                                            <p className="text-sm mb-4">
                                                The protocol checks the parent asset's license before allowing a remix.
                                            </p>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-start">
                                                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                                                    <span><strong>Viral License:</strong> If the parent is ShareAlike (SA), the remix MUST also be ShareAlike.</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                                                    <span><strong>Attribution:</strong> Metadata pointers ensure the original creator is always credited.</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                                                    <span><strong>Commercial Rights:</strong> If the parent forbids commercial use, the remix cannot grant commercial rights.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-medium text-foreground mb-4">For AI Agents</h3>
                                    <p className="mb-6">
                                        This structure is particularly powerful for Generative AI. An AI agent can:
                                    </p>
                                    <ol className="list-decimal pl-5 space-y-2 mb-6 marker:text-pink-500">
                                        <li>Scan the blockchain for assets with "Remix Allowed" licenses.</li>
                                        <li>Generate a new derivative work (e.g., a variation of an image).</li>
                                        <li>Mint the new asset, automatically linking the source material in the metadata.</li>
                                        <li>Propagate royalties back to the original human creator if a sale occurs.</li>
                                    </ol>
                                </div>
                            </section>


                            <AiAgentOverview
                                title="Agent-Readable Metadata"
                                summary="Mediolano's programmable licensing is designed for AI agents. By standardizing license terms in JSON metadata (e.g., 'commercial_use': true, 'modification_allowed': false) and ensuring on-chain verifiability, autonomous agents can query, negotiate, and utilize IP rights without human intervention."
                                roles={["IP Licensor", "License Verifier", "Marketplace Agent"]}
                                contracts={[
                                    { name: "IPCollection", address: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS || "0x...", network: "Starknet Mainnet" }
                                ]}
                                codeSnippet={{
                                    language: "json",
                                    code: `{\n  "name": "Asset Name",\n  "description": "...",\n  "attributes": [\n    { "trait_type": "License", "value": "CC-BY-SA-4.0" },\n    { "trait_type": "Commercial Use", "value": "Allowed" },\n    { "trait_type": "Royalty", "value": "5%" }\n  ]\n}`,
                                    description: "Example Metadata Structure"
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
