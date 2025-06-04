import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, Link2, Globe, ExternalLink, Image as ImageIcon, X } from "lucide-react";
import { fileTypeIcons } from "./constants";
import { AssetsTabProps } from "./types";

function FileUploadSection({
  fileInputRef,
  uploadedFiles,
  setUploadedFiles,
  previewUrls,
  setPreviewUrls,
  uploadProgress,
  setUploadProgress,
}: Pick<AssetsTabProps, "fileInputRef" | "uploadedFiles" | "setUploadedFiles" | "previewUrls" | "setPreviewUrls" | "uploadProgress" | "setUploadProgress">) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file);
          setPreviewUrls((prev) => ({ ...prev, [file.name]: url }));
        }
      });

      simulateUploadProgress();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file);
          setPreviewUrls((prev) => ({ ...prev, [file.name]: url }));
        }
      });

      simulateUploadProgress();
    }
  };

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName));
    if (previewUrls[fileName]) {
      URL.revokeObjectURL(previewUrls[fileName]);
      setPreviewUrls((prev) => {
        const newUrls = { ...prev };
        delete newUrls[fileName];
        return newUrls;
      });
    }
  };

  const getFileIcon = (mimeType: string) => {
    const IconComponent = fileTypeIcons[mimeType as keyof typeof fileTypeIcons] || fileTypeIcons.default;
    return <IconComponent className="h-5 w-5" />;
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Files</CardTitle>
        <CardDescription>Upload the files that represent your intellectual property</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={openFileSelector}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
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
            onChange={handleFileUpload}
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
            <h4 className="font-medium mb-2">Uploaded Files ({uploadedFiles.length})</h4>
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
                        {(file.size / 1024).toFixed(1)} KB • {file.type || "Unknown type"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {previewUrls[file.name] && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(previewUrls[file.name], "_blank");
                        }}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.name);
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
  );
}

function ImagePreviewSection({ previewUrls }: Pick<AssetsTabProps, "previewUrls">) {
  if (!previewUrls || Object.keys(previewUrls).length === 0) return null;

  return (
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
  );
}

function MediaUrlSection() {
  const form = useFormContext();

  return (
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
                  onClick={() => window.open(form.getValues("mediaUrl"), "_blank")}
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
  );
}

export function AssetsTab(props: AssetsTabProps) {
  const { useMediaUrl, setUseMediaUrl } = props;

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
        <>
          <FileUploadSection {...props} />
          <ImagePreviewSection previewUrls={props.previewUrls} />
        </>
      ) : (
        <MediaUrlSection />
      )}
    </div>
  );
} 