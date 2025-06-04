import {
  Image,
  FileText,
  Music,
  Code,
  File,
  Globe2,
  NotepadText,
  Clapperboard,
  Box,
} from "lucide-react";

export const types = [
  { id: "1", name: "3D Model" },
  { id: "2", name: "AI Model" },
  { id: "3", name: "Artwork" },
  { id: "4", name: "Audio" },
  { id: "5", name: "Document" },
  { id: "6", name: "Literary" },
  { id: "7", name: "Publication" },
  { id: "8", name: "RWA" },
  { id: "9", name: "Software" },
  { id: "10", name: "Video" },
  { id: "11", name: "Other" },
];

export const licenses = [
  { id: "1", name: "All Rights Reserved" },
  { id: "2", name: "Creative Commons" },
  { id: "3", name: "MIT License" },
  { id: "4", name: "GNU General Public License" },
];

export const collections = [{ id: "1", name: "Programmable IP Collection" }];

export const fileTypeIcons = {
  "image/jpeg": Image,
  "image/png": Image,
  "image/gif": Image,
  "video/mp4": FileText,
  "audio/mpeg": Music,
  "application/pdf": FileText,
  "text/plain": FileText,
  "application/zip": FileText,
  "application/json": Code,
  "text/javascript": Code,
  "text/html": Code,
  "text/css": Code,
  default: FileText,
};

export const ipTypeIcons = {
  "3d-model": FileText,
  "ai-model": Code,
  artwork: Image,
  audio: Music,
  document: File,
  literary: FileText,
  post: NotepadText,
  rwa: Globe2,
  software: Code,
  video: Clapperboard,
  other: Box,
}; 