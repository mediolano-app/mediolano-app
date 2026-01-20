import { pinata } from "@/services/config/server.config";
import { IPFS_URL } from "@/services/constants";
import { useState, useCallback } from "react";

export interface IpfsMetadata {
  name: string;
  description: string;
  image?: string;
  attributes?: { trait_type: string; value: string }[];
  [key: string]: unknown;
}

const getSignedUrl = async (): Promise<string> => {
  try {
    const res = await fetch("/api/pinata");
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage = data.error || data.message || "Failed to fetch signed URL";

      // Specifically handle Pinata plan limits
      if (errorMessage.includes("plan limits") || errorMessage.includes("403")) {
        throw new Error("Pinata account limit reached. Please check your Pinata dashboard storage and plan limits.");
      }

      throw new Error(errorMessage);
    }

    if (!data.url) {
      throw new Error("No signed URL returned from server");
    }

    return data.url;
  } catch (err) {
    console.error("Error in getSignedUrl:", err);
    throw err instanceof Error ? err : new Error("Failed to connect to Pinata service");
  }
};

export function useIpfsUpload() {
  const [fileUrl, setFileUrl] = useState("");
  const [metadataUrl, setMetadataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  const simulateProgress = () => {
    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 10; // simulate irregular speed
      setProgress((prev) => Math.min(prev + value, 95));
    }, 200);
    return interval;
  };

  const uploadMetadataToIpfs = async (metadata: IpfsMetadata) => {
    try {
      const metadataSignedUrl = await getSignedUrl();
      const metadataUpload = await pinata.upload.public
        .json(metadata)
        .url(metadataSignedUrl);
      const uploadedMetadataUrl = `ipfs://${metadataUpload.cid}`;
      setMetadataUrl(uploadedMetadataUrl);

      return {
        metadataUrl: uploadedMetadataUrl,
        cid: metadataUpload.cid,
      };
    } catch (err) {
      console.error("Metadata upload error details:", err);
      const error =
        err instanceof Error ? err : new Error("Metadata check failed");

      // Enhance error message for the user
      if (error.message.includes("403") || error.message.includes("limit")) {
        error.message = "Upload failed: Pinata account limit exceeded. Check your plan at pinata.cloud";
      }

      setError(error);
      throw error;
    }
  };

  const uploadToIpfs = useCallback(
    async (
      file: File,
      metadata: any,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _imageKey?: string
    ) => {
      setLoading(true);
      setError(null);
      setProgress(0);
      setFileUrl("");
      setMetadataUrl("");

      const progressInterval = simulateProgress();

      try {
        // Upload file
        const fileSignedUrl = await getSignedUrl();
        const fileUpload = await pinata.upload.public
          .file(file)
          .url(fileSignedUrl);
        const uploadedFileUrl = `ipfs://${fileUpload.cid}`;
        const assetUrl = `${IPFS_URL}/ipfs/${fileUpload.cid}`;
        setFileUrl(uploadedFileUrl);

        // Upload metadata
        const metadataWithImage = {
          ...metadata,
          assetUrl: assetUrl,
          image: uploadedFileUrl,
        };

        const result = await uploadMetadataToIpfs(metadataWithImage);

        setProgress(100); // done
        clearInterval(progressInterval);

        return {
          fileUrl: uploadedFileUrl,
          metadataUrl: result.metadataUrl,
          cid: result.cid,
        };
      } catch (err) {
        clearInterval(progressInterval);
        const error = err instanceof Error ? err : new Error("Upload failed");
        setError(error);
        throw error;
      } finally {
        setLoading(false);
        setTimeout(() => setProgress(0), 1000); // optional: reset progress after delay
      }
    },
    []
  );

  const uploadImageFromUrl = useCallback(
    async (imageUrl: string, metadata: any, imageKey: string = "image") => {
      console.log("uploadImageFromUrl called with:", { imageUrl, imageKey });
      setLoading(true);
      setError(null);
      setProgress(0);
      setFileUrl("");
      setMetadataUrl("");

      const progressInterval = simulateProgress();

      try {
        let uploadedFileUrl = imageUrl;

        // Only call server API if it's a full URL (not a relative path like /placeholder.svg)
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
          // Call server-side API to fetch and upload image
          console.log("Calling server API to upload image from URL...");
          const response = await fetch("/api/upload-image-from-url", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageUrl,
              fileName: `collection-image-${Date.now()}`,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error || "Failed to upload image from URL"
            );
          }

          const uploadResult = await response.json();
          console.log("Server upload result:", uploadResult);
          uploadedFileUrl = uploadResult.ipfsUrl;
          setFileUrl(uploadedFileUrl);
        } else {
          console.log("Using relative URL as-is:", imageUrl);
        }

        // Upload metadata with image URL
        const metadataWithImage = {
          name: metadata?.title || metadata?.name,
          description: metadata?.description,
          [imageKey]: uploadedFileUrl,
          ...metadata,
        };

        console.log("Uploading metadata with image URL:", metadataWithImage);

        const result = await uploadMetadataToIpfs(metadataWithImage);

        setProgress(100); // done
        clearInterval(progressInterval);

        return {
          fileUrl: uploadedFileUrl,
          metadataUrl: result.metadataUrl,
          cid: result.cid,
        };
      } catch (err) {
        clearInterval(progressInterval);
        const error =
          err instanceof Error
            ? err
            : new Error("Image upload from URL failed");
        setError(error);
        throw error;
      } finally {
        setLoading(false);
        setTimeout(() => setProgress(0), 1000);
      }
    },
    [uploadMetadataToIpfs]
  );

  return {
    fileUrl,
    metadataUrl,
    uploadToIpfs,
    uploadImageFromUrl,
    loading,
    error,
    uploadMetadataToIpfs,
    progress,
  };
}
