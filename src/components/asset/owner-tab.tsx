import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, PlusCircle, Globe } from "lucide-react"
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
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle>Owner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold truncate text-lg">
                {toText(asset?.owner?.name).startsWith("0x") ? shortenAddress(toText(asset?.owner?.name)) : toText(asset?.owner?.name)}
              </h3>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="h-8" asChild>
                  <a href={`/creator/${asset?.owner?.address || asset?.owner?.name}`} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Profile
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Creator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold truncate text-lg">{toText(asset.author.name).startsWith("0x") ? shortenAddress(toText(asset.author.name)) : toText(asset.author.name)}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{asset.author.bio}</p>

              <div className="mt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8" asChild>
                    <Link href={`/creator/${asset.author.address || asset.author.name}`}>
                      <Globe className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  )
} 