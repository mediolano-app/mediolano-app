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
import { AgreementStatusBadge } from "./agreement-badge";


function AgreementCard({ agreement }: { agreement: { id: string } }) {
  // Fetch metadata from the contract
  const { data: metadata, isLoading: isMetadataLoading } = useReadContract({
    abi: ip_licensing_agreement as Abi,
    functionName: "get_metadata",
    address: agreement.id as `0x${string}`,
    args: [],
    watch: true,
  });

  // Fetch whether the agreement is fully signed
  const { data: isFullySigned, isLoading: isFullySignedLoading } = useReadContract({
    abi: ip_licensing_agreement as Abi,
    functionName: "is_fully_signed",
    address: agreement.id as `0x${string}`,
    args: [],
    watch: true,
  });

  // Fetch the signature count
  const { data: signatureCount, isLoading: signatureCountLoading } = useReadContract({
    abi: ip_licensing_agreement as Abi,
    functionName: "get_signature_count",
    address: agreement.id as `0x${string}`,
    args: [],
    watch: true,
  });

  // Fetch the signer count
  const { data: signerCount, isLoading: signerCountLoading } = useReadContract({
    abi: ip_licensing_agreement as Abi,
    functionName: "get_signer_count",
    address: agreement.id as `0x${string}`,
    args: [],
    watch: true,
  });

  const [dateString, setDateString] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("draft");

  // Set date string from metadata timestamp
  useEffect(() => {
    if (metadata && !isMetadataLoading) {
      const timestamp = metadata[3];
      const date = new Date(Number(timestamp) * 1000);
      setDateString(date.toISOString());
    }
  }, [metadata, isMetadataLoading]);

  // Determine status based on contract data
  useEffect(() => {
    if (
      !isFullySignedLoading &&
      !signatureCountLoading &&
      signatureCount !== undefined &&
      isFullySigned !== undefined
    ) {
      if (isFullySigned === true) {
        setStatus("completed");
      } else if (Number(signatureCount) > 0) {
        setStatus("pending");
      } else {
        setStatus("draft");
      }
    }
  }, [isFullySigned, signatureCount, isFullySignedLoading, signatureCountLoading]);
  
  if (
    isMetadataLoading ||
    !metadata ||
    !dateString ||
    signerCountLoading ||
    signatureCountLoading ||
    isFullySignedLoading
  ) {
    return (
      <Card className="bg-transparent shadow-none border-none">
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  const title = metadata[0] as string;
  const detailsJson = metadata[2] as string;
  const details = JSON.parse(detailsJson || "{}");
  const parties = details.parties || [];
  const type = details.type || "Unknown";

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
              {Number(signatureCount)}/{Number(signerCount)} Signatures
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