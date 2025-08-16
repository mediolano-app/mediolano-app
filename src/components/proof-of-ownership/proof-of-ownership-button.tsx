"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ProofOfOwnershipButtonProps {
  assetId: string
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

export function ProofOfOwnershipButton({
  assetId,
  variant = "outline",
  size = "sm",
  className,
  children,
}: ProofOfOwnershipButtonProps) {
  return (
    <Link href={`/proof-of-ownership/${assetId}`}>
      <Button variant={variant} size={size} className={cn("flex items-center gap-2", className)}>
        <Shield className="h-4 w-4" />
        {children || "Proof of Ownership"}
      </Button>
    </Link>
  )
}
