"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Settings, User, Zap, CheckCircle } from "lucide-react";
import { useAccount } from "@starknet-react/core";
import { shortString } from "starknet";
import { useUsersSettings } from "@/hooks/useUsersSettings";
import { toEpochTime } from "@/lib/utils";

// Mockup data with booleans replaced by numbers
const mockUser = {
  name: "Testing",
  email: "alice@mediolano.app",
  username: "alice_ip_creator",
  language: "en",
  twoFactorEnabled: 0,
  notificationsEnabled: 1,
  notificationTypes: {
    ipUpdates: 1,
    blockchainEvents: 0,
    accountActivity: 1,
  },
  password: "",
  dataRetention: 180,
  apiKey: 0,
};

const mock_new_settings_data = {
  displayPublicProfile: 1,
  emailNotifications: 1,
  marketplaceProfile: 0,
}

export default function SettingsPage() {
  const {
    getAccountSettings,
    isUpdating,
    error,
    executeSettingsCall,
  } = useUsersSettings();
  const [loadingSettings, setLoadingSettings] = useState(false);
  const { address: walletAddress } = useAccount();

  const [user, setUser] = useState(mockUser);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );

  const [settings, setSettings] = useState(mock_new_settings_data);

  // Generic updater for flat fields
  type Update = [key: string, value: any] | Record<string, any>;

  const updateUser = (update: Update) => {
    setUser((prevUser) => {
      if (Array.isArray(update)) {
        const [key, value] = update;
        return { ...prevUser, [key]: value };
      }
      return { ...prevUser, ...update };
    });
  };

  const update_new_settings = (update: Update) => {
    setSettings((prevSettings) => {
      if (Array.isArray(update)) {
        const [key, value] = update;
        return { ...prevSettings, [key]: value };
      }
      return { ...prevSettings, ...update };
    });
  };

  // Notifications UI removed



  useEffect(() => {
    if (!walletAddress) return;

    const decode = (val: any) =>
      val === 0n ? "" : shortString.decodeShortString(val);

    const fetchSettings = async () => {
      setLoadingSettings(true);

      try {
        console.log("Fetching settings for:", walletAddress);

        const accountSettingRes = await getAccountSettings(walletAddress);

        // Update user state
        updateUser({
          name: decode(accountSettingRes?.name),
          email: decode(accountSettingRes?.email),
          username: decode(accountSettingRes?.username),
        });
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchSettings();
  }, [walletAddress, getAccountSettings]);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="flex flex-col glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2" /> Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                disabled={loadingSettings}
                value={user.name}
                onChange={(e) => updateUser(["name", e.target.value])}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                disabled={loadingSettings}
                type="email"
                value={user.email}
                onChange={(e) => updateUser(["email", e.target.value])}
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                disabled={loadingSettings}
                value={user.username}
                onChange={(e) => updateUser(["username", e.target.value])}
              />
            </div>
          </CardContent>
          <div className="flex justify-end p-5">
            <Button
              onClick={async (e) => {
                console.log(user);
                await executeSettingsCall({
                  method: "store_account_details",
                  args: [
                    user.name,
                    user.email,
                    user.username,
                    toEpochTime(new Date().toISOString()),
                  ],
                });
              }}
              disabled={saveStatus === "saving"}
            >
              {saveStatus === "saving"
                ? "Saving..."
                : saveStatus === "saved"
                  ? "Saved!"
                  : "Save Changes"}
            </Button>
          </div>
        </Card>

        {/* IP Management removed */}
        <Card className="flex flex-col glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2" /> New Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">


            <div className="flex items-center space-x-2">
              <Switch
                id="display-public-profile"
                checked={settings.displayPublicProfile === 1}
                onCheckedChange={(checked: boolean) =>
                  update_new_settings(["displayPublicProfile", checked ? 1 : 0])
                }
              />
              <Label htmlFor="display-public-profile">
                Display Public Profile
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications === 1}
                onCheckedChange={(checked: boolean) =>
                  update_new_settings(["emailNotifications", checked ? 1 : 0])
                }
              />
              <Label htmlFor="email-notifications">
                Get Email Notifications
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="marketplace-profile"
                checked={settings.marketplaceProfile === 1}
                onCheckedChange={(checked: boolean) =>
                  update_new_settings(["marketplaceProfile", checked ? 1 : 0])
                }
              />
              <Label htmlFor="marketplace-profile">
                Enable Marketplace Profile
              </Label>
            </div>

          </CardContent>
          <div className="flex justify-end p-5">
            <Button
              onClick={async (e) => {
                console.log("Saving new profile settings:", settings);
                await executeSettingsCall({
                  method: "update_settings",
                  args: [
                    {
                      display_public_profile:
                        settings.displayPublicProfile === 1,
                      email_notifications:
                        settings.emailNotifications === 1,
                      marketplace_profile:
                        settings.marketplaceProfile === 1,
                    },
                  ],
                });
              }}
              disabled={saveStatus === "saving"}
            >
              {saveStatus === "saving"
                ? "Saving..."
                : saveStatus === "saved"
                  ? "Saved!"
                  : "Save Changes"}
            </Button>
          </div>
        </Card>

        {/* Notifications, Security, and Advanced Settings removed */}
      </div>

      {/* <div className="flex justify-end mb-8">
        <Button
          // onClick={(e) => handleSave(e)}
          disabled={saveStatus === "saving"}
        >
          {saveStatus === "saving"
            ? "Saving..."
            : saveStatus === "saved"
            ? "Saved!"
            : "Save Changes"}
        </Button>
      </div> */}

      {saveStatus === "saved" && (
        <Alert className="mb-8">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your settings have been saved successfully.
          </AlertDescription>
        </Alert>
      )}

      <Card className="glass-card text-foreground">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2" /> Benefits of Decentralized IP Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Secure Registration:</strong> Immutable blockchain
                records ensure tamper-proof IP registration.
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Enhanced Protection:</strong> Decentralized storage and
                cryptographic techniques provide robust security for your
                intellectual property.
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Streamlined Licensing:</strong> Smart contracts automate
                and enforce licensing agreements, reducing administrative
                overhead.
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Efficient Monetization:</strong> Tokenization enables
                fractional ownership and new revenue streams for your IP assets.
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Global Commercialization:</strong> Blockchain technology
                facilitates borderless transactions and broader market access
                for your intellectual property.
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Transparent Tracking:</strong> Real-time visibility into
                IP usage, licensing, and royalty distributions.
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
