"use client";

import React, { useState, useEffect } from "react";
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
import {
	Eye,
	DollarSign,
	Send,
	MoreHorizontal,
	Search,
	Grid,
	List,
	FileText,
	Zap,
	Globe,
	Gauge,
} from "lucide-react";
import Image from "next/image";
import { abi } from "../../src/abis/abi";
import { type Abi } from "starknet";
import { useReadContract } from "@starknet-react/core";
import { pinataClient } from "@/utils/pinataClient";
import Link from "next/link";

interface NFTCardProps {
	tokenId: BigInt;
	status: string;
}

export interface Attribute {
	trait_type?: string;
	value: string;
}

export type IPType = "" | "patent" | "trademark" | "copyright" | "trade_secret";

export interface IP{
	name: string,
	description: string,
	external_url: string,
	image: string,
	attributes: Attribute[],
  }

const NFTCard: React.FC<NFTCardProps> = ({ tokenId, status }) => {
	const contract = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`;
	const [metadata, setMetadata] = useState<IP | null>(null);
	const [isImage, setIsImage] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	//status = 'IP';

	// Get tokenURI from contract
	const {
		data: tokenURI,
		isLoading: isContractLoading,
		error: contractError,
	} = useReadContract({
		abi: abi as Abi,
		functionName: "tokenURI",
		address: contract as `0x${string}`,
		args: [Number(tokenId)],
		watch: false,
	});
	// Fetch metadata when tokenURI is available
	useEffect(() => {
		const fetchMetadata = async () => {
			if (!tokenURI || typeof tokenURI !== "string") {
				return;
			}

			try {
				setIsLoading(true);
        		console.log(tokenURI);
				const response = await pinataClient.gateways.get(tokenURI);
				console.log(response);
				let parsedData: any;
				try {
					parsedData =
						typeof response.data === "string"
							? JSON.parse(response.data)
							: response.data;
				} catch (parseError) {
					throw new Error("Failed to parse metadata");
				}

				// if (!isValidMetadata(parsedData)) {
				// 	throw new Error("Invalid metadata format");
				// }

				setMetadata(parsedData);
				if(parsedData.image.startsWith("https://")) {
					setIsImage(true);
				}
				console.log(parsedData);
				setError(null);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to fetch metadata",
				);
				setMetadata(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMetadata();
	}, [tokenURI]);
	
	useEffect(() => {
		if (metadata) {
			console.log("Metadata:", metadata);
			//console.log("Metadata IMAGE", metadata.image);
		}
	}
	, [metadata]);


	if (isLoading || isContractLoading) {
		return <div>Loading...</div>; // Consider using a proper loading component
	}

	if (error || contractError) {
		return <div>Error: {error || "Failed to fetch token data"}</div>; // Consider using a proper error component
	}

	if (!metadata) {
		return <div>No metadata available</div>;
	}


	function truncateString(input: string, maxLength: number): string {
		// Check if the string length exceeds the maximum length
		if (input.length > maxLength) {
			// Truncate the string to the specified length and append '...' or another indicator
			return input.substring(0, maxLength) + "...";
		}
		// If the string is within the limit, return it as is
		return input;
	}

	return (
		<Card className="overflow-hidden">
			<CardHeader className="p-0">
			  {isImage ? (
				<Image
					src={metadata.image}
					alt={metadata.name}
					width={400}
					height={400}
					className="w-full h-48 object-cover"
				/> ) : (
				<Image
					src={
						"/background.jpg"
					} // Add fallback image
					alt={metadata.name}
					width={400}
					height={400}
					className="w-full h-48 object-cover"
				/>
			  )}
			</CardHeader>
			<CardContent className="p-4">
				<CardTitle className="mb-2 text-xl">{metadata.name}</CardTitle>
				
				<p className="text-sm text-muted-foreground mb-5">
					{ truncateString(metadata.description, 99 ) }</p>
				
				
				<div className="flex justify-between items-center mb-2">

				<Badge variant="default">
					{metadata.attributes?.[0]?.value ?? "0"}
				</Badge>
				<Badge variant="secondary">
					{metadata.attributes?.[1]?.value ?? "0"}
				</Badge>
				</div>
				{/* <Badge className="text-sm"
					variant={
						status === "Protected"
							? "default"
							: status === "Licensed"
								? "secondary"
								: "outline"
					}
				>
					{status}
				</Badge>*/}
			</CardContent>
			<CardFooter className="p-4 flex flex-wrap gap-2">
				
				<Link href={`/asset/${tokenId}`}>
				<Button variant="outline" size="sm">
					<Eye className="h-4 w-4 mr-2" />
					View
				</Button></Link>
				{/*
				<Button variant="outline" size="sm">
					<FileText className="h-4 w-4 mr-2" />
					License
				</Button>
				*/}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>More Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<Link href={`/asset/dashboard/${tokenId}`}>
						<DropdownMenuItem>
							<Gauge className="h-4 w-4 mr-2" />
							Dashboard
						</DropdownMenuItem>
						</Link>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardFooter>
		</Card>
	);
};

export default NFTCard;