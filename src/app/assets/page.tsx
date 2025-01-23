'use client';

import { useAccount } from '@starknet-react/core';
import NFTCard from '@/components/NFTCard';
import { useEffect, useState } from 'react';
import { Pagination } from '@/components/pagination';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAssets } from '@/hooks/useAssets';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectWallet } from "@/components/ConnectWallet";

export default function AssetsPage() {
    const { address } = useAccount();
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const {
        assets,
        loading,
        error,
        totalAssets,
        fetchAssets,
        isTestData
    } = useAssets({ useTestData: true });

    useEffect(() => {
        fetchAssets(currentPage);
    }, [fetchAssets, currentPage]);

    const filteredAssets = assets.filter(asset =>
        asset.id.toLowerCase().includes(search.toLowerCase()) ||
        (asset.name?.toLowerCase() || '').includes(search.toLowerCase())
    );

    const sortedAssets = [...filteredAssets].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return Number(b.id) - Number(a.id);
            case 'oldest':
                return Number(a.id) - Number(b.id);
            case 'name':
                return (a.name || '').localeCompare(b.name || '');
            default:
                return 0;
        }
    });

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold">Assets Gallery</h1>
                    {!address && (
                        <ConnectWallet />
                    )}
                </div>
                <div className="flex gap-4">
                    <Input
                        placeholder="Search by ID or name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64"
                    />
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {!address && (
                <Alert className="mb-6">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Viewing Sample Data</AlertTitle>
                    <AlertDescription className="flex items-center justify-between">
                        <span>Currently viewing sample assets. Connect your wallet to see your actual assets.</span>
                        <ConnectWallet />
                    </AlertDescription>
                </Alert>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            ) : sortedAssets.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">No Assets Found</h3>
                    <p className="text-gray-600">
                        {search
                            ? "No assets match your search criteria. Try adjusting your search terms."
                            : "No assets available at the moment."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedAssets.map((asset) => (
                            <NFTCard
                                key={asset.id}
                                tokenId={asset.id}
                                imageUrl={asset.uri}
                                name={asset.name || `Asset #${asset.id}`}
                                owner={asset.owner}
                            />
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(totalAssets / 12)}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </>
            )}
        </div>
    );
} 