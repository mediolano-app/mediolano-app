"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TypeFilter as TypeFilterType } from "@/types/collections-filter";
import { ALLOWED_IP_TYPES } from "@/lib/constants";
import { FileType } from "lucide-react";

interface TypeFilterProps {
  onApply: (filter: TypeFilterType) => void;
  currentFilter?: TypeFilterType;
}

export function TypeFilter({ onApply, currentFilter }: TypeFilterProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    currentFilter?.ipTypes || []
  );

  const handleToggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleApply = () => {
    if (selectedTypes.length > 0) {
      onApply({
        type: "type",
        ipTypes: selectedTypes,
      });
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <FileType className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">Filter by IP Type</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
        {ALLOWED_IP_TYPES.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox
              id={`type-${type}`}
              checked={selectedTypes.includes(type)}
              onCheckedChange={() => handleToggleType(type)}
            />
            <Label
              htmlFor={`type-${type}`}
              className="text-sm font-normal cursor-pointer"
            >
              {type}
            </Label>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setSelectedTypes([])}
          className="flex-1"
        >
          Clear
        </Button>
        <Button onClick={handleApply} className="flex-1" disabled={selectedTypes.length === 0}>
          Apply ({selectedTypes.length})
        </Button>
      </div>
    </div>
  );
}