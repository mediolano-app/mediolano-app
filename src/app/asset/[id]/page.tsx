"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileCheck, Users, Box } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReadContract } from "@starknet-react/core";
import { abi } from "@/abis/abi";
import { Abi } from "starknet";
import { useAccount } from "@starknet-react/core";
import { CONTRACT_ADDRESS } from "@/lib/constants";
import { NFTMetadata } from "@/lib/types";
import { IPTypeInfo } from "@/components/ip-type-info";
import { fetchIPFSMetadata, determineIPType, getKnownCids } from "@/utils/ipfs";
import { OverviewTab } from "@/components/asset/overview-tab";
import { LicenseTab } from "@/components/asset/license-tab";
import { OwnerTab } from "@/components/asset/owner-tab";
import CreatorAssetPage from "@/components/creator-asset";

interface AssetPageProps {
  params: Promise<{
    id: string;
  }>;
}

// export default function AssetPage({ params }: AssetPageProps) {
//   // Unwrap the params Promise using React.use()
//   const resolvedParams = use(params);
//   const { id } = resolvedParams;

//   const tokenId = id || 0; // Default to 0 if id is not provided // need improve

//   const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
//   const { account, address } = useAccount();
//   const userAddress = address || "Loading";

//   //Add new consts to recognize the Cids
//   const [assetType, setAssetType] = useState<string>("NFT"); // use NFT for default
//   const knownCids = getKnownCids();
//   const ipfsCid = knownCids[id] || null;

//   // Read basic NFT information (name, symbol)
//   const { data: nftSymbol } = useReadContract({
//     abi: abi as Abi,
//     functionName: "symbol",
//     address: CONTRACT_ADDRESS,
//     args: [],
//   });

//   // Read token name
//   const { data: nftName } = useReadContract({
//     abi: abi as Abi,
//     functionName: "name",
//     address: CONTRACT_ADDRESS,
//     args: [],
//   });

//   // Read token URI for metadata
//   const { data: tokenURI } = useReadContract({
//     abi: abi as Abi,
//     functionName: "tokenURI",
//     address: CONTRACT_ADDRESS,
//     args: [tokenId],
//   });

//   // Read token owner
//   const { data: tokenOwner } = useReadContract({
//     abi: abi as Abi,
//     functionName: "ownerOf",
//     address: CONTRACT_ADDRESS,
//     args: [tokenId],
//   });

//   const tokenOwnerAddress = account ? address?.slice(0, 66) : "Unknown";
//   //console.log("Token Owner:", tokenOwnerAddress);

//   // Fetch metadata when tokenURI changes
//   useEffect(() => {
//     const fetchMetadata = async () => {
//       if (tokenURI) {
//         try {
//           const response = await fetch(tokenURI);
//           const data = await response.json();
//           setMetadata(data);
//         } catch (error) {
//           console.error("Error fetching metadata:", error);
//         }
//       }
//     };

//     fetchMetadata();
//   }, [tokenURI]);

//   useEffect(() => {
//     async function detectAssetType() {
//       // if there exists an IPFS CID, get the metadata
//       if (ipfsCid) {
//         try {
//           const metadata = await fetchIPFSMetadata(ipfsCid);
//           if (metadata) {
//             // Use determineIPType func to detect the type in metadata-based
//             const detectedType = determineIPType(metadata);
//             if (detectedType) {
//               setAssetType(detectedType);
//               console.log(assetType);
//               return;
//             }
//           }
//         } catch (error) {
//           console.error(
//             "Error fetching IPFS metadata for type detection:",
//             error
//           );
//         }
//       }

//       // second try, try to infer the type from the name
//       const name = (metadata?.name || nftName || "").toLowerCase();
//       if (
//         name.includes("audio") ||
//         name.includes("music") ||
//         name.includes("sound")
//       ) {
//         setAssetType("Audio");
//         return;
//       }
//       if (name.includes("art") || name.includes("painting")) {
//         setAssetType("Art");
//         return;
//       }
//       if (name.includes("video") || name.includes("film")) {
//         setAssetType("Video");
//         return;
//       }
//       if (
//         name.includes("software") ||
//         name.includes("code") ||
//         name.includes("app")
//       ) {
//         setAssetType("Software");
//         return;
//       }
//       if (name.includes("patent") || name.includes("invention")) {
//         setAssetType("Patents");
//         return;
//       }
//       if (
//         name.includes("post") ||
//         name.includes("article") ||
//         name.includes("blog")
//       ) {
//         setAssetType("Posts");
//         return;
//       }
//       if (name.includes("book") || name.includes("publication")) {
//         setAssetType("Publications");
//         return;
//       }
//       console.log(assetType);

//       // if there isn't determined it yet, use fallback based on the id
//       const numId = parseInt(id, 10);
//       const types = [
//         "Art",
//         "Software",
//         "Audio",
//         "Video",
//         "Patents",
//         "Posts",
//         "Documents",
//         "Publications",
//         "RWA",
//         "NFT",
//       ];
//       setAssetType(types[numId % types.length]);
//     }

//     detectAssetType();
//   }, [id, ipfsCid, metadata, nftName, assetType]);

//   const nftData = {
//     title: metadata?.name || nftName || "Loading IP",
//     description: metadata?.description || "",
//     nftId: "NFT #" + tokenId,
//     symbol: nftSymbol || "MIP",
//     tokenId: tokenId.toString(),
//     tokenURI: tokenURI || "",
//     owner: tokenOwner || "",
//     tokenStandard: "ERC721",
//     collection: nftName || "MIP",
//     author: (metadata?.author || tokenOwner || "Unknown").toString(),
//     imageUrl: metadata?.image || "/background.jpg",
//     blockchain: "Starknet",
//     contractAddress: CONTRACT_ADDRESS || "",
//     ipfsUrl: tokenURI || "",
//     externalUrl: metadata?.externalUrl || "",
//   };

//   const asset = {
//     id,
//     name: metadata?.name || nftName || "Loading IP",
//     author: {
//       name: (metadata?.author || tokenOwner || "Unknown").toString(),
//       address: tokenOwnerAddress,
//       avatar: metadata?.image || "/background.jpg",
//       verified: false,
//       bio: "author bio (Preview).",
//       website: "https://ip.mediolano.app",
//     },
//     creator: {
//       name: (metadata?.author || tokenOwner || "Unknown").toString(),
//       address: tokenOwnerAddress,
//       avatar: metadata?.image || "/background.jpg",
//       verified: false,
//       bio: "author bio (Preview).",
//       website: "https://ip.mediolano.app",
//     },
//     owner: {
//       name: (metadata?.author || tokenOwnerAddress || "Unknown").toString(),
//       address: tokenOwnerAddress,
//       avatar: "/background.jpg",
//       verified: true,
//       acquired: "(Preview)",
//     },
//     description: metadata?.description || "",
//     template: metadata?.type || "Asset",
//     image: metadata?.image || "/background.jpg",
//     createdAt: "(Preview)",
//     collection: "MIP",
//     blockchain: "Starknet",
//     tokenStandard: "ERC-721",
//     licenseType: metadata?.licenseType || "NFT",
//     licenseDetails: metadata?.licenseDetails || "Undefined",
//     version: metadata?.version || "1.0",
//     commercialUse: metadata?.commercialUse || false,
//     modifications: metadata?.modifications || false,
//     attribution: metadata?.attribution || false,
//     licenseTerms: metadata?.licenseDetails || "Undefined",
//     contract: CONTRACT_ADDRESS,
//     attributes: [
//       { trait_type: "Asset", value: "Programmable IP" },
//       { trait_type: "Protection", value: "Proof of Onwership" },
//     ],
//     licenseInfo: {
//       type: "(Preview)",
//       terms: "(Preview)",
//       allowCommercial: false,
//       allowDerivatives: true,
//       requireAttribution: true,
//       royaltyPercentage: 5,
//     },
//     ipfsCid: ipfsCid,
//     type: assetType, // change to use the new form of search IP type dynamically
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <main className="container mx-auto p-4 py-8 ">
//         <Link href="/portfolio">
//           <Button variant="ghost" size="sm" className="mb-6">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Portfolio
//           </Button>
//         </Link>

//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
//           {/* Left column - Image */}
//           <div className="lg:col-span-3">
//             <div className="top-24">
//               <div className="relative overflow-hidden rounded-xl border bg-muted/20 p-2">
//                 <Image
//                   src={asset.image || "/background.jpg"}
//                   alt={asset.name}
//                   width={600}
//                   height={600}
//                   className="w-full h-auto object-contain"
//                   sizes="(max-width: 768px) 100vw, 40vw"
//                   priority
//                 />
//                 <div className="absolute top-3 left-3">
//                   <Badge className="bg-primary/90 text-primary-foreground">
//                     {asset.collection}
//                   </Badge>
//                 </div>
//               </div>

//               <div className="mt-4 flex flex-wrap gap-2">
//                 {asset.attributes.map((attr, index) => (
//                   <Badge
//                     key={index}
//                     variant="outline"
//                     className="bg-background"
//                   >
//                     {attr.trait_type}: {attr.value}
//                   </Badge>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-6">
//               <IPTypeInfo
//                 asset={{ ...asset, ipfsCid: asset.ipfsCid || undefined }}
//               />
//             </div>
//           </div>

//           {/* Right column - Content */}
//           <div className="lg:col-span-3">
//             <div className="mb-6">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h1 className="text-3xl font-bold text-clip">{asset.name}</h1>
//                 </div>
//               </div>
//             </div>

//             <Tabs defaultValue="overview" className="mt-8">
//               <TabsList className="grid w-full grid-cols-3">
//                 <TabsTrigger value="overview">Overview</TabsTrigger>
//                 <TabsTrigger value="license">License</TabsTrigger>
//                 <TabsTrigger value="owner">Owner</TabsTrigger>
//               </TabsList>

//               <TabsContent value="overview" className="mt-6">
//                 <OverviewTab
//                   asset={asset}
//                   tokenOwnerAddress={tokenOwnerAddress}
//                 />
//               </TabsContent>

//               <TabsContent value="license" className="mt-6">
//                 <LicenseTab asset={asset} />
//               </TabsContent>

//               <TabsContent value="owner" className="mt-6">
//                 <OwnerTab asset={asset} tokenOwnerAddress={tokenOwnerAddress} />
//               </TabsContent>
//             </Tabs>

//             <div className="mt-6 flex flex-wrap gap-4">
//               <Button disabled variant="outline" className="flex-1">
//                 Share
//               </Button>
//               <Button disabled variant="outline" className="flex-1">
//                 View on Explorer
//               </Button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

export default function page({ params }: AssetPageProps) {
  return <CreatorAssetPage params={params} />;
}
