"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, Search, List, ArrowUpDown, LineChart } from "lucide-react";
import { useCreatorNFTPortfolio } from "@/hooks/contracts/use-mip";
import { PortfolioStats } from "../portfolio-stats";
import { CreatorNFTCard } from "./creator-nft-card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortOption =
  | "price-high"
  | "price-low"
  | "name-asc"
  | "name-desc"
  | "date-new"
  | "date-old";

export interface IP {
  name: string;
  description: string;
  external_url: string;
  image: string;
  attributes: [];
  date?: string;
  tokenId?: BigInt;
}

export default function CreatorNFTPortfolio() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showStats, setShowStats] = useState(true);

  const { metadata, setSortOption, sortOption } = useCreatorNFTPortfolio();

  // Filter metadata based on search query
  const filteredMetadata = useMemo(() => {
    if (!searchQuery.trim()) {
      return metadata;
    }

    const query = searchQuery.toLowerCase().trim();

    return metadata.filter((item) => {
      const name = item.name?.toLowerCase() || "";
      const description = item.description?.toLowerCase() || "";

      return name.includes(query) || description.includes(query);
    });
  }, [metadata, searchQuery]);

  return (
    <div className="space-y-6">
      {showStats && <PortfolioStats useBlockchainData={false} />}

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-[350px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or collection..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowStats(!showStats)}
            className={cn(showStats && "bg-muted")}
          >
            <LineChart className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={sortOption}
                onValueChange={(value) => setSortOption(value as SortOption)}
              >
                <DropdownMenuRadioItem value="name-asc">
                  Name: A to Z
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name-desc">
                  Name: Z to A
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="date-new">
                  Date: Newest First
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="date-old">
                  Date: Oldest First
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Collections</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredMetadata.length === 0 && searchQuery ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                No NFTs match your search for &quot;{searchQuery}&quot;. Try a
                different search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMetadata.map((meta, index) => (
                <CreatorNFTCard
                  tokenId={meta?.tokenId as any}
                  key={index}
                  isFiltered={true}
                  metadata={meta}
                  setMetadata={() => { }}
                  status="Protected"
                />
              ))}
            </div>
          )}
        </TabsContent>


      </Tabs>
    </div>
  );
}
