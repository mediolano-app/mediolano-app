import React from "react";
import { Upload, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileHeaderProps {
  user: {
    name?: string;
    bio?: string;
  };
  address?: string;
  coverPreview?: string;
  avatarPreview?: string;
  isCopied?: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "cover") => void;
  onCopyAddress: () => void;
  sliceAddress: (address: string) => string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  address,
  coverPreview,
  avatarPreview,
  isCopied,
  onImageUpload,
  onCopyAddress,
  sliceAddress,
}) => {
  const getInitials = (name: string) => {
    if (!name || name.trim() === '') {
      return 'ME';
    }
    return name.trim().substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div className="relative h-40 rounded-lg overflow-hidden mb-8">
        <img
          src={coverPreview || "/background.jpg"}
          alt="Profile cover"
          className="w-full h-full object-cover"
        />
        <Label
          htmlFor="cover-upload"
          className="absolute bottom-2 right-2 cursor-pointer"
        >
          <Input
            id="cover-upload"
            type="file"
            className="hidden"
            onChange={(e) => onImageUpload(e, "cover")}
            accept="image/*"
          />
          <div className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Change Cover
          </div>
        </Label>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-500 border-2 border-border flex items-center justify-center text-white font-bold text-3xl">
              {getInitials(user.name || "")}
            </div>
          )}
          <Label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 cursor-pointer"
          >
            <Input
              id="avatar-upload"
              type="file"
              className="hidden"
              onChange={(e) => onImageUpload(e, "avatar")}
              accept="image/*"
            />
            <div className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 rounded-full flex items-center justify-center shadow-md">
              <Upload className="w-4 h-4" />
            </div>
          </Label>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{user.name || ""}</h2>
          {address && (
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground font-mono">
                {sliceAddress(address)}
              </p>
              <button
                onClick={onCopyAddress}
                className="p-1 hover:bg-muted rounded transition-colors"
                title="Copy full address"
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                )}
              </button>
            </div>
          )}
          {user.bio && (
            <p className="text-sm text-muted-foreground max-w-md">
              {user.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
