"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgreementDetails } from "@/app/services/proof-of-licensing/components/agreement-details"
import { AgreementParties } from "@/app/services/proof-of-licensing/components/agreement-parties"
import { AgreementTerms } from "@/app/services/proof-of-licensing/components/agreement-terms"
import { AgreementProof } from "@/app/services/proof-of-licensing/components/agreement-proof"
import { useAgreement } from "@/hooks/use-agreement"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Share2 } from "lucide-react"
import { Abi, useAccount, useContract, useProvider, useReadContract, useSendTransaction } from "@starknet-react/core"
import { ip_licensing_agreement } from "@/abis/ip_licensing_agreement"
import { useEffect, useState } from "react"
import { formatDate } from "@/lib/utils"
import { decToHexAddress, hexToDecAddress } from "@/utils/utils"
import { Party, Signature } from "@/types/agreement"


export default function AgreementPage() {
  const { address } = useAccount();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { agreement, isLoading: isLoadingAgreement, } = useAgreement(params.id);

  const { provider } = useProvider();

  const [dateString, setDateString] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<string>("Unknown");
  const [status, setStatus] = useState<string>("");
  const [parties, setParties] = useState<Party[]>([]);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  
  const { contract } = useContract({
    abi: ip_licensing_agreement as Abi,
    address: params.id as `0x${string}`,
  });


  const { sendAsync: signAgreement, error: signAgreementError } = useSendTransaction({
    calls:
      contract && address
        ? [contract.populate("sign_agreement", [])]
        : undefined,
  });

  const { sendAsync: finalizeAgreement, error: finalizeAgreementError } = useSendTransaction({
    calls:
      contract && address
        ? [contract.populate("make_immutable", [])]
        : undefined,
  });
  
   const { data: metadata, isLoading: isLoadingMetadata } = useReadContract({
     abi: ip_licensing_agreement as Abi,
     functionName: "get_metadata",
     address: params.id as `0x${string}`,
     watch: true,
     args: [],
   });

    // Fetch list of signers
    const { data: signers, isLoading: signersLoading } = useReadContract({
      abi: ip_licensing_agreement as Abi,
      functionName: "get_signers",
      address: params.id as `0x${string}`,
      args: [],
      watch: true,
    });
    
    // Fetch signature count
    const { data: signatureCount, isLoading: signatureCountLoading } = useReadContract({
      abi: ip_licensing_agreement as Abi,
      functionName: "get_signature_count",
      address: params.id as `0x${string}`,
      args: [],
      watch: true,
    });
    
    // Fetch agreement owner
    const { data: owner, isLoading: ownerLoading } = useReadContract({
      abi: ip_licensing_agreement as Abi,
      functionName: "get_owner",
      address: params.id as `0x${string}`,
      watch: true,
      args: [],
    });
    
    const { data: isFullySigned, isLoading: isFullySignedLoading } = useReadContract({
      abi: ip_licensing_agreement as Abi,
      functionName: "is_fully_signed",
      address: params.id as `0x${string}`,
      args: [],
      watch: true,
    });
    
    const { data: currentUserHasSigned, isLoading: hasSignedLoading } = useReadContract({
      abi: ip_licensing_agreement as Abi,
      functionName: "has_signed",
      address: params.id as `0x${string}`,
      args: [address ? hexToDecAddress(address) : "0"],
      watch: true,
    });
  
 
    
  // Fetch signature statuses and timestamps for all signers
  useEffect(() => {
    if (provider && signers && !signersLoading && !signatureCountLoading && signers.length > 0) {
      console.log(signers)
      const fetchSignatures = async () => {
        const signaturePromises = signers.map(async (signer: string) => {
          try {
            const hasSignedResult = await provider.callContract({
              contractAddress: params.id,
              entrypoint: "has_signed",
              calldata: [signer],
            });
            console.log(hasSignedResult)
            if (hasSignedResult[0] === "0x1") {
              const timestampResult = await provider.callContract({
                contractAddress: params.id,
                entrypoint: "get_signature_timestamp",
                calldata: [signer],
              });
              console.log(timestampResult)
              return {
                walletAddress: signer,
                timestamp: Number(timestampResult[0]),
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching signature for ${signer}:`, error);
            return null;
          }
        });
        const signatureData = await Promise.all(signaturePromises);
        console.log(signatureData)
        setSignatures(signatureData.filter((sig: Signature): sig is Signature => sig !== null));
      };
      fetchSignatures();
    }
  }, [provider, signers, params.id, signersLoading, signatureCountLoading]);

  // Handle metadata
  useEffect(() => {
    if (metadata && !isLoadingMetadata && signers && !signersLoading) {
      const title = metadata["0"] || "";
      const description = metadata["1"] || "";
      const detailsJson = metadata["2"] || "";
      const timestamp = metadata["3"] || "0";
      console.log(metadata)

      setTitle(title);
      setDescription(description);
      
      let details: { type: string; parties: Party[] } = { type: "Unknown", parties: [] };
      try {
        details = JSON.parse(detailsJson || "{}");
      } catch (error) {
        console.error("Error parsing detailsJson:", error);
      }
      
      setType(details.type || "Unknown");
      const metadataParties = details.parties || [];
      
      const enrichedParties = metadataParties.map((party, index) => ({
        ...party,
        walletAddress: signers[index] ? decToHexAddress(signers[index]) : "", 
      }));
      setParties(enrichedParties);
      console.log("Enriched parties:", enrichedParties);

      const date = new Date(Number(timestamp) * 1000);
      setDateString(date.toISOString());
    }
  }, [metadata, isLoadingMetadata, signers, signersLoading]);
  
  useEffect(() => {
    console.log("Parties:", parties);
  }, [parties]);

   // Update status based on isFullySigned
   useEffect(() => {
    if (!isFullySignedLoading && isFullySigned !== undefined) {
      setStatus(isFullySigned === "0x1" ? "completed" : "pending");
    }
  }, [isFullySigned, isFullySignedLoading]);

  const canSign =
  address &&
  !hasSignedLoading &&
  !currentUserHasSigned &&
  signers?.some((signer) => address.toLowerCase() === decToHexAddress(signer).toLowerCase());
  console.log("cansign",canSign)
  console.log("curren", currentUserHasSigned)
  
  const canFinalize =
  status === "pending" &&
  signers &&
  signatures.length === signers.length &&
  owner &&
  address?.toLowerCase() === decToHexAddress(owner).toLowerCase();
  console.log("canfinalize",canFinalize)

  const handleSign = async () => {
    try {
      await signAgreement();
      toast({
        title: "Agreement Signed",
        description: "You have successfully signed this agreement.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: signAgreementError?.message || "Failed to sign agreement.",
        variant: "destructive",
      });
    }
  };

  const handleFinalize = async () => {
    try {
      await finalizeAgreement();
      toast({
        title: "Agreement Finalized",
        description: "The agreement has been finalized and proof of licensing has been generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: finalizeAgreementError?.message || "Failed to finalize agreement.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Agreement link copied to clipboard.",
    });
  };

  if (isLoadingMetadata || isLoadingAgreement || isFullySignedLoading || hasSignedLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!metadata || !agreement) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Agreement Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The agreement you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Agreements
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{title}</h1>
              <AgreementStatusBadge status={status} />
            </div>
            <p className="text-muted-foreground mt-1">
              {type} • Created on {dateString ? formatDate(dateString) : "Loading..."}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          {canSign && <Button onClick={handleSign}>Sign Agreement</Button>}
          {canFinalize && <Button onClick={handleFinalize}>Finalize Agreement</Button>}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="parties">Parties</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
          {status === "completed" && <TabsTrigger value="proof">Proof of Licensing</TabsTrigger>}
        </TabsList>

        <TabsContent value="details">
          <AgreementDetails agreement={agreement} description={description} createdAt={dateString} signatures={signatures} status={status} parties={parties} />
        </TabsContent>

        <TabsContent value="parties">
          <AgreementParties agreement={agreement} />
        </TabsContent>

        <TabsContent value="terms">
          <AgreementTerms agreement={agreement} />
        </TabsContent>

        {status === "completed" && (
          <TabsContent value="proof">
            <AgreementProof agreement={agreement} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

function AgreementStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "draft":
      return <Badge variant="outline">Draft</Badge>
    case "pending":
      return <Badge variant="secondary">Pending Signatures</Badge>
    case "completed":
      return (
        <Badge variant="default" className="bg-green-500">
          Completed
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
