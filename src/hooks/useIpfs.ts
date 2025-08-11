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
  const res = await fetch("/api/pinata");
  if (!res.ok) throw new Error("Failed to fetch signed URL");
  const { url } = await res.json();
  return url;
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

  const uploadMetadataToIpfs = useCallback(async (metadata: IpfsMetadata) => {
    try {
      const metadataSignedUrl = await getSignedUrl();
      const metadataUpload = await pinata.upload.public
        .json(metadata)
        .url(metadataSignedUrl);
      const uploadedMetadataUrl = `${IPFS_URL}/ipfs/${metadataUpload.cid}`;
      setMetadataUrl(uploadedMetadataUrl);

      return {
        metadataUrl: uploadedMetadataUrl,
        cid: metadataUpload.cid,
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Metadata upload failed");
      setError(error);
      throw error;
    }
  }, []);

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
        const uploadedFileUrl = `${IPFS_URL}/ipfs/${fileUpload.cid}`;
        setFileUrl(uploadedFileUrl);

        // Upload metadata
        const metadataWithImage = {
          ...metadata,
          image: uploadedFileUrl,
          description: metadata?.description,
          name: metadata?.title || metadata?.name,
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
    [uploadMetadataToIpfs]
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
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
          // Call server-side API to fetch and upload image
          console.log("Calling server API to upload image from URL...");
          const response = await fetch('/api/upload-image-from-url', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageUrl,
              fileName: `collection-image-${Date.now()}`,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload image from URL');
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
          ...metadata,
          [imageKey]: uploadedFileUrl,
          description: metadata?.description,
          name: metadata?.title || metadata?.name,
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
        const error = err instanceof Error ? err : new Error("Image upload from URL failed");
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
    progress,
  };
}
