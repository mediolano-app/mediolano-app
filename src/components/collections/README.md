# Modular Collections Component

A flexible, reusable React component for displaying and filtering Mediolano IP collections from the MIP protocol on Starknet.

## ⚠️ Important Note

This modular component **has replaced** the old `collections-public.tsx` implementation. The legacy file has been preserved as `collections-public-legacy.tsx` for reference only.

## Features

- ✅ **Modular Design**: Easily customizable and reusable
- ✅ **ERC-721 Support**: Full support for Starknet ERC-721 collections
- ✅ **Advanced Filtering**: Filter by user, type, metadata, status with UI panel
- ✅ **Search & Sort**: Real-time search and multiple sort options
- ✅ **Responsive Design**: Mobile-first responsive layout
- ✅ **Accessibility**: WCAG 2.1 compliant with ARIA labels and keyboard navigation
- ✅ **IPFS Metadata**: Automatic parsing of IPFS metadata
- ✅ **View Modes**: Grid and list view options
- ✅ **Filter Panel**: Slide-out sheet with accordion-style filter sections

## Installation

The component is already integrated into the project. No additional installation required.

## Basic Usage

```tsx
import { CollectionsModular } from "@/components/collections/collections-modular";

export default function MyPage() {
  return (
    <CollectionsModular
      enableFiltering={true}
      enableSorting={true}
      enableSearch={true}
    />
  );
}
```

## Props

### `CollectionsModularProps`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialFilters` | `Partial<CollectionFilterState>` | `undefined` | Initial filter state |
| `enableFiltering` | `boolean` | `true` | Enable filtering controls |
| `enableSorting` | `boolean` | `true` | Enable sorting dropdown |
| `enableSearch` | `boolean` | `true` | Enable search input |
| `enableViewToggle` | `boolean` | `true` | Enable grid/list view toggle |
| `featuredCollectionIds` | `string[]` | `[]` | Array of featured collection IDs |
| `className` | `string` | `undefined` | Additional CSS classes |
| `onCollectionClick` | `(id: string) => void` | `undefined` | Callback when collection is clicked |

## Advanced Usage

### With Initial Filters

```tsx
<CollectionsModular
  initialFilters={{
    searchQuery: "Art",
    sortOption: "items-high",
    viewMode: "list",
    activeFilters: [
      {
        type: "type",
        ipTypes: ["Art", "Audio"],
      },
    ],
  }}
/>
```

### With Custom Click Handler

```tsx
<CollectionsModular
  onCollectionClick={(id) => {
    router.push(`/collections/${id}`);
  }}
/>
```

### Minimal Configuration

```tsx
<CollectionsModular
  enableFiltering={false}
  enableSorting={false}
  enableSearch={true}
  enableViewToggle={false}
/>
```

## Filter Types

### User Filter
Filter collections by owner address:

```tsx
{
  type: "user",
  ownerAddress: "0x..."
}
```

### Type Filter
Filter by IP type:

```tsx
{
  type: "type",
  ipTypes: ["Art", "Audio", "Video"]
}
```

### Status Filter
Filter by collection status:

```tsx
{
  type: "status",
  isActive: true,
  hasItems: true
}
```

### Metadata Filter
Filter by custom metadata attributes - the most powerful filter for advanced queries:

```tsx
{
  type: "metadata",
  attributes: {
    visibility: "public",
    enableVersioning: true,
    allowComments: false,
    requireApproval: true
  }
}
```

**How Metadata Filtering Works:**

The metadata filter allows you to query collections based on any attributes stored in their IPFS metadata or collection properties. The filter matches collections where ALL specified attributes match exactly (AND logic).

**Available Metadata Fields:**
- `visibility` (string): "public" or "private"
- `enableVersioning` (boolean): Whether versioning is enabled
- `allowComments` (boolean): Whether comments are allowed
- `requireApproval` (boolean): Whether approval is required
- Any custom field from your IPFS metadata

**Using the Metadata Filter UI:**

1. **Quick Add Common Fields**: Click preset buttons for common metadata fields
2. **Custom Attributes**: Add any custom key-value pairs
   - Enter attribute name (e.g., "category", "verified", "premium")
   - Select type: Text, True/False, or Number
   - Enter the value
3. **Multiple Filters**: Add multiple metadata attributes (all must match)

**Example Use Cases:**

```tsx
// Find all public collections with versioning enabled
{
  type: "metadata",
  attributes: {
    visibility: "public",
    enableVersioning: true
  }
}

// Find premium collections that require approval
{
  type: "metadata",
  attributes: {
    premium: true,
    requireApproval: true
  }
}

// Find collections in a specific category with comments allowed
{
  type: "metadata",
  attributes: {
    category: "Art",
    allowComments: true
  }
}
```

### Date Filter
Filter by date range:

```tsx
{
  type: "date",
  startDate: new Date("2025-01-01"),
  endDate: new Date("2025-12-31")
}
```

## Sort Options

- `name-asc`: Name A to Z
- `name-desc`: Name Z to A
- `date-new`: Newest first
- `date-old`: Oldest first
- `items-high`: Most items first
- `items-low`: Fewest items first
- `value-high`: Highest value first
- `value-low`: Lowest value first

## Modular Data Usage

### Using the Hook Independently

The component is built on a modular architecture, allowing you to use the filtering logic separately from the UI:

```tsx
import { useFilteredCollections } from "@/hooks/use-collections-filtered";

function MyCustomComponent() {
  const {
    collections,          // Filtered and sorted collections
    allCollections,       // Original unfiltered data
    loading,              // Loading state
    error,                // Error state
    filterState,          // Current filter state
    addFilter,            // Add a new filter
    removeFilter,         // Remove a filter by type
    clearAllFilters,      // Clear all filters
    setSearchQuery,       // Set search text
    setSortOption,        // Change sort option
    setViewMode,          // Toggle grid/list
    toggleFeaturedOnly,   // Toggle featured filter
  } = useFilteredCollections();

  return (
    <div>
      {/* Build your own custom UI */}
      <input onChange={(e) => setSearchQuery(e.target.value)} />
      {collections.map(col => <div key={col.id}>{col.name}</div>)}
    </div>
  );
}
```

### Building Custom Filters

Create your own filter UI that uses the hook:

```tsx
function CustomFilterComponent() {
  const { addFilter, filterState } = useFilteredCollections();

  const filterByArtOnly = () => {
    addFilter({
      type: "type",
      ipTypes: ["Art"]
    });
  };

  const filterByActivePublic = () => {
    addFilter({
      type: "metadata",
      attributes: {
        visibility: "public"
      }
    });
    addFilter({
      type: "status",
      isActive: true
    });
  };

  return (
    <div>
      <button onClick={filterByArtOnly}>Show Art Only</button>
      <button onClick={filterByActivePublic}>Active & Public</button>
      <p>Active filters: {filterState.activeFilters.length}</p>
    </div>
  );
}
```

### Programmatic Filtering

Initialize with pre-configured filters:

```tsx
const { collections } = useFilteredCollections({
  searchQuery: "Premium",
  sortOption: "items-high",
  viewMode: "grid",
  activeFilters: [
    {
      type: "metadata",
      attributes: { visibility: "public", enableVersioning: true }
    },
    {
      type: "status",
      isActive: true,
      hasItems: true
    }
  ]
});
```

### Accessing Raw Data

Get unfiltered data for custom processing:

```tsx
const { allCollections, collections, filterState } = useFilteredCollections();

// Compare filtered vs total
const filterRatio = collections.length / allCollections.length;
console.log(`Showing ${filterRatio * 100}% of collections`);

// Custom aggregations
const totalAssets = allCollections.reduce((sum, col) => sum + col.itemCount, 0);
const filteredAssets = collections.reduce((sum, col) => sum + col.itemCount, 0);
```

## Starknet Integration

The component automatically integrates with:

- **Starknet React hooks** for blockchain data
- **IPFS metadata** via Pinata gateway
- **OpenZeppelin Cairo contracts** (ERC-721)
- **MIP Collections Protocol** on Starknet

## Accessibility

The component follows WCAG 2.1 guidelines:

- Keyboard navigation support
- ARIA labels for screen readers
- Focus management
- Semantic HTML structure
- High contrast mode support

## Performance

- **Memoized filtering** for optimal performance
- **Lazy loading** of IPFS metadata
- **Virtual scrolling** for large datasets (planned)
- **Debounced search** to reduce re-renders

## Examples

### Public Collections Page

```tsx
<CollectionsModular
  enableFiltering={true}
  enableSorting={true}
  featuredCollectionIds={["20"]}
/>
```

### User Portfolio

```tsx
<CollectionsModular
  initialFilters={{
    activeFilters: [
      {
        type: "user",
        ownerAddress: userAddress,
      },
    ],
  }}
  enableSearch={false}
/>
```

### Filtered by Type

```tsx
<CollectionsModular
  initialFilters={{
    activeFilters: [
      {
        type: "type",
        ipTypes: ["Art"],
      },
    ],
  }}
/>
```

## Components Structure

```
src/components/collections/
├── collections-modular.tsx       # Main modular component (ACTIVE)
├── collections-public-legacy.tsx # Legacy implementation (DEPRECATED)
├── filters/
│   ├── filter-panel.tsx         # Filter panel with Sheet UI
│   ├── user-filter.tsx          # Filter by user/owner
│   ├── type-filter.tsx          # Filter by IP type
│   └── status-filter.tsx        # Filter by status
└── README.md                     # This file

src/hooks/
└── use-collections-filtered.ts   # Filtering hook

src/types/
└── collections-filter.ts         # Type definitions

src/app/collections/
├── page.tsx                      # Main collections page (uses CollectionsModular)
└── modular/
    └── page.tsx                  # Demo page (can be removed)
```

## Contributing

When adding new filter types:

1. Add type definition to `src/types/collections-filter.ts`
2. Implement filter logic in `useFilteredCollections` hook
3. Create filter UI component in `src/components/collections/filters/`
4. Update this documentation

## Support

For issues or questions:
- GitHub Issues: https://github.com/mediolano-app/mediolano-app/issues
- Telegram: https://t.me/mediolanoapp
- OnlyDust: https://app.onlydust.com/p/mediolano