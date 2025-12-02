export type CollectionFilterType = 'all' | 'user' | 'type' | 'metadata' | 'status' | 'date';

export type CollectionSortOption =
  | 'name-asc'
  | 'name-desc'
  | 'date-new'
  | 'date-old'
  | 'items-high'
  | 'items-low'
  | 'value-high'
  | 'value-low';

export interface UserFilter {
  type: 'user';
  ownerAddress?: string;
}

export interface TypeFilter {
  type: 'type';
  ipTypes: string[];
}

export interface MetadataFilter {
  type: 'metadata';
  attributes: Record<string, string | boolean | number>;
}

export interface StatusFilter {
  type: 'status';
  isActive?: boolean;
  hasItems?: boolean;
}

export interface DateFilter {
  type: 'date';
  startDate?: Date;
  endDate?: Date;
}

export type CollectionFilter =
  | UserFilter
  | TypeFilter
  | MetadataFilter
  | StatusFilter
  | DateFilter;

export interface CollectionFilterState {
  searchQuery: string;
  sortOption: CollectionSortOption;
  activeFilters: CollectionFilter[];
  viewMode: 'grid' | 'list';
  showFeaturedOnly: boolean;
}

export interface FilterComponentProps {
  onFilterChange: (filter: CollectionFilter) => void;
  onRemoveFilter: (filterType: CollectionFilterType) => void;
  activeFilters: CollectionFilter[];
}

export interface CollectionsModularProps {
  initialFilters?: Partial<CollectionFilterState>;
  enableFiltering?: boolean;
  enableSorting?: boolean;
  enableSearch?: boolean;
  enableViewToggle?: boolean;
  featuredCollectionIds?: string[];
  className?: string;
  onCollectionClick?: (collectionId: string) => void;
}