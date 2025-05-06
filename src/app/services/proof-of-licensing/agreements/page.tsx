import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AgreementsList } from "@/app/services/proof-of-licensing/components/agreements-list"
import { AgreementFilters } from "@/app/services/proof-of-licensing/components/agreement-filters"

export default function AgreementsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Agreements</h1>
          <p className="text-muted-foreground mt-1">Manage your licensing agreements and track their status</p>
        </div>
        <Link href="agreements/create">
          <Button>Create New Agreement</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-[250px_1fr] gap-8">
        <AgreementFilters />
        <AgreementsList />
      </div>
    </div>
  )
}

