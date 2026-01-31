"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
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
    ArrowRight,
    Scroll,
    ShieldCheck
} from "lucide-react"
import { cn } from "@/lib/utils"

const protocolLinks = [
    { title: "DApp Guide", href: "/docs/dapp-guide", icon: Globe2, desc: "Overview of Mediolano IP Creator" },
    { title: "User Guide", href: "/docs/user-guide", icon: BookOpen, desc: "How-to guides and tutorials" },
    { title: "Developers", href: "/docs/developers", icon: Terminal, desc: "Contracts, SDKs, and tools" },
    { title: "Permissionless Setup", href: "/docs/permissionless-setup", icon: Terminal, desc: "Run and deploy locally" },
    { title: "How does Mediolano protect IP?", href: "/docs/ip-protection", icon: ShieldCheck, desc: "Built for the Integrity Web" },
    { title: "Mediolano Protocol", href: "/docs/protocol", icon: Network, desc: "Technical architecture" },
    { title: "Programmable Licensing", href: "/docs/programmable-licensing", icon: Scroll, desc: "Decentralized IP Rights" },
    { title: "Security", href: "/docs/security", icon: Shield, desc: "Security and Verification" },
    { title: "FAQ", href: "/docs/faq", icon: HelpCircle, desc: "Common questions" },
]

const daoLinks = [
    { title: "Community Guidelines", href: "/docs/community-guidelines", icon: Users, desc: "Guidelines for community members" },
    { title: "Compliance Guidelines", href: "/docs/compliance-guidelines", icon: Scale, desc: "Regulatory compliance info" },
    { title: "Mediolano DAO", href: "/docs/mediolano-dao", icon: Users, desc: "Mission and governance model" },
    { title: "DAO Constitution", href: "/docs/dao-constitution", icon: Landmark, desc: "Foundation Governing Document" },
    { title: "Governance Charter", href: "/docs/governance-charter", icon: Gavel, desc: "DAO governance rules" },
    { title: "Public Goods", href: "/docs/public-goods", icon: Heart, desc: "Mission and open source" },
    { title: "Terms of Use", href: "/docs/terms-of-use", icon: FileText, desc: "Legal terms and conditions" },
    { title: "Privacy Policy", href: "/docs/privacy-policy", icon: FileText, desc: "Privacy policy" },
]

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export function DocsNavigation() {
    const pathname = usePathname()

    return (
        <div className="mt-24 pt-12 border-t border-border/40">
            <h3 className="text-2xl font-bold mb-8 px-1">Explore Documentation</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">

                {/* Protocol & Platform Section */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    <div className="flex items-center space-x-3 mb-6 px-1">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 ring-1 ring-blue-500/20">
                            <Zap className="w-4 h-4" />
                        </div>
                        <h4 className="text-lg font-semibold text-foreground/90">Protocol & Platform</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {protocolLinks.map((link, index) => {
                            const Icon = link.icon
                            const isActive = pathname === link.href
                            return (
                                <motion.div key={index} variants={item}>
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "group relative block h-full p-4 rounded-2xl border transition-all duration-300 overflow-hidden",
                                            isActive
                                                ? "bg-primary/5 border-primary/30 shadow-md shadow-primary/5"
                                                : "bg-background/40 border-border/40 hover:bg-background/80 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                            "bg-gradient-to-br from-primary/5 via-transparent to-transparent"
                                        )} />

                                        <div className="relative flex items-start space-x-4">
                                            <div className={cn(
                                                "p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110",
                                                isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                            )}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className={cn(
                                                        "font-semibold text-sm transition-colors",
                                                        isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                                                    )}>
                                                        {link.title}
                                                    </h4>
                                                    <ArrowRight className={cn(
                                                        "w-3.5 h-3.5 transition-all duration-300 transform",
                                                        isActive
                                                            ? "text-primary translate-x-0 opacity-100"
                                                            : "text-muted-foreground -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                                    )} />
                                                </div>
                                                <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed group-hover:text-muted-foreground transition-colors">
                                                    {link.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>

                {/* DAO & Governance Section */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center space-x-3 mb-6 px-1">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 ring-1 ring-amber-500/20">
                            <Scale className="w-4 h-4" />
                        </div>
                        <h4 className="text-lg font-semibold text-foreground/90">DAO & Governance</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {daoLinks.map((link, index) => {
                            const Icon = link.icon
                            const isActive = pathname === link.href
                            return (
                                <motion.div key={index} variants={item}>
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "group relative block h-full p-4 rounded-2xl border transition-all duration-300 overflow-hidden",
                                            isActive
                                                ? "bg-amber-500/5 border-amber-500/30 shadow-md shadow-amber-500/5"
                                                : "bg-background/40 border-border/40 hover:bg-background/80 hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                            "bg-gradient-to-br from-amber-500/5 via-transparent to-transparent"
                                        )} />

                                        <div className="relative flex items-start space-x-4">
                                            <div className={cn(
                                                "p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110",
                                                isActive
                                                    ? "bg-amber-500/10 text-amber-500"
                                                    : "bg-muted/50 text-muted-foreground group-hover:bg-amber-500/10 group-hover:text-amber-500"
                                            )}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className={cn(
                                                        "font-semibold text-sm transition-colors",
                                                        isActive ? "text-amber-500" : "text-foreground group-hover:text-amber-500"
                                                    )}>
                                                        {link.title}
                                                    </h4>
                                                    <ArrowRight className={cn(
                                                        "w-3.5 h-3.5 transition-all duration-300 transform",
                                                        isActive
                                                            ? "text-amber-500 translate-x-0 opacity-100"
                                                            : "text-muted-foreground -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                                    )} />
                                                </div>
                                                <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed group-hover:text-muted-foreground transition-colors">
                                                    {link.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>

            </div>
        </div>
    )
}
