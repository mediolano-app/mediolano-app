import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/TagInput";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ipTypeIcons } from "./constants";
import { DetailsTabProps } from "./types";

export function DetailsTab({
  isNewCollection,
  setIsNewCollection,
  newCollection,
  setNewCollection,
  setTags,
}: DetailsTabProps) {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-1">
            Title
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Enter the title of your IP"
            {...form.register("title")}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">
              {form.formState.errors.title.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="author" className="flex items-center gap-1">
            Author
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="author"
            placeholder="Enter the author's name"
            {...form.register("author")}
          />
          {form.formState.errors.author && (
            <p className="text-sm text-destructive">
              {form.formState.errors.author.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center gap-1">
            Description
            <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your intellectual property"
            className="min-h-[120px]"
            {...form.register("description")}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-destructive">
              {form.formState.errors.description.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="externalUrl" className="flex items-center gap-1">
            External Url
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="externalUrl"
            placeholder="Enter a external Url link"
            {...form.register("externalUrl")}
          />
          {form.formState.errors.externalUrl && (
            <p className="text-sm text-destructive">
              {form.formState.errors.externalUrl.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2 mt-4">
          <Label className="flex items-center gap-1">
            IP Type
            <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            defaultValue={form.getValues("type")}
            onValueChange={(value) =>
              form.setValue("type", value, {
                shouldValidate: true,
              })
            }
            className="grid grid-cols-2 gap-4"
          >
            {Object.entries(ipTypeIcons).map(([type, Icon]) => (
              <div key={type} className="flex items-center space-x-2">
                <RadioGroupItem value={type} id={type} />
                <Label htmlFor={type} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {type.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2 mt-5">
          <Label htmlFor="collection" className="flex items-center gap-1">
            Collection (Preview)
          </Label>
          <Select
            value={form.getValues("collection")}
            onValueChange={(value) => {
              if (value === "new") {
                setIsNewCollection(true);
                form.setValue("collection", "");
              } else {
                setIsNewCollection(false);
                form.setValue("collection", value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select or create a collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Programmable IP Collection</SelectItem>
              <SelectItem value="new">Create New Collection</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isNewCollection && (
          <div className="space-y-2">
            <Label htmlFor="newCollection">New Collection Name</Label>
            <Input
              id="newCollection"
              value={newCollection}
              onChange={(e) => setNewCollection(e.target.value)}
              placeholder="Enter new collection name"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="tags" className="flex items-center gap-2">
            Tags
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add tags to help others discover your IP. Press Enter or comma to add each tag.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <TagInput
            tags={form.getValues("tags")}
            setTags={setTags}
            placeholder="Type and press Enter to add tags..."
            maxTags={10}
          />
        </div>
      </div>
    </div>
  );
} 