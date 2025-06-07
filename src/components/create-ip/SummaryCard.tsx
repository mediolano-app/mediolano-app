import { UseFormReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";
import type { FormValues } from "@/app/create/asset/page";

interface SummaryCardProps {
  form: UseFormReturn<FormValues>;
  uploadedFiles: File[];
  activeTab: string;
  onReviewSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function SummaryCard({
  form,
  uploadedFiles,
  activeTab,
  onReviewSubmit,
}: SummaryCardProps) {
  return (
    <Card className="sticky top-6 bg-muted/50">
      <CardHeader>
        <CardTitle>IP Summary</CardTitle>
        <CardDescription>Review your IP creation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {form.watch("title") && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Title</p>
            <p className="text-sm text-muted-foreground">
              {form.watch("title")}
            </p>
          </div>
        )}

        {form.watch("author") && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Author</p>
            <p className="text-sm text-muted-foreground">
              {form.watch("author")}
            </p>
          </div>
        )}

        {form.watch("type") && (
          <div className="space-y-1">
            <p className="text-sm font-medium">IP Type</p>
            <p className="text-sm text-muted-foreground capitalize">
              {form.watch("type").replace("-", " ")}
            </p>
          </div>
        )}

        {form.getValues("tags") && form.getValues("tags").length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Tags</p>
            <div className="flex flex-wrap gap-1">
              {form.getValues("tags").map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Files</p>
            <p className="text-sm text-muted-foreground">
              {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""} uploaded
            </p>
          </div>
        )}

        {form.watch("mediaUrl") && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Media URL</p>
            <p className="text-sm text-muted-foreground truncate">
              {form.watch("mediaUrl")}
            </p>
          </div>
        )}

        {form.watch("licenseType") && (
          <div className="space-y-1">
            <p className="text-sm font-medium">License</p>
            <p className="text-sm text-muted-foreground capitalize">
              {form.watch("licenseType").replace("-", " ")}
            </p>
          </div>
        )}

        {form.watch("version") && (
          <div className="space-y-1">
            <p className="text-sm font-medium">IP Version</p>
            <p className="text-sm text-muted-foreground">
              {form.watch("version")}
            </p>
          </div>
        )}

        <Separator />

        <div className="space-y-1">
          <p className="text-sm font-medium">Protection</p>
          <p className="text-sm text-muted-foreground">
            Your IP will be protected in 181 countries according to The Berne
            Convention
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Proof of Ownership</p>
          <p className="text-sm text-muted-foreground">
            Immutable timestamp on Starknet blockchain, settled on Ethereum
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Duration</p>
          <p className="text-sm text-muted-foreground">
            Valid for 50-70 years, in accordance with legal jurisdiction
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Fees</p>
          <p className="text-sm text-muted-foreground">
            Zero fees for registration
          </p>
        </div>
      </CardContent>
      <CardFooter>
        {activeTab === "rights" && (
          <Button className="w-full" type="button" onClick={onReviewSubmit}>
            <Shield className="h-4 w-4 mr-2" />
            Register IP Asset
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 