"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, Shield, Globe, FileText } from "lucide-react";

interface AssetPreviewProps {
  formState: any;
  template?: any;
}

export function AssetPreview({ formState, template }: AssetPreviewProps) {
  const hasBasicInfo = formState.title || formState.description;
  const hasMedia = formState.mediaFile || formState.mediaPreviewUrl;
  const hasLicensing = formState.licenseType;
  const hasMetadata =
    formState.metadataFields &&
    Object.keys(formState.metadataFields).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Eye className="h-5 w-5" />
          Live Preview
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          See how your asset will appear once registered
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Media Preview */}
        {hasMedia && (
          <div className="space-y-2">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {formState.mediaPreviewUrl &&
              formState.mediaPreviewUrl !==
                "/placeholder.svg?height=600&width=600" ? (
                <img
                  src={formState.mediaPreviewUrl || "/placeholder.svg"}
                  alt="Asset preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <FileText className="h-12 w-12" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Basic Information */}
        {hasBasicInfo && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">
              {formState.title || "Untitled Asset"}
            </h3>
            {formState.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {formState.description}
              </p>
            )}
            <div className="flex flex-wrap gap-1">
              {template && (
                <Badge variant="outline" className="text-xs">
                  {template.name}
                </Badge>
              )}
              {formState.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Licensing Info */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Protection & Licensing
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">License:</span>
              <span className="font-medium">
                {formState.licenseType === "all-rights-reserved" &&
                  "All Rights Reserved"}
                {formState.licenseType === "cc-by" && "CC BY"}
                {formState.licenseType === "cc-by-sa" && "CC BY-SA"}
                {formState.licenseType === "cc-by-nc" && "CC BY-NC"}
                {formState.licenseType === "custom" && "Custom License"}
                {!formState.licenseType && "All Rights Reserved"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scope:</span>
              <span className="font-medium flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {formState.geographicScope === "worldwide" && "Worldwide"}
                {formState.geographicScope === "us" && "United States"}
                {formState.geographicScope === "eu" && "European Union"}
                {formState.geographicScope === "uk" && "United Kingdom"}
                {formState.geographicScope === "canada" && "Canada"}
                {formState.geographicScope === "australia" && "Australia"}
                {formState.geographicScope === "other" && "Other"}
                {!formState.geographicScope && "Worldwide"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Protection:</span>
              <span className="font-medium">Blockchain Verified</span>
            </div>
          </div>
        </div>

        {/* Metadata Preview */}
        {hasMetadata && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Asset Details</h4>
              <div className="space-y-1 text-sm">
                {Object.entries(formState.metadataFields).map(
                  ([key, value]) => {
                    if (!value) return null;
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="font-medium truncate ml-2">
                          {typeof value === "boolean"
                            ? value
                              ? "Yes"
                              : "No"
                            : String(value)}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </>
        )}

        {/* Collection Info */}
        {formState.collection && (
          <>
            <Separator />
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Collection</h4>
              <p className="text-sm text-muted-foreground">
                {formState?.collectionName || formState.collection}
              </p>
            </div>
          </>
        )}

        {/* Empty State */}
        {!hasBasicInfo && !hasMedia && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              Start filling out the form to see your asset preview
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
