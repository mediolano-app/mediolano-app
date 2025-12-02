"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserFilter as UserFilterType } from "@/types/collections-filter";
import { User } from "lucide-react";

interface UserFilterProps {
  onApply: (filter: UserFilterType) => void;
  currentFilter?: UserFilterType;
}

export function UserFilter({ onApply, currentFilter }: UserFilterProps) {
  const [ownerAddress, setOwnerAddress] = useState(currentFilter?.ownerAddress || "");

  const handleApply = () => {
    if (ownerAddress.trim()) {
      onApply({
        type: "user",
        ownerAddress: ownerAddress.trim(),
      });
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">Filter by Owner</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="owner-address">Owner Address</Label>
        <Input
          id="owner-address"
          placeholder="0x..."
          value={ownerAddress}
          onChange={(e) => setOwnerAddress(e.target.value)}
        />
      </div>

      <Button onClick={handleApply} className="w-full" disabled={!ownerAddress.trim()}>
        Apply Filter
      </Button>
    </div>
  );
}