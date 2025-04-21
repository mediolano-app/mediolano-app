"use client"

import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TokenChartProps {
  priceHistory: Array<{
    date: string
    price: number
    formattedDate: string
  }>
  volumeHistory: Array<{
    date: string
    volume: number
    formattedDate: string
  }>
  symbol: string
}

export function TokenChart({ priceHistory, volumeHistory, symbol }: TokenChartProps) {
  const [timeRange, setTimeRange] = useState("30d")

  // Filter data based on time range
  const filterDataByTimeRange = (data: any[]) => {
    const now = new Date()
    const filterDate = new Date()

    switch (timeRange) {
      case "7d":
        filterDate.setDate(now.getDate() - 7)
        break
      case "14d":
        filterDate.setDate(now.getDate() - 14)
        break
      case "30d":
        filterDate.setDate(now.getDate() - 30)
        break
      case "90d":
        filterDate.setDate(now.getDate() - 90)
        break
      default:
        filterDate.setDate(now.getDate() - 30)
    }

    return data.filter((item) => new Date(item.date) >= filterDate)
  }

  const filteredPriceData = filterDataByTimeRange(priceHistory)
  const filteredVolumeData = filterDataByTimeRange(volumeHistory)

  // Format price for tooltip
  const formatPrice = (value: number) => {
    return `${value.toFixed(6)} ETH`
  }

  // Format volume for tooltip
  const formatVolume = (value: number) => {
    return `$${value.toLocaleString()}`
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Token Performance</CardTitle>
        <CardDescription>Historical price and volume data for {symbol}</CardDescription>
        <div className="flex items-center space-x-2 mt-2">
          <Button variant={timeRange === "7d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("7d")}>
            7D
          </Button>
          <Button variant={timeRange === "14d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("14d")}>
            14D
          </Button>
          <Button variant={timeRange === "30d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("30d")}>
            30D
          </Button>
          <Button variant={timeRange === "90d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("90d")}>
            90D
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="price">Price</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
          </TabsList>
          <TabsContent value="price" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredPriceData}>
                <XAxis dataKey="formattedDate" tickLine={false} axisLine={false} tickMargin={10} minTickGap={30} />
                <YAxis
                  tickFormatter={(value) => value.toFixed(6)}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  width={80}
                />
                <Tooltip
                  formatter={(value: number) => [formatPrice(value), "Price"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="volume" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredVolumeData}>
                <XAxis dataKey="formattedDate" tickLine={false} axisLine={false} tickMargin={10} minTickGap={30} />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  width={80}
                />
                <Tooltip
                  formatter={(value: number) => [formatVolume(value), "Volume"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
