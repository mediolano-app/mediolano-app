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
        assetsLoading,
        collectionsLoading
    } = useCreatorData()

    const isLoading = assetsLoading || collectionsLoading

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
        <div className="relative overflow-hidden -mt-[88px] pt-[120px] pb-12 z-0">
            {/*  Background with gradient overlay */}
            <div className="absolute inset-0 z-0">
                {/* 
                    Prevent Flash: Only show background layers when NOT loading.
                    If loading, show a subtle skeleton/dark bg to prevent "flash" of default gradient.
                */}
                {isLoading ? (
                    <div className="absolute inset-0 bg-background/80 animate-pulse" />
                ) : (
                    <>
                        {/* Base gradient - Only show if NO header image to avoid "double background" muddy look */}
                        {!headerImage && (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
                        )}

                        {/* Dynamic image background (if available) */}
                        {headerImage && (
                            <Image
                                src={headerImage}
                                alt="Creator Background"
                                fill
                                className="object-cover opacity-60 blur-xl scale-110"
                                priority
                                sizes="100vw"
                            />
                        )}

                        {/*  overlay - adjusted for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30 opacity-90" />
                    </>
                )}
            </div>

            {/* Hero Content */}
            <div className="relative z-10 container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                    {/* Avatar with Glassmorphism Border */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                        {/* Mobile: h-32/w-32 -> h-40/w-40 to increase size as requested */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-primary/50 to-secondary/50 rounded-full blur-md opacity-75" />
                            <Avatar className="h-40 w-40 lg:h-48 lg:w-48 border-2 border-white/20 shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                                <AvatarImage
                                    src={avatarImage}
                                    alt={creatorInfo.name}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-white text-3xl lg:text-4xl font-bold bg-gradient-to-br from-primary to-secondary">
                                    {creatorInfo.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Mobile-only basic info */}
                        <div className="mt-4 lg:hidden w-full max-w-sm">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <h1 className="text-2xl font-bold text-white drop-shadow-md">{creatorInfo.name}</h1>
                                {creatorInfo.verified && <CheckCircle className="h-6 w-6 text-primary" />}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap justify-center gap-2 mb-4">
                                {creatorInfo.specialties.slice(0, 2).map((specialty: string) => (
                                    <Badge
                                        key={specialty}
                                        variant="secondary"
                                        className="bg-white/10 text-white border-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
                                    >
                                        {specialty}
                                    </Badge>
                                ))}
                            </div>

                            {/* Mobile Bio - Clean */}
                            {creatorInfo.bio && (
                                <p className="text-white/80 text-sm text-center mb-6 leading-relaxed line-clamp-3">
                                    {creatorInfo.bio}
                                </p>
                            )}

                            {/* Redesigned Mobile Actions */}
                            <div className="flex items-center justify-center gap-3">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="h-10 bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md flex-1 max-w-[160px]"
                                    onClick={handleCopyAddress}
                                >
                                    {copiedAddress ? (
                                        <>
                                            <Check className="h-4 w-4 mr-2" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy Address
                                        </>
                                    )}
                                </Button>

                                <div className="h-10 w-10 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md rounded-md cursor-pointer transition-colors">
                                    <ShareButton />
                                </div>
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
                    </div>
                </div>
            </div>
        </div>
    )
}
