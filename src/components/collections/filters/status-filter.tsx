"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StatusFilter as StatusFilterType } from "@/types/collections-filter";
import { Activity } from "lucide-react";

interface StatusFilterProps {
  onApply: (filter: StatusFilterType) => void;
  currentFilter?: StatusFilterType;
}

export function StatusFilter({ onApply, currentFilter }: StatusFilterProps) {
  const [isActive, setIsActive] = useState<boolean | undefined>(currentFilter?.isActive);
  const [hasItems, setHasItems] = useState<boolean | undefined>(currentFilter?.hasItems);

  const handleApply = () => {
    onApply({
      type: "status",
      isActive,
      hasItems,
    });
  };

  const hasSelection = isActive !== undefined || hasItems !== undefined;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">Filter by Status</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Collection Status</Label>
          <RadioGroup
            value={
              isActive === undefined ? "all" : isActive ? "active" : "inactive"
            }
            onValueChange={(value) =>
              setIsActive(value === "all" ? undefined : value === "active")
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="status-all" />
              <Label htmlFor="status-all" className="font-normal cursor-pointer">
                All
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="active" id="status-active" />
              <Label htmlFor="status-active" className="font-normal cursor-pointer">
                Active Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inactive" id="status-inactive" />
              <Label htmlFor="status-inactive" className="font-normal cursor-pointer">
                Inactive Only
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Has Items</Label>
          <RadioGroup
            value={
              hasItems === undefined ? "all" : hasItems ? "with-items" : "empty"
            }
            onValueChange={(value) =>
              setHasItems(value === "all" ? undefined : value === "with-items")
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="items-all" />
              <Label htmlFor="items-all" className="font-normal cursor-pointer">
                All
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="with-items" id="items-with" />
              <Label htmlFor="items-with" className="font-normal cursor-pointer">
                With Items
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="empty" id="items-empty" />
              <Label htmlFor="items-empty" className="font-normal cursor-pointer">
                Empty
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Button onClick={handleApply} className="w-full" disabled={!hasSelection}>
        Apply Filter
      </Button>
    </div>
  );
}