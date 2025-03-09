import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Book, FileCheck, Lock } from "lucide-react"

export function CommunityFeatures() {
    return (
      <>
                
                {/* Educational Resources */}
            <div className="mt-16">
            <h3 className="text-center text-lg font-semibold mb-6">Learn More About Programmable IP</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Book className="h-5 w-5" />
                    <span>Blockchain Basics</span>
                </CardTitle>
                <CardDescription>Understand the fundamentals of blockchain technology</CardDescription>
                </CardHeader>
                <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>What is blockchain?</li>
                    <li>How does decentralization work?</li>
                    <li>Introduction to smart contracts</li>
                </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>Zero-Knowledge Proofs</span>
                </CardTitle>
                <CardDescription>Explore the power of privacy in blockchain</CardDescription>
                </CardHeader>
                <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Understanding ZK-SNARKs</li>
                    <li>Privacy vs. Transparency</li>
                    <li>Use cases in IP management</li>
                </ul>
                </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <FileCheck className="h-5 w-5" />
                    <span>IP on the Blockchain</span>
                </CardTitle>
                <CardDescription>Learn how Mediolano revolutionizes IP management</CardDescription>
                </CardHeader>
                <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Tokenization of intellectual property</li>
                    <li>Automated licensing and royalties</li>
                    <li>Global collaboration and distribution</li>
                </ul>
                </CardContent>
            </Card>
            </div>
            </div>

</>
  )
}