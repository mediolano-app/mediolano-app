"use client"
import { useState, useEffect } from "react"
import {
    ChevronRight,
    FileText,
    Wallet,
    PlusCircle,
    Layers,
    Image as ImageIcon,
    Sparkles,
    LayoutTemplate,
    BookOpen,
    ArrowRightLeft,
    Activity,
    UserCircle,
    ArrowUp,
    Search,
    Grid,
    Users,
    Settings,
    Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DocsNavigation } from "@/components/docs/docs-navigation"

const tableOfContents = [
    { id: "getting-started", title: "Getting Started", icon: Wallet },
    { id: "creating-ip", title: "Creating IP", icon: PlusCircle },
    { id: "managing-ip", title: "Managing Portfolio", icon: BookOpen },
    { id: "exploring", title: "Exploring", icon: Search },
    { id: "community", title: "Community", icon: Users },
    { id: "settings", title: "Settings", icon: Settings },
]

export default function UserGuideContent() {
    const [activeSection, setActiveSection] = useState("getting-started")
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
                <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" />
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
                                    <FileText className="w-4 h-4" />
                                    <span>Documentation</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    User Guide
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl text-balance">
                                    Step-by-step instructions on how to use Mediolano IP Creator to create, manage, and explore programmable IP.
                                </p>
                            </div>

                            {/* Getting Started */}
                            <section id="getting-started" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Wallet className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Getting Started</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="mb-6">
                                        To start using Mediolano, you need a Starknet-compatible wallet.
                                    </p>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl hover:bg-card/50 transition-colors">
                                            <h3 className="text-lg font-medium text-foreground mb-2">1. Connect Wallet</h3>
                                            <p className="text-sm">Click the <strong>Connect Wallet</strong> button in the top right corner. Select your preferred wallet (e.g., Argent, Braavos).</p>
                                        </div>
                                        <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl hover:bg-card/50 transition-colors">
                                            <h3 className="text-lg font-medium text-foreground mb-2">2. Navigate</h3>
                                            <p className="text-sm">Use the main menu or the sidebar on mobile to access different sections like <strong>Create</strong>, <strong>Discover</strong>, and <strong>Portfolio</strong>.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Creating IP */}
                            <section id="creating-ip" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <PlusCircle className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Creating IP</h2>
                                </div>
                                <div className="space-y-6">
                                    <div className="backdrop-blur-md bg-background/50 border border-border/60 rounded-2xl p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary mt-1">
                                                <Grid className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-medium text-foreground mb-2">Create Panel</h3>
                                                <p className="text-muted-foreground">Your central hub for creation. Choose to create a Collection, a single Asset, or Remix existing work.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        {[
                                            { title: "Collections", icon: Layers, desc: "Group related works. Essential for series or albums." },
                                            { title: "IP Assets", icon: ImageIcon, desc: "Mint individual items. Upload media, set metadata, and define rights." },
                                            { title: "Remix", icon: Sparkles, desc: "Create derivative works from existing IP, respecting original licenses." },
                                            { title: "Templates", icon: LayoutTemplate, desc: "Use specialized templates for Art, Music, Software, and more." },
                                        ].map((item, i) => {
                                            const Icon = item.icon
                                            return (
                                                <div key={i} className="group p-5 rounded-2xl bg-background/40 backdrop-blur-sm border border-border/40 hover:bg-background/60 hover:border-primary/20 transition-all duration-300">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </section>

                            {/* Managing Portfolio */}
                            <section id="managing-ip" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/5 rotate-1 transition-transform hover:rotate-2">
                                        <BookOpen className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Managing Portfolio</h2>
                                </div>
                                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground">
                                    <ul className="list-none space-y-4 pl-0">
                                        <li className="flex items-start">
                                            <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-medium text-primary">1</span>
                                            <span>
                                                <strong className="text-foreground">Portfolio Dashboard:</strong> Overview of all your IP holdings and stats.
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-medium text-primary">2</span>
                                            <span>
                                                <strong className="text-foreground">My Activities:</strong> Detailed log of all your on-chain actions and interactions.
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-medium text-primary">3</span>
                                            <span>
                                                <strong className="text-foreground">My Assets & Collections:</strong> Manage individual items and groups you've created.
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-medium text-primary">4</span>
                                            <span>
                                                <strong className="text-foreground">Transfer:</strong> Securely transfer ownership of assets to other wallets.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Exploring */}
                            <section id="exploring" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 -rotate-1 transition-transform hover:-rotate-2">
                                        <Search className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Exploring</h2>
                                </div>
                                <div className="backdrop-blur-md bg-background/50 border border-border/60 rounded-2xl p-8">
                                    <h3 className="text-xl font-medium text-foreground mb-3">Discover</h3>
                                    <p className="text-muted-foreground mb-4">
                                        The entry point for the Integrity Web. Find the latest registered IP, trending collections, and featured creators.
                                    </p>
                                    <Badge variant="secondary">/discover</Badge>
                                </div>
                            </section>

                            {/* Community */}
                            <section id="community" className="mb-20 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/5 rotate-2 transition-transform hover:rotate-3">
                                        <Users className="w-6 h-6 text-pink-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Community</h2>
                                </div>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl hover:bg-card/50 transition-colors">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <Layers className="w-5 h-5 text-primary" />
                                            <h3 className="text-lg font-medium text-foreground">Explore Collections</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Browse public IP collections from other creators.</p>
                                    </div>
                                    <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl hover:bg-card/50 transition-colors">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <ImageIcon className="w-5 h-5 text-primary" />
                                            <h3 className="text-lg font-medium text-foreground">Discover Assets</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Find the most recent IP assets registered on the protocol.</p>
                                    </div>
                                    <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl hover:bg-card/50 transition-colors md:col-span-2">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <Activity className="w-5 h-5 text-primary" />
                                            <h3 className="text-lg font-medium text-foreground">Community Activities</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Track real-time global events. See what others are minting, remixing, and trading.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Settings */}
                            <section id="settings" className="mb-12 scroll-mt-32">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-slate-500/10 border border-slate-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-500/5 -rotate-2 transition-transform hover:-rotate-3">
                                        <Settings className="w-6 h-6 text-slate-500" />
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Settings</h2>
                                </div>
                                <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-6 rounded-2xl hover:bg-card/50 transition-colors border-l-4 border-l-yellow-500">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <h3 className="text-lg font-medium text-foreground">Account Preferences</h3>
                                        <Badge variant="outline" className="text-yellow-500 border-yellow-500/50 bg-yellow-500/10">Experimental Feature</Badge>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Mediolano is pushing the boundaries of what's possible on-chain. Our settings feature is fully permissionless, meaning your user preferences and profile data are stored directly in a smart contract on Starknet, giving you true ownership of your digital identity.
                                    </p>
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
