"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserRevenue } from "@/app/services/revenue-sharing//lib/mock-data"
import RevenueOverview from "@/app/services/revenue-sharing/components/revenue-overview"
import RevenueAnalytics from "@/app/services/revenue-sharing/components/revenue-analytics"
import ClaimableRevenue from "@/app/services/revenue-sharing/components/claimable-revenue"
import ClaimHistory from "@/app/services/revenue-sharing/components/claim-history"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Download, BarChart3, PieChart, LineChart } from "lucide-react"
import RevenueNavigation from "@/app/services/revenue-sharing/components/revenue-navigation"
import { useEffect, useState } from "react"
import { Abi, useAccount, useContract, useReadContract } from "@starknet-react/core"
import { ip_revenue_abi } from "@/abis/ip_revenue"

export default function RevenueDashboard() {
  // const analytics = getRevenueAnalytics();
  const mockRevenueData = getUserRevenue();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS as `0x${string}`;

  const { contract } = useContract({ abi: ip_revenue_abi as Abi, address: CONTRACT_ADDRESS });
  const {address} = useAccount();

  const [revenueData, setRevenueData] = useState<{
    totalRevenue: number;
    totalClaimed: number;
    claimableAmount: number;
    pendingRevenue: number;
    claimableBreakdown: Array<{ nftContract: string; tokenId: string; amount: number; source: string }>;
  } | null>(null);
  const [analytics, setAnalytics] = useState<{
    bySource: Array<{ name: string; value: number }>;
    byAsset: Array<{ name: string; value: number }>;
    monthly: Array<{ month: string; revenue: number }>;
  } | undefined>(undefined);

  useEffect(() => {
    async function fetchData() {
      if (!address || !contract) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch revenue data
        console.log("Starting to fetch data...");
        console.log("Address:", address);
        console.log("Contract:", contract);
        
        const assetCountResponse = await contract.call('get_user_ip_asset_count', [address]);
        console.log("Asset count response:", assetCountResponse);
        const assetCount = Number(assetCountResponse);
        console.log("Asset count:", assetCount);
        const assets = [];
        for (let i = 0; i < assetCount; i++) {
          console.log("Fetching asset", i);
          const assetResponse = await contract.call('get_user_ip_asset', [address, i]);
          console.log("Asset response:", assetResponse);
          // The response should be an array with two elements
          const nftContract = assetResponse[0];
          const tokenId = assetResponse[1];
          assets.push({ nftContract: nftContract.toString(), tokenId: tokenId.toString() });
        }
        console.log("assets", assets)
        let totalRevenue = 0;
        let totalClaimed = 0;
        let claimableAmount = 0;
        let pendingRevenue = 0;
        const claimableBreakdown = [];

        for (const { nftContract, tokenId } of assets) {
          console.log("Processing asset:", { nftContract, tokenId });
          const sharesResponse = await contract.call('get_fractional_shares', [nftContract, tokenId, address]);
          const ownerCountResponse = await contract.call('get_fractional_owner_count', [nftContract, tokenId]);
          const contractBalanceResponse = await contract.call('get_contract_balance', [nftContract]);
          
          console.log("sharesResponse", sharesResponse)
          console.log("ownerCountResponse", ownerCountResponse)
          console.log("contractBalanceResponse", contractBalanceResponse)
          
          const shares = Number(sharesResponse);  
          const ownerCount = Number(ownerCountResponse);
          const contractBalance = Number(contractBalanceResponse);
          
          // Calculate user's share of the balance
          const userRevenue = (contractBalance * shares) / (ownerCount * 100); // Assuming 100 is the total shares per owner
          const claimable = userRevenue;

          totalRevenue += userRevenue / 1e18;
          totalClaimed += 0; // We don't have a way to track claimed amounts yet
          claimableAmount += claimable / 1e18;
          pendingRevenue += 0; // We don't have a way to track pending amounts yet

          if (claimable > 0) {
            claimableBreakdown.push({
              nftContract,
              tokenId,
              amount: claimable / 1e18,
              source: `NFT ${tokenId}`,
            });
          }
        }

        setRevenueData({
          totalRevenue: Number(totalRevenue.toFixed(4)),
          totalClaimed: Number(totalClaimed.toFixed(4)),
          claimableAmount: Number(claimableAmount.toFixed(4)),
          pendingRevenue: Number(pendingRevenue.toFixed(4)),
          claimableBreakdown,
        });
        console.log("revenueData", revenueData)

        // Fetch analytics data
        const bySource = [];
        const byAsset = [];
        const monthly = [];

        for (const { nftContract, tokenId } of assets) {
          const listingResponse = await contract.call('get_listing', [nftContract, tokenId]);
          const listing = listingResponse as any;
          const revenue = Number(listing.fractional.accrued_revenue) / 1e18;
          bySource.push({ name: `NFT ${tokenId}`, value: revenue });
          byAsset.push({ name: `NFT ${tokenId}`, value: revenue });
        }

        // Mock monthly data (since contract doesn't store historical data)
        const now = new Date();
        for (let i = 4; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          monthly.push({
            month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
            revenue: Number((Math.random() * 10).toFixed(2)),
          });
        }

        setAnalytics({ bySource, byAsset, monthly });
      } catch (err) {
        setError('Failed to load data. Please ensure your wallet is connected.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [contract]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Revenue Dashboard</h1>
          <p className="text-gray-600">Track and analyze revenue performance across your IP assets</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <Button variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/services/revenue-sharing/claim">
              Claim Revenue <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <RevenueNavigation />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{revenueData?.totalRevenue ?? 0} ETH</div>
            <p className="text-xs text-gray-500 mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Claimed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{revenueData?.totalClaimed ?? 0} ETH</div>
            <p className="text-xs text-gray-500 mt-1">Successfully claimed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available to Claim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{revenueData?.claimableAmount ?? 0} ETH</div>
            <p className="text-xs text-gray-500 mt-1">Ready for claiming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{revenueData?.pendingRevenue ?? 0} ETH</div>
            <p className="text-xs text-gray-500 mt-1">Generated but not yet claimable</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <RevenueOverview />
        </TabsContent>

        <TabsContent value="analytics">
          <RevenueAnalytics />
        </TabsContent>

        <TabsContent value="claims">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Claimable Revenue</CardTitle>
                <CardDescription>Revenue available for you to claim</CardDescription>
              </CardHeader>
              <CardContent>
                <ClaimableRevenue data={revenueData?.claimableBreakdown ?? mockRevenueData.claimableBreakdown} />
                <div className="mt-4 text-center">
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/services/revenue-sharing/claim">
                      View All Claimable Revenue <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Claims</CardTitle>
                <CardDescription>Your recent revenue claim history</CardDescription>
              </CardHeader>
              <CardContent>
                <ClaimHistory limit={5} />
                <div className="mt-4 text-center">
                  <Button asChild variant="outline">
                    <Link href="/services/revenue-sharing/claim?tab=history">
                      View Full Claim History <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Revenue by Source</CardTitle>
            <PieChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.bySource.map((source, index) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"][index % 4] }}
                    ></div>
                    <span className="text-sm">{source.name}</span>
                  </div>
                  <div className="font-medium text-sm">{source.value} ETH</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Top Performing Assets</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.byAsset.map((asset) => (
                <div key={asset.name} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{asset.name}</span>
                    <span className="text-sm font-medium">{asset.value} ETH</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600"
                      style={{ width: `${(asset.value / analytics?.byAsset[0].value) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Monthly Trend</CardTitle>
            <LineChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.monthly.slice(-5).map((month) => (
                <div key={month.month} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{month.month}</span>
                    <span className="text-sm font-medium">{month.revenue} ETH</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600"
                      style={{
                        width: `${(month.revenue / Math.max(...analytics?.monthly.map((m) => m.revenue))) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
