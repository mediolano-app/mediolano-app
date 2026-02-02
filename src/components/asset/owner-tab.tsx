import { ExternalLink } from "lucide-react"
import { shortenAddress } from "@/lib/utils"
import Link from "next/link"

interface OwnerTabProps {
  asset: {
    owner: {
      name: string
      address: string
      avatar: string
      acquired: string
    }
    author: {
      name: string
      address: string
      avatar: string
      bio: string
    }
    createdAt: string
  }
}

// Safely coerce any value to string for display
const toText = (value: unknown): string => (value === undefined || value === null ? "" : String(value))

export function OwnerTab({ asset }: OwnerTabProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Owner Row */}
      <div className="flex items-center justify-between group">
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Owner</span>
          <Link
            href={`/creator/${asset?.owner?.address || asset?.owner?.name}`}
            className="font-semibold text-sm truncate hover:text-primary transition-colors flex items-center gap-1.5"
          >
            {toText(asset?.owner?.name).startsWith("0x") ? shortenAddress(toText(asset?.owner?.name)) : toText(asset?.owner?.name)}
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>

      <div className="h-px bg-border/50 w-full" />

      {/* Creator Row */}
      <div className="flex items-center justify-between group">
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Creator</span>
          <Link
            href={`/creator/${asset.author.address || asset.author.name}`}
            className="font-semibold text-sm truncate hover:text-primary transition-colors flex items-center gap-1.5"
          >
            {toText(asset.author.name).startsWith("0x") ? shortenAddress(toText(asset.author.name)) : toText(asset.author.name)}
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  )
} 