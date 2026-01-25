"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface AddressLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
    address: string
    showFull?: boolean
    className?: string
}

export function AddressLink({ address, showFull = false, className, children, ...props }: AddressLinkProps) {
    if (!address || address === "0x0" || address === "0") {
        return <span className={cn("text-muted-foreground", className)}>Unknown</span>
    }

    const displayAddress = showFull
        ? address
        : `${address.slice(0, 6)}...${address.slice(-4)}`

    return (
        <Link
            href={`/creator/${address}`}
            className={cn("hover:text-primary hover:underline transition-colors cursor-pointer", className)}
            {...props}
        >
            {children || displayAddress}
        </Link>
    )
}
