"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCollections } from "@/hooks/use-collection";

interface CreatorHeaderProps {
    address: string;
}

export function CreatorHeader({ address }: CreatorHeaderProps) {
    // 1. Fetch collections directly
    const { collections, loading } = useGetCollections(address as `0x${string}`);

    // 2. Strict Image Logic: Find first valid image that IS NOT a placeholder
    const { headerImage, avatarImage } = useMemo(() => {
        let foundImage: string | null = null;

        // Search for valid image in collections
        const validCollection = collections.find(c =>
            c.image &&
            typeof c.image === 'string' &&
            c.image !== "" &&
            !c.image.includes("placeholder")
        );

        if (validCollection) {
            foundImage = validCollection.image;
        }

        return {
            headerImage: foundImage,
            avatarImage: foundImage // Use same image for avatar for now if valid
        };
    }, [collections]);

    // 3. Handlers
    const displayName = `${address.slice(0, 6)}...${address.slice(-4)}`;

    const handleShare = () => {
        if (typeof navigator !== 'undefined') {
            if (navigator.share) {
                navigator.share({
                    title: `Creator ${displayName}`,
                    url: window.location.href,
                }).catch(() => { });
            } else {
                navigator.clipboard.writeText(window.location.href);
            }
        }
    };

    if (loading) {
        return <HeaderSkeleton />;
    }

    return (
        <div className="relative overflow-hidden -mt-[88px] pt-[150px] pb-24 min-h-[400px] flex flex-col justify-center bg-background">

            {/* --- Background Layer --- */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                {/* 1. Base Gradient (Always present) */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background" />

                {/* 2. Dynamic Image OR Premium Gradient Fallback */}
                {headerImage ? (
                    <Image
                        src={headerImage}
                        alt="Background"
                        fill
                        className="object-cover opacity-40 blur-[80px] scale-110 saturate-150"
                        priority
                        sizes="100vw"
                    />
                ) : (
                    // Premium Fallback Gradient (Aurora / Mesh style)
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/40 via-secondary/20 to-transparent blur-3xl" />
                )}

                {/* 3. Overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>

            {/* --- Content Layer --- */}
            <div className="relative z-10 container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col items-center justify-center gap-8 text-center pt-8">

                    {/* Avatar */}
                    <div className="relative group">
                        {/* Glow effect behind avatar */}
                        <div className={`absolute -inset-4 rounded-full blur-2xl opacity-40 transition-opacity duration-1000 ${avatarImage ? "bg-primary/50" : "bg-gradient-to-r from-primary to-secondary"
                            }`} />

                        <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-[3px] border-background/50 shadow-2xl backdrop-blur-sm bg-background/50">
                            {avatarImage ? (
                                <Image
                                    src={avatarImage}
                                    alt={displayName}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                            ) : (
                                // Elegant Gradient Avatar Fallback
                                <div className="w-full h-full bg-gradient-to-tr from-primary/10 via-primary/5 to-secondary/10 flex items-center justify-center">
                                    <div className="w-full h-full absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-50" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col items-center gap-5 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground drop-shadow-sm font-sans">
                            {displayName}
                        </h1>

                        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-secondary/30 border border-white/5 text-muted-foreground font-mono text-sm backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-green-500/80 mr-1 animate-pulse" />
                            {displayName}
                        </div>

                        <div className="mt-2">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleShare}
                                className="h-11 px-8 border-primary/20 hover:bg-primary/5 hover:border-primary/50 hover:text-primary transition-all duration-300 rounded-full bg-background/20 backdrop-blur-sm"
                            >
                                <Share2 className="mr-2 h-4 w-4" />
                                Share Profile
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function HeaderSkeleton() {
    return (
        <div className="relative overflow-hidden -mt-[88px] pt-[150px] pb-24 min-h-[400px] flex flex-col justify-center bg-background">
            <div className="relative z-10 container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col items-center justify-center gap-8">
                    <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background" />
                    <div className="flex flex-col items-center gap-4 w-full max-w-md">
                        <Skeleton className="h-10 w-64 rounded-xl" />
                        <Skeleton className="h-8 w-40 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
