"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    CheckCircle,
    Zap,
    Copy,
    ExternalLink,
    Activity,
    Fingerprint,
    Lock,
    AlertTriangle,
} from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ProvenanceEvent {
    id: string
    type: "mint" | "transfer" | "license" | "modification" | "verification" | "dispute"
    title: string
    description: string
    from?: string
    to?: string
    date?: string
    timestamp: string
    transactionHash?: string
    blockNumber?: number
    verified: boolean
}

interface SimpleProvenanceProps {
    events: ProvenanceEvent[]
    compact?: boolean
}

export function SimpleProvenance({ events, compact = false }: SimpleProvenanceProps) {
    const [copied, setCopied] = useState<string | null>(null)

    const handleCopy = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(type)
            setTimeout(() => setCopied(null), 2000)
        } catch (error) {
            console.error("Failed to copy:", error)
        }
    }

    const getEventIcon = (type: ProvenanceEvent["type"]) => {
        switch (type) {
            case "mint":
                return <Zap className="h-4 w-4" />
            case "transfer":
                return <ArrowRight className="h-4 w-4" />
            case "license":
                return <Lock className="h-4 w-4" />
            case "modification":
                return <Fingerprint className="h-4 w-4" />
            case "verification":
                return <CheckCircle className="h-4 w-4" />
            case "dispute":
                return <AlertTriangle className="h-4 w-4" />
            default:
                return <Activity className="h-4 w-4" />
        }
    }

    const getEventColorClass = (type: ProvenanceEvent["type"]) => {
        switch (type) {
            case "mint": return "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800"
            case "transfer": return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
            case "license": return "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400 border-purple-200 dark:border-purple-800"
            default: return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700"
        }
    }

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
        } catch (e) {
            return "Recently"
        }
    }

    const truncateAddress = (address: string) => {
        if (!address) return "0x00...0000"
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    }

    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center border rounded-xl border-dashed bg-muted/30">
                <Activity className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground text-sm">No provenance history available yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="relative pl-2">
                {/* Continuous Timeline Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-px bg-border" />

                <div className="space-y-6">
                    {events.map((event, index) => (
                        <div key={`${event.id}-${index}`} className="relative pl-10 group">
                            {/* Timeline Dot */}
                            <div className={`absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-background flex items-center justify-center z-10 shadow-sm ${getEventColorClass(event.type)}`}>
                                {getEventIcon(event.type)}
                            </div>

                            {/* Content Card */}
                            <div className="flex flex-col bg-card/50 border rounded-xl p-4 transition-all hover:bg-card hover:border-primary/20 hover:shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm text-foreground">{event.title}</span>
                                        {event.type === "mint" && (
                                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                Genesis
                                            </Badge>
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground font-mono">{formatDate(event.timestamp)}</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-mono bg-muted/30 p-2 rounded-lg w-full sm:w-fit">
                                    <div className="flex items-center">
                                        <span className="w-16">From:</span>
                                        <span className="text-foreground/80 truncate max-w-[100px] sm:max-w-none">
                                            {event.from && BigInt(event.from) !== 0n ? truncateAddress(event.from) : "Null Address"}
                                        </span>
                                    </div>
                                    <ArrowRight className="h-3 w-3 opacity-50 shrink-0" />
                                    <div className="flex items-center">
                                        <span className="w-8">To:</span>
                                        <span className="text-foreground/80 truncate max-w-[100px] sm:max-w-none">
                                            {event.to ? truncateAddress(event.to) : "Unknown"}
                                        </span>
                                    </div>
                                </div>

                                {event.transactionHash && (
                                    <div className="flex items-center justify-end gap-2 mt-1">
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/40 px-2 py-1 rounded-full">
                                            <span>Tx:</span>
                                            <span className="font-mono max-w-[80px] sm:max-w-[120px] truncate">{event.transactionHash}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-4 w-4 ml-1 hover:text-foreground"
                                                onClick={() => handleCopy(event.transactionHash!, "tx")}
                                            >
                                                <Copy className="h-2.5 w-2.5" />
                                            </Button>
                                            <a
                                                href={`https://sepolia.starkscan.co/tx/${event.transactionHash}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="ml-1 hover:text-primary transition-colors"
                                            >
                                                <ExternalLink className="h-2.5 w-2.5" />
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
