import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, PlusCircle, Globe } from "lucide-react"

interface OwnerTabProps {
  asset: {
    owner: {
      name: string
      avatar: string
      acquired: string
    }
    author: {
      name: string
      avatar: string
      bio: string
    }
    createdAt: string
  }
}

// Safely coerce any value to string for display
const toText = (value: unknown): string => (value === undefined || value === null ? "" : String(value))

export function OwnerTab({ asset}: OwnerTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ownership</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={asset.owner?.avatar} alt={toText(asset.owner?.name)} />
              <AvatarFallback>{toText(asset?.owner?.name).substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold truncate">{toText(asset?.owner?.name).slice(0,20)}{toText(asset?.owner?.name).length > 20 ? "..." : ""}</h3>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Globe className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Author</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={asset.author.avatar} alt={toText(asset.author.name)} />
              <AvatarFallback>{toText(asset.author.name).substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold truncate">{toText(asset.author.name).slice(0,20)}{toText(asset.author.name).length > 20 ? "..." : ""}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{asset.author.bio}</p>

              <div className="mt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8">
                    <Globe className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ownership History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm">Transferred</p>
                <p className="text-sm text-muted-foreground">{asset.owner.acquired}</p>
                <p className="text-sm">
                  From {toText(asset?.owner?.name).slice(0,20)} to {toText(asset?.owner?.name).slice(0,20)}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <PlusCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm">Created</p>
                <p className="text-sm text-muted-foreground">{asset.createdAt}</p>
                <p className="text-sm">By {toText(asset?.owner?.name).slice(0,20)}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline">View Provenance</Button>
        </CardFooter>
      </Card>
    </div>
  )
} 