"use client";

import { useState, ChangeEvent, useEffect, useCallback } from "react";
import { useAccount } from "@starknet-react/core";
import { useUsersSettings } from "@/hooks/useUsersSettings";
import { useIpfsUpload } from "@/hooks/useIpfs";
import { useToast } from "@/hooks/use-toast";
import { toEpochTime } from "@/lib/utils";
import type {
  UserProfile,
  SocialMediaLinks,
  UserPreferences,
} from "@/lib/types";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Icons
import {
  Upload,
  RefreshCw,
  Award,
  User,
  Globe,
  Twitter,
  Linkedin,
  Github,
  Shield,
  Bell,
  Eye,
  Key,
  Save,
} from "lucide-react";



interface UploadedImages {
  avatarUrl?: string;
  coverUrl?: string;
}

type ImageType = "avatar" | "cover";
type PreferenceKey = keyof UserPreferences;
type SocialPlatform = keyof SocialMediaLinks;
type ProfileField = "name" | "username" | "email" | "website" | "bio";

// Constants
const INITIAL_USER_PROFILE: UserProfile = {
  address: "",
  name: "",
  username: "",
  website: "",
  email: "",
  socialMedia: {
    twitter: "",
    linkedin: "",
    github: "",
  },
  avatarUrl: "/avatar.jpg",
  coverUrl: "/background.jpg",
  bio: "",
  preferences: {
    marketProfile: false,
    emailNotifications: true,
    publicProfile: true,
    dataSharing: "limited",
  },
  transactions: [],
  stats: {
    nftAssets: 0,
    transactions: 0,
    listingItems: 0,
    nftCollections: 0,
    rewards: 0,
    badges: 0,
  },
};

export default function UserAccount() {
  // Hooks
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const {
    getAccountSettings,
    executeSettingsCall,
    executeMultipleSettingsCalls,
    isUpdating,
  } = useUsersSettings();
  const { uploadToIpfs, loading: ipfsLoading, progress } = useIpfsUpload();

  // State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [avatarPreview, setAvatarPreview] = useState(
    INITIAL_USER_PROFILE.avatarUrl
  );
  const [coverPreview, setCoverPreview] = useState(
    INITIAL_USER_PROFILE.coverUrl
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Event Handlers
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }, []);

  const handlePreferenceChange = useCallback(
    (preference: PreferenceKey, value: boolean | string) => {
      setUser((prevUser: UserProfile) => ({
        ...prevUser,
        preferences: {
          ...prevUser.preferences,
          [preference]: value,
        },
      }));
    },
    []
  );

  const handleInputChange = useCallback(
    (field: ProfileField, value: string) => {
      setUser((prevUser: UserProfile) => ({
        ...prevUser,
        [field]: value,
      }));
    },
    []
  );

  const handleSocialMediaChange = useCallback(
    (platform: SocialPlatform, value: string) => {
      setUser((prevUser: UserProfile) => ({
        ...prevUser,
        socialMedia: {
          ...prevUser.socialMedia,
          [platform]: value,
        },
      }));
    },
    []
  );

  // Effects
  useEffect(() => {
    const loadUserSettings = async (): Promise<void> => {
      if (!isConnected || !address) return;

      setIsLoading(true);
      try {
        console.log(
          "Loading user settings from contract for address:",
          address
        );
        const accountSettings = await getAccountSettings(address);

        if (accountSettings) {
          console.log("Loaded account settings:", accountSettings);
          setUser((prevUser: UserProfile) => ({
            ...prevUser,
            address: address,
            // TODO: Map contract data to user state based on actual contract response structure
          }));
        } else {
          console.log("No existing settings found, using defaults");
          setUser((prevUser: UserProfile) => ({
            ...prevUser,
            address: address,
          }));
        }
      } catch (err) {
        console.error("Failed to load user settings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSettings();
  }, [isConnected, address, getAccountSettings]);

  // Image Upload Handlers
  const handleImageUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>, type: ImageType): void => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e): void => {
        const result = e.target?.result as string;
        if (type === "avatar") {
          setAvatarPreview(result);
          setAvatarFile(file);
        } else {
          setCoverPreview(result);
          setCoverFile(file);
        }
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const uploadImagesToIpfs = useCallback(async (): Promise<UploadedImages> => {
    const files = [
      { file: avatarFile, type: "avatar" as const, name: "Avatar" },
      { file: coverFile, type: "cover" as const, name: "Cover" },
    ].filter(({ file }) => file);

    if (!files.length) return {};

    try {
      console.log(`Uploading ${files.length} image(s) to IPFS...`);

      const results = await Promise.all(
        files.map(({ file, type, name }) =>
          uploadToIpfs(file!, {
            name: `${user.name || "User"} ${name}`,
            description: `Profile ${name.toLowerCase()} image`,
          }).then((result) => ({ type, url: result.fileUrl }))
        )
      );

      return results.reduce((acc, { type, url }) => {
        acc[type === "avatar" ? "avatarUrl" : "coverUrl"] = url;
        console.log(`${type} uploaded:`, url);
        return acc;
      }, {} as UploadedImages);
    } catch (error) {
      console.error("IPFS upload failed:", error);
      throw new Error(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }, [avatarFile, coverFile, uploadToIpfs, user.name]);

  // Transaction Handlers
  const handleSave = useCallback(async (): Promise<void> => {
    setIsDrawerOpen(true);
  }, []);

  const handleTransactionSign = useCallback(async (): Promise<void> => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to save settings.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload images first if any are selected
      if (avatarFile || coverFile) {
        const uploadedImages = await uploadImagesToIpfs();
        setUser((prev) => ({
          ...prev,
          avatarUrl: uploadedImages.avatarUrl || prev.avatarUrl,
          coverUrl: uploadedImages.coverUrl || prev.coverUrl,
        }));
      }

      const timestamp = toEpochTime(new Date().toISOString());

      if (!user.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Name is required to save account settings.",
          variant: "destructive",
        });
        return;
      }

      if (!user.username.trim()) {
        toast({
          title: "Validation Error",
          description: "Username is required to save account settings.",
          variant: "destructive",
        });
        return;
      }

      const { emailNotifications, publicProfile, marketProfile } =
        user.preferences;

      await executeMultipleSettingsCalls([
        {
          method: "store_account_details",
          args: [user.name, user.email, user.username, timestamp],
        },
        {
          method: "store_ip_management_settings",
          args: ["0", marketProfile ? 1 : 0, timestamp],
        },
        {
          method: "store_notification_settings",
          args: [
            emailNotifications,
            publicProfile,
            false,
            marketProfile,
            timestamp,
          ],
        },
        {
          method: "store_X_verification",
          args: [false, timestamp, user.socialMedia.twitter],
        },
      ]);

      toast({
        title: "Settings Saved!",
        description:
          "Your account settings have been saved!.",
      });

      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Multicall transaction failed:", err);
      toast({
        title: "Transaction Failed",
        description:
          err instanceof Error ? err.message : "Failed to save settings",
        variant: "destructive",
      });
    }
  }, [
    isConnected,
    address,
    user,
    avatarFile,
    coverFile,
    executeSettingsCall,
    uploadImagesToIpfs,
    toast,
  ]);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Account (Preview)</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Profile and Preferences */}
          <Card className="col-span-full bg-background/90">
            <CardHeader>
              <CardTitle>Profile & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Section */}
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
                      onChange={(e) => handleImageUpload(e, "cover")}
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
                    <img
                      src={avatarPreview || "/background.jpg"}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full"
                    />
                    <Label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 cursor-pointer"
                    >
                      <Input
                        id="avatar-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "avatar")}
                        accept="image/*"
                      />
                      <div className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 rounded-full flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                    </Label>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {user.address}
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={user.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        value={user.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                        className="pl-8"
                        placeholder="Enter your username"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (not visible)</Label>
                    <div className="relative">
                      <Globe className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={user.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        value={user.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">X</Label>
                    <div className="relative">
                      <Twitter className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="twitter"
                        value={user.socialMedia.twitter}
                        onChange={(e) =>
                          handleSocialMediaChange("twitter", e.target.value)
                        }
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="linkedin"
                        value={user.socialMedia.linkedin}
                        onChange={(e) =>
                          handleSocialMediaChange("linkedin", e.target.value)
                        }
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <div className="relative">
                      <Github className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="github"
                        value={user.socialMedia.github}
                        onChange={(e) =>
                          handleSocialMediaChange("github", e.target.value)
                        }
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={user.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="resize-none"
                  />
                </div>
              </div>

              {/* Preferences Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label>Display Public Profile</Label>
                        <p className="text-sm text-muted-foreground">
                          You can make your profile private by disabling this
                          option.
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={user.preferences.publicProfile}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("publicProfile", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about your IP assets and account
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={user.preferences.emailNotifications}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("emailNotifications", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label>Marketplace Profile</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your profile and IP portfolio at
                          the Marketplace
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={user.preferences.marketProfile}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("marketProfile", checked)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data Sharing</Label>
                    <Select
                      value={user.preferences.dataSharing}
                      onValueChange={(value) =>
                        handlePreferenceChange("dataSharing", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select data sharing level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anonymous">Anonymous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button
                    className="w-full"
                    onClick={handleSave}
                    disabled={
                      !isConnected || isLoading || ipfsLoading || isUpdating
                    }
                  >
                    {isLoading || ipfsLoading || isUpdating ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {!isConnected
                      ? "Connect Wallet to Save"
                      : isLoading
                      ? "Loading Settings..."
                      : ipfsLoading
                      ? `Uploading to IPFS... ${progress}%`
                      : isUpdating
                      ? "Processing Transaction..."
                      : "Save Profile & Preferences"}
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Confirm Transaction</DrawerTitle>
                    <DrawerDescription>
                      Please review and sign the transaction to save your
                      profile and preferences to the blockchain.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-4">
                    <p>Transaction details:</p>
                    <ul className="list-disc list-inside">
                      <li>Update profile information</li>
                      <li>Update account preferences</li>
                      <li>Store data on Starknet blockchain</li>
                    </ul>

                    <Button
                      onClick={handleTransactionSign}
                      className="w-full"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Key className="w-4 h-4 mr-2" />
                      )}
                      {isUpdating
                        ? "Processing Transaction..."
                        : "Sign and Submit"}
                    </Button>
                  </div>
                </DrawerContent>
              </Drawer>
            </CardContent>
          </Card>

          {/* User Stats Widgets */}
          {Object.entries(user.stats).map(([key, value]) => (
            <Card key={key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {key.split(/(?=[A-Z])/).join(" ")}
                </CardTitle>
                {key === "rewards" && (
                  <Award className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
              </CardContent>
            </Card>
          ))}

          {/* Recent Transactions */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell>{tx.asset}</TableCell>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>{tx.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
