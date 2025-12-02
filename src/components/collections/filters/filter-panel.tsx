"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Filter, X } from "lucide-react";
import { UserFilter } from "./user-filter";
import { TypeFilter } from "./type-filter";
import { StatusFilter } from "./status-filter";
import { MetadataFilter } from "./metadata-filter";
import type { CollectionFilter } from "@/types/collections-filter";

interface FilterPanelProps {
  activeFilters: CollectionFilter[];
  onApplyFilter: (filter: CollectionFilter) => void;
  onRemoveFilter: (filterType: string) => void;
  onClearAll: () => void;
}

export function FilterPanel({
  activeFilters,
  onApplyFilter,
  onRemoveFilter,
  onClearAll,
}: FilterPanelProps) {
  const [open, setOpen] = useState(false);

  const getActiveFilterCount = () => activeFilters.length;

  const getFilterLabel = (filter: CollectionFilter): string => {
    switch (filter.type) {
      case "user":
        return `Owner: ${filter.ownerAddress?.slice(0, 6)}...${filter.ownerAddress?.slice(-4)}`;
      case "type":
        return `Type: ${filter.ipTypes.join(", ")}`;
      case "status":
        const parts = [];
        if (filter.isActive !== undefined) {
          parts.push(filter.isActive ? "Active" : "Inactive");
        }
        if (filter.hasItems !== undefined) {
          parts.push(filter.hasItems ? "Has Items" : "Empty");
        }
        return `Status: ${parts.join(", ")}`;
      case "metadata":
        return `Metadata: ${Object.keys(filter.attributes).length} filters`;
      case "date":
        return "Date Range";
      default:
        return filter.type;
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-1 rounded-full px-2">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filter Collections</SheetTitle>
          <SheetDescription>
            Apply filters to narrow down your collection search
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Active Filters</span>
              <Button variant="ghost" size="sm" onClick={onClearAll}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  <span className="text-xs">{getFilterLabel(filter)}</span>
                  <button
                    onClick={() => onRemoveFilter(filter.type)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    aria-label={`Remove ${filter.type} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Filter Options */}
        <ScrollArea className="h-[calc(100vh-280px)] pr-4">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="owner">
              <AccordionTrigger className="text-sm font-medium">
                Filter by Owner
              </AccordionTrigger>
              <AccordionContent>
                <UserFilter
                  onApply={(filter) => {
                    onApplyFilter(filter);
                    setOpen(false);
                  }}
                  currentFilter={activeFilters.find((f) => f.type === "user") as any}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="type">
              <AccordionTrigger className="text-sm font-medium">
                Filter by IP Type
              </AccordionTrigger>
              <AccordionContent>
                <TypeFilter
                  onApply={(filter) => {
                    onApplyFilter(filter);
                    setOpen(false);
                  }}
                  currentFilter={activeFilters.find((f) => f.type === "type") as any}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="status">
              <AccordionTrigger className="text-sm font-medium">
                Filter by Status
              </AccordionTrigger>
              <AccordionContent>
                <StatusFilter
                  onApply={(filter) => {
                    onApplyFilter(filter);
                    setOpen(false);
                  }}
                  currentFilter={activeFilters.find((f) => f.type === "status") as any}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="metadata">
              <AccordionTrigger className="text-sm font-medium">
                Filter by Metadata
              </AccordionTrigger>
              <AccordionContent>
                <MetadataFilter
                  onApply={(filter) => {
                    onApplyFilter(filter);
                    setOpen(false);
                  }}
                  currentFilter={activeFilters.find((f) => f.type === "metadata") as any}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>

        <SheetFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="w-full">
            Done
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
