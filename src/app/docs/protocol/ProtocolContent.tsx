"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Cpu, Layers, Network, ShieldCheck, Zap, Code2, ArrowUp, Database, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DocsNavigation } from "@/components/docs/docs-navigation"
import { AiAgentOverview } from "@/components/docs/ai-agent-overview"

const tableOfContents = [
    { id: "architecture", title: "Architecture", icon: Layers },
    { id: "smart-contracts", title: "Smart Contracts", icon: Code2 },
    { id: "contract-overview", title: "IPCollection Contract", icon: ShieldCheck },
    { id: "core-functions", title: "Core Functions", icon: Code2 },
    { id: "erc721-functions", title: "ERC721 Standard", icon: Layers },
    { id: "starknet", title: "Why Starknet?", icon: Zap },
    { id: "decentralization", title: "Decentralization", icon: Network },
    { id: "data-availability", title: "Data Availability", icon: Database },
]

export default function ProtocolContent() {
    const [activeSection, setActiveSection] = useState("architecture")
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
                <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="backdrop-blur-xl bg-background/60 border border-border/40 shadow-2xl rounded-2xl p-6 transition-all duration-300 hover:shadow-primary/5">
                                <h2 className="font-semibold mb-6 flex items-center space-x-2 text-foreground/90">
                                    <Cpu className="w-5 h-5 text-primary" />
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
                                    <Network className="w-4 h-4" />
                                    <span>Public Goods</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    Mediolano Protocol
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl text-balance">
                                    Programmable IP foundation of the Integrity Web. A high-performance, modular infrastructure for programmable intellectual property onchain.
                                </p>
                            </div>

                            {/* Architecture */}
                            <section id="architecture" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Layers className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Architecture</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed mb-6">
                                        Mediolano utilizes a modular architecture designed for scalability and interoperability. By decoupling the asset registry from the licensing logic, we enable flexible and evolving IP management.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                            <h3 className="text-lg font-medium text-foreground mb-2">Core Registry</h3>
                                            <p className="text-sm">IP ownership and metadata. Implemented as an ERC-721 compatible contract onchain.</p>
                                        </div>
                                        <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                            <h3 className="text-lg font-medium text-foreground mb-2">Licensing Modules</h3>
                                            <p className="text-sm">Immutable data defining usage rights, licensing terms, and transferability. Create with freedom.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Smart Contracts */}
                            <section id="smart-contracts" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <Code2 className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Smart Contracts</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Our smart contracts are written in Cairo, Starknet's native language, optimized for validity proofs (ZK-Rollup).
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Optimized for low gas consumption and high throughput.",
                                            "Censorship resistant with decentralized storage.",
                                            "Public Goods first principles.",
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* Why Starknet */}
                            <section id="starknet" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 rotate-1 transition-transform hover:rotate-2">
                                        <Zap className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Why Starknet?</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Starknet provides the computational layer and zero-knowledge proofs necessary for the Integrity Web, while maintaining decentralization and Ethereum security.
                                    </p>
                                    <div className="space-y-4">
                                        {[
                                            { title: "Validity Proofs", desc: "Mathematical integrity powered by STARKs." },
                                            { title: "Account Abstraction", desc: "Native support for advanced wallet features and improved UX." },
                                            { title: "Ethereum Security", desc: "Settlement and data availability on Ethereum mainnet." },
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-center space-x-4 p-4 bg-muted/20 rounded-xl">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{item.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Decentralization */}
                            <section id="decentralization" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/5 -rotate-1 transition-transform hover:-rotate-2">
                                        <Network className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Decentralization</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed">
                                        The protocol is designed to be unstoppable and censorship-resistant. No single entity controls the registry or the rules of engagement.
                                    </p>
                                </div>
                            </section>

                            {/* Data Availability */}
                            <section id="data-availability" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Database className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Data Availability</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Critical metadata (ownership, license terms) is stored on-chain or posted as calldata to Ethereum, ensuring it remains available as long as Ethereum exists. Heavy media assets are referenced via IPFS/Arweave hashes.
                                    </p>
                                </div>
                            </section>

                            {/* Contract Overview */}
                            <section id="contract-overview" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <ShieldCheck className="w-6 h-6 text-pink-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Mediolano Protocol - IP Collection Smart Contract</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed mb-6">
                                        The `IPCollection` contract is the core of the Mediolano Protocol. It implements the ERC721 standard for non-fungible tokens, extended with upgradeability and specific IP management features.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                            <h3 className="text-lg font-medium text-foreground mb-2">Interfaces Implemented</h3>
                                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                                <li><code className="bg-muted px-1 py-0.5 rounded text-primary">IUpgradeable</code>: Allows for logic upgrades without state loss.</li>
                                                <li><code className="bg-muted px-1 py-0.5 rounded text-primary">IIPCollection</code>: Custom interface for minting and token management.</li>
                                                <li><code className="bg-muted px-1 py-0.5 rounded text-primary">ERC721ABI</code>: Standard NFT functionality.</li>
                                                <li><code className="bg-muted px-1 py-0.5 rounded text-primary">OwnableABI</code>: Access control for administrative actions.</li>
                                                <li><code className="bg-muted px-1 py-0.5 rounded text-primary">IERC721Enumerable</code>: Enumerability extension.</li>
                                            </ul>
                                        </div>
                                        <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                            <h3 className="text-lg font-medium text-foreground mb-2">Contract Interactions</h3>
                                            <p className="text-sm">Interacting with the contract typically requires a Starknet wallet like Argent X or Braavos in order to sign transactions. Read-only functions can be called via any Starknet provider.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Core Functions */}
                            <section id="core-functions" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/5 rotate-1 transition-transform hover:rotate-2">
                                        <Code2 className="w-6 h-6 text-teal-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Core Functions</h2>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        {
                                            name: "mint",
                                            sig: "mint(recipient: ContractAddress) -> u256",
                                            desc: "Mints a new IP asset token to the specified recipient. Returns the new Token ID."
                                        },
                                        {
                                            name: "burn",
                                            sig: "burn(token_id: u256)",
                                            desc: "Burns a specific token. Operates only if the caller is the owner or approved."
                                        },
                                        {
                                            name: "transfer_token",
                                            sig: "transfer_token(from: ContractAddress, to: ContractAddress, token_id: u256)",
                                            desc: "Transfers ownership of a specific token from one address to another."
                                        },
                                        {
                                            name: "list_user_tokens",
                                            sig: "list_user_tokens(owner: ContractAddress) -> Array<u256>",
                                            desc: "Returns an array of all token IDs owned by a specific address. Useful for fetching user portfolios."
                                        }
                                    ].map((func, index) => (
                                        <div key={index} className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl group hover:border-primary/30 transition-colors">
                                            <div className="flex items-center justify-between mb-3">
                                                <code className="text-primary font-mono text-sm bg-primary/10 px-2 py-1 rounded">{func.name}</code>
                                                <Badge variant="outline" className="text-xs">External</Badge>
                                            </div>
                                            <pre className="text-xs md:text-sm text-muted-foreground bg-black/20 p-3 rounded-lg mb-3 overflow-x-auto">
                                                {func.sig}
                                            </pre>
                                            <p className="text-sm text-muted-foreground">{func.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Standard ERC721 Functions */}
                            <section id="erc721-functions" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/5 -rotate-1 transition-transform hover:-rotate-2">
                                        <Layers className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Standard ERC721</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground mb-6">
                                        Mediolano fully complies with the ERC721 standard, ensuring compatibility with all Starknet NFT marketplaces and wallets.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { name: "balance_of", desc: "Count of tokens owned by an address." },
                                            { name: "owner_of", desc: "Owner of a specific token ID." },
                                            { name: "approve", desc: "Approve another address to transfer a token." },
                                            { name: "get_approved", desc: "Get the approved address for a token." },
                                            { name: "set_approval_for_all", desc: "Approve an operator for all tokens." },
                                            { name: "is_approved_for_all", desc: "Check if an operator is approved for all." },
                                            { name: "token_uri", desc: "Get the metadata URI for a token." },
                                            { name: "safe_transfer_from", desc: "Transfer with safety checks." },
                                        ].map((item, i) => (
                                            <div key={i} className="flex flex-col p-3 rounded-xl bg-muted/20">
                                                <span className="font-mono text-sm text-foreground mb-1">{item.name}</span>
                                                <span className="text-xs text-muted-foreground">{item.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>


                            <AiAgentOverview
                                title="Protocol Architecture & Contracts"
                                summary="A modular system of Cairo smart contracts on Starknet. The Core Registry (ERC721) manages asset ownership, while Licensing Modules define usage rights. Logic is separated from state for upgradeability. Validated by STARK proofs for integrity."
                                roles={["Contract Caller", "Verifier", "Indexer"]}
                                contracts={[
                                    { name: "IPCollection", address: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS || "0x...", network: "Starknet Mainnet" }
                                ]}
                                codeSnippet={{
                                    language: "cairo",
                                    code: "use mediolano::interfaces::IIPCollectionDispatcherTrait;\n\nlet dispatcher = IIPCollectionDispatcher { contract_address };\nlet token_id = dispatcher.mint(recipient);",
                                    description: "Cross-Contract Interaction (Cairo)"
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
