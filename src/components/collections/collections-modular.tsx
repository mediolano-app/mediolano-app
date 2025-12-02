"use client";

import { useState, useMemo } from "react";
import { useFilteredCollections } from "@/hooks/use-collections-filtered";
import { CollectionCard } from "@/components/collection-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Grid,
  List,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Star,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CollectionsModularProps } from "@/types/collections-filter";
import { ReportAssetDialog } from "@/components/report-asset-dialog";
import { FilterPanel } from "@/components/collections/filters/filter-panel";

export function CollectionsModular({
  initialFilters,
  enableFiltering = true,
  enableSorting = true,
  enableSearch = true,
  enableViewToggle = true,
  featuredCollectionIds = [],
  className,
  onCollectionClick,
}: CollectionsModularProps) {
  const {
    collections,
    loading,
    error,
    filterState,
    addFilter,
    removeFilter,
    clearAllFilters,
    setSearchQuery,
    setSortOption,
    setViewMode,
    toggleFeaturedOnly,
  } = useFilteredCollections(initialFilters);

  const [reportDialogState, setReportDialogState] = useState<{
    isOpen: boolean;
    collectionId: string;
    collectionName: string;
  }>({
    isOpen: false,
    collectionId: "",
    collectionName: "",
  });

  // Memoized sort icon to prevent unnecessary re-renders
  const sortIcon = useMemo(() => {
    if (
      filterState.sortOption.includes("high") ||
      filterState.sortOption.includes("desc") ||
      filterState.sortOption === "date-new"
    ) {
      return <ArrowDown className="h-4 w-4" />;
    }
    return <ArrowUp className="h-4 w-4" />;
  }, [filterState.sortOption]);

  const handleCollectionClick = (collectionId: string) => {
    onCollectionClick?.(collectionId);
  };

  // Check if there are any active filters
  const hasActiveFilters =
    filterState.activeFilters.length > 0 ||
    filterState.searchQuery ||
    filterState.showFeaturedOnly;

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive font-semibold">Error loading collections</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filters and Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        {/* Search */}
        {enableSearch && (
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search collections..."
              className="pl-8"
              value={filterState.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search collections"
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          {/* View Toggle */}
          {enableViewToggle && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(filterState.viewMode === "grid" ? "list" : "grid")}
              aria-label={`Switch to ${filterState.viewMode === "grid" ? "list" : "grid"} view`}
            >
              {filterState.viewMode === "grid" ? (
                <List className="h-4 w-4" />
              ) : (
                <Grid className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Featured Filter */}
          {enableFiltering && featuredCollectionIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFeaturedOnly}
              className={cn(
                filterState.showFeaturedOnly && "bg-yellow-500/10 border-yellow-500/50"
              )}
              aria-pressed={filterState.showFeaturedOnly}
              aria-label="Toggle featured collections"
            >
              <Star
                className={cn(
                  "h-4 w-4 mr-1",
                  filterState.showFeaturedOnly && "fill-yellow-500 text-yellow-500"
                )}
              />
              Featured
            </Button>
          )}

          {/* Advanced Filters Panel */}
          {enableFiltering && (
            <FilterPanel
              activeFilters={filterState.activeFilters}
              onApplyFilter={addFilter}
              onRemoveFilter={removeFilter}
              onClearAll={clearAllFilters}
            />
          )}

          {/* Sort Dropdown */}
          {enableSorting && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  <span className="hidden xs:inline">Sort</span>
                  {sortIcon}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={filterState.sortOption}
                  onValueChange={(value: any) => setSortOption(value)}
                >
                  <DropdownMenuRadioItem value="date-new">
                    Date: Newest First
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="date-old">
                    Date: Oldest First
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name-asc">Name: A to Z</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name-desc">Name: Z to A</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="items-high">
                    Items: High to Low
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="items-low">
                    Items: Low to High
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="value-high">
                    Value: High to Low
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="value-low">
                    Value: Low to High
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {loading ? (
            "Loading..."
          ) : (
            <>
              Showing {collections.length} collection{collections.length !== 1 ? "s" : ""}
              {hasActiveFilters && " (filtered)"}
            </>
          )}
        </span>
        {hasActiveFilters && !loading && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-auto p-0 text-sm hover:text-primary"
          >
            Clear all filters
          </Button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!loading && collections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No collections found matching your criteria</p>
          {(filterState.activeFilters.length > 0 || filterState.searchQuery) && (
            <Button variant="link" onClick={clearAllFilters} className="mt-2">
              Clear filters to see all collections
            </Button>
          )}
        </div>
      )}

      {/* Collections Grid/List */}
      {!loading && collections.length > 0 && (
        <div
          className={cn(
            filterState.viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          )}
          role="list"
          aria-label="Collections list"
        >
          {collections.map((collection, index) => (
            <CollectionCard
              key={String(collection.id)}
              collection={collection}
              index={index}
              onClick={() => handleCollectionClick(String(collection.id))}
            />
          ))}
        </div>
      )}

      {/* Report Dialog */}
      <ReportAssetDialog
        contentId={reportDialogState.collectionId}
        contentName={reportDialogState.collectionName}
        contentType="collection"
        open={reportDialogState.isOpen}
        onOpenChange={(open) =>
          setReportDialogState((prev) => ({ ...prev, isOpen: open }))
        }
      />
    </div>
  );
}