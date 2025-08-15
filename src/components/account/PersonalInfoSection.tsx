import React from "react";
import { User, Mail, Globe, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ProfileField = "name" | "username" | "email" | "website" | "bio" | "phone" | "location" | "org";

interface PersonalInfoSectionProps {
  user: {
    name: string;
    username: string;
    email: string;
    website: string;
    bio: string;
  };
  onUserChange: (field: ProfileField, value: string) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  user,
  onUserChange,
}) => {
  return (
    <div className="space-y-6">
      
      {/* 
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <p className="text-sm text-muted-foreground">
          Basic details about yourself
        </p>
      </div>*/}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-muted-foreground flex items-center gap-2">
            <User className="w-4 h-4" />
            Name or Title
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={user.name}
            onChange={(e) => onUserChange("name", e.target.value)}
            className="h-11"
          />
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-muted-foreground flex items-center gap-2">
            <User className="w-4 h-4" />
            Public Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={user.username}
            onChange={(e) => onUserChange("username", e.target.value)}
            className="h-11"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-muted-foreground flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={user.email}
            onChange={(e) => onUserChange("email", e.target.value)}
            className="h-11"
          />
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website" className="text-muted-foreground flex items-center gap-2">
            <Globe className="w-4 h-4" />
            External Link
          </Label>
          <Input
            id="website"
            type="url"
            placeholder="Enter your website or social link"
            value={user.website}
            onChange={(e) => onUserChange("website", e.target.value)}
            className="h-11"
          />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-muted-foreground flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Bio
        </Label>
        <Textarea
          id="bio"
          placeholder="Tell the world about yourself"
          value={user.bio}
          onChange={(e) => onUserChange("bio", e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </div>
    </div>
  );
};
