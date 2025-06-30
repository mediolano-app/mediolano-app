// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Eye, MoreHorizontal, FileText, Gauge } from "lucide-react";
// import Image from "next/image";

// import { type Abi } from "starknet";
// import { useReadContract } from "@starknet-react/core";
// import { pinataClient } from "@/utils/pinataClient";
// import Link from "next/link";
// import { abi } from "@/abis/abi";
// import type { NFTCardProps } from "./types";

// export const CreatorNFTCard: React.FC<NFTCardProps> = ({
//   tokenId,
//   metadata,
//   setMetadata,
//   isFiltered,
//   setFilteredMetadata,
// }) => {
//   const contract = process.env
//     .NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`;
//   const [isImage, setIsImage] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   //status = 'IP';

//   // Get tokenURI from contract
//   const {
//     data: tokenURI,
//     isLoading: isContractLoading,
//     error: contractError,
//   } = useReadContract({
//     abi: abi as Abi,
//     functionName: "tokenURI",
//     address: contract as `0x${string}`,
//     args: [Number(tokenId)],
//     watch: false,
//   });
//   // Fetch metadata when tokenURI is available
//   useEffect(() => {
//     const fetchMetadata = async () => {
//       if (!tokenURI || typeof tokenURI !== "string") {
//         return;
//       }

//       try {
//         setIsLoading(true);
//         const response = await pinataClient.gateways.get(tokenURI);

//         let parsedData;
//         try {
//           parsedData =
//             typeof response.data === "string"
//               ? JSON.parse(response.data)
//               : response.data;
//         } catch (err) {
//           throw new Error("Failed to parse metadata");
//         }

//         setMetadata(parsedData);
//         setFilteredMetadata?.([...parsedData]);
//         if (parsedData.image.startsWith("https://")) {
//           setIsImage(true);
//         }
//         console.log(parsedData);
//         setError(null);
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : "Failed to fetch metadata"
//         );
//         setMetadata(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (!isFiltered) {
//       fetchMetadata();
//     }
//   }, [isFiltered, tokenURI]);

//   useEffect(() => {
//     if (metadata) {
//     }
//   }, [metadata]);

//   if (isLoading || isContractLoading) {
//     return <div>Loading...</div>; // Consider using a proper loading component
//   }

//   if (error || contractError) {
//     return <div>Error: {error || "Failed to fetch token data"}</div>; // Consider using a proper error component
//   }

//   if (!metadata) {
//     return <div>No metadata available</div>;
//   }

//   function truncateString(input: string, maxLength: number): string {
//     // Check if the string length exceeds the maximum length
//     if (input.length > maxLength) {
//       // Truncate the string to the specified length and append '...' or another indicator
//       return input.substring(0, maxLength) + "...";
//     }
//     // If the string is within the limit, return it as is
//     return input;
//   }

//   return (
//     <Card className="overflow-hidden">
//       <CardHeader className="p-0">
//         {isImage ? (
//           <Image
//             src={metadata.image}
//             alt={metadata.name}
//             width={400}
//             height={400}
//             className="w-full h-48 object-cover"
//           />
//         ) : (
//           <Image
//             src={"/background.jpg"} // Add fallback image
//             alt={metadata.name}
//             width={400}
//             height={400}
//             className="w-full h-48 object-cover"
//           />
//         )}
//       </CardHeader>
//       <CardContent className="p-4">
//         <CardTitle className="mb-2 text-xl">{metadata.name}</CardTitle>

//         <p className="text-sm text-muted-foreground mb-5 min-h-[40px]">
//           {truncateString(metadata.description, 99)}
//         </p>

//         <div className="flex justify-between items-center mb-2">
//           <Badge variant="default">
//             {metadata.attributes?.[2]?.value ?? "MIP"}
//           </Badge>
//           <Badge variant="secondary">
//             {metadata.attributes?.[0]?.value ?? "MIP"}
//           </Badge>
//         </div>
//       </CardContent>
//       <CardFooter className="p-4 flex flex-wrap gap-2">
//         <Link href={`/asset/${tokenId}`}>
//           <Button variant="outline" size="sm">
//             <Eye className="h-4 w-4 mr-2" />
//             View
//           </Button>
//         </Link>

//         <Button variant="outline" size="sm" disabled>
//           <FileText className="h-4 w-4 mr-2" />
//           License
//         </Button>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" size="sm">
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent>
//             <DropdownMenuLabel>More</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <Link href={`/asset/dashboard/${tokenId}`}>
//               <DropdownMenuItem>
//                 <Gauge className="h-4 w-4 mr-2" />
//                 Asset Dashboard
//               </DropdownMenuItem>
//             </Link>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </CardFooter>
//     </Card>
//   );
// };

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, FileText, Gauge } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { NFTCardProps } from "./types";

export const CreatorNFTCard: React.FC<NFTCardProps> = ({
  tokenId,
  metadata,
}) => {
  if (!metadata) return null;

  function truncateString(input: string, maxLength: number): string {
    return input.length > maxLength
      ? input.substring(0, maxLength) + "..."
      : input;
  }

  const isImage = metadata.image?.startsWith("https://");

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Image
          src={isImage ? metadata.image : "/background.jpg"}
          alt={metadata.name}
          width={400}
          height={400}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 text-xl">{metadata.name}</CardTitle>
        <p className="text-sm text-muted-foreground mb-5 min-h-[40px]">
          {truncateString(metadata.description, 99)}
        </p>
        <div className="flex justify-between items-center mb-2">
          <Badge variant="default">
            {metadata.attributes?.[2]?.value ?? "MIP"}
          </Badge>
          <Badge variant="secondary">
            {metadata.attributes?.[0]?.value ?? "MIP"}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex flex-wrap gap-2">
        <Link href={`/asset/${tokenId}`}>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        </Link>

        <Button variant="outline" size="sm" disabled>
          <FileText className="h-4 w-4 mr-2" />
          License
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>More</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/asset/dashboard/${tokenId}`}>
              <DropdownMenuItem>
                <Gauge className="h-4 w-4 mr-2" />
                Asset Dashboard
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};
