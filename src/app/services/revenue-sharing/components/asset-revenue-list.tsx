"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ExternalLink, History, Settings } from "lucide-react";
import { Abi, useAccount, useReadContract } from "@starknet-react/core";
import { ip_revenue_abi } from "@/abis/ip_revenue";

interface Asset {
  id: string;
  title: string;
  imageUrl: string;
  totalShares: number;
  creatorShare: number;
  pendingRevenue: number;
  status: string;
  nft_contract: string;
  token_id: string;
}

export default function AssetRevenueList() {
  const [sortField, setSortField] = useState<keyof Asset>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { address } = useAccount();

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS as `0x${string}`;

  const { data: assetCountData, isLoading: isCountLoading } = useReadContract({
    functionName: "get_user_ip_asset_count",
    args: [address],
    abi: ip_revenue_abi as Abi,
    address: CONTRACT_ADDRESS,
    watch: true,
  });

  const assetCount = useMemo(() => {
    if (!assetCountData) return 0;
    return Number(assetCountData);
  }, [assetCountData]);

  const indices = useMemo(
    () => Array.from({ length: assetCount }, (_, i) => i),
    [assetCount]
  );

  const { data: assetsData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ip_revenue_abi as Abi,
    functionName: "get_user_ip_assets_batch",
    args: [address, indices],
    watch: true,
  });

  const listingsArgs = useMemo(() => {
    if (!assetsData) return [];
    return assetsData.map((asset: any) => ({
      nft_contract: asset[0],
      token_id: asset[1],
    }));
  }, [assetsData]);
  
  const { data: listingsData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ip_revenue_abi as Abi,
    functionName: "get_listings_batch",
    args: [listingsArgs],
    watch: true,
  });

  const assets: Asset[] = useMemo(() => {
    if (!assetsData || !listingsData) return [];
    
    return assetsData
      .map((assetData: any, index: number) => {
        const [nft_contract, token_id] = assetData;
        const listing = listingsData[index];
        if (!listing) return null;

        return {
          id: `${nft_contract}_${token_id.low}_${token_id.high}`,
          title: `Asset ${index + 1}`,
          imageUrl: "/placeholder.svg",
          totalShares: Number(listing.fractional.total_shares.low),
          creatorShare: 0,
          pendingRevenue: Number(listing.fractional.accrued_revenue.low) / 1e18,
          status: listing.active ? "Active" : "Inactive",
          nft_contract: nft_contract.toString(),
          token_id: `${token_id.low}_${token_id.high}`,
        };
      })
      .filter((asset: Asset): asset is Asset => asset !== null);
  }, [assetsData, listingsData]);

  const sortedAssets = useMemo(() => [...assets].sort((a, b) => {
    const aValue = a[sortField as keyof Asset];
    const bValue = b[sortField as keyof Asset];
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  }), [assets, sortField, sortDirection]);

  const toggleSort = (field: keyof Asset) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (isCountLoading) {
    return <div>Loading assets...</div>;
  }

  if (!address) {
    return <div>Please connect your wallet to view assets.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("title")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Asset <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost" 
                onClick={() => toggleSort("totalShares")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Total Shares <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("creatorShare")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Creator Share <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("pendingRevenue")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Pending Revenue <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAssets.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No assets found.
              </TableCell>
            </TableRow>
          )}
          {sortedAssets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={asset.imageUrl || "/placeholder.svg"}
                    alt={asset.title}
                    className="h-10 w-10 rounded object-cover"
                  />
                  <div>
                    <div className="font-medium">{asset.title}</div>
                    <div className="text-xs text-gray-500">
                      ID: {asset.id.substring(0, 8)}...
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{asset.totalShares}</TableCell>
              <TableCell>{asset.creatorShare}%</TableCell>
              <TableCell>{asset.pendingRevenue} ETH</TableCell>
              <TableCell>
                <Badge
                  className={
                    asset.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : asset.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {asset.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button asChild size="icon" variant="ghost">
                    <Link href={`/revenue-sharing/assets/${asset.id}`}>
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                  <Button asChild size="icon" variant="ghost">
                    <Link href={`/revenue-sharing/assets/${asset.id}/history`}>
                      <History className="h-4 w-4" />
                      <span className="sr-only">History</span>
                    </Link>
                  </Button>
                  <Button asChild size="icon" variant="ghost">
                    <Link href={`/revenue-sharing/assets/${asset.id}/settings`}>
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Settings</span>
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}