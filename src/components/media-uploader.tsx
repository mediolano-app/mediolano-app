"use client";

import {
  useState,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";

import { Upload, X, CheckCircle, LinkIcon, Camera, AlertCircle } from "lucide-react";

import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

export interface MediaUploaderRef {
  getFileAsync: () => Promise<File | null>;
}

interface MediaUploaderProps {
  label?: string;
  initialUrl?: string;
  onChange: (url: string, file?: File) => void;
}

const MediaUploader = forwardRef<MediaUploaderRef, MediaUploaderProps>(
  ({ label = "Media", initialUrl = "", onChange }, ref) => {
    const [mediaType, setMediaType] = useState<"upload" | "url">("upload");
    const [mediaPreview, setMediaPreview] = useState<string>(initialUrl);
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [mediaUrlInput, setMediaUrlInput] = useState(initialUrl);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      getFileAsync: async () => {
        if (mediaFile) return mediaFile;

        if (mediaType === "url" && mediaUrlInput) {
          try {
            const res = await fetch(mediaUrlInput);
            if (!res.ok) throw new Error("Invalid image URL");

            const blob = await res.blob();
            const contentType = blob.type || "image/jpeg";
            const extension = contentType.split("/")[1];
            return new File([blob], `url-media.${extension}`, {
              type: contentType,
            });
          } catch (err) {
            console.error("Error converting URL to file:", err);
            toast({
              title: "Invalid Media URL",
              description: "We couldn't fetch the image from the provided URL.",
              variant: "destructive",
            });
            return null;
          }
        }

        return null;
      },
    }));

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    }, []);

    const handleFileInputClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileSelect = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) handleFileChosen(file);
      },
      []
    );

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileChosen(file);
    }, []);

    const handleFileChosen = useCallback(
      (file: File) => {
        setIsUploading(true);
        setUploadProgress(0);
        setMediaFile(file);

        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setIsUploading(false);

              const reader = new FileReader();
              reader.onload = (e) => {
                const result = e.target?.result as string;
                setMediaPreview(result);
                onChange(result, file);
              };
              reader.readAsDataURL(file);

              return 100;
            }
            return prev + 15;
          });
        }, 150);
      },
      [onChange]
    );

    const handleUrlChange = (url: string) => {
      setMediaUrlInput(url);
      setMediaPreview(url);
      onChange(url);
    };

    const clearMedia = () => {
      setMediaFile(null);
      setMediaPreview("");
      setMediaUrlInput("");
      onChange("");
    };

    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold flex items-center space-x-2">
          <Upload className="w-5 h-5 text-primary" />
          <span>{label}</span>
          <Badge variant="secondary" className="text-xs px-2 py-0">
            Optional
          </Badge>
        </Label>

        <Tabs
          value={mediaType}
          onValueChange={(val) => setMediaType(val as "upload" | "url")}
        >
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-background"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </TabsTrigger>
            <TabsTrigger
              value="url"
              className="data-[state=active]:bg-background"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Media URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-primary/50 hover:bg-muted/20"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleFileInputClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              />

              {!mediaPreview ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">
                      Drop files here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Images, videos, audio, documents (Max 100MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Image
                      src={mediaPreview || "/placeholder.svg"}
                      alt="Preview"
                      width={300}
                      height={150}
                      className="w-full h-32 object-cover rounded-lg mx-auto"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearMedia();
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{mediaFile?.name}</span>
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Processing...</p>
                      <Progress value={uploadProgress} className="w-32" />
                      <p className="text-xs text-muted-foreground">
                        {uploadProgress}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="url" className="mt-4">
            <div className="space-y-3">
              <Input
                placeholder="https://example.com/media.jpg"
                value={mediaUrlInput}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="bg-background/50 border-border/50 focus:border-primary"
              />
              {mediaUrlInput && (
                <div className="border rounded-lg overflow-hidden bg-muted/20">
                  <Image
                    src={mediaUrlInput}
                    alt="URL Preview"
                    width={300}
                    height={150}
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
);

MediaUploader.displayName = "MediaUploader";

export interface CoverImageUploaderRef {
  getFile: () => File | null;
  getImageUrl: () => string;
  clear: () => void;
}

interface CoverImageUploaderProps {
  label?: string;
  initialImage?: string;
  onChange: (imageUrl: string, file?: File) => void;
}

const CoverImageUploader = forwardRef<
  CoverImageUploaderRef,
  CoverImageUploaderProps
>(({ label = "Cover Image", initialImage = "", onChange }, ref) => {
  const [coverImage, setCoverImage] = useState<string>(initialImage);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [inputMethod, setInputMethod] = useState<"upload" | "url">("upload");
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [isUrlValidating, setIsUrlValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default fallback image for mobile wallet compatibility
  const DEFAULT_IMAGE = "/placeholder.svg";

  useImperativeHandle(ref, () => ({
    getFile: () => coverFile,
    getImageUrl: () => {
      // Return the current image URL, or default if none provided
      if (coverFile && coverImage) return coverImage;
      if (imageUrlInput && isUrlValid) return imageUrlInput;
      return DEFAULT_IMAGE;
    },
    clear: () => {
      setCoverImage("");
      setCoverFile(null);
      setImageUrlInput("");
      setIsUrlValid(false);
      onChange("");
    },
  }));

  const validateImageUrl = async (url: string): Promise<boolean> => {
    if (!url) return false;
    
    try {
      new URL(url);
      
      // Check if the URL is accessible
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      
      return contentType?.startsWith('image/') || false;
    } catch (error) {
      console.warn('Invalid image URL:', error);
      return false;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCoverImage(result);
      setCoverFile(file);
      // Clear URL input when uploading file
      setImageUrlInput("");
      setIsUrlValid(false);
      onChange(result, file);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = async (url: string) => {
    setImageUrlInput(url);
    
    if (url) {
      // Reset validation state while checking
      setIsUrlValid(false);
      setIsUrlValidating(true);
      
      const isValid = await validateImageUrl(url);
      setIsUrlValid(isValid);
      setIsUrlValidating(false);
      
      if (isValid) {
        // Clear any uploaded file when using URL
        setCoverFile(null);
        setCoverImage("");
        onChange(url);
      } else {
        onChange("");
      }
    } else {
      setIsUrlValid(false);
      setIsUrlValidating(false);
      onChange("");
    }
  };

  const clearImage = () => {
    setCoverImage("");
    setCoverFile(null);
    setImageUrlInput("");
    setIsUrlValid(false);
    onChange("");
  };

  const clearUrlInput = () => {
    setImageUrlInput("");
    setIsUrlValid(false);
    onChange("");
  };



  return (
    <div className="space-y-4">
      <Label htmlFor="cover-image" className="font-medium">
        {label}
        <Badge variant="secondary" className="ml-2 text-xs">
          Optional
        </Badge>
      </Label>

             <Tabs
         value={inputMethod}
         onValueChange={(val) => {
           const newMethod = val as "upload" | "url";
           setInputMethod(newMethod);
           
           // Clear the other method when switching tabs
           if (newMethod === "upload") {
             // Switching to upload tab - clear URL input
             setImageUrlInput("");
             setIsUrlValid(false);
             setIsUrlValidating(false);
           } else {
             // Switching to URL tab - clear uploaded file
             setCoverFile(null);
             setCoverImage("");
           }
           onChange("");
         }}
       >
        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
          <TabsTrigger
            value="upload"
            className="data-[state=active]:bg-background"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </TabsTrigger>
          <TabsTrigger
            value="url"
            className="data-[state=active]:bg-background"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Image URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Input
              id="cover-image"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {coverImage ? (
              <div className="space-y-2">
                <Image
                  src={coverImage}
                  alt="Cover preview"
                  width={400}
                  height={200}
                  className="mx-auto max-h-[200px] rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop or click to select an image
                </p>
                <Button type="button" variant="outline">
                  Select Image
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

                 <TabsContent value="url" className="mt-4">
           <div className="space-y-3">
             <div className="flex space-x-2">
               <Input
                 placeholder="https://example.com/image.jpg"
                 value={imageUrlInput}
                 onChange={(e) => handleUrlChange(e.target.value)}
                 className="bg-background/50 border-border/50 focus:border-primary flex-1"
               />
               {imageUrlInput && (
                 <Button
                   type="button"
                   variant="outline"
                   size="sm"
                   onClick={clearUrlInput}
                 >
                   Clear
                 </Button>
               )}
             </div>
             
                           {imageUrlInput && (
                <div className="flex items-center space-x-2">
                  {isUrlValidating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-muted-foreground">
                        Validating URL...
                      </span>
                    </>
                  ) : isUrlValid ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">
                        Valid image URL
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-muted-foreground">
                        Invalid or inaccessible image URL
                      </span>
                    </>
                  )}
                </div>
              )}
             
             {imageUrlInput && isUrlValid && (
               <div className="border rounded-lg overflow-hidden bg-muted/20">
                 <Image
                   src={imageUrlInput}
                   alt="URL Preview"
                   width={400}
                   height={200}
                   className="w-full h-32 object-cover"
                 />
               </div>
             )}
           </div>
         </TabsContent>
      </Tabs>
             
       {!coverFile && !imageUrlInput && (
         <div className="mt-4">
           <p className="text-xs text-muted-foreground">
             No image provided. A default placeholder will be used for your collection.
           </p>
         </div>
       )}
    </div>
  );
});

CoverImageUploader.displayName = "CoverImageUploader";

export { MediaUploader, CoverImageUploader };
