"use client"
import { useState, useEffect } from "react"
import {
    ChevronRight,
    FileText,
    Terminal,
    BookOpen,
    ArrowUp,
    Settings,
    Download,
    Play,
    Server,
    Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DocsNavigation } from "@/components/docs/docs-navigation"

const tableOfContents = [
    { id: "introduction", title: "Introduction", icon: Shield },
    { id: "prerequisites", title: "Prerequisites", icon: FileText },
    { id: "installation", title: "Installation", icon: Download },
    { id: "configuration", title: "Configuration", icon: Settings },
    { id: "running-locally", title: "Running Locally", icon: Play },
    { id: "deployment", title: "Deployment", icon: Server },
]

export default function PermissionlessSetupContent() {
    const [activeSection, setActiveSection] = useState("introduction")
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
                <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            {/* Navigation */}
                            <div className="backdrop-blur-xl bg-background/60 border border-border/40 shadow-2xl rounded-2xl p-6 transition-all duration-300 hover:shadow-primary/5">
                                <h2 className="font-semibold mb-6 flex items-center space-x-2 text-foreground/90">
                                    <BookOpen className="w-5 h-5 text-primary" />
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

                            {/* Header */}
                            <div className="mb-16 relative">
                                <div className="inline-flex items-center space-x-2 mb-6 backdrop-blur-md bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-sm font-medium text-primary">
                                    <Terminal className="w-4 h-4" />
                                    <span>Developer Guide</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    Permissionless Setup
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl text-balance">
                                    A guide to help run Mediolano IP Creator locally or deploy your own instance.
                                </p>
                            </div>

                            {/* Introduction */}
                            <section id="introduction" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Shield className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Introduction</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="mb-6">
                                        Mediolano IP Creator is a fully permissionless and open-source decentralized application (DApp). This means anyone can run the application locally or deploy their own instance without relying on a central authority.
                                    </p>
                                    <p>
                                        Whether you are a developer looking to contribute, a user who wants to run a private instance, or an AI agent integrating with the protocol, this guide provides all the necessary steps to get up and running.
                                    </p>
                                </div>
                            </section>

                            {/* Prerequisites */}
                            <section id="prerequisites" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <FileText className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Prerequisites</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Node.js 18.17 or later</li>
                                        <li>npm or yarn or pnpm or bun</li>
                                        <li>Git</li>
                                        <li>A code editor (like VS Code)</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Installation */}
                            <section id="installation" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/5 rotate-1 transition-transform hover:rotate-2">
                                        <Download className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Installation</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="mb-4">Clone the repository and install dependencies:</p>
                                    <div className="bg-muted/50 p-4 rounded-xl border border-border/50 font-mono text-sm overflow-x-auto">
                                        <code>
                                            git clone https://github.com/mediolano/mediolano-app.git<br />
                                            cd mediolano-app<br />
                                            npm install
                                        </code>
                                    </div>
                                </div>
                            </section>

                            {/* Configuration */}
                            <section id="configuration" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 -rotate-1 transition-transform hover:-rotate-2">
                                        <Settings className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Configuration</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="mb-4">
                                        Copy the example environment file to create your own configuration:
                                    </p>
                                    <div className="bg-muted/50 p-4 rounded-xl border border-border/50 font-mono text-sm mb-6">
                                        <code>cp .env.example .env.local</code>
                                    </div>
                                    <p className="mb-4">
                                        Then, open <code>.env.local</code> and configure the following variables:
                                    </p>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium text-foreground mb-2">Core Settings</h3>
                                            <div className="bg-card p-4 rounded-xl border border-border/50 text-sm">
                                                <ul className="space-y-2 font-mono">
                                                    <li><span className="text-primary">NEXT_PUBLIC_APP_URL</span>: Your app URL (e.g., http://localhost:3000)</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-foreground mb-2">Starknet Configuration</h3>
                                            <div className="bg-card p-4 rounded-xl border border-border/50 text-sm">
                                                <ul className="space-y-2 font-mono">
                                                    <li><span className="text-primary">NEXT_PUBLIC_STARKNET_NETWORK</span>: mainnet (or sepolia)</li>
                                                    <li><span className="text-primary">NEXT_PUBLIC_EXPLORER_URL</span>: https://voyager.online</li>
                                                    <li><span className="text-primary">NEXT_PUBLIC_RPC_URL</span>: Your RPC endpoint (optional)</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-foreground mb-2">Contracts (Mainnet)</h3>
                                            <div className="bg-card p-4 rounded-xl border border-border/50 text-sm">
                                                <ul className="space-y-2 font-mono break-all">
                                                    <li><span className="text-primary">NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS</span>: 0x05e73b7be06d82beeb390a0e0d655f2c9e7cf519658e04f05d9c690ccc41da03</li>
                                                    <li><span className="text-primary">NEXT_PUBLIC_COLLECTION_CONTRACT_HASH</span>: 0x07631b53dcec6eb95f00ebc8cf63c2cdc5190c07cbe93e6c3ec92a4dccb12fe5</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-foreground mb-2">Contracts (Sepolia Testnet)</h3>
                                            <div className="bg-card p-4 rounded-xl border border-border/50 text-sm">
                                                <ul className="space-y-2 font-mono break-all">
                                                    <li><span className="text-primary">NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS</span>: 0x03990b145bec2bb3d3143e7cb3b8a89a72272cf562d2b0278f38e3357cbc976f</li>
                                                    <li><span className="text-primary">NEXT_PUBLIC_COLLECTION_CONTRACT_HASH</span>: 0x06ea42dff5fe3670a7444829602dfd5417afc4b5a3191cfb4e660fab47ae922d</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-foreground mb-2">IPFS & Pinata</h3>
                                            <div className="bg-card p-4 rounded-xl border border-border/50 text-sm">
                                                <ul className="space-y-2 font-mono">
                                                    <li><span className="text-primary">NEXT_PUBLIC_GATEWAY_URL</span>: IPFS Gateway (e.g., https://ipfs.io/ipfs)</li>
                                                    <li><span className="text-primary">PINATA_JWT</span>: Your Pinata JWT</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Running Locally */}
                            <section id="running-locally" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Play className="w-6 h-6 text-pink-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Running Locally</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="mb-4">Start the development server:</p>
                                    <div className="bg-muted/50 p-4 rounded-xl border border-border/50 font-mono text-sm">
                                        <code>npm run dev</code>
                                    </div>
                                    <p className="mt-4">
                                        Open <a href="http://localhost:3000" className="text-primary hover:underline">http://localhost:3000</a> with your browser to see the result.
                                    </p>
                                </div>
                            </section>

                            {/* Deployment */}
                            <section id="deployment" className="mb-12 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-slate-500/10 border border-slate-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <Server className="w-6 h-6 text-slate-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Deployment</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="mb-6">
                                        The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.
                                    </p>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl hover:bg-card/50 transition-colors">
                                            <h3 className="text-lg font-medium text-foreground mb-4">Vercel</h3>
                                            <p className="text-sm mb-4">
                                                Push your code to a Git repository (GitHub, GitLab, or Bitbucket) and import the project into Vercel.
                                            </p>
                                            <Button variant="outline" className="w-full" asChild>
                                                <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer">Deploy to Vercel</a>
                                            </Button>
                                        </div>
                                        <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl hover:bg-card/50 transition-colors">
                                            <h3 className="text-lg font-medium text-foreground mb-4">Netlify</h3>
                                            <p className="text-sm mb-4">
                                                Similar to Vercel, you can connect your repository to Netlify for automatic deployments.
                                            </p>
                                            <Button variant="outline" className="w-full" asChild>
                                                <a href="https://www.netlify.com/" target="_blank" rel="noopener noreferrer">Deploy to Netlify</a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Docs Navigation */}
                            <DocsNavigation />

                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Top */}
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
