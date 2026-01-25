"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyImageProps extends ImageProps {
    fallbackSrc?: string;
}

export function LazyImage({
    src,
    alt,
    className,
    fallbackSrc = "/placeholder.svg",
    ...props
}: LazyImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [imgSrc, setImgSrc] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(false);

        if (!src) {
            setError(true);
            setIsLoading(false);
            return;
        }

        if (typeof src === 'string') {
            setImgSrc(src);
        } else {
            setImgSrc(src as any);
        }
    }, [src]);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setIsLoading(false);
        if (props.onLoad) {
            props.onLoad(e);
        }
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setIsLoading(false);
        setError(true);
        if (props.onError) {
            props.onError(e);
        }
    };

    // If fill is true, the wrapper needs to take full width/height of parent
    // to match next/image's behavior when filling a parent.
    const isFill = props.fill;

    return (
        <div className={cn(
            "relative overflow-hidden bg-muted/20",
            isFill && "w-full h-full", // Force wrapper to fill parent if image is filling
            !isFill && "inline-block" // Wraps tight around content if not filling
        )}>
            {isLoading && (
                <Skeleton className="absolute inset-0 h-full w-full z-10" />
            )}

            <Image
                src={error ? fallbackSrc : (imgSrc || fallbackSrc)}
                alt={alt}
                className={cn(
                    "transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100",
                    className // Apply className to usage (restoring object-cover, etc)
                )}
                onLoad={handleLoad}
                onError={handleError}
                {...props}
            />
        </div>
    );
}
