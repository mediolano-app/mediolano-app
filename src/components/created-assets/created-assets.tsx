'use client';

import { useState, useMemo } from 'react';
import { useAccount } from '@starknet-react/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Search,
	Grid,
	List,
	MoreHorizontal,
	Eye,
	Send,
	DollarSign,
	Share2,
	Calendar,
	Coins,
	FileText,
	Image as ImageIcon,
	Music,
	Video,
	Palette,
	Code,
	Package,
	AlertCircle,
	ExternalLink,
	RefreshCw,
	Brain,
	Building,
	BookOpen,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
	useCreatedAssets,
	type CreatedAsset,
	type AssetType,
} from '@/hooks/useCreatedAssets';
import { cn } from '@/lib/utils';

export type SortOption =
	| 'date-desc'
	| 'date-asc'
	| 'name-asc'
	| 'name-desc'
	| 'type-asc'
	| 'type-desc';

interface CreatedAssetsProps {
	className?: string;
	enableFiltering?: boolean;
	enableSorting?: boolean;
	itemsPerPage?: number;
	showStats?: boolean;
}

const assetTypeIcons: Record<AssetType, React.ElementType> = {
	'IP Token': Coins,
	'IP Coin': Coins,
	'Story Chapter': FileText,
	Artwork: Palette,
	Music: Music,
	Video: Video,
	Document: FileText,
	Software: Code,
	Patent: Package,
	'AI Model': Brain,
	NFT: ImageIcon,
	Publication: BookOpen,
	RWA: Building,
	Other: Package,
};

const assetTypeColors: Record<AssetType, string> = {
	'IP Token':
		'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
	'IP Coin':
		'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
	'Story Chapter':
		'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
	Artwork: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
	Music: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
	Video: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
	Document: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
	Software:
		'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
	Patent: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
	'AI Model':
		'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
	NFT: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
	Publication:
		'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-400',
	RWA: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
	Other: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
};

export function CreatedAssets({
	className,
	enableFiltering = true,
	enableSorting = true,
	itemsPerPage = 12,
	showStats = true,
}: CreatedAssetsProps) {
	const { isConnected } = useAccount();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedType, setSelectedType] = useState<AssetType | 'all'>('all');
	const [sortOption, setSortOption] = useState<SortOption>('date-desc');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [currentPage, setCurrentPage] = useState(1);

	const { assets, isLoading, error, stats, refetch } = useCreatedAssets();

	// Filter and sort assets
	const filteredAndSortedAssets = useMemo(() => {
		let filtered = assets;

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(asset: CreatedAsset) =>
					asset.name.toLowerCase().includes(query) ||
					asset.description.toLowerCase().includes(query) ||
					asset.assetType.toLowerCase().includes(query) ||
					asset.tokenId.toLowerCase().includes(query)
			);
		}

		// Apply type filter
		if (selectedType !== 'all') {
			filtered = filtered.filter(
				(asset: CreatedAsset) => asset.assetType === selectedType
			);
		}

		// Apply sorting
		filtered.sort((a: CreatedAsset, b: CreatedAsset) => {
			switch (sortOption) {
				case 'date-desc':
					return (
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);
				case 'date-asc':
					return (
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					);
				case 'name-asc':
					return a.name.localeCompare(b.name);
				case 'name-desc':
					return b.name.localeCompare(a.name);
				case 'type-asc':
					return a.assetType.localeCompare(b.assetType);
				case 'type-desc':
					return b.assetType.localeCompare(a.assetType);
				default:
					return 0;
			}
		});

		return filtered;
	}, [assets, searchQuery, selectedType, sortOption]);

	// Pagination
	const totalPages = Math.ceil(filteredAndSortedAssets.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedAssets = filteredAndSortedAssets.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	// Get unique asset types for filter
	const availableTypes = useMemo(() => {
		const types = new Set(assets.map((asset: CreatedAsset) => asset.assetType));
		return Array.from(types).sort();
	}, [assets]);

	if (!isConnected) {
		return (
			<Card className={className}>
				<CardContent className="flex items-center justify-center p-8">
					<div className="text-center">
						<AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-medium mb-2">Wallet Not Connected</h3>
						<p className="text-muted-foreground">
							Please connect your wallet to view your created assets.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card className={className}>
				<CardContent className="flex items-center justify-center p-8">
					<div className="text-center">
						<AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
						<h3 className="text-lg font-medium mb-2">Error Loading Assets</h3>
						<p className="text-muted-foreground mb-4">{error}</p>
						<Button onClick={() => refetch()} variant="outline">
							<RefreshCw className="h-4 w-4 mr-2" />
							Try Again
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className={cn('space-y-6', className)}>
			{/* Stats Section */}
			{showStats && stats && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Assets
							</CardTitle>
							<Package className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.totalAssets}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Asset Types</CardTitle>
							<Grid className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.uniqueTypes}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Most Recent</CardTitle>
							<Calendar className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-sm font-medium">
								{stats.mostRecentAsset ? (
									<span>{stats.mostRecentAsset?.name || 'None'}</span>
								) : (
									<span className="text-muted-foreground">None</span>
								)}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Active Assets
							</CardTitle>
							<Eye className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.activeAssets}</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Header with Controls */}
			<Card>
				<CardHeader>
					<div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
						<div>
							<CardTitle className="text-xl">Created Assets</CardTitle>
							<p className="text-muted-foreground">
								Digital assets you&apos;ve authored and minted on Starknet
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() =>
									setViewMode(viewMode === 'grid' ? 'list' : 'grid')
								}
							>
								{viewMode === 'grid' ? (
									<List className="h-4 w-4" />
								) : (
									<Grid className="h-4 w-4" />
								)}
							</Button>
							<Button onClick={() => refetch()} variant="outline" size="icon">
								<RefreshCw className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</CardHeader>

				{/* Filters and Search */}
				{enableFiltering && (
					<CardContent className="pt-0">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Search assets..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-9"
								/>
							</div>
							<Select
								value={selectedType}
								onValueChange={(value) =>
									setSelectedType(value as AssetType | 'all')
								}
							>
								<SelectTrigger className="w-full sm:w-[180px]">
									<SelectValue placeholder="Filter by type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Types</SelectItem>
									{availableTypes.map((type: string) => (
										<SelectItem key={type} value={type}>
											{type}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{enableSorting && (
								<Select
									value={sortOption}
									onValueChange={(value) => setSortOption(value as SortOption)}
								>
									<SelectTrigger className="w-full sm:w-[180px]">
										<SelectValue placeholder="Sort by" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="date-desc">Newest First</SelectItem>
										<SelectItem value="date-asc">Oldest First</SelectItem>
										<SelectItem value="name-asc">Name A-Z</SelectItem>
										<SelectItem value="name-desc">Name Z-A</SelectItem>
										<SelectItem value="type-asc">Type A-Z</SelectItem>
										<SelectItem value="type-desc">Type Z-A</SelectItem>
									</SelectContent>
								</Select>
							)}
						</div>
					</CardContent>
				)}
			</Card>

			{/* Assets Grid/List */}
			<div className="space-y-4">
				{isLoading ? (
					<div
						className={cn(
							'grid gap-4',
							viewMode === 'grid'
								? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
								: 'grid-cols-1'
						)}
					>
						{Array.from({ length: itemsPerPage }).map((_, i) => (
							<Card key={i}>
								<CardContent className="p-4">
									<div className="space-y-3">
										<Skeleton className="h-48 w-full rounded-lg" />
										<Skeleton className="h-4 w-3/4" />
										<Skeleton className="h-3 w-1/2" />
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				) : paginatedAssets.length === 0 ? (
					<Card>
						<CardContent className="flex items-center justify-center p-8">
							<div className="text-center">
								<Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
								<h3 className="text-lg font-medium mb-2">No Assets Found</h3>
								<p className="text-muted-foreground mb-4">
									{searchQuery || selectedType !== 'all'
										? 'No assets match your search criteria.'
										: "You haven't created any assets yet."}
								</p>
								<Button asChild>
									<Link href="/create">Create Your First Asset</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				) : (
					<Tabs
						value={viewMode}
						onValueChange={(value) => setViewMode(value as 'grid' | 'list')}
					>
						<TabsContent value="grid" className="mt-0">
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
								{paginatedAssets.map((asset: CreatedAsset) => (
									<AssetCard key={asset.id} asset={asset} />
								))}
							</div>
						</TabsContent>
						<TabsContent value="list" className="mt-0">
							<div className="space-y-4">
								{paginatedAssets.map((asset: CreatedAsset) => (
									<AssetListItem key={asset.id} asset={asset} />
								))}
							</div>
						</TabsContent>
					</Tabs>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex items-center justify-center gap-2">
						<Button
							variant="outline"
							disabled={currentPage === 1}
							onClick={() => setCurrentPage(currentPage - 1)}
						>
							Previous
						</Button>
						<span className="text-sm text-muted-foreground">
							Page {currentPage} of {totalPages}
						</span>
						<Button
							variant="outline"
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage(currentPage + 1)}
						>
							Next
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

function AssetCard({ asset }: { asset: CreatedAsset }) {
	const IconComponent = assetTypeIcons[asset.assetType];

	// Format creation date
	const formatDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
		} catch {
			return 'Unknown date';
		}
	};

	// Get blockchain explorer URL
	const getExplorerUrl = () => {
		const baseUrl = 'https://sepolia.starkscan.co'; // Adjust based on network
		return `${baseUrl}/contract/${asset.contractAddress}#read-write-contract-sub-write`;
	};

	return (
		<Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
			<div className="relative">
				<div className="aspect-square overflow-hidden bg-muted/30">
					{asset.image && asset.image !== '/placeholder.svg' ? (
						<Image
							src={asset.image}
							alt={asset.name}
							width={300}
							height={300}
							className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
							onError={(e) => {
								// Fallback to icon if image fails to load
								const target = e.target as HTMLImageElement;
								target.style.display = 'none';
								target.nextElementSibling?.classList.remove('hidden');
							}}
						/>
					) : null}
					<div
						className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/60 ${
							asset.image && asset.image !== '/placeholder.svg' ? 'hidden' : ''
						}`}
					>
						<IconComponent className="h-16 w-16 text-muted-foreground/60" />
					</div>
				</div>
				<div className="absolute top-2 left-2">
					<Badge
						className={cn(
							'text-xs font-medium',
							assetTypeColors[asset.assetType]
						)}
					>
						{asset.assetType}
					</Badge>
				</div>
				{!asset.isActive && (
					<div className="absolute top-2 right-2">
						<Badge variant="secondary" className="text-xs">
							Inactive
						</Badge>
					</div>
				)}
			</div>
			<CardContent className="p-4">
				<div className="space-y-3">
					<div className="flex items-start justify-between">
						<div className="flex-1 min-w-0">
							<h3
								className="font-semibold text-sm line-clamp-1 mb-1"
								title={asset.name}
							>
								{asset.name}
							</h3>
							<p className="text-xs text-muted-foreground line-clamp-2 mb-2">
								{asset.description}
							</p>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 flex-shrink-0"
								>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem asChild>
									<Link href={`/asset/${asset.tokenId}`}>
										<Eye className="h-4 w-4 mr-2" />
										View Details
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href={`/transfer?asset=${asset.tokenId}`}>
										<Send className="h-4 w-4 mr-2" />
										Transfer
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href={`/licensing?asset=${asset.tokenId}`}>
										<DollarSign className="h-4 w-4 mr-2" />
										License & Monetize
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Share2 className="h-4 w-4 mr-2" />
									Share
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link
										href={getExplorerUrl()}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLink className="h-4 w-4 mr-2" />
										View on Starknet
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Metadata section */}
					<div className="space-y-2 text-xs text-muted-foreground">
						<div className="flex items-center justify-between">
							<span>Token #{asset.tokenId}</span>
							<span className="text-primary font-medium">
								{asset.tokenStandard}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span>Created</span>
							<span>{formatDate(asset.createdAt)}</span>
						</div>
					</div>

					{/* Action buttons */}
					<div className="flex gap-2 pt-2">
						<Button asChild size="sm" variant="outline" className="flex-1">
							<Link href={`/asset/${asset.tokenId}`}>
								<Eye className="h-3 w-3 mr-1" />
								View
							</Link>
						</Button>
						<Button asChild size="sm" variant="outline" className="flex-1">
							<Link href={`/licensing?asset=${asset.tokenId}`}>
								<DollarSign className="h-3 w-3 mr-1" />
								License
							</Link>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function AssetListItem({ asset }: { asset: CreatedAsset }) {
	const IconComponent = assetTypeIcons[asset.assetType];

	// Format creation date
	const formatDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
		} catch {
			return 'Unknown date';
		}
	};

	// Get blockchain explorer URL
	const getExplorerUrl = () => {
		const baseUrl = 'https://sepolia.starkscan.co'; // Adjust based on network
		return `${baseUrl}/contract/${asset.contractAddress}#read-write-contract-sub-write`;
	};

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardContent className="p-4">
				<div className="flex items-center gap-4">
					<div className="w-16 h-16 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
						{asset.image && asset.image !== '/placeholder.svg' ? (
							<Image
								src={asset.image}
								alt={asset.name}
								width={64}
								height={64}
								className="w-full h-full object-cover"
								onError={(e) => {
									// Fallback to icon if image fails to load
									const target = e.target as HTMLImageElement;
									target.style.display = 'none';
									target.nextElementSibling?.classList.remove('hidden');
								}}
							/>
						) : null}
						<div
							className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/60 ${
								asset.image && asset.image !== '/placeholder.svg'
									? 'hidden'
									: ''
							}`}
						>
							<IconComponent className="h-8 w-8 text-muted-foreground/60" />
						</div>
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-2">
							<h3 className="font-semibold text-sm truncate">{asset.name}</h3>
							<Badge
								className={cn(
									'text-xs font-medium',
									assetTypeColors[asset.assetType]
								)}
							>
								{asset.assetType}
							</Badge>
							{!asset.isActive && (
								<Badge variant="secondary" className="text-xs">
									Inactive
								</Badge>
							)}
						</div>
						<p className="text-sm text-muted-foreground line-clamp-2 mb-2">
							{asset.description}
						</p>
						<div className="flex items-center gap-6 text-xs text-muted-foreground">
							<span className="flex items-center gap-1">
								<span className="font-medium">Token:</span>#{asset.tokenId}
							</span>
							<span className="flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								{formatDate(asset.createdAt)}
							</span>
							<span className="flex items-center gap-1">
								<span className="font-medium">Standard:</span>
								{asset.tokenStandard}
							</span>
						</div>
					</div>
					<div className="flex items-center gap-2 flex-shrink-0">
						<Button variant="outline" size="sm" asChild>
							<Link href={`/asset/${asset.tokenId}`}>
								<Eye className="h-4 w-4 mr-1" />
								View
							</Link>
						</Button>
						<Button variant="outline" size="sm" asChild>
							<Link href={`/licensing?asset=${asset.tokenId}`}>
								<DollarSign className="h-4 w-4 mr-1" />
								License
							</Link>
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem asChild>
									<Link href={`/transfer?asset=${asset.tokenId}`}>
										<Send className="h-4 w-4 mr-2" />
										Transfer Asset
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Share2 className="h-4 w-4 mr-2" />
									Share Asset
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link
										href={getExplorerUrl()}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLink className="h-4 w-4 mr-2" />
										View on Starknet
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
