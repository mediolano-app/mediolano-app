"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card } from "@/components/ui/card"
import type { MonthlyRevenue } from "@/app/services/revenue-sharing/lib/types"

interface RevenueChartProps {
  data: MonthlyRevenue[]
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Card className="p-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
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
            <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
