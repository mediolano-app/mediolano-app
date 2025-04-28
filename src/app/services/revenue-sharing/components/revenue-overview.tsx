"use client"

import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserRevenue } from "@/app/services/revenue-sharing/lib/mock-data"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Bar,
  BarChart,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function RevenueOverview() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [timeframe, setTimeframe] = useState("6m")

  const revenueData = getUserRevenue()

  // Filter data based on selected timeframe
  const getTimeframeData = () => {
    switch (timeframe) {
      case "1m":
        return revenueData.monthlyData.slice(-1)
      case "3m":
        return revenueData.monthlyData.slice(-3)
      case "6m":
        return revenueData.monthlyData.slice(-6)
      case "1y":
        return revenueData.monthlyData.slice(-12)
      case "all":
      default:
        return revenueData.monthlyData
    }
  }

  const timeframeData = getTimeframeData()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="revenue" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="revenue">Revenue vs Claims</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
            </TabsList>

            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Claims</CardTitle>
                <CardDescription>Compare generated revenue against claimed revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeframeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Generated Revenue"
                        stroke="#10b981"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                      <Line type="monotone" dataKey="claimed" name="Claimed Revenue" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Breakdown</CardTitle>
                <CardDescription>View revenue sources by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeframeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
                      <XAxis dataKey="month" tick={{ fill: isDark ? "#ccc" : "#333" }} />
                      <YAxis tick={{ fill: isDark ? "#ccc" : "#333" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? "#333" : "#fff",
                          color: isDark ? "#fff" : "#333",
                          border: `1px solid ${isDark ? "#444" : "#ddd"}`,
                        }}
                      />
                      <Legend />
                      <Bar dataKey="marketplace" name="Marketplace" stackId="a" fill="#10b981" />
                      <Bar dataKey="licensing" name="Licensing" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="streaming" name="Streaming" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="api" name="API" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Metrics</CardTitle>
            <CardDescription>Key performance indicators for your revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-500">Average Monthly Revenue</span>
                <span className="font-medium">
                  {(revenueData.totalRevenue / revenueData.monthlyData.length).toFixed(2)} ETH
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-500">Claim Rate</span>
                <span className="font-medium">
                  {((revenueData.totalClaimed / revenueData.totalRevenue) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-500">Highest Monthly Revenue</span>
                <span className="font-medium">
                  {Math.max(...revenueData.monthlyData.map((item) => item.revenue))} ETH
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-500">Unclaimed Revenue</span>
                <span className="font-medium">
                  {(revenueData.totalRevenue - revenueData.totalClaimed).toFixed(2)} ETH
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Revenue Growth (YoY)</span>
                <span className="font-medium text-emerald-600">+24%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
            <CardDescription>How your revenue is distributed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Marketplace</span>
                  <span className="text-sm font-medium">48%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: "48%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Licensing</span>
                  <span className="text-sm font-medium">24%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: "24%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Streaming</span>
                  <span className="text-sm font-medium">19%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: "19%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">API</span>
                  <span className="text-sm font-medium">9%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: "9%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
