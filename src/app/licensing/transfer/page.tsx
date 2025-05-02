import { Button } from "@/components/ui/button"
import { TransferForm } from "@/app/licensing/components/transfer-form"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
export default function TransferPage() {
  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <div className="flex items-center gap-2">
        <Link href="/" className="hidden sm:block">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Transfer License</h1>
      </div>

      <div className="mx-auto mt-8 max-w-8xl pb-16 md:pb-0">
        <TransferForm />
      </div>
    </div>
  )
}
