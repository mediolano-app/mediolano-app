import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCheck, FileText, Layers } from "lucide-react"

export function Metrics() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricCard
        title="Total Assets"
        value="12"
        change="+2 from last month"
        icon={<Layers className="h-4 w-4 text-muted-foreground" />}
      />
      <MetricCard
        title="Active Licenses"
        value="24"
        change="+8 from last month"
        icon={<FileCheck className="h-4 w-4 text-muted-foreground" />}
      />
      <MetricCard
        title="License Revenue"
        value="5,240 ETH"
        change="+12% from last month"
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
}

function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  )
}
