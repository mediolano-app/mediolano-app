"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Terminal, Braces, GitMerge, FileJson, ArrowUp, Code2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DocsNavigation } from "@/components/docs/docs-navigation"
import { AiAgentOverview } from "@/components/docs/ai-agent-overview"

const tableOfContents = [
    { id: "open-source", title: "Open Source Repository", icon: Terminal },
    { id: "contracts", title: "Smart Contracts", icon: FileJson },
    { id: "sdk", title: "SDK Integration", icon: Braces },
    { id: "api-services", title: "API Services", icon: GitMerge },
    { id: "resources", title: "Resources", icon: Code2 },
]

export default function DevelopersContent() {
    const [activeSection, setActiveSection] = useState("open-source")
    const [showBackToTop, setShowBackToTop] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)

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

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <div className="min-h-screen relative selection:bg-primary/30 selection:text-foreground">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-slate-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="backdrop-blur-xl bg-background/60 border border-border/40 shadow-2xl rounded-2xl p-6 transition-all duration-300 hover:shadow-primary/5">
                                <h2 className="font-semibold mb-6 flex items-center space-x-2 text-foreground/90">
                                    <Terminal className="w-5 h-5 text-primary" />
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
                                    <Code2 className="w-4 h-4" />
                                    <span>Developers</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    Developer Hub
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl text-balance">
                                    Build the next generation of IP applications. Access our smart contracts, SDKs, and data layers to integrate programmable IP into your dApp.
                                </p>
                            </div>

                            {/* Quick Start */}
                            <section id="open-source" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Terminal className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Open Source Repository</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed mb-6">
                                        You can find the source code for the Mediolano on GitHub. It is open source and available for anyone to use, modify, and contribute to. The Mediolano IP Creator dapp is fully permissionless and can be run locally or deployed independently to create your own instance.
                                    </p>
                                    <div className="bg-black/80 rounded-xl p-4 overflow-x-auto relative group">
                                        <div className="absolute top-4 right-4">
                                            <button
                                                onClick={() => copyToClipboard("git clone https://github.com/mediolano-app/mediolano-app.git", "clone_cmd")}
                                                className="p-2 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
                                            >
                                                {copied === "clone_cmd" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                            </button>
                                        </div>
                                        <code className="text-sm font-mono text-green-400">
                                            git clone https://github.com/mediolano-app/mediolano-app.git<br />
                                            cd mediolano-app<br />
                                            npm install<br />
                                            npm run dev
                                        </code>
                                    </div>
                                </div>
                            </section>

                            {/* Smart Contracts */}
                            <section id="contracts" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <FileJson className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Cairo Smart Contracts</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                        Mediolano implements zero-knowledge proofs to ensure the integrity of your intellectual property.
                                    </p>
                                    <div className="space-y-4">
                                        {[
                                            { name: "Mediolano Protocol IP Collections", address: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS, network: "Starknet Mainnet" },
                                        ].map((contract, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/20 rounded-xl gap-4">
                                                <div>
                                                    <h4 className="font-semibold text-foreground">{contract.name}</h4>
                                                    <Badge variant="outline" className="mt-1">{contract.network}</Badge>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto bg-background/50 p-2 rounded-lg border border-border/30">
                                                    <code className="text-xs font-mono text-muted-foreground truncate flex-1 sm:flex-none">{contract.address}</code>
                                                    <button
                                                        onClick={() => copyToClipboard(process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS || "", `addr_${index}`)}
                                                        className="p-1 hover:bg-muted rounded transition-colors"
                                                    >
                                                        {copied === `addr_${index}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>



                            {/* API Services */}
                            <section id="api-services" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/5 -rotate-1 transition-transform hover:-rotate-2">
                                        <GitMerge className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">API Services</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed mb-6">
                                        Mediolano provides a REST API for querying indexed NFT data from Starknet contracts.
                                    </p>

                                    <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl space-y-6">
                                        <div>
                                            <h3 className="text-xl font-semibold text-foreground mb-4">NFT Indexer API</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="flex flex-col space-y-1">
                                                    <span className="text-muted-foreground">Version</span>
                                                    <span className="font-mono text-foreground">1.0.0</span>
                                                </div>
                                                <div className="flex flex-col space-y-1">
                                                    <span className="text-muted-foreground">Specification</span>
                                                    <span className="font-mono text-foreground">OAS 3.0</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex flex-col space-y-2">
                                                <span className="text-sm font-medium text-foreground">Documentation</span>
                                                <a
                                                    href="https://mediolano-api-service.onrender.com/docs/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 text-primary hover:underline"
                                                >
                                                    <span>View Swagger UI</span>
                                                    <ChevronRight className="w-4 h-4" />
                                                </a>
                                                <a
                                                    href="https://mediolano-api-service.onrender.com/docs/json"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 text-primary hover:underline"
                                                >
                                                    <span>View JSON Specification</span>
                                                    <ChevronRight className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-semibold text-foreground mb-3">Available Schemas</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    "Asset", "Collection", "Transfer", "Stats",
                                                    "PaginatedAssets", "PaginatedCollections", "PaginatedTransfers"
                                                ].map((schema) => (
                                                    <Badge key={schema} variant="secondary" className="bg-muted/50">
                                                        {schema}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>


                            {/* SDK */}
                            <section id="sdk" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 rotate-1 transition-transform hover:rotate-2">
                                        <Braces className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">SDK (Coming Soon)</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Install our TypeScript SDK for easier interaction with the protocol.
                                    </p>
                                    <div className="bg-black/80 rounded-xl p-4 mb-4">
                                        <code className="text-sm font-mono text-green-400">
                                            npm install @mediolano/sdk
                                        </code>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Full documentation available at <a href="#" className="text-primary hover:underline">sdk.mediolano.app</a>
                                    </p>
                                </div>
                            </section>




                            {/* Resources */}
                            <section id="resources" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Code2 className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Resources</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <Button variant="outline" className="justify-start gap-2 h-auto py-4">
                                            <div className="flex flex-col items-start text-left">
                                                <span className="font-semibold">Telegram Channel</span>
                                                <span className="text-xs text-muted-foreground font-normal">Get support from the community</span>
                                            </div>
                                        </Button>
                                        <Button variant="outline" className="justify-start gap-2 h-auto py-4">
                                            <div className="flex flex-col items-start text-left">
                                                <span className="font-semibold">Open-source Repository</span>
                                                <span className="text-xs text-muted-foreground font-normal">Audit and contribute to the project</span>
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            </section>


                            <AiAgentOverview
                                title="Developer API & SDK Integration"
                                summary="Interact with the Mediolano Protocol via our REST API or TypeScript SDK. The API follows OpenAPI 3.0 standards and provides indexed access to on-chain Asset, Collection, and Transfer data. Designed for programmatic access, allowing agents to query asset provenance and market stats efficiently."
                                roles={["Integrator", "Data Analyst", "Bot Developer"]}
                                schema={{
                                    Asset: {
                                        type: "object",
                                        properties: {
                                            contract_address: { type: "string" },
                                            token_id: { type: "string" },
                                            owner: { type: "string" },
                                            metadata_uri: { type: "string" }
                                        }
                                    }
                                }}
                                codeSnippet={{
                                    language: "typescript",
                                    code: "import { MediolanoSDK } from '@mediolano/sdk';\n\nconst sdk = new MediolanoSDK();\nconst asset = await sdk.getAsset(contractAddress, tokenId);",
                                    description: "Fetch Asset Data (SDK)"
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
                >
                    <ArrowUp className="w-5 h-5" />
                </Button>
            )}
        </div>
    )
}
