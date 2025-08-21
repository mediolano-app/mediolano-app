import React from "react";
import { Phone, MapPin, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileField = "name" | "username" | "email" | "website" | "bio" | "phone" | "location" | "org";

interface AdditionalInfoSectionProps {
  user: {
    phone: string;
    location: string;
    organization: string;
  };
  onUserChange: (field: ProfileField, value: string) => void;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  user,
  onUserChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Additional Information</h3>
        <p className="text-sm text-muted-foreground">
          Optional details about your contact and background
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-muted-foreground flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            value={user.phone}
            onChange={(e) => onUserChange("phone", e.target.value)}
            className="h-11"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="Enter your location"
            value={user.location}
            onChange={(e) => onUserChange("location", e.target.value)}
            className="h-11"
          />
        </div>

        {/* Organization */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="organization" className="text-muted-foreground flex items-center gap-2">
            <Building className="w-4 h-4" />
            Organization
          </Label>
          <Input
            id="organization"
            type="text"
            placeholder="Enter your organization"
            value={user.organization}
            onChange={(e) => onUserChange("org", e.target.value)}
            className="h-11"
          />
        </div>
      </div>
    </div>
  );
};
