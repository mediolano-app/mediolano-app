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
        const uploadedFileUrl = `${IPFS_URL}/${fileUpload.cid}`;
        setFileUrl(uploadedFileUrl);

        // Upload metadata
        const metadataWithImage = {
          ...metadata,
          image: uploadedFileUrl,
          description: metadata?.description,
          name: metadata?.title || metadata?.name,
        };

        const metadataSignedUrl = await getSignedUrl();
        const metadataUpload = await pinata.upload.public
          .json(metadataWithImage)
          .url(metadataSignedUrl);
        const uploadedMetadataUrl = `${IPFS_URL}/${metadataUpload.cid}`;
        setMetadataUrl(uploadedMetadataUrl);

        setProgress(100); // done
        clearInterval(progressInterval);

        return {
          fileUrl: uploadedFileUrl,
          metadataUrl: uploadedMetadataUrl,
          cid: metadataUpload.cid,
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

  return {
    fileUrl,
    metadataUrl,
    uploadToIpfs,
    loading,
    error,
    progress,
  };
}
