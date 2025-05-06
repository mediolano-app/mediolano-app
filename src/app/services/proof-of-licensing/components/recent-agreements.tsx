"use client";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAgreements } from "@/hooks/use-agreements";
import { formatDate } from "@/lib/utils";
import { FileText, Users, Clock } from "lucide-react";
import { Abi, useReadContract } from "@starknet-react/core";
import { ip_licensing_agreement } from "@/abis/ip_licensing_agreement";
import { useEffect, useState } from "react";


function AgreementStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "draft":
      return <Badge variant="outline">Draft</Badge>;
    case "pending":
      return <Badge variant="secondary">Pending Signatures</Badge>;
    case "completed":
      return (
        <Badge variant="default" className="bg-green-500">
          Completed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function AgreementCard({ agreement }) {
  const { data: metadata, isLoading } = useReadContract({
    abi: ip_licensing_agreement as Abi,
    functionName: "get_metadata",
    address: agreement.id,
    args: [],
  });

  const [dateString, setDateString] = useState<string | null>(null);


  useEffect(() => {
    if (metadata && !isLoading) {
      const timestamp = metadata[3];
      const date = new Date(Number(timestamp) * 1000);
      setDateString(date.toISOString());
    }
  }, [metadata, isLoading]);


  if (isLoading || !metadata || !dateString) {
    return (
      <Card className="bg-transparent shadow-none border-none">
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  const title = metadata[0];
  const description = metadata[1];
  const detailsJson = metadata[2];
  const details = JSON.parse(detailsJson || "{}");
  const parties = details.parties || [];
  const type = details.type || "Unknown";
  const status = agreement.status || (metadata[4] ? "completed" : "pending");

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1">{title}</CardTitle>
          <AgreementStatusBadge status={status} />
        </div>
        <CardDescription>Created {formatDate(dateString)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{type}</span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{parties.length} Parties</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {agreement.signatures?.length || 0}/{parties.length} Signatures
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`proof-of-licensing/agreements/${agreement.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}



export function RecentAgreements() {
  const { agreements } = useAgreements({ limit: 4 });

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {agreements.map((agreement) => (
        <AgreementCard key={agreement.id} agreement={agreement} />
      ))}
    </div>
  );
}