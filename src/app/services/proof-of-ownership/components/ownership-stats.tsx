import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Clock, FileCheck, Globe } from "lucide-react"

export default function OwnershipStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Protected Assets</CardTitle>
          <Shield className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">+2 from last month</p>
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-0.5 rounded-full">
              83% Verified
            </span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Verification Checks</CardTitle>
          <FileCheck className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">47</div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">+15 from last month</p>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Countries Protected</CardTitle>
          <Globe className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">181</div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">Berne Convention</p>
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-0.5 rounded-full">
              Global
            </span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Protection Period</CardTitle>
          <Clock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">70 years</div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">After publication</p>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-0.5 rounded-full">
              Long-term
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
