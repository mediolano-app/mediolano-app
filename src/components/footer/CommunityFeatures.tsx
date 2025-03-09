import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Users,
    FileText,
    Banknote,
  } from "lucide-react"

export function CommunityFeatures() {
  return (
    <>

    {/* Community Showcase */}
    <div className="mt-16">
          <h3 className="text-center text-lg font-semibold mb-6">Join Our Thriving Community</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-center flex flex-col items-center">
                  <Users className="h-8 w-8 mb-2" />
                  <span className="text-2xl font-bold">10,000+</span>
                </CardTitle>
                <CardDescription className="text-center">Active Users</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-center flex flex-col items-center">
                  <FileText className="h-8 w-8 mb-2" />
                  <span className="text-2xl font-bold">50,000+</span>
                </CardTitle>
                <CardDescription className="text-center">Registered IPs</CardDescription>
              </CardHeader>
            </Card>
            <Card className="sm:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-center flex flex-col items-center">
                  <Banknote className="h-8 w-8 mb-2" />
                  <span className="text-2xl font-bold">$100M+</span>
                </CardTitle>
                <CardDescription className="text-center">Total Value Locked</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
    
    </>
  )
}