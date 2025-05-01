import { Button } from "@/components/ui/button"
import { CreateLicenseForm } from "@/app/licensing/components/create-license-form"
import { AssetSelector } from "@/app/licensing/components/asset-selector"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface CreateLicensePageProps {
  searchParams: { assetId?: string }
}

export default function CreateLicensePage({ searchParams }: CreateLicensePageProps) {
  const assetId = searchParams.assetId

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <div className="flex items-center gap-2">
        <Link href={assetId ? `/licensing/assets/${assetId}` : "/licensing/assets"} className="hidden sm:block">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Create License</h1>
      </div>

      <Separator className="my-6" />

      <div className="mx-auto max-w-8xl pb-16 md:pb-0">
        {!assetId ? <AssetSelector /> : <CreateLicenseForm assetId={assetId} />}
      </div>
    </div>
  )
}
