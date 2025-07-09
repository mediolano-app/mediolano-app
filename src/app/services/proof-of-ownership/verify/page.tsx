"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Search, Shield, CheckCircle2, X, ExternalLink, Copy, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Next.js Router for URL manipulation and search params
import { useSearchParams, useRouter } from 'next/navigation'; // For App Router

// Starknet imports
import { Contract, RpcProvider, constants, uint256 } from "starknet"
import { abi as CONTRACT_ABI } from "@/abis/abi";
// The CONTRACT_ADDRESS is now less critical for direct input, but still used as a fallback or for external links
const CONTRACT_ADDRESS_FALLBACK = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP ||
  '0x03c7b6d007691c8c5c2b76c6277197dc17257491f1d82df5609ed1163a2690d0';

const provider = new RpcProvider({
  nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
  chainId: constants.StarknetChainId.SN_SEPOLIA,
});

// The contract instance will be created dynamically if needed, or use a default
const defaultContract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS_FALLBACK, provider);

type FELT = string;

// Define a regex to extract contract address and token ID from a Voyager NFT URL
const voyagerUrlRegex = /https:\/\/sepolia\.voyager\.online\/nft\/(0x[0-9a-fA-F]+)\/(\d+)/;

const verifyUrlFormSchema = z.object({
  voyagerUrl: z.string().regex(voyagerUrlRegex, {
    message: "Please enter a valid Starknet Sepolia Voyager NFT URL (e.g., https://sepolia.voyager.online/nft/0x.../123)",
  }),
})

const hashFormSchema = z.object({
  transactionHash: z.string().min(1, {
    message: "Transaction hash is required",
  }),
})

const certificateFormSchema = z.object({
  certificateId: z.string().min(1, {
    message: "Certificate ID is required",
  }),
})

interface OwnershipData {
  owner: string;
  creationDate: string;
  licensingTerms: string;
  transactionHistory: Array<{ txHash: string; date: string; action: string }>;
  berneConventionCompliant: boolean;
  verificationStatus: 'verified' | 'unverified' | 'pending';
  assetTitle?: string;
  assetType?: string;
  registrationDate?: string;
  transactionHash?: string;
  blockNumber?: string;
  contractAddressUsed: string; // New: to store the contract address from the URL
  tokenIdUsed: string;         // New: to store the token ID from the URL
}

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlContractAddress = searchParams.get('contractAddress');
  const urlTokenId = searchParams.get('tokenId');

  const [verificationResult, setVerificationResult] = useState<"success" | "error" | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [ownershipData, setOwnershipData] = useState<OwnershipData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingUrlParams, setIsLoadingUrlParams] = useState(false);

  const urlForm = useForm<z.infer<typeof verifyUrlFormSchema>>({
    resolver: zodResolver(verifyUrlFormSchema),
    defaultValues: {
      voyagerUrl: "",
    },
  })

  const hashForm = useForm<z.infer<typeof hashFormSchema>>({
    resolver: zodResolver(hashFormSchema),
    defaultValues: {
      transactionHash: "",
    },
  })

  const certificateForm = useForm<z.infer<typeof certificateFormSchema>>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: {
      certificateId: "",
    },
  })

  // Effect to handle URL parameters for direct asset display
  useEffect(() => {
    async function fetchDetailsFromUrl() {
      if (urlContractAddress && urlTokenId) {
        setIsLoadingUrlParams(true);
        setError(null);
        setOwnershipData(null);
        setVerificationResult(null);

        try {
          let tokenIdU256;
          try {
            tokenIdU256 = uint256.bnToUint256(BigInt(urlTokenId));
          } catch (e) {
            setError('Invalid Token ID format in URL. Please ensure it\'s a valid number.');
            setIsLoadingUrlParams(false);
            setVerificationResult("error");
            return;
          }

          // Create contract instance based on the URL's contractAddress
          const dynamicContract = new Contract(CONTRACT_ABI, urlContractAddress as string, provider);
          const owner = await dynamicContract.owner_of(tokenIdU256);

          let metadataUri = '';
          try {
            const uriResult = await dynamicContract.token_uri(tokenIdU256);
            if (uriResult && uriResult.data && Array.isArray(uriResult.data)) {
              metadataUri = uriResult.data.map((felt: FELT) => {
                let hex = BigInt(felt).toString(16).padStart(62, '0');
                let str = '';
                for (let i = 0; i < hex.length; i += 2) {
                  const byte = parseInt(hex.slice(i, i + 2), 16);
                  if (byte === 0) break;
                  str += String.fromCharCode(byte);
                }
                return str;
              }).join('').replace(/\0+$/, '');
            }
          } catch (e) {
            metadataUri = '';
            console.error("Error fetching token URI:", e);
          }

          let creationDate = '';
          let licensingTerms = '';
          let assetTitle = '';
          let assetType = '';
          let registrationDate = '';
          let metadataError = '';
          let rawMetadata = null;
          if (metadataUri && (metadataUri.startsWith('http') || metadataUri.startsWith('ipfs://'))) {
            let fetchUrl = metadataUri;
            if (metadataUri.startsWith('ipfs://')) {
              fetchUrl = metadataUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
            }
            try {
              console.log('Fetching metadata from:', fetchUrl);
              const resp = await fetch(fetchUrl);
              if (resp.ok) {
                const meta = await resp.json();
                rawMetadata = meta;
                creationDate = meta.creation_date || meta.date || 'Missing in metadata';
                licensingTerms = meta.licensing_terms || meta.license || 'Missing in metadata';
                assetTitle = meta.name || meta.title || 'Missing in metadata';
                assetType = meta.type || meta.asset_type || 'Missing in metadata';
                registrationDate = meta.creation_date || meta.date || 'Missing in metadata';
              } else {
                metadataError = `Failed to fetch metadata: HTTP ${resp.status}`;
              }
            } catch (e) {
              metadataError = `Error fetching metadata: ${e}`;
              console.error("Error fetching metadata from URI:", e);
            }
          } else {
            metadataError = 'No valid metadata URI found.';
          }

          setOwnershipData({
            owner: owner.toString(),
            creationDate,
            licensingTerms,
            transactionHistory: [],
            berneConventionCompliant: true,
            verificationStatus: owner ? 'verified' : 'unverified',
            assetTitle,
            assetType,
            registrationDate,
            transactionHash: 'N/A', // Indexer needed for real tx hash
            blockNumber: 'N/A',     // Indexer needed for real block number
            contractAddressUsed: urlContractAddress,
            tokenIdUsed: urlTokenId,
          });
          setVerificationResult(owner ? "success" : "error");

        } catch (e: any) {
          console.error("Error fetching ownership data from URL:", e);
          setError('Failed to fetch ownership data from the provided URL. Ensure it\'s a valid Starknet Sepolia NFT and the contract exists.');
          setVerificationResult("error");
        } finally {
          setIsLoadingUrlParams(false);
        }
      } else {
        // If no params, clear any previous verification results
        setOwnershipData(null);
        setVerificationResult(null);
        setError(null);
        setIsLoadingUrlParams(false);
      }
    }

    fetchDetailsFromUrl();
  }, [urlContractAddress, urlTokenId]); // Re-run when these URL params change

  // Function to handle the form submission for the Voyager URL
  async function onSubmitVoyagerUrl(values: z.infer<typeof verifyUrlFormSchema>) {
    setIsVerifying(true);
    setError(null);
    setOwnershipData(null);
    setVerificationResult(null);

    const match = values.voyagerUrl.match(voyagerUrlRegex);
    if (match && match[1] && match[2]) {
      const contractAddr = match[1];
      const tokenId = match[2];
      // Navigate to the URL with the extracted parameters
      router.push(`?contractAddress=${contractAddr}&tokenId=${tokenId}`);
    } else {
      setError("Invalid Starknet Voyager NFT URL format.");
      setVerificationResult("error");
    }
    setIsVerifying(false); // This stops the button spinner immediately, useEffect handles full loading
  }

  async function onSubmitHash(values: z.infer<typeof hashFormSchema>) {
    setIsVerifying(true);
    setError(null);
    setOwnershipData(null);
    setVerificationResult(null);
    // TODO: Implement real data fetching by transaction hash (requires indexer or backend support)
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult("error");
      setError("Verification by transaction hash is not yet supported. Please use the Voyager NFT URL method.");
    }, 1000);
  }

  async function onSubmitCertificate(values: z.infer<typeof certificateFormSchema>) {
    setIsVerifying(true);
    setError(null);
    setOwnershipData(null);
    setVerificationResult(null);
    // TODO: Implement real data fetching by certificate ID (requires backend support)
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult("error");
      setError("Verification by certificate ID is not yet supported. Please use the Voyager NFT URL method.");
    }, 1000);
  }

  // Determine what to render based on URL parameters or form submission
  const showDetailsFromUrl = urlContractAddress && urlTokenId && (ownershipData || isLoadingUrlParams || error);

  if (showDetailsFromUrl) {
    if (isLoadingUrlParams) {
      return (
        <div className="container py-10 text-center">
          <p className="text-xl">Loading asset details from URL...</p>
          <p className="text-muted-foreground mt-2">Fetching data from Starknet and IPFS.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="container py-10">
          <Alert variant="destructive">
            <X className="h-4 w-4" />
            <AlertTitle>Error Loading Asset</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button className="mt-4" onClick={() => router.push('/')}>Go Back to Verification Form</Button>
          </Alert>
        </div>
      );
    }

    if (ownershipData) {
      return (
        <div className="container py-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Asset Details</h1>
              <p className="text-muted-foreground">
                Detailed information about the intellectual property asset
              </p>
            </div>

            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="bg-green-50 dark:bg-green-950/30 border-b border-green-100 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <CardTitle className="text-green-800 dark:text-green-400">Verification Successful</CardTitle>
                </div>
                <CardDescription className="text-green-700 dark:text-green-500">
                  This intellectual property has a valid proof of ownership record on the blockchain.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-100 dark:border-green-900">
                    <Shield className="h-10 w-10 text-green-600 dark:text-green-400" />
                    <div>
                      <h3 className="font-medium text-green-800 dark:text-green-400">Protected under Berne Convention</h3>
                      <p className="text-sm text-green-700 dark:text-green-500">
                        This intellectual property is protected under The Berne Convention in 181 countries
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Asset Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Asset Title</p>
                        <p className="font-medium">{ownershipData.assetTitle || 'N/A'}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Asset Type</p>
                        <p className="font-medium">{ownershipData.assetType || 'N/A'}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Registration Date</p>
                        <p className="font-medium">{ownershipData.registrationDate || 'N/A'}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Owner</p>
                        {/* Fix for text overflow: Added break-words and text-wrap */}
                        <p className="font-medium break-words text-wrap">{ownershipData.owner}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Blockchain Verification</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-muted-foreground">Contract Address</p>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(ownershipData.contractAddressUsed)}>
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="p-2 bg-muted rounded font-mono text-xs break-all">
                          {ownershipData.contractAddressUsed}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-muted-foreground">Token ID</p>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(ownershipData.tokenIdUsed)}>
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="p-2 bg-muted rounded font-mono text-xs break-all">
                          {ownershipData.tokenIdUsed}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-muted-foreground">Transaction Hash (First Registration)</p>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(ownershipData.transactionHash || 'N/A')}>
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="p-2 bg-muted rounded font-mono text-xs break-all">
                          {ownershipData.transactionHash || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-muted-foreground">Block Number (First Registration)</p>
                          <span className="text-xs text-muted-foreground">Starknet</span>
                        </div>
                        <div className="p-2 bg-muted rounded font-mono text-xs break-all">
                          {ownershipData.blockNumber || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-6">
                <Button className="sm:flex-1" onClick={() => router.push('/')}>Go Back to Verification</Button>
                <Button variant="outline" className="sm:flex-1" asChild>
                  <a
                    href={`https://sepolia.voyager.online/contract/${ownershipData.contractAddressUsed}#readContract`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> View Contract on Voyager
                  </a>
                </Button>
                <Button variant="outline" className="sm:flex-1" asChild>
                  <a
                    href={`https://sepolia.voyager.online/nft/${ownershipData.contractAddressUsed}/${ownershipData.tokenIdUsed}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> View NFT on Voyager
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      );
    }
  }

  // Default render: the verification form and results from form submission
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Verify Proof of Ownership</h1>
          <p className="text-muted-foreground">
            Confirm the authenticity of intellectual property ownership claims on the blockchain
          </p>
        </div>

        <Tabs defaultValue="assetId" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assetId">By Voyager NFT URL</TabsTrigger>
            <TabsTrigger value="hash">By Transaction Hash</TabsTrigger>
            <TabsTrigger value="certificate">By Certificate ID</TabsTrigger>
          </TabsList>

          <TabsContent value="assetId">
            <Card>
              <CardHeader>
                <CardTitle>Verify by Voyager NFT URL</CardTitle>
                <CardDescription>Enter the Starknet Sepolia Voyager NFT URL to verify its ownership information</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...urlForm}>
                  <form onSubmit={urlForm.handleSubmit(onSubmitVoyagerUrl)} className="space-y-4">
                    <FormField
                      control={urlForm.control}
                      name="voyagerUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voyager NFT URL</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="e.g., https://sepolia.voyager.online/nft/0x.../123"
                                  className="pl-8"
                                  {...field}
                                />
                              </div>
                              <Button type="submit" disabled={isVerifying}>
                                {isVerifying ? "Verifying..." : "Verify"}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Paste the full URL of the NFT from Starknet Sepolia Voyager.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                {isVerifying && (
                  <div className="text-center text-muted-foreground mt-4">Verifying on Starknet...</div>
                )}
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <X className="h-4 w-4" />
                    <AlertTitle>Verification Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hash">
            <Card>
              <CardHeader>
                <CardTitle>Verify by Transaction Hash</CardTitle>
                <CardDescription>Enter the blockchain transaction hash to verify ownership</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...hashForm}>
                  <form onSubmit={hashForm.handleSubmit(onSubmitHash)} className="space-y-4">
                    <FormField
                      control={hashForm.control}
                      name="transactionHash"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction Hash</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Enter transaction hash (0x...)"
                                  className="pl-8 font-mono"
                                  {...field}
                                />
                              </div>
                              <Button type="submit" disabled={isVerifying}>
                                {isVerifying ? "Verifying..." : "Verify"}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            The transaction hash is the unique identifier of the blockchain transaction
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificate">
            <Card>
              <CardHeader>
                <CardTitle>Verify by Certificate ID</CardTitle>
                <CardDescription>Enter the Certificate ID to verify its authenticity</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...certificateForm}>
                  <form onSubmit={certificateForm.handleSubmit(onSubmitCertificate)} className="space-y-4">
                    <FormField
                      control={certificateForm.control}
                      name="certificateId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certificate ID</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter Certificate ID" className="pl-8" {...field} />
                              </div>
                              <Button type="submit" disabled={isVerifying}>
                                {isVerifying ? "Verifying..." : "Verify"}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            The Certificate ID can be found on the ownership certificate
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* This block renders if form submission was successful and no URL params are active */}
        {verificationResult === "success" && ownershipData && !showDetailsFromUrl && (
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="bg-green-50 dark:bg-green-950/30 border-b border-green-100 dark:border-green-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle className="text-green-800 dark:text-green-400">Verification Successful</CardTitle>
              </div>
              <CardDescription className="text-green-700 dark:text-green-500">
                This asset has a valid proof of ownership record on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-100 dark:border-green-900">
                  <Shield className="h-10 w-10 text-green-600 dark:text-green-400" />
                  <div>
                    <h3 className="font-medium text-green-800 dark:text-green-400">Verified Ownership</h3>
                    <p className="text-sm text-green-700 dark:text-green-500">
                      This intellectual property is protected under The Berne Convention in 181 countries
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Asset Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Asset Title</p>
                      <p className="font-medium">{ownershipData.assetTitle || 'N/A'}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Asset Type</p>
                      <p className="font-medium">{ownershipData.assetType || 'N/A'}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Registration Date</p>
                      <p className="font-medium">{ownershipData.registrationDate || 'N/A'}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Owner</p>
                      {/* Fix for text overflow: Added break-words and text-wrap */}
                      <p className="font-medium break-words text-wrap">{ownershipData.owner}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Blockchain Verification</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-muted-foreground">Contract Address</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(ownershipData.contractAddressUsed)}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="p-2 bg-muted rounded font-mono text-xs break-all">
                        {ownershipData.contractAddressUsed}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-muted-foreground">Token ID</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(ownershipData.tokenIdUsed)}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="p-2 bg-muted rounded font-mono text-xs break-all">
                        {ownershipData.tokenIdUsed}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-muted-foreground">Transaction Hash</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="p-2 bg-muted rounded font-mono text-xs break-all">
                        {ownershipData.transactionHash || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-muted-foreground">Block Number</p>
                        <span className="text-xs text-muted-foreground">Starknet</span>
                      </div>
                      <div className="p-2 bg-muted rounded font-mono text-xs">{ownershipData.blockNumber || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-6">
              {/* This button will now update the URL to trigger the useEffect */}
              <Button className="sm:flex-1" asChild>
                <a href={`?contractAddress=${ownershipData.contractAddressUsed}&tokenId=${ownershipData.tokenIdUsed}`}>View Asset Details (URL)</a>
              </Button>
              <Button variant="outline" className="sm:flex-1" asChild>
                <a
                  href={`https://sepolia.voyager.online/nft/${ownershipData.contractAddressUsed}/${ownershipData.tokenIdUsed}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" /> View on Blockchain Explorer
                </a>
              </Button>
            </CardFooter>
          </Card>
        )}

        {verificationResult === "error" && !isVerifying && !ownershipData && !showDetailsFromUrl && (
          <Alert variant="destructive">
            <X className="h-4 w-4" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>
              {error || "We couldn't verify this asset. Please check the URL or hash and try again."}
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold">About Proof of Ownership Verification</h2>
          <p className="text-muted-foreground">
            Our blockchain verification system provides indisputable proof of intellectual property ownership. When you
            verify an asset, we check its records against our secure blockchain database to confirm authenticity.
          </p>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Verification Information</AlertTitle>
            <AlertDescription>
              Successful verification confirms that the asset was registered on our platform and its ownership
              information is stored on the blockchain. This can be used as evidence in legal proceedings or licensing
              negotiations.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Legal Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Verification results are recognized in 181 countries under The Berne Convention
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Immutable Records</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Blockchain records cannot be altered, providing tamper-proof verification
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Instant Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get immediate confirmation of ownership status with our real-time verification
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}