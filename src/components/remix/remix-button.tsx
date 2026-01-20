"use client"

import { Button } from "@/components/ui/button"
import { GitBranch } from "lucide-react"
import Link from "next/link"
import type { Asset } from "@/types/asset"

interface RemixButtonProps {
  asset: Asset
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  className?: string
}

export function RemixButton({ asset, variant = "default", size = "default", className }: RemixButtonProps) {
  // Check if the asset allows remixing based on its license
  const allowsRemixing = () => {
    const license = asset.licenseType.toLowerCase()
    // Most Creative Commons licenses allow derivatives
    // MIT and similar open source licenses allow derivatives
    // Custom licenses would need to be checked individually
    return (
      license.includes("creative commons") ||
      license.includes("cc-by") ||
      license.includes("mit") ||
      license.includes("apache") ||
      license.includes("open source") ||
      license.includes("commercial") ||
      license.includes("personal")
    )
  }

  if (!allowsRemixing()) {
    return (
      <Button variant="outline" size={size} disabled className={className}>
        <GitBranch className="h-4 w-4 mr-2" />
        Remix Not Allowed
      </Button>
    )
  }

  return (
    <Button variant={variant} size={size} className={className} asChild>
      <Link href={`/create/remix?asset=${asset.id}`}>
        <GitBranch className="h-4 w-4 mr-2" />
        Create Remix
      </Link>
    </Button>
  )
}
