'use client';

import { CreatedAssets } from '@/components/created-assets';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';

export default function CreatedAssetsPage() {
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto p-4 py-8">
				{/* Header */}
				<div className="flex items-center gap-4 mb-8">
					<Button variant="ghost" size="sm" asChild>
						<Link href="/portfolio">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Portfolio
						</Link>
					</Button>
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-2">
							<h1 className="text-3xl font-bold">Created Assets</h1>
							<Badge variant="secondary" className="text-xs">
								Beta
							</Badge>
						</div>
						<p className="text-muted-foreground">
							View and manage all the digital assets you&apos;ve created and
							minted on Starknet
						</p>
					</div>
				</div>

				{/* Info Card */}
				<Card className="mb-8 border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-900/10">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
							<Info className="h-5 w-5" />
							About Created Assets
						</CardTitle>
						<CardDescription className="text-blue-800 dark:text-blue-200">
							This component queries your connected wallet on Starknet to
							display all intellectual property assets you&apos;ve authored,
							including IP Tokens, NFTs, Story Chapters, and more.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<h4 className="font-medium mb-2">Features:</h4>
								<ul className="list-disc list-inside space-y-1 text-xs">
									<li>Real-time blockchain data fetching</li>
									<li>Asset type categorization</li>
									<li>Metadata and preview display</li>
									<li>Grid and list view modes</li>
									<li>Search and filtering capabilities</li>
									<li>Quick action buttons</li>
								</ul>
							</div>
							<div>
								<h4 className="font-medium mb-2">Supported Asset Types:</h4>
								<ul className="list-disc list-inside space-y-1 text-xs">
									<li>IP Tokens & IP Coins</li>
									<li>Story Chapters & Publications</li>
									<li>Artwork, Music & Video</li>
									<li>Software & AI Models</li>
									<li>Patents & Documents</li>
									<li>NFTs & RWA Assets</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Main Component */}
				<CreatedAssets
					className="w-full"
					enableFiltering={true}
					enableSorting={true}
					itemsPerPage={12}
					showStats={true}
				/>

				{/* Technical Notes */}
				<Card className="mt-8 border-gray-200 bg-gray-50/30 dark:border-gray-800 dark:bg-gray-900/10">
					<CardHeader>
						<CardTitle className="text-gray-900 dark:text-gray-100 text-lg">
							Technical Implementation
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
									Blockchain Integration:
								</h4>
								<ul className="space-y-1 text-xs">
									<li>• Connects to Starknet via @starknet-react/core</li>
									<li>• Queries user tokens from smart contracts</li>
									<li>• Fetches metadata from IPFS/tokenURI</li>
									<li>• Real-time data synchronization</li>
								</ul>
							</div>
							<div>
								<h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
									Component Features:
								</h4>
								<ul className="space-y-1 text-xs">
									<li>• TypeScript with full type safety</li>
									<li>• Responsive design with Tailwind CSS</li>
									<li>• shadcn/ui component integration</li>
									<li>• Modular and reusable architecture</li>
								</ul>
							</div>
						</div>
						<div className="pt-4 border-t border-gray-200 dark:border-gray-800">
							<p className="text-xs text-gray-600 dark:text-gray-400">
								<strong>Note:</strong> This component automatically detects and
								categorizes different types of intellectual property assets
								based on their metadata and properties. Asset actions (transfer,
								license, monetize) are integrated with the existing Mediolano
								ecosystem.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
