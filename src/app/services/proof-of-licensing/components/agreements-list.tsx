"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAgreements } from "@/hooks/use-agreements";
import { formatDate } from "@/lib/utils";
import { FileText, Users, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Abi, useReadContract } from "@starknet-react/core";
import { ip_licensing_agreement } from "@/abis/ip_licensing_agreement";
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

  // Handle loading or missing data
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
        <Link href={`agreements/${agreement.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export function AgreementsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { agreements, isLoading: isAgreementsLoading } = useAgreements();

  const filteredAgreements = agreements.filter((agreement) => {
    const matchesSearch = agreement.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || agreement.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search agreements..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {isAgreementsLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredAgreements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No agreements found</p>
          <Link href="/agreements/create">
            <Button>Create New Agreement</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgreements.map((agreement) => (
            <AgreementCard key={agreement.id} agreement={agreement} />
          ))}
        </div>
      )}
    </div>
  );
}