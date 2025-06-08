"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Abi, useAccount, useProvider, useReadContract } from "@starknet-react/core";
import { ip_revenue_abi } from "@/abis/ip_revenue";
import { uint256 } from "starknet";


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
  if (!CONTRACT_ADDRESS) {
    throw new Error("Contract address not found in environment variables");
  }

  const { provider } = useProvider();

  const { data: assetCountData, isLoading: isAssetCountLoading } = useReadContract({
    functionName: "get_user_ip_asset_count",
    args: address ? [address.toString()] : undefined,
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

  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (provider && assetCountData && !isAssetCountLoading && assetCount > 0) {
      const fetchAssets = async () => {
        setIsLoading(true);
        try {
          const assetPromises = indices.map(async (index) => {
            const { low, high } = uint256.bnToUint256(BigInt(index));
            try {
              if (!address) return null;
              
              const assetResult = await provider.callContract({
                contractAddress: CONTRACT_ADDRESS,
                entrypoint: "get_user_ip_asset",
                calldata: [address.toString(), low.toString(), high.toString()],
              });
              console.log(assetResult)

              if (!assetResult || !assetResult[0] || !assetResult[1]) return null;
              
              const nft_contract = assetResult[0].toString();
              const token_id = assetResult[1];
              const { low: token_low, high: token_high } = uint256.bnToUint256(BigInt(token_id));
              
              if (!nft_contract || !token_low || !token_high) return null;
              
              // Fetch additional asset data if needed
              const [fractionalShares, contractBalance] = await Promise.all([
                provider.callContract({
                  contractAddress: CONTRACT_ADDRESS,
                  entrypoint: "get_fractional_shares",
                  calldata: [nft_contract, token_low.toString(), token_high.toString(), address],
                }),
                provider.callContract({
                  contractAddress: CONTRACT_ADDRESS,
                  entrypoint: "get_contract_balance",
                  calldata: [nft_contract],
                }),
              ]);
              console.log(fractionalShares, contractBalance)

              return {
                id: index?.toString(),
                title: `Asset ${index + 1}`,
                imageUrl: "/placeholder.svg",
                totalShares: 0,
                creatorShare: Number(fractionalShares[0]) || 0,
                pendingRevenue: Number(contractBalance[0]) || 0,
                status: "Active",
                nft_contract,
                token_id: `${token_low}_${token_high}`,
              };
            } catch (error) {
              console.error(`Error fetching asset at index ${index}:`, error);
              return null;
            }
          });

          const assetData = await Promise.all(assetPromises);
          console.log(assetData)
          setAssets(assetData.filter((asset): asset is Asset => asset !== null));
        } catch (error) {
          console.error("Error fetching assets:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAssets();
    }
  }, [provider, assetCountData, isAssetCountLoading, assetCount, address, indices, CONTRACT_ADDRESS]);

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

  if (isLoading) {
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
                      ID: {asset.nft_contract.substring(0, 8)}...
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