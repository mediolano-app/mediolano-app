"use client"

import { useState } from "react"
import { Bot, Copy, Check, Terminal, Database, Code, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ContractInfo {
    name: string
    address: string
    network: string
}

interface CodeSnippet {
    language: string
    code: string
    description: string
}

interface AiAgentOverviewProps {
    title: string
    summary: string
    roles?: string[]
    schema?: Record<string, any>
    contracts?: ContractInfo[]
    codeSnippet?: CodeSnippet
    className?: string
}

export function AiAgentOverview({
    title,
    summary,
    roles,
    schema,
    contracts,
    codeSnippet,
    className
}: AiAgentOverviewProps) {
    const [copied, setCopied] = useState(false)
    const [expanded, setExpanded] = useState(false)

    const generateSystemContext = () => {
        const parts = [
            `# Context: ${title}`,
            `Summary: ${summary}`,
        ]

        if (roles && roles.length > 0) {
            parts.push(`Roles: ${roles.join(", ")}`)
        }

        if (contracts && contracts.length > 0) {
            parts.push("Contracts:")
            contracts.forEach(c => parts.push(`- ${c.name} (${c.network}): ${c.address}`))
        }

        if (schema) {
            parts.push("Data Schema:")
            parts.push(JSON.stringify(schema, null, 2))
        }

        if (codeSnippet) {
            parts.push("Usage Example:")
            parts.push(codeSnippet.code)
        }

        return parts.join("\n\n")
    }

    const copyContext = () => {
        navigator.clipboard.writeText(generateSystemContext())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={cn("mt-12 mb-8", className)}>
            <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-background/50 backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-purple-500/50 to-primary/50" />

                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Bot className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold tracking-tight">AI Agent Context</h3>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-8"
                            onClick={copyContext}
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span className="text-xs">Copy for LLM</span>
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-muted-foreground leading-relaxed">
                                {summary}
                            </p>
                        </div>

                        {roles && (
                            <div className="flex flex-wrap gap-2">
                                {roles.map(role => (
                                    <Badge key={role} variant="secondary" className="font-mono text-xs">
                                        {role}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <div className="pt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpanded(!expanded)}
                                className="w-full text-xs text-muted-foreground hover:text-primary"
                            >
                                {expanded ? "Hide Technical Details" : "Show Technical Details (Schema & Contracts)"}
                            </Button>
                        </div>

                        <motion.div
                            initial={false}
                            animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-4 pt-4 border-t border-border/50">
                                {contracts && contracts.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
                                            <Shield className="w-3.5 h-3.5" />
                                            <span>Smart Contracts</span>
                                        </div>
                                        <div className="grid gap-2">
                                            {contracts.map((c, i) => (
                                                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded bg-muted/30 border border-border/30 text-xs font-mono">
                                                    <span className="text-muted-foreground">{c.name}</span>
                                                    <span className="text-primary">{c.address}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {schema && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
                                            <Database className="w-3.5 h-3.5" />
                                            <span>JSON Schema</span>
                                        </div>
                                        <div className="relative rounded-lg bg-black/80 p-3 font-mono text-xs overflow-x-auto">
                                            <pre className="text-green-400">
                                                {JSON.stringify(schema, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                {codeSnippet && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
                                            <Code className="w-3.5 h-3.5" />
                                            <span>{codeSnippet.description}</span>
                                        </div>
                                        <div className="relative rounded-lg bg-black/80 p-3 font-mono text-xs overflow-x-auto">
                                            <pre className="text-blue-300">
                                                {codeSnippet.code}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
