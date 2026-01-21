"use client"

import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import Link from "next/link"

interface ProofOfOwnershipButtonProps {
  assetId: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  className?: string
}

export function ProofOfOwnershipButton({
  assetId,
  variant = "outline",
  size = "default",
  className = "",
}: ProofOfOwnershipButtonProps) {
  return (
    <Link href={`/proof-of-ownership/${assetId}`}>
      <Button variant={variant} size={size} className={className}>
        <Shield className="mr-2 h-4 w-4" />
        Proof of Ownership
      </Button>
    </Link>
  )
}
