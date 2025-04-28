"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  Cell,
} from "recharts"
import { getRevenueAnalytics } from "@/app/services/revenue-sharing/lib/mock-data"

export default function RevenueAnalytics() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [timeframe, setTimeframe] = useState("6m")

  const analytics = getRevenueAnalytics()

  // Filter data based on selected timeframe
  const getTimeframeData = () => {
    switch (timeframe) {
      case "1m":
        return analytics.monthly.slice(-1)
      case "3m":
        return analytics.monthly.slice(-3)
      case "6m":
        return analytics.monthly.slice(-6)
      case "1y":
        return analytics.monthly.slice(-12)
      case "all":
      default:
        return analytics.monthly
    }
  }

  const timeframeData = getTimeframeData()

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sources">Revenue Sources</TabsTrigger>
              <TabsTrigger value="assets">By Asset</TabsTrigger>
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

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-500">Total Revenue</div>
                  <div className="text-3xl font-bold mt-2">{analytics.totalRevenue} ETH</div>
                  <div className="text-xs text-green-600 mt-1">+{analytics.revenueGrowth}% from previous period</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-500">Pending Claims</div>
                  <div className="text-3xl font-bold mt-2">{analytics.pendingClaims} ETH</div>
                  <div className="text-xs text-gray-500 mt-1">{analytics.pendingClaimsCount} pending claims</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-500">Active Assets</div>
                  <div className="text-3xl font-bold mt-2">{analytics.activeAssets}</div>
                  <div className="text-xs text-gray-500 mt-1">Generating revenue</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Revenue Over Time</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeframeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
                      <XAxis dataKey="month" tick={{ fill: isDark ? "#ccc" : "#333" }} />
                      <YAxis tick={{ fill: isDark ? "#ccc" : "#333" }} tickFormatter={(value) => `${value} ETH`} />
                      <Tooltip
                        formatter={(value) => [`${value} ETH`, "Revenue"]}
                        contentStyle={{
                          backgroundColor: isDark ? "#333" : "#fff",
                          color: isDark ? "#fff" : "#333",
                          border: `1px solid ${isDark ? "#444" : "#ddd"}`,
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#10b981" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="claimed" stroke="#3b82f6" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Revenue by Source</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.bySource}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {analytics.bySource.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} ETH`, "Revenue"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Source Breakdown</h3>
                  <div className="space-y-4">
                    {analytics.bySource.map((source, index) => (
                      <div key={source.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span>{source.name}</span>
                        </div>
                        <div className="font-medium">{source.value} ETH</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Source Trends</h3>
                <div className="h-[300px]">
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
                      <Bar dataKey="marketplace" stackId="a" fill="#10b981" />
                      <Bar dataKey="licensing" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="streaming" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="api" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Top Performing Assets</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.byAsset}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
                      <XAxis type="number" tick={{ fill: isDark ? "#ccc" : "#333" }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: isDark ? "#ccc" : "#333" }} width={80} />
                      <Tooltip
                        formatter={(value) => [`${value} ETH`, "Revenue"]}
                        contentStyle={{
                          backgroundColor: isDark ? "#333" : "#fff",
                          color: isDark ? "#fff" : "#333",
                          border: `1px solid ${isDark ? "#444" : "#ddd"}`,
                        }}
                      />
                      <Bar dataKey="value" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Asset Performance Comparison</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.assetComparison} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                      <Line type="monotone" dataKey="asset1" name="Digital Art Series" stroke="#10b981" />
                      <Line type="monotone" dataKey="asset2" name="Music Album" stroke="#3b82f6" />
                      <Line type="monotone" dataKey="asset3" name="AI Model" stroke="#f59e0b" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
