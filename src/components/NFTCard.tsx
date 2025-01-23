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
import { Skeleton } from '@/components/ui/skeleton';

export interface NFTCardProps {
	tokenId: string;
	imageUrl: string;
	name: string;
	owner: string;
}

const NFTCard: React.FC<NFTCardProps> = ({ tokenId, imageUrl, name, owner }) => {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<Card className="overflow-hidden">
			<CardContent className="p-0 relative aspect-square">
				{isLoading && (
					<Skeleton className="w-full h-full absolute inset-0" />
				)}
				<Image
					src={imageUrl}
					alt={name}
					fill
					className="object-cover"
					onLoad={() => setIsLoading(false)}
					onError={() => setIsLoading(false)}
				/>
			</CardContent>
			<CardFooter className="flex flex-col gap-2 p-4">
				<div className="w-full">
					<h3 className="font-semibold truncate">{name}</h3>
					<p className="text-sm text-gray-500 truncate">
						Token ID: {tokenId}
					</p>
					<p className="text-sm text-gray-500 truncate">
						Owner: {owner.slice(0, 6)}...{owner.slice(-4)}
					</p>
				</div>
				<div className="flex gap-2 w-full">
					<Button variant="outline" className="w-full">
						View Details
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
};

export default NFTCard;