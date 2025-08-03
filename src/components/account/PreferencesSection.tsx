import React from "react";
import { Shield, Bell, Eye } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PreferencesSectionProps {
  settings: {
    isPrivate: boolean;
    emailNotifications: boolean;
    profileVisibility: string;
  };
  onSettingsChange: (field: string, value: boolean | string) => void;
}

export const PreferencesSection: React.FC<PreferencesSectionProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Account Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Manage your privacy and notification settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Privacy Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Privacy Settings
          </h4>
          
          <div className="space-y-4 pl-6">
            {/* Private Profile */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="private-profile" className="text-sm font-normal">
                  Private Profile
                </Label>
                <p className="text-xs text-muted-foreground">
                  Make your profile visible only to connections
                </p>
              </div>
              <Switch
                id="private-profile"
                checked={settings.isPrivate}
                onCheckedChange={(checked) => onSettingsChange("isPrivate", checked)}
              />
            </div>

            {/* Profile Visibility */}
            <div className="space-y-2">
              <Label className="text-sm font-normal flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Profile Visibility
              </Label>
              <Select
                value={settings.profileVisibility}
                onValueChange={(value) => onSettingsChange("profileVisibility", value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notification Settings
          </h4>
          
          <div className="space-y-4 pl-6">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-sm font-normal">
                  Email Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive updates and notifications via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => onSettingsChange("emailNotifications", checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
