import { UseFormReturn } from "react-hook-form";
import type { FormValues } from "@/app/create/asset/page";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/TagInput";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, FileText, Zap, Image, Music, File, NotepadText, Globe2, Code, Clapperboard, Box } from "lucide-react";

interface DetailsTabProps {
  form: UseFormReturn<FormValues>;
  collections: { id: string; name: string }[];
  isNewCollection: boolean;
  newCollection: string;
  onNewCollectionChange: (value: string) => void;
  onCollectionChange: (value: string) => void;
  onSetTags: (tags: string[]) => void;
}

export function DetailsTab({
  form,
  collections,
  isNewCollection,
  newCollection,
  onNewCollectionChange,
  onCollectionChange,
  onSetTags,
}: DetailsTabProps) {
  return (
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
            form.setValue("type", value as FormValues["type"], {
              shouldValidate: true,
            })
          }
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3d-model" id="3d-model" />
            <Label htmlFor="3d-model" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              3D Model
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ai-model" id="ai-model" />
            <Label htmlFor="ai-model" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              AI Model
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="artwork" id="artwork" />
            <Label htmlFor="artwork" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Artwork
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="audio" id="audio" />
            <Label htmlFor="audio" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Audio
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="document" id="document" />
            <Label htmlFor="document" className="flex items-center gap-2">
              <File className="h-4 w-4" />
              Document
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="literary" id="literary" />
            <Label htmlFor="literary" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Literary
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="post" id="post" />
            <Label htmlFor="Post / Publication" className="flex items-center gap-2">
              <NotepadText className="h-4 w-4" />
              Post / Publication
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rwa" id="rwa" />
            <Label htmlFor="rwa" className="flex items-center gap-2">
              <Globe2 className="h-4 w-4" />
              RWA (Real World Asset)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="software" id="software" />
            <Label htmlFor="software" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Software
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video" id="video" />
            <Label htmlFor="video" className="flex items-center gap-2">
              <Clapperboard className="h-4 w-4" />
              Video
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other" className="flex items-center gap-2">
              <Box className="h-4 w-4" />
              Other
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2 mt-5">
        <Label htmlFor="collection" className="flex items-center gap-1">
          Collection (Preview)
        </Label>
        <Select
          value={form.getValues("collection")}
          onValueChange={onCollectionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select or create a collection" />
          </SelectTrigger>
          <SelectContent>
            {collections.map((collection) => (
              <SelectItem key={collection.id} value={collection.id}>
                {collection.name}
              </SelectItem>
            ))}
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
            onChange={(e) => onNewCollectionChange(e.target.value)}
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
          setTags={onSetTags}
          placeholder="Type and press Enter to add tags..."
          maxTags={10}
        />
      </div>
    </div>
  );
} 