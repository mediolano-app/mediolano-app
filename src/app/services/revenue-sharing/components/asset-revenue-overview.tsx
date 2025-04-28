"use client"

import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAssetRevenueData } from "@/app/services/revenue-sharing/lib/mock-data"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { AlertCircle, ArrowRight, Clock, Download } from "lucide-react"
import Link from "next/link"

interface AssetRevenueOverviewProps {
  assetId: string
}

export default function AssetRevenueOverview({ assetId }: AssetRevenueOverviewProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const revenueData = getAssetRevenueData(assetId)

  if (!revenueData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No revenue data</h3>
        <p className="mt-1 text-sm text-gray-500">No revenue data available for this asset.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <div className="text-3xl font-bold mt-2">{revenueData.totalRevenue} ETH</div>
            <div className="text-xs text-green-600 mt-1">+{revenueData.revenueGrowth}% from previous period</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Pending Claims</div>
            <div className="text-3xl font-bold mt-2">{revenueData.pendingClaims} ETH</div>
            <div className="text-xs text-gray-500 mt-1">{revenueData.pendingClaimsCount} pending claims</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Claim Rate</div>
            <div className="text-3xl font-bold mt-2">{revenueData.claimRate}%</div>
            <div className="text-xs text-gray-500 mt-1">Of distributed revenue</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
          <CardDescription>Track revenue generation and claims over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
                <XAxis dataKey="month" tick={{ fill: isDark ? "#ccc" : "#333" }} />
                <YAxis tick={{ fill: isDark ? "#ccc" : "#333" }} tickFormatter={(value) => `${value} ETH`} />
                <Tooltip
                  formatter={(value) => [`${value} ETH`, ""]}
                  contentStyle={{
                    backgroundColor: isDark ? "#333" : "#fff",
                    color: isDark ? "#fff" : "#333",
                    border: `1px solid ${isDark ? "#444" : "#ddd"}`,
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="generated" name="Generated" stroke="#10b981" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="claimed" name="Claimed" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Distributions</CardTitle>
            <CardDescription>Latest revenue distributions for this asset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueData.recentDistributions.map((distribution) => (
                <div
                  key={distribution.id}
                  className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <div className="font-medium">{distribution.amount} ETH</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(distribution.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge
                    className={
                      distribution.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : distribution.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {distribution.status}
                  </Badge>
                </div>
              ))}

              {revenueData.recentDistributions.length === 0 && (
                <div className="text-center py-4 text-gray-500">No recent distributions</div>
              )}

              <Button asChild variant="outline" className="w-full mt-4">
                <Link href={`/revenue-sharing/assets/${assetId}/history`}>
                  View All Distributions <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Sources</CardTitle>
            <CardDescription>Breakdown of revenue by source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueData.revenueSources.map((source) => (
                <div key={source.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></div>
                    <span>{source.name}</span>
                  </div>
                  <div>
                    <div className="font-medium text-right">{source.amount} ETH</div>
                    <div className="text-xs text-gray-500 text-right">{source.percentage}%</div>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full mt-4">
                <Download className="mr-2 h-4 w-4" /> Export Revenue Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
