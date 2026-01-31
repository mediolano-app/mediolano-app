"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
    BookOpen,
    Code2,
    FileText,
    Gavel,
    Globe,
    Heart,
    HelpCircle,
    Layers,
    Lock,
    Network,
    Scale,
    Search,
    Shield,
    Terminal,
    Users,
    Zap,
    ArrowRight,
    Landmark,
    Globe2,
    Scroll,
    ShieldCheck
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AiAgentOverview } from "@/components/docs/ai-agent-overview"

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function DocsLandingClient() {
    return (
        <div className="min-h-screen relative selection:bg-primary/30 selection:text-foreground overflow-hidden">
            {/* Ambient Background with Motion */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 2
                    }}
                    className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]"
                />
                <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-background via-background/0 to-transparent" />
            </div>

            <div className="container mx-auto px-4 py-16 md:py-24">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-20 relative z-10"
                >
                    <Badge variant="outline" className="mb-6 px-4 py-1 border-primary/20 bg-primary/5 text-primary">
                        Documentation v0.3
                    </Badge>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/50">
                        Mediolano Documentation
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                        Explore the protocol, build with our tools, or participate in Mediolano DAO.
                    </p>


                </motion.div>

                {/* SECTION 1: PROTOCOL & PLATFORM */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="mb-24"
                >
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                        <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            <Zap className="w-4 h-4" />
                            <span className="text-sm font-semibold tracking-wide uppercase">Protocol & Platform</span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
                        {/* Platform Guide (Large) */}
                        <motion.div variants={item} className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/30 backdrop-blur-md hover:bg-background/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5">
                            <Link href="/docs/dapp-guide" className="absolute inset-0 z-20" />
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-6">
                                <Globe2 className="w-64 h-64" />
                            </div>
                            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                                <div>
                                    <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl mb-6 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                                        <Globe className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4">Platform Guide</h2>
                                    <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
                                        Your gateway to the DApp. Learn how to create, license, and monetize IP assets with zero fees.
                                    </p>
                                </div>
                                <div className="flex items-center text-blue-500 font-medium mt-8 group-hover:translate-x-2 transition-transform">
                                    Explroe the DApp <ArrowRight className="ml-2 w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Developer Hub (Tall) */}
                        <motion.div variants={item} className="md:row-span-2 group relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/30 backdrop-blur-md hover:bg-background/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/5">
                            <Link href="/docs/developers" className="absolute inset-0 z-20" />
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute -bottom-12 -right-12 opacity-10 group-hover:opacity-20 transition-all duration-700">
                                <Terminal className="w-48 h-48" />
                            </div>
                            <div className="relative z-10 p-8 h-full flex flex-col">
                                <div className="inline-flex p-3 bg-purple-500/10 rounded-2xl mb-6 text-purple-500 w-fit group-hover:scale-110 transition-transform duration-300">
                                    <Code2 className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold mb-4">Developers</h2>
                                <p className="text-muted-foreground mb-6">
                                    Build on the Integrity Web.
                                </p>
                                <div className="mt-auto space-y-3">
                                    <div className="flex items-center text-sm text-foreground/80 bg-background/40 p-2 rounded-lg border border-border/40">
                                        <Terminal className="w-4 h-4 mr-2 text-purple-500" />
                                        <span>SDK Reference</span>
                                    </div>
                                    <div className="flex items-center text-sm text-foreground/80 bg-background/40 p-2 rounded-lg border border-border/40">
                                        <FileText className="w-4 h-4 mr-2 text-purple-500" />
                                        <span>Protocol</span>
                                    </div>
                                    <div className="flex items-center text-sm text-foreground/80 bg-background/40 p-2 rounded-lg border border-border/40">
                                        <Network className="w-4 h-4 mr-2 text-purple-500" />
                                        <span>API Services</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Permissionless Setup */}
                        <motion.div variants={item} className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/30 backdrop-blur-md hover:bg-background/50 transition-all duration-500">
                            <Link href="/docs/permissionless-setup" className="absolute inset-0 z-20" />
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500">
                                        <Terminal className="w-6 h-6" />
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Permissionless Setup</h3>
                                <p className="text-sm text-muted-foreground">Run & Deploy Locally.</p>
                            </div>
                        </motion.div>

                        {/* User Guide */}
                        <motion.div variants={item} className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/30 backdrop-blur-md hover:bg-background/50 transition-all duration-500">
                            <Link href="/docs/user-guide" className="absolute inset-0 z-20" />
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-teal-500/10 rounded-xl text-teal-500">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">User Guide</h3>
                                <p className="text-sm text-muted-foreground">Step-by-step tutorials.</p>
                            </div>
                        </motion.div>

                        {/* Protocol */}
                        <motion.div variants={item} className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/30 backdrop-blur-md hover:bg-background/50 transition-all duration-500">
                            <Link href="/docs/protocol" className="absolute inset-0 z-20" />
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
                                        <Layers className="w-6 h-6" />
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Protocol</h3>
                                <p className="text-sm text-muted-foreground">Architecture & Logic.</p>
                            </div>
                        </motion.div>

                        {/* Programmable Licensing */}
                        <motion.div variants={item} className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/30 backdrop-blur-md hover:bg-background/50 transition-all duration-500">
                            <Link href="/docs/programmable-licensing" className="absolute inset-0 z-20" />
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
                                        <Scroll className="w-6 h-6" />
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Programmable Licensing</h3>
                                <p className="text-sm text-muted-foreground">Decentralized Rights.</p>
                            </div>
                        </motion.div>

                        {/* IP Protection */}
                        <motion.div variants={item} className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/30 backdrop-blur-md hover:bg-background/50 transition-all duration-500">
                            <Link href="/docs/ip-protection" className="absolute inset-0 z-20" />
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">How we protect IP?</h3>
                                <p className="text-sm text-muted-foreground">Built for the Integrity Web.</p>
                            </div>
                        </motion.div>

                        {/* Security */}
                        <motion.div variants={item} className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/30 backdrop-blur-md hover:bg-background/50 transition-all duration-500">
                            <Link href="/docs/security" className="absolute inset-0 z-20" />
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Security</h3>
                                <p className="text-sm text-muted-foreground">Audits & Bounties.</p>
                            </div>
                        </motion.div>

                    </div>
                </motion.section>

                {/* SECTION 2: DAO & GOVERNANCE */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                        <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <Scale className="w-4 h-4" />
                            <span className="text-sm font-semibold tracking-wide uppercase">Guidelines</span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">

                        {/* Mediolano DAO (Full Wide) */}
                        <motion.div variants={item} className="md:col-span-3 group relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/30 backdrop-blur-md hover:bg-background/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/5">
                            <Link href="/docs/mediolano-dao" className="absolute inset-0 z-20" />
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all duration-500">
                                <Users className="w-64 h-64" />
                            </div>
                            <div className="relative z-10 p-10 flex flex-col md:flex-row items-start md:items-center justify-between">
                                <div className="flex items-center space-x-6 mb-4 md:mb-0">
                                    <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 group-hover:scale-110 transition-transform duration-300">
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold mb-2">Mediolano DAO</h3>
                                        <p className="text-muted-foreground text-lg">Our mission, values, and decentralized governance model.</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-amber-500 font-medium group-hover:translate-x-2 transition-transform">
                                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Community Guidelines */}
                        <motion.div variants={item} className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/30 backdrop-blur-md hover:bg-background/50 transition-all duration-500">
                            <Link href="/docs/community-guidelines" className="absolute inset-0 z-20" />
                            <div className="p-8 h-full flex flex-col justify-between">
                                <div className="flex items-start justify-between">
                                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 mb-4">
                                        <Users className="w-8 h-8" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Community Guidelines</h3>
                                    <p className="text-muted-foreground">Guidelines for community members.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Constitution (Large) */}
                        <motion.div variants={item} className="md:col-span-2 group relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/30 backdrop-blur-md hover:bg-background/50 transition-all duration-500">
                            <Link href="/docs/dao-constitution" className="absolute inset-0 z-20" />
                            <div className="p-8 h-full flex flex-col justify-between">
                                <div className="flex items-start justify-between">
                                    <div className="p-3 bg-red-500/10 rounded-xl text-red-500 mb-4">
                                        <Landmark className="w-8 h-8" />
                                    </div>
                                    <Badge variant="secondary" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Foundation Document</Badge>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Constitution</h3>
                                    <p className="text-muted-foreground">The foundational principles and articles governing the organization.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Governance Charter */}
                        <motion.div variants={item} className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/30 backdrop-blur-md hover:bg-background/50 transition-all duration-500">
                            <Link href="/docs/governance-charter" className="absolute inset-0 z-20" />
                            <div className="p-8 h-full flex flex-col">
                                <div className="p-3 bg-green-500/10 rounded-xl text-green-500 w-fit mb-4">
                                    <Gavel className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Governance Charter</h3>
                                <p className="text-sm text-muted-foreground">Voting rules & processes.</p>
                            </div>
                        </motion.div>

                        {/* Reference Cards */}
                        {[
                            { title: "Public Goods", href: "/docs/public-goods", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
                            { title: "Compliance Guidelines", href: "/docs/compliance-guidelines", icon: Scale, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                            { title: "Terms of use", href: "/docs/terms-of-use", icon: FileText, color: "text-indigo-500", bg: "bg-indigo-500/10" },
                            { title: "Privacy Policy", href: "/docs/privacy-policy", icon: Lock, color: "text-red-500", bg: "bg-red-500/10" },
                        ].map((data, i) => {
                            // Separating the motion prop 'variants' from the data object to fix the lint error
                            const Icon = data.icon
                            return (
                                <motion.div key={i} variants={item} className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/30 backdrop-blur-md hover:bg-background/50 transition-all duration-500">
                                    <Link href={data.href} className="absolute inset-0 z-20" />
                                    <div className="p-6 flex items-center space-x-4">
                                        <div className={`p-3 rounded-xl ${data.bg} ${data.color} group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-semibold text-lg">{data.title}</h3>
                                    </div>
                                </motion.div>
                            )
                        })}

                    </div>
                </motion.section>



                <AiAgentOverview
                    title="Mediolano Protocol System Context"
                    summary="Mediolano is a permissionless, Starknet-based protocol for programmable intellectual property. It serves as the foundation for Programmable IP on the Integrity Web, enabling on-chain IP registration, flexible licensing modules, and immutable provenance tracking. Designed for autonomy, it allows AI agents to register self-generated content and manage IP rights programmatically."
                    roles={["IP Creator", "IP Consumer", "Module Developer", "DAO Governance"]}
                    contracts={[
                        { name: "IPCollection Core", address: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS || "0x...", network: "Starknet Mainnet" }
                    ]}
                    codeSnippet={{
                        language: "bash",
                        code: "npx create-mediolano-app@latest",
                        description: "Scaffold a new IP Application"
                    }}
                />
            </div>
        </div>
    )
}
