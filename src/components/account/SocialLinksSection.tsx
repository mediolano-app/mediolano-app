import React, { useState } from "react";
import { Plus, X, Twitter, Linkedin, Github, Instagram, Music, MessageCircle, Youtube, Send, Facebook } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialMediaLinks } from "@/lib/types";

interface SocialLinksSectionProps {
  socialLinks: SocialMediaLinks;
  onSocialLinksChange: (links: SocialMediaLinks) => void;
}

type SocialPlatformKey = keyof SocialMediaLinks;

interface SocialPlatform {
  key: SocialPlatformKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
}

const socialPlatforms: SocialPlatform[] = [
  { key: "twitter", label: "Twitter", icon: Twitter, placeholder: "Enter Twitter username" },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "Enter LinkedIn profile" },
  { key: "github", label: "GitHub", icon: Github, placeholder: "Enter GitHub username" },
  { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "Enter Instagram username" },
  { key: "tiktok", label: "TikTok", icon: Music, placeholder: "Enter TikTok username" },
  { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "Enter Facebook profile" },
  { key: "discord", label: "Discord", icon: MessageCircle, placeholder: "Enter Discord username" },
  { key: "youtube", label: "YouTube", icon: Youtube, placeholder: "Enter YouTube channel" },
];

export const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({
  socialLinks,
  onSocialLinksChange,
}) => {
  const [showSocialDropdown, setShowSocialDropdown] = useState(false);
  const [activeSocialLinks, setActiveSocialLinks] = useState<Set<SocialPlatformKey>>(
    new Set(Object.keys(socialLinks).filter(key => socialLinks[key as SocialPlatformKey]) as SocialPlatformKey[])
  );

  const getAvailableSocialPlatforms = () => {
    return socialPlatforms.filter(platform => !activeSocialLinks.has(platform.key));
  };

  const getActiveSocialLinks = () => {
    return socialPlatforms.filter(platform => activeSocialLinks.has(platform.key));
  };

  const addSocialLink = (platformKey: SocialPlatformKey) => {
    setActiveSocialLinks(prev => new Set([...prev, platformKey]));
    setShowSocialDropdown(false);
  };

  const removeSocialLink = (platformKey: SocialPlatformKey) => {
    setActiveSocialLinks(prev => {
      const newSet = new Set(prev);
      newSet.delete(platformKey);
      return newSet;
    });
    
    // Remove the value from socialLinks
    const updatedLinks = { ...socialLinks };
    delete updatedLinks[platformKey];
    onSocialLinksChange(updatedLinks);
  };

  const updateSocialLink = (platformKey: SocialPlatformKey, value: string) => {
    onSocialLinksChange({
      ...socialLinks,
      [platformKey]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Social Media Links</h3>
        <p className="text-sm text-muted-foreground">
          Connect your social media profiles
        </p>
      </div>

      <div className="space-y-4">
        {/* Add Social Link Button */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Add the social platforms you use
          </span>
          <div className="relative" data-social-dropdown>
            <button
              type="button"
              onClick={() => setShowSocialDropdown(!showSocialDropdown)}
              className="flex items-center space-x-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
              disabled={getAvailableSocialPlatforms().length === 0}
            >
              <Plus className="w-4 h-4" />
              <span>Add Social Link</span>
            </button>

            {showSocialDropdown && getAvailableSocialPlatforms().length > 0 && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-background border border-border rounded-md shadow-lg z-10">
                {getAvailableSocialPlatforms().map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={platform.key}
                      type="button"
                      onClick={() => addSocialLink(platform.key)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span>{platform.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Active Social Links */}
        <div className="space-y-3">
          {getActiveSocialLinks().map((platform) => {
            const Icon = platform.icon;
            return (
              <div key={platform.key} className="flex items-center space-x-3">
                <div className="flex-1 space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {platform.label}
                  </Label>
                  <Input
                    type="text"
                    placeholder={platform.placeholder}
                    value={socialLinks[platform.key] || ""}
                    onChange={(e) => updateSocialLink(platform.key, e.target.value)}
                    className="h-11"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSocialLink(platform.key)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors mt-7"
                  title={`Remove ${platform.label}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {getActiveSocialLinks().length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No social links added yet.</p>
            <p className="text-xs mt-1">Click "Add Social Link" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};
