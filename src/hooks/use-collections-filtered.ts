import { useState, useCallback, useMemo, useEffect } from "react";
import { Collection } from "@/lib/types";
import { useGetAllCollections } from "./use-collection";
import type {
  CollectionFilter,
  CollectionSortOption,
  CollectionFilterState,
} from "@/types/collections-filter";

export function useFilteredCollections(initialState?: Partial<CollectionFilterState>) {
  const { collections: allCollections, loading, error, reload } = useGetAllCollections();

  const [filterState, setFilterState] = useState<CollectionFilterState>({
    searchQuery: initialState?.searchQuery || "",
    sortOption: initialState?.sortOption || "date-new",
    activeFilters: initialState?.activeFilters || [],
    viewMode: initialState?.viewMode || "grid",
    showFeaturedOnly: initialState?.showFeaturedOnly || false,
  });

  const applyFilters = useCallback(
    (collections: Collection[]): Collection[] => {
      let filtered = [...collections];

      if (filterState.searchQuery) {
        const query = filterState.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (col) =>
            col.name.toLowerCase().includes(query) ||
            col.description.toLowerCase().includes(query) ||
            col.symbol?.toLowerCase().includes(query)
        );
      }

      filterState.activeFilters.forEach((filter) => {
        switch (filter.type) {
          case "user":
            if (filter.ownerAddress) {
              filtered = filtered.filter(
                (col) => col.owner.toLowerCase() === filter.ownerAddress?.toLowerCase()
              );
            }
            break;

          case "type":
            if (filter.ipTypes.length > 0) {
              filtered = filtered.filter(
                (col) => col.type && filter.ipTypes.includes(col.type)
              );
            }
            break;

          case "metadata":
            filtered = filtered.filter((col) => {
              return Object.entries(filter.attributes).every(([key, value]) => {
                const colValue = (col as any)[key];
                return colValue === value;
              });
            });
            break;

          case "status":
            if (filter.isActive !== undefined) {
              filtered = filtered.filter((col) => col.isActive === filter.isActive);
            }
            if (filter.hasItems !== undefined) {
              filtered = filtered.filter((col) =>
                filter.hasItems ? col.itemCount > 0 : col.itemCount === 0
              );
            }
            break;

          case "date":
            if (filter.startDate || filter.endDate) {
              filtered = filtered.filter((col) => {
                const colDate = new Date(col.lastMintTime);
                if (filter.startDate && colDate < filter.startDate) return false;
                if (filter.endDate && colDate > filter.endDate) return false;
                return true;
              });
            }
            break;
        }
      });

      return filtered;
    },
    [filterState.searchQuery, filterState.activeFilters]
  );

  const applySorting = useCallback(
    (collections: Collection[]): Collection[] => {
      const sorted = [...collections];

      switch (filterState.sortOption) {
        case "name-asc":
          return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case "name-desc":
          return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case "date-new":
          return sorted.sort(
            (a, b) =>
              new Date(b.lastMintTime).getTime() - new Date(a.lastMintTime).getTime()
          );
        case "date-old":
          return sorted.sort(
            (a, b) =>
              new Date(a.lastMintTime).getTime() - new Date(b.lastMintTime).getTime()
          );
        case "items-high":
          return sorted.sort((a, b) => b.itemCount - a.itemCount);
        case "items-low":
          return sorted.sort((a, b) => a.itemCount - b.itemCount);
        case "value-high":
          return sorted.sort((a, b) => (b.floorPrice || 0) - (a.floorPrice || 0));
        case "value-low":
          return sorted.sort((a, b) => (a.floorPrice || 0) - (b.floorPrice || 0));
        default:
          return sorted;
      }
    },
    [filterState.sortOption]
  );

  const filteredAndSortedCollections = useMemo(() => {
    const filtered = applyFilters(allCollections);
    return applySorting(filtered);
  }, [allCollections, applyFilters, applySorting]);

  const addFilter = useCallback((filter: CollectionFilter) => {
    setFilterState((prev) => {
      const withoutSameType = prev.activeFilters.filter((f) => f.type !== filter.type);
      return {
        ...prev,
        activeFilters: [...withoutSameType, filter],
      };
    });
  }, []);

  const removeFilter = useCallback((filterType: string) => {
    setFilterState((prev) => ({
      ...prev,
      activeFilters: prev.activeFilters.filter((f) => f.type !== filterType),
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilterState((prev) => ({
      ...prev,
      searchQuery: "",
      activeFilters: [],
      showFeaturedOnly: false,
    }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setSortOption = useCallback((option: CollectionSortOption) => {
    setFilterState((prev) => ({ ...prev, sortOption: option }));
  }, []);

  const setViewMode = useCallback((mode: "grid" | "list") => {
    setFilterState((prev) => ({ ...prev, viewMode: mode }));
  }, []);

  const toggleFeaturedOnly = useCallback(() => {
    setFilterState((prev) => ({ ...prev, showFeaturedOnly: !prev.showFeaturedOnly }));
  }, []);

  return {
    collections: filteredAndSortedCollections,
    allCollections,
    loading,
    error,
    reload,
    filterState,
    addFilter,
    removeFilter,
    clearAllFilters,
    setSearchQuery,
    setSortOption,
    setViewMode,
    toggleFeaturedOnly,
  };
}