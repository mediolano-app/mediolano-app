import { UseFormReturn } from "react-hook-form";
import type { FormValues } from "@/app/create/asset/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Link2, Globe, ExternalLink, Image, X } from "lucide-react";

interface AssetsTabProps {
  form: UseFormReturn<FormValues>;
  useMediaUrl: boolean;
  setUseMediaUrl: (value: boolean) => void;
  uploadedFiles: File[];
  previewUrls: { [key: string]: string };
  uploadProgress: number;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onOpenFileSelector: () => void;
  onRemoveFile: (fileName: string) => void;
  getFileIcon: (mimeType: string) => JSX.Element;
}

export function AssetsTab({
  form,
  useMediaUrl,
  setUseMediaUrl,
  uploadedFiles,
  previewUrls,
  uploadProgress,
  fileInputRef,
  onFileUpload,
  onDragOver,
  onDrop,
  onOpenFileSelector,
  onRemoveFile,
  getFileIcon,
}: AssetsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Button
          type="button"
          variant={!useMediaUrl ? "default" : "outline"}
          onClick={() => setUseMediaUrl(false)}
          className="flex-1"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
        <Button
          type="button"
          variant={useMediaUrl ? "default" : "outline"}
          onClick={() => setUseMediaUrl(true)}
          className="flex-1"
        >
          <Link2 className="h-4 w-4 mr-2" />
          Use Media URL
        </Button>
      </div>

      {!useMediaUrl ? (
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Upload the files that represent your intellectual property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={onOpenFileSelector}
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Drag and drop files here</h3>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse files from your computer
              </p>
              <Input
                type="file"
                id="file-upload"
                className="hidden"
                ref={fileInputRef}
                multiple
                onChange={onFileUpload}
              />
              <Button type="button">Select Files</Button>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">
                  Uploaded Files ({uploadedFiles.length})
                </h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB •{" "}
                            {file.type || "Unknown type"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        { previewUrls[file.name] && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                             const url = previewUrls[file.name];
                             // Validate URL before opening
                             try {
                               const validUrl = new URL(url);
                               if (validUrl.protocol === 'http:' || validUrl.protocol === 'https:') {
                                 window.open(url, "_blank", "noopener,noreferrer");
                               }
                             } catch (error) {
                               console.error('Invalid URL:', url, error);
                             }
                            }}
                          >
                            <Image className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFile(file.name);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 text-sm text-muted-foreground">
              <p>Supported file types: JPG, PNG, GIF, MP4, MP3, PDF, ZIP, and more.</p>
              <p>Maximum file size: 100MB</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Media URL</CardTitle>
            <CardDescription>Provide a URL to your media content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mediaUrl" className="flex items-center gap-1">
                  Media URL
                  <span className="text-destructive">*</span>
                </Label>
                <div className="flex">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mediaUrl"
                      placeholder="https://example.com/your-media-content"
                      className="pl-9"
                      {...form.register("mediaUrl")}
                    />
                  </div>
                  {form.watch("mediaUrl") && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={() => {
                         const url = form.getValues("mediaUrl");
                         if (!url) return;

                         try {
                           const validUrl = new URL(url);
                           if (validUrl.protocol === 'http:' || validUrl.protocol === 'https:') {
                             window.open(url, "_blank", "noopener,noreferrer");
                           }
                         } catch (error) {
                           console.error('Invalid URL:', url, error);
                         }
                       }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {form.formState.errors.mediaUrl && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.mediaUrl.message as string}
                  </p>
                )}
              </div>

              <Alert>
                <AlertTitle>Media URL Guidelines</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Ensure the URL is publicly accessible</li>
                    <li>For images: use direct links to JPG, PNG, or WebP files</li>
                    <li>For videos: use direct links or embedding URLs from platforms like Vimeo or YouTube</li>
                    <li>For audio: use direct links to MP3 or WAV files</li>
                    <li>For documents: link to PDF or other document formats</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}

      {uploadedFiles.length > 0 && previewUrls && Object.keys(previewUrls).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Image Previews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(previewUrls).map(([fileName, url]) => (
                <div
                  key={fileName}
                  className="relative aspect-square rounded-md overflow-hidden border"
                >
                  <img
                    src={url || "/placeholder.svg"}
                    alt={fileName}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 