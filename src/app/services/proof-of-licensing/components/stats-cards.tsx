import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, CheckCircle, Eye } from "lucide-react"
import { useAgreementStats } from "@/hooks/use-agreement-stats"
import { Abi, useAccount, useReadContract } from "@starknet-react/core";
import { ip_licensing_agreement } from "@/abis/ip_licensing_agreement";

export function StatsCards() {
  const { totalAgreements, totalSignatures, completedAgreements, publicViews } = useAgreementStats()

  const {address} = useAccount();
  const AGREEMENT_HASH = process.env.NEXT_PUBLIC_AGREEMENT_CONTRACT_HASH as `0x${string}`;

  // use the user address to check the deployed contract instances of this contract class by the address

  //   const { data: agreementMetadata } = useReadContract({
  //     abi: ip_licensing_agreement as Abi,
  //     functionName: "get_metadata",
  //     address: CONTRACT_ADDRESS,
  //     args: [],
  //   });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Agreements</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAgreements}</div>
          <p className="text-xs text-muted-foreground">Licensing agreements created</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Signatures</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSignatures}</div>
          <p className="text-xs text-muted-foreground">Signatures collected</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Agreements</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedAgreements}</div>
          <p className="text-xs text-muted-foreground">Fully executed agreements</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Public Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{publicViews}</div>
          <p className="text-xs text-muted-foreground">Public directory views</p>
        </CardContent>
      </Card>
    </div>
  )
}

