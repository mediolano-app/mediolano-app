"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    CheckCircle,
    Globe,
    Copy,
    Check,
} from "lucide-react"
import { useCreatorData } from "./creator-data-context"
import { ShareButton } from "@/components/share-button"

export function CreatorHeader() {
    const [copiedAddress, setCopiedAddress] = useState(false)

    const {
        creatorInfo,
        headerImage,
        avatarImage,
    } = useCreatorData()

    const handleCopyAddress = async () => {
        try {
            await navigator.clipboard.writeText(creatorInfo.address)
            setCopiedAddress(true)
            setTimeout(() => setCopiedAddress(false), 2000)
        } catch (error) {
            console.error("Failed to copy address:", error)
        }
    }

    return (
        <div className="relative overflow-hidden -mt-[88px] pt-[120px]">
            {/*  Background with gradient overlay */}
            <div className="absolute inset-0">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />

                {/* Dynamic image background (if available) */}
                {headerImage && (
                    <Image
                        src={headerImage}
                        alt="Creator Background"
                        fill
                        className="object-cover opacity-30 blur-2xl scale-125"
                        priority
                        sizes="100vw"
                    />
                )}

                {/*  overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background backdrop-blur-sm" />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 container mx-auto px-4 pb-8 md:pb-12">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                    {/* Avatar with Glassmorphism Border */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-primary/50 to-secondary/50 rounded-full blur-md opacity-75" />
                            <Avatar className="relative h-32 w-32 md:h-40 md:w-40 border-2 border-white/20 shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                                <AvatarImage
                                    src={avatarImage}
                                    alt={creatorInfo.name}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-white text-2xl md:text-3xl font-bold bg-gradient-to-br from-primary to-secondary">
                                    {creatorInfo.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Mobile-only basic info */}
                        <div className="mt-4 lg:hidden">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{creatorInfo.name}</h1>
                                {creatorInfo.verified && <CheckCircle className="h-6 w-6 text-primary" />}
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                                {creatorInfo.specialties.slice(0, 2).map((specialty: string) => (
                                    <Badge
                                        key={specialty}
                                        className="bg-white/10 text-white border-white/20 backdrop-blur-xl hover:bg-white/20 transition-colors"
                                    >
                                        {specialty}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Info - Desktop */}
                    <div className="hidden lg:block flex-1 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <h1 className="text-4xl xl:text-5xl font-bold drop-shadow-lg">{creatorInfo.name}</h1>
                            {creatorInfo.verified && <CheckCircle className="h-8 w-8 text-primary" />}
                        </div>

                        <p className="text-xl text-white/90 mb-6 max-w-2xl leading-relaxed drop-shadow-sm">{creatorInfo.bio}</p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {creatorInfo.specialties.map((specialty: string) => (
                                <Badge
                                    key={specialty}
                                    className="bg-white/10 text-white border-white/20 backdrop-blur-xl text-sm px-3 py-1 hover:bg-white/20 transition-colors"
                                >
                                    {specialty}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons (Formerly Stats Cards) - Desktop */}
                    <div className="hidden lg:flex flex-col gap-3 w-full xl:w-auto xl:min-w-[240px] mt-6 lg:mt-0 lg:self-center">

                        <ShareButton />
                        {/*
                        <Button
                            variant="outline"
                            className="w-full border-white/20 text-white hover:bg-white/10 backdrop-blur-xl bg-white/5 transition-all hover:border-white/40 justify-start h-12 px-4"
                            onClick={handleCopyAddress}
                        >
                            {copiedAddress ? (
                                <>
                                    <Check className="h-5 w-5 mr-3" />
                                    <span className="text-lg">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-5 w-5 mr-3" />
                                    <span className="text-lg">Copy address</span>
                                </>
                            )}
                        </Button>
                        */}

                    </div>
                </div>
            </div>

            {/* Mobile Bio Section with Glassmorphism */}
            <div className="lg:hidden px-4 pb-6 pt-2 text-center relative z-10">
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                    <p className="text-white/90 mb-4 text-sm">{creatorInfo.bio}</p>
                    <div className="flex gap-2 justify-center">
                        <div className="w-full max-w-xs flex gap-2">
                            <Button
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 backdrop-blur-xl bg-white/5 flex-1 transition-all"
                                onClick={handleCopyAddress}
                            >
                                {copiedAddress ? (
                                    <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy Address
                                    </>
                                )}
                            </Button>
                            <div className="bg-white/5 rounded-md border border-white/20 backdrop-blur-xl hover:bg-white/10 transition-all flex items-center justify-center w-10">
                                <ShareButton />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
