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
    Landmark
} from "lucide-react"

const docsLinks = [
    { title: "DApp Guide", href: "/docs/dapp-guide", icon: Globe2, desc: "Overview of Mediolano IP Creator" },
    { title: "User Guide", href: "/docs/user-guide", icon: BookOpen, desc: "How-to guides and tutorials" },
    { title: "Terms of Use", href: "/docs/terms-of-use", icon: FileText, desc: "Legal terms and conditions" },
    { title: "Privacy Policy", href: "/docs/privacy-policy", icon: Shield, desc: "Data protection and privacy" },
    { title: "Community Guidelines", href: "/docs/community-guidelines", icon: Users, desc: "Standards for community interaction" },
    { title: "Compliance Guidelines", href: "/docs/compliance-guidelines", icon: Scale, desc: "Regulatory compliance info" },
    { title: "Governance Charter", href: "/docs/governance-charter", icon: Gavel, desc: "DAO governance rules" },
    { title: "Constitution", href: "/docs/constitution", icon: Landmark, desc: "Foundation Governing Document" },
    { title: "Mediolano Protocol", href: "/docs/protocol", icon: Network, desc: "Technical architecture" },
    { title: "Public Goods", href: "/docs/public-goods", icon: Heart, desc: "Mission and open source" },
    { title: "Developers", href: "/docs/developers", icon: Terminal, desc: "Contracts, SDKs, and tools" },
    { title: "Security", href: "/docs/security", icon: Shield, desc: "Audits and bug bounties" },
    { title: "FAQ", href: "/docs/faq", icon: HelpCircle, desc: "Common questions" },
]

export function DocsNavigation() {
    return (
        <div className="mt-24 pt-12 border-t border-border/40">
            <h3 className="text-2xl font-semibold mb-8">Explore Documentation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {docsLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                        <Link
                            key={index}
                            href={link.href}
                            className="group block p-6 rounded-2xl bg-background/40 border border-border/40 hover:bg-background/60 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform duration-300">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{link.title}</h4>
                                    <p className="text-sm text-muted-foreground">{link.desc}</p>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
