"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MetadataFilter as MetadataFilterType } from "@/types/collections-filter";
import { Database, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MetadataFilterProps {
  onApply: (filter: MetadataFilterType) => void;
  currentFilter?: MetadataFilterType;
}

type AttributeValue = string | boolean | number;

interface MetadataAttribute {
  key: string;
  value: AttributeValue;
  type: "string" | "boolean" | "number";
}

export function MetadataFilter({ onApply, currentFilter }: MetadataFilterProps) {
  const [attributes, setAttributes] = useState<MetadataAttribute[]>(() => {
    if (currentFilter?.attributes) {
      return Object.entries(currentFilter.attributes).map(([key, value]) => ({
        key,
        value,
        type: typeof value as "string" | "boolean" | "number",
      }));
    }
    return [];
  });

  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newType, setNewType] = useState<"string" | "boolean" | "number">("string");

  const addAttribute = () => {
    if (!newKey.trim()) return;

    let processedValue: AttributeValue;
    if (newType === "boolean") {
      processedValue = newValue.toLowerCase() === "true";
    } else if (newType === "number") {
      processedValue = parseFloat(newValue) || 0;
    } else {
      processedValue = newValue;
    }

    setAttributes([...attributes, { key: newKey, value: processedValue, type: newType }]);
    setNewKey("");
    setNewValue("");
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    if (attributes.length === 0) return;

    const attributesObj: Record<string, AttributeValue> = {};
    attributes.forEach((attr) => {
      attributesObj[attr.key] = attr.value;
    });

    onApply({
      type: "metadata",
      attributes: attributesObj,
    });
  };

  // Common metadata fields for quick selection
  const commonFields = [
    { key: "visibility", value: "public", type: "string" as const },
    { key: "enableVersioning", value: true, type: "boolean" as const },
    { key: "allowComments", value: true, type: "boolean" as const },
    { key: "requireApproval", value: false, type: "boolean" as const },
  ];

  const addCommonField = (field: typeof commonFields[0]) => {
    if (attributes.some((a) => a.key === field.key)) return;
    setAttributes([...attributes, field]);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">Filter by Metadata</h3>
      </div>

      {/* Common Fields Quick Add */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Quick Add Common Fields</Label>
        <div className="flex flex-wrap gap-2">
          {commonFields.map((field) => (
            <Button
              key={field.key}
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => addCommonField(field)}
              disabled={attributes.some((a) => a.key === field.key)}
            >
              <Plus className="h-3 w-3 mr-1" />
              {field.key}
            </Button>
          ))}
        </div>
      </div>

      {/* Current Attributes */}
      {attributes.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Active Attributes</Label>
          <div className="flex flex-wrap gap-2">
            {attributes.map((attr, index) => (
              <Badge key={index} variant="secondary" className="gap-1 pr-1">
                <span className="text-xs">
                  {attr.key}: {String(attr.value)}
                </span>
                <button
                  onClick={() => removeAttribute(index)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Custom Attribute Input */}
      <div className="space-y-3 border-t pt-3">
        <Label className="text-xs text-muted-foreground">Add Custom Attribute</Label>

        <div className="space-y-2">
          <div>
            <Label htmlFor="attr-key" className="text-xs">
              Attribute Name
            </Label>
            <Input
              id="attr-key"
              placeholder="e.g., category, verified, minPrice"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          <div>
            <Label htmlFor="attr-type" className="text-xs">
              Type
            </Label>
            <select
              id="attr-type"
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              className="w-full h-8 px-3 text-sm rounded-md border border-input bg-background"
            >
              <option value="string">Text</option>
              <option value="boolean">True/False</option>
              <option value="number">Number</option>
            </select>
          </div>

          <div>
            <Label htmlFor="attr-value" className="text-xs">
              Value
            </Label>
            {newType === "boolean" ? (
              <div className="flex items-center space-x-2 h-8">
                <Switch
                  id="attr-value-bool"
                  checked={newValue === "true"}
                  onCheckedChange={(checked) => setNewValue(checked ? "true" : "false")}
                />
                <Label htmlFor="attr-value-bool" className="text-sm">
                  {newValue === "true" ? "True" : "False"}
                </Label>
              </div>
            ) : (
              <Input
                id="attr-value"
                type={newType === "number" ? "number" : "text"}
                placeholder={newType === "number" ? "e.g., 100" : "e.g., premium"}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="h-8 text-sm"
              />
            )}
          </div>

          <Button onClick={addAttribute} disabled={!newKey.trim()} className="w-full h-8 text-sm">
            <Plus className="h-3 w-3 mr-1" />
            Add Attribute
          </Button>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          onClick={() => setAttributes([])}
          className="flex-1"
          disabled={attributes.length === 0}
        >
          Clear All
        </Button>
        <Button onClick={handleApply} className="flex-1" disabled={attributes.length === 0}>
          Apply Filter
        </Button>
      </div>
    </div>
  );
}
