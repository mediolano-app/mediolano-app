"use client";

import { useState, ChangeEvent, useEffect, useCallback } from "react";
import { useAccount } from "@starknet-react/core";
import {
  useAccountContract,
  type PersonalInfo,
  type SocialMediaLinks as ContractSocialLinks,
  type ProfileSettings,
} from "@/hooks/useAccount";
import { useIpfsUpload } from "@/hooks/useIpfs";
import { useToast } from "@/hooks/use-toast";
import {
  PersonalInfoSection,
  SocialLinksSection,
  AdditionalInfoSection,
  PreferencesSection,
  ProfileHeader,
} from "@/components/account";
import { toEpochTime } from "@/lib/utils";
import type {
  UserProfile,
  UserPreferences,
  SocialMediaLinks,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  Phone,
  MapPin,
  Building,
  Instagram,
  Video,
  Facebook,
  MessageCircle,
  Youtube,
  User,
  Globe,
  Twitter,
  Copy,
  Check,
  Plus,
  X,
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
type ProfileField =
  | "name"
  | "username"
  | "email"
  | "website"
  | "bio"
  | "phone"
  | "location"
  | "org";

// Social Platform Configuration
const SOCIAL_PLATFORMS = [
  {
    key: "twitter" as const,
    label: "X (Twitter)",
    icon: Twitter,
    placeholder: "Enter username",
  },
  {
    key: "linkedin" as const,
    label: "LinkedIn",
    icon: Linkedin,
    placeholder: "Enter profile URL or username",
  },
  {
    key: "github" as const,
    label: "GitHub",
    icon: Github,
    placeholder: "Enter username",
  },
  {
    key: "instagram" as const,
    label: "Instagram",
    icon: Instagram,
    placeholder: "Enter username",
  },
  {
    key: "tiktok" as const,
    label: "TikTok",
    icon: Video,
    placeholder: "Enter username",
  },
  {
    key: "facebook" as const,
    label: "Facebook",
    icon: Facebook,
    placeholder: "Enter profile URL or username",
  },
  {
    key: "discord" as const,
    label: "Discord",
    icon: MessageCircle,
    placeholder: "Enter username#1234",
  },
  {
    key: "youtube" as const,
    label: "YouTube",
    icon: Youtube,
    placeholder: "Enter channel URL or handle",
  },
] as const;

type SocialPlatformKey = (typeof SOCIAL_PLATFORMS)[number]["key"];

// Constants
const INITIAL_USER_PROFILE: UserProfile = {
  address: "",
  name: "",
  username: "",
  website: "",
  email: "",
  phone: "",
  location: "",
  org: "",
  socialMedia: {
    twitter: "",
    linkedin: "",
    github: "",
    instagram: "",
    tiktok: "",
    facebook: "",
    discord: "",
    youtube: "",
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
  // Wallet connection
  const { address, isConnected } = useAccount();
  const { toast } = useToast();

  // Account contract operations
  const {
    getProfile,
    getPersonalInfo,
    getSocialLinks,
    getSettings,
    isProfileRegistered,
    registerProfile,
    updatePersonalInfo,
    updateSocialLinks,
    updateSettings,
    isUpdating: isContractUpdating,
    error: contractError,
  } = useAccountContract();

  // IPFS upload functionality
  const {
    uploadToIpfs,
    loading: isIpfsUploading,
    progress: uploadProgress,
  } = useIpfsUpload();

  // State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState(
    INITIAL_USER_PROFILE.coverUrl
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [activeSocialLinks, setActiveSocialLinks] = useState<
    SocialPlatformKey[]
  >([]);
  const [showSocialDropdown, setShowSocialDropdown] = useState(false);

  // Initialize active social links based on existing data when component first loads
  useEffect(() => {
    const activePlatforms = SOCIAL_PLATFORMS.filter(
      (platform) =>
        user.socialMedia[platform.key] &&
        user.socialMedia[platform.key].trim() !== ""
    ).map((platform) => platform.key);
    setActiveSocialLinks(activePlatforms);
  }, []); // Only run once on mount, not on every user.socialMedia change

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showSocialDropdown && !target.closest("[data-social-dropdown]")) {
        setShowSocialDropdown(false);
      }
    };

    if (showSocialDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showSocialDropdown]);

  // Utility functions
  const sliceAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  const getAvatarSrc = () => {
    return avatarPreview && avatarPreview !== "/avatar.jpg"
      ? avatarPreview
      : `https://api.dicebear.com/7.x/initials/svg?seed=${
          user.name || user.username || address || "User"
        }&backgroundColor=3b82f6&textColor=ffffff`;
  };

  // Social Links Management
  const getActiveSocialLinks = () => {
    return SOCIAL_PLATFORMS.filter((platform) => {
      const hasContent =
        user.socialMedia[platform.key] &&
        user.socialMedia[platform.key].trim() !== "";
      const isExplicitlyAdded = activeSocialLinks.includes(platform.key);
      return hasContent || isExplicitlyAdded;
    });
  };

  console.log(getActiveSocialLinks());

  const getAvailableSocialPlatforms = () => {
    const activePlatforms = getActiveSocialLinks().map((p) => p.key);
    return SOCIAL_PLATFORMS.filter(
      (platform) => !activePlatforms.includes(platform.key)
    );
  };

  const addSocialLink = (platformKey: SocialPlatformKey) => {
    // Add to activeSocialLinks to track explicitly added platforms
    setActiveSocialLinks((prev) => [...prev, platformKey]);
    // Initialize the social media field with empty string
    setUser((prevUser) => ({
      ...prevUser,
      socialMedia: {
        ...prevUser.socialMedia,
        [platformKey]: "",
      },
    }));
    setShowSocialDropdown(false);
  };

  const removeSocialLink = (platformKey: SocialPlatformKey) => {
    // Remove from activeSocialLinks
    setActiveSocialLinks((prev) => prev.filter((key) => key !== platformKey));
    // Clear the social media field
    setUser((prevUser) => ({
      ...prevUser,
      socialMedia: {
        ...prevUser.socialMedia,
        [platformKey]: "",
      },
    }));
  };

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
        console.log("Loading user profile from contract for address:", address);

        // Check if profile is registered first
        const profileRegistered = await isProfileRegistered(address);

        if (profileRegistered) {
          // Load complete profile data
          const [profileData, personalInfo, socialLinks, settings] =
            await Promise.all([
              getProfile(address),
              getPersonalInfo(address),
              getSocialLinks(address),
              getSettings(address),
            ]);

          console.log("Loaded profile data:", {
            profileData,
            personalInfo,
            socialLinks,
            settings,
          });

          if (personalInfo && socialLinks && settings) {
            setUser((prevUser: UserProfile) => ({
              ...prevUser,
              address: address,
              name: personalInfo.name || "",
              username: personalInfo.username || "",
              email: personalInfo.email || "",
              bio: personalInfo.bio || "",
              location: personalInfo.location || "",
              phone: personalInfo.phone || "",
              org: personalInfo.org || "",
              website: personalInfo.website || "",
              socialMedia: {
                twitter: socialLinks.x_handle || "",
                linkedin: socialLinks.linkedin || "",
                instagram: socialLinks.instagram || "",
                tiktok: socialLinks.tiktok || "",
                facebook: socialLinks.facebook || "",
                discord: socialLinks.discord || "",
                youtube: socialLinks.youtube || "",
                github: socialLinks.github || "",
              },
              preferences: {
                ...prevUser.preferences,
                publicProfile: settings.display_public_profile || false,
                emailNotifications: settings.email_notifications || false,
                marketProfile: settings.marketplace_profile || false,
              },
            }));
          }
        } else {
          console.log("Profile not registered, using defaults");
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
  }, [
    isConnected,
    address,
    isProfileRegistered,
    getProfile,
    getPersonalInfo,
    getSocialLinks,
    getSettings,
  ]);

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

      // Validation
      const validationErrors = [
        {
          field: user.name.trim(),
          message: "Name is required to save account settings.",
        },
        {
          field: user.username.trim(),
          message: "Username is required to save account settings.",
        },
      ].filter(({ field }) => !field);

      if (validationErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: validationErrors[0].message,
          variant: "destructive",
        });
        return;
      }

      const timestamp = toEpochTime(new Date().toISOString());

      const { emailNotifications, publicProfile, marketProfile } =
        user.preferences;

      // Prepare data structures for Account contract
      const personalInfo: PersonalInfo = {
        username: user.username,
        name: user.name,
        bio: user.bio || "",
        location: user.location || "",
        email: user.email,
        phone: user.phone || "",
        org: user.org || "",
        website: user.website || "",
      };

      const socialLinks: ContractSocialLinks = {
        x_handle: user.socialMedia.twitter || "",
        linkedin: user.socialMedia.linkedin || "",
        instagram: user.socialMedia.instagram || "",
        tiktok: user.socialMedia.tiktok || "",
        facebook: user.socialMedia.facebook || "",
        discord: user.socialMedia.discord || "",
        youtube: user.socialMedia.youtube || "",
        github: user.socialMedia.github || "",
      };

      const profileSettings: ProfileSettings = {
        display_public_profile: publicProfile,
        email_notifications: emailNotifications,
        marketplace_profile: marketProfile,
      };

      // Check if profile exists and register or update accordingly
      const profileExists = await isProfileRegistered(address);

      if (!profileExists) {
        // Register new profile
        await registerProfile(personalInfo, socialLinks, profileSettings);
      } else {
        // Update existing profile sections
        await Promise.all([
          updatePersonalInfo(personalInfo),
          updateSocialLinks(socialLinks),
          updateSettings(profileSettings),
        ]);
      }

      toast({
        title: "Settings Saved!",
        description: "Your account settings have been saved!.",
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
    registerProfile,
    uploadImagesToIpfs,
    toast,
  ]);

  return (
    <div className="min-h-screen">
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
              <ProfileHeader
                user={user}
                address={address}
                coverPreview={coverPreview}
                avatarPreview={avatarPreview}
                isCopied={isCopied}
                onImageUpload={handleImageUpload}
                onCopyAddress={() => copyToClipboard(address!)}
                sliceAddress={sliceAddress}
              />

              <PersonalInfoSection
                user={user}
                onUserChange={handleInputChange}
              />

              <SocialLinksSection
                socialLinks={user.socialMedia}
                onSocialLinksChange={(links) =>
                  setUser((prev) => ({ ...prev, socialMedia: links }))
                }
              />

              <AdditionalInfoSection
                user={{
                  phone: user.phone,
                  location: user.location,
                  organization: user.org,
                }}
                onUserChange={handleInputChange}
              />

              <PreferencesSection
                settings={{
                  isPrivate: !user.preferences.publicProfile,
                  emailNotifications: user.preferences.emailNotifications,
                  profileVisibility: user.preferences.dataSharing,
                }}
                onSettingsChange={(field, value) => {
                  if (field === "isPrivate") {
                    handlePreferenceChange("publicProfile", !value);
                  } else if (field === "emailNotifications") {
                    handlePreferenceChange(
                      "emailNotifications",
                      value as boolean
                    );
                  } else if (field === "profileVisibility") {
                    handlePreferenceChange("dataSharing", value as string);
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={
                !isConnected ||
                isLoading ||
                isIpfsUploading ||
                isContractUpdating
              }
            >
              {isLoading || isIpfsUploading || isContractUpdating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {!isConnected
                ? "Connect Wallet to Save"
                : isLoading
                ? "Loading Settings..."
                : isIpfsUploading
                ? `Uploading to IPFS... ${uploadProgress}%`
                : isContractUpdating
                ? "Processing Transaction..."
                : "Save Profile & Preferences"}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Confirm Transaction</DrawerTitle>
              <DrawerDescription>
                Please review and sign the transaction to save your profile and
                preferences to the blockchain.
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
                disabled={isContractUpdating}
              >
                {isContractUpdating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Key className="w-4 h-4 mr-2" />
                )}
                {isContractUpdating
                  ? "Processing Transaction..."
                  : "Sign and Submit"}
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* User Stats Widgets */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      </div>

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
  );
}
