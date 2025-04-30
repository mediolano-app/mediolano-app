"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import Image from "next/image"
import { CheckCircle, ArrowRight, Home, Share2, Copy, FileCheck, DollarSign, Calendar } from "lucide-react"

interface AssetConfirmationProps {
  formState: any
  template: { id: string; name: string; icon: string; color: string }
}

export function AssetConfirmation({ formState, template }: AssetConfirmationProps) {
  const router = useRouter()
  const assetId = Math.floor(Math.random() * 1000) + 1 // Generate random ID for demo

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">Asset Created</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8 max-w-4xl">
        <Card className="mb-8 border-green-200 dark:border-green-800">
          <CardHeader className="bg-green-50 dark:bg-green-950/30 flex flex-row items-center gap-4 pb-4">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl text-green-700 dark:text-green-300">Asset Successfully Created!</CardTitle>
              <p className="text-sm text-green-600 dark:text-green-400">
                Your {template.name} IP asset has been registered and is now available
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="relative aspect-square overflow-hidden rounded-lg border">
                  <Image
                    src={formState.mediaPreviewUrl || "/placeholder.svg"}
                    alt={formState.title}
                    fill
                    className="object-cover"
                  />
                  {formState.collection && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-primary/80 text-primary-foreground">{formState.collection}</Badge>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{formState.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{template.name}</Badge>
                    <Badge variant="outline">#{assetId}</Badge>
                  </div>
                </div>

                <p className="text-muted-foreground">{formState.description}</p>

                {formState.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formState.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">License</p>
                    <p className="font-medium flex items-center gap-1">
                      <FileCheck className="h-4 w-4 text-muted-foreground" />
                      {formState.licenseTerms}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Royalty</p>
                    <p className="font-medium flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {formState.royaltyPercentage}%
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Created On</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Asset ID</p>
                    <p className="font-medium">#{assetId}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
            <Button className="w-full sm:w-auto" onClick={() => router.push(`/assets/${assetId}`)}>
              View Asset
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </CardFooter>
        </Card>

        <div className="flex flex-col md:flex-row gap-4">
          <Button variant="outline" size="lg" className="flex-1" onClick={() => router.push("/")}>
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
          <Button variant="outline" size="lg" className="flex-1" onClick={() => router.push("/create/templates")}>
            <FileCheck className="mr-2 h-4 w-4" />
            Create Another Asset
          </Button>
        </div>
      </main>
    </div>
  )
}
