"use client"

import Link from "next/link"
import {
    FileText,
    Shield,
    Users,
    Scale,
    Gavel,
    BookOpen,
    Globe2,
    Network,
    Heart,
    Terminal,
    HelpCircle,
    Landmark,
    Zap,
    Box
} from "lucide-react"

const protocolLinks = [
    { title: "DApp Guide", href: "/docs/dapp-guide", icon: Globe2, desc: "Overview of Mediolano IP Creator" },
    { title: "User Guide", href: "/docs/user-guide", icon: BookOpen, desc: "How-to guides and tutorials" },
    { title: "Developers", href: "/docs/developers", icon: Terminal, desc: "Contracts, SDKs, and tools" },
    { title: "Mediolano Protocol", href: "/docs/protocol", icon: Network, desc: "Technical architecture" },
    { title: "Security", href: "/docs/security", icon: Shield, desc: "Audits and bug bounties" },
    { title: "FAQ", href: "/docs/faq", icon: HelpCircle, desc: "Common questions" },
]

const daoLinks = [
    { title: "Mediolano DAO", href: "/docs/mediolano-dao", icon: Users, desc: "Mission and governance model" },
    { title: "Constitution", href: "/docs/constitution", icon: Landmark, desc: "Foundation Governing Document" },
    { title: "Governance Charter", href: "/docs/governance-charter", icon: Gavel, desc: "DAO governance rules" },
    { title: "Public Goods", href: "/docs/public-goods", icon: Heart, desc: "Mission and open source" },
    { title: "Compliance Guidelines", href: "/docs/compliance-guidelines", icon: Scale, desc: "Regulatory compliance info" },
    { title: "Terms of Use", href: "/docs/terms-of-use", icon: FileText, desc: "Legal terms and conditions" },
]

export function DocsNavigation() {
    return (
        <div className="mt-24 pt-12 border-t border-border/40">
            <h3 className="text-2xl font-semibold mb-8">Explore Documentation</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Protocol & Platform Section */}
                <div>
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500">
                            <Zap className="w-4 h-4" />
                        </div>
                        <h4 className="text-lg font-medium text-foreground/80">Protocol & Platform</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {protocolLinks.map((link, index) => {
                            const Icon = link.icon
                            return (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="group block p-4 rounded-xl bg-background/40 border border-border/40 hover:bg-background/60 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-primary/5 rounded-lg text-primary/70 group-hover:text-primary group-hover:bg-primary/10 transition-colors duration-300">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm text-foreground mb-0.5 group-hover:text-primary transition-colors">{link.title}</h4>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{link.desc}</p>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* DAO & Governance Section */}
                <div>
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500">
                            <Scale className="w-4 h-4" />
                        </div>
                        <h4 className="text-lg font-medium text-foreground/80">DAO & Governance</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {daoLinks.map((link, index) => {
                            const Icon = link.icon
                            return (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="group block p-4 rounded-xl bg-background/40 border border-border/40 hover:bg-background/60 hover:border-amber-500/20 hover:shadow-md hover:shadow-amber-500/5 transition-all duration-300"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-amber-500/5 rounded-lg text-amber-500/70 group-hover:text-amber-500 group-hover:bg-amber-500/10 transition-colors duration-300">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm text-foreground mb-0.5 group-hover:text-amber-500 transition-colors">{link.title}</h4>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{link.desc}</p>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}
