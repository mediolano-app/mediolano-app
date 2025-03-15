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
} from "lucide-react";
import Image from "next/image";
import { abi } from "../../src/abis/abi";
import { type Abi } from "starknet";
import { useReadContract } from "@starknet-react/core";
import { pinataClient } from "@/utils/pinataClient";
import { IP } from "../app/register/page";

interface NFTCardProps {
	tokenId: BigInt;
	status: string;
}



const NFTCard: React.FC<NFTCardProps> = ({ tokenId, status }) => {
	const contract = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MIP as `0x${string}`;
	const [metadata, setMetadata] = useState<IP | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	status = 'Listed';

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

	console.log("ESSE EH O TOKEN URI", tokenURI);

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

				// Validate metadata structure
				if (!isValidMetadata(parsedData)) {
					throw new Error("Invalid metadata format");
				}

				setMetadata(parsedData);
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

	const isValidMetadata = (data: any): data is IP => {
		return (
			data &&
			typeof data === "object" &&
			"name" in data &&
			"description" in data
		);
	};

	if (isLoading || isContractLoading) {
		return <div>Loading...</div>; // Consider using a proper loading component
	}

	if (error || contractError) {
		return <div>Error: {error || "Failed to fetch token data"}</div>; // Consider using a proper error component
	}

	if (!metadata) {
		return <div>No metadata available</div>;
	}

	return (
		<Card className="overflow-hidden">
			<CardHeader className="p-0">
				<Image
					src={metadata.image || "/background.jpg"} // Add fallback image
					alt={metadata.name}
					width={400}
					height={400}
					className="w-full h-48 object-cover"
				/>
			</CardHeader>
			<CardContent className="p-4">
				<CardTitle className="mb-2">{metadata.name}</CardTitle>
				<div className="flex justify-between items-center mb-2">
					<Badge variant="secondary">{metadata.type}</Badge>
				</div>
				<Badge
					variant={
						status === "Listed"
							? "default"
							: status === "Licensed"
								? "secondary"
								: "outline"
					}
				>
					{status}
				</Badge>
			</CardContent>
			<CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
				<Button variant="outline" size="sm">
					<Eye className="h-4 w-4 mr-2" />
					View
				</Button>
				<Button variant="outline" size="sm">
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
						<DropdownMenuLabel>More Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<DollarSign className="h-4 w-4 mr-2" />
							Monetize
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Globe className="h-4 w-4 mr-2" />
							Listing
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Zap className="h-4 w-4 mr-2" />
							Transaction
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardFooter>
		</Card>
	);
};

export default NFTCard;