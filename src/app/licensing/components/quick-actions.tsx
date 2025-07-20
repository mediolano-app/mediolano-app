import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileStack, FilePlus, Wallet, Plus, FileAudio2, FileImage, FileText, Hexagon, FileVideo } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function QuickActions() {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <Tabs defaultValue="actions">
          <TabsList className="mb-4">
            <TabsTrigger value="actions">Quick Actions</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="actions" className="mt-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Link href="/portfolio" className="w-full">
                <Button variant="outline" className="h-full w-full justify-start gap-3 px-4 py-6">
                  <FileStack className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Browse Assets</span>
                    <span className="text-xs text-muted-foreground">View your IP assets</span>
                  </div>
                </Button>
              </Link>

              <Link href="/licensing/create-license" className="w-full">
                <Button variant="outline" className="h-full w-full justify-start gap-3 px-4 py-6">
                  <FilePlus className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">License Your IP</span>
                    <span className="text-xs text-muted-foreground">License an existing asset</span>
                  </div>
                </Button>
              </Link>

              <Link href="/licensing/transfer" className="w-full">
                <Button variant="outline" className="h-full w-full justify-start gap-3 px-4 py-6">
                  <Wallet className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Transfer License</span>
                    <span className="text-xs text-muted-foreground">Transfer to another address</span>
                  </div>
                </Button>
              </Link>

              <Link href="/create" className="w-full">
                <Button variant="outline" className="h-full w-full justify-start gap-3 px-4 py-6">
                  <Plus className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Create</span>
                    <span className="text-xs text-muted-foreground">Register Programmable IP</span>
                  </div>
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="create" className="mt-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
              <Link href="/licensing/assets/create?type=Audio" className="w-full">
                <Button variant="outline" className="h-full w-full flex-col gap-3 px-4 py-6">
                  <FileAudio2 className="h-8 w-8" />
                  <span className="font-medium">Audio</span>
                </Button>
              </Link>

              <Link href="/licensing/assets/create?type=Art" className="w-full">
                <Button variant="outline" className="h-full w-full flex-col gap-3 px-4 py-6">
                  <FileImage className="h-8 w-8" />
                  <span className="font-medium">Art</span>
                </Button>
              </Link>

              <Link href="/licensing/assets/create?type=Documents" className="w-full">
                <Button variant="outline" className="h-full w-full flex-col gap-3 px-4 py-6">
                  <FileText className="h-8 w-8" />
                  <span className="font-medium">Document</span>
                </Button>
              </Link>

              <Link href="/licensing/assets/create?type=NFT" className="w-full">
                <Button variant="outline" className="h-full w-full flex-col gap-3 px-4 py-6">
                  <Hexagon className="h-8 w-8" />
                  <span className="font-medium">NFT</span>
                </Button>
              </Link>

              <Link href="/licensing/assets/create?type=Video" className="w-full">
                <Button variant="outline" className="h-full w-full flex-col gap-3 px-4 py-6">
                  <FileVideo className="h-8 w-8" />
                  <span className="font-medium">Video</span>
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
