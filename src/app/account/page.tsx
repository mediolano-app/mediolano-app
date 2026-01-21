"use client";

import { useState, ChangeEvent, useEffect, useCallback } from "react";
import { useAccount } from "@starknet-react/core";
import { Contract } from "starknet";
import { accountABI } from "@/abis/account";
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
  Linkedin,
  Github,
  Shield,
  Bell,
  Eye,
  Key,
  Save,
} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ExternalLink, CheckCircle, Info, AlertCircle } from "lucide-react";

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
  avatarUrl: "/background.jpg",
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

// Utility function to generate Starknet explorer links
const getStarknetExplorerUrl = (txHash: string, network: "mainnet" | "sepolia" = "sepolia") => {
  const baseUrl = network === "mainnet" ? "https://starkscan.co/tx/" : "https://sepolia.starkscan.co/tx/"
  return `${baseUrl}${txHash}`
}


export default function UserAccount() {
  // Wallet connection
  const { address, isConnected, account} = useAccount();
  const { toast } = useToast();

  // Account contract operations
  const {
    getProfile,
    getPersonalInfo,
    getSocialLinks,
    getSettings,
    isProfileRegistered,
    registerProfile,
   
    updateProfileMulticall,
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
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

      setIsLoading(true)
      if (isInitialLoad) {
        toast({
          title: "Loading Settings",
          description: "Checking for your profile on the blockchain...",
        })
      }

      try {
        // Check if profile is registered first
        const profileRegistered = await isProfileRegistered(address);

        if (profileRegistered) {
           toast({
            title: "Profile Found",
            description: "Loading your settings from the blockchain...",
          })

          // Load complete profile data
          const [profileData, personalInfo, socialLinks] =
            await Promise.all([
              getProfile(address),
              getPersonalInfo(address),
              getSocialLinks(address),
            ]);

          if (personalInfo && socialLinks &&  profileData) {
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
                publicProfile: profileData?.display_public_profile || false,
                emailNotifications: profileData?.email_notifications || false,
                marketProfile: profileData?.marketplace_profile || false,
              },
            }));
              // Owner-bound settings read: call through connected wallet so contract sees caller
          const contractAddress = process.env
            .NEXT_PUBLIC_ACCOUNT_CONTRACT_ADDRESS as `0x${string}` | undefined;
          if (account && contractAddress) {
            try {
              const ownerContract = new Contract(accountABI as any, contractAddress, account);
              const ownerSettings = await (ownerContract as any).get_settings(address);
              if (ownerSettings) {
                setUser((prevUser: UserProfile) => ({
                  ...prevUser,
                  preferences: {
                    ...prevUser.preferences,
                    publicProfile: ownerSettings.display_public_profile || false,
                    emailNotifications: ownerSettings.email_notifications || false,
                    marketProfile: ownerSettings.marketplace_profile || false,
                  },
                }));
              }
            } catch (_) {
              
            }
            
             toast({
              title: "Settings Loaded Successfully",
              description: "Your profile settings have been loaded from the blockchain.",
              action: (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
              ),
            })
          }
          }
        } else {
          console.log("Profile not registered, using defaults");
          setUser((prevUser: UserProfile) => ({
            ...prevUser,
            address: address,
          }));
            toast({
            title: "No Settings Found",
            description: "Default options loaded. You can customize and save your profile settings.",
            action: (
              <div className="flex items-center gap-1 text-blue-600">
                <Info className="w-4 h-4" />
              </div>
            ),
          })

        }
      } catch (err) {
        console.error("Failed to load user settings:", err);
          toast({
          title: "Failed to Load Settings",
          description: "There was an error loading your profile. Using default settings.",
          variant: "destructive",
          action: (
            <div className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
            </div>
          ),
        })
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

    // Loading state is managed by the contract hook automatically

    try {
      // Step 1: Upload images to IPFS if any are selected
      if (avatarFile || coverFile) {
        // Show IPFS upload progress
        toast({
          title: "Uploading Images",
          description: "Uploading images to IPFS...",
        });

        const uploadedImages = await uploadImagesToIpfs();

        // Update user state with new image URLs
        setUser((prev) => ({
          ...prev,
          avatarUrl: uploadedImages.avatarUrl || prev.avatarUrl,
          coverUrl: uploadedImages.coverUrl || prev.coverUrl,
        }));
      }

      // Step 2: Validation
       toast({
        title: "Processing Transaction",
        description: "Saving your settings to the blockchain...",
      })
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

      // Step 3: Prepare contract data
      const { emailNotifications, publicProfile, marketProfile } =
        user.preferences;

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

      toast({
        title: "Checking Profile",
        description: "Checking if profile exists on blockchain...",
      });

      const profileExists = await isProfileRegistered(address);

      toast({
        title: "Processing Transaction",
        description: profileExists
          ? "Updating existing profile..."
          : "Registering new profile...",
      });

      let transactionResult;
      if (!profileExists) {
        console.log("🆕 Registering new profile...");
        transactionResult = await registerProfile(
          personalInfo,
          socialLinks,
          profileSettings
        );
        console.log(transactionResult);
      } else {
        transactionResult = await updateProfileMulticall(personalInfo, socialLinks, profileSettings);
      }

      console.log("Transaction completed successfully:", transactionResult);

       const txHash = transactionResult?.transaction_hash;
      const explorerUrl = txHash ? getStarknetExplorerUrl(txHash) : null

      // Success handling
      toast({
        title: "Success!",
        description: profileExists
          ? "Your profile has been updated on the blockchain!"
          : "Your profile has been registered on the blockchain!",
           action: explorerUrl ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(explorerUrl, "_blank")}
            className="flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            View on Starknet
          </Button>
        ) : (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-4 h-4" />
          </div>
        ),
      });

      // Close drawer
      setIsDrawerOpen(false);

      // Optional: Refresh profile data from contract
      console.log("Refreshing profile data from blockchain...");
    } catch (err) {
    
      // Determine error type for better user feedback
      let errorTitle = "Transaction Failed";
      let errorDescription = "Failed to save settings";

      if (err instanceof Error) {
        if (
          err.message.includes("User rejected") ||
          err.message.includes("rejected")
        ) {
          errorTitle = "Transaction Cancelled";
          errorDescription = "You cancelled the transaction.";
        } else if (err.message.includes("insufficient")) {
          errorTitle = "Insufficient Funds";
          errorDescription =
            "You don't have enough funds to complete this transaction.";
        } else if (err.message.includes("network")) {
          errorTitle = "Network Error";
          errorDescription = "Network connection issue. Please try again.";
        } else {
          errorDescription = err.message;
        }
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
         action: (
          <div className="flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
          </div>
        ),
      });
    }
  }, [
    isConnected,
    address,
    user,
    avatarFile,
    coverFile,
    registerProfile,
    updateProfileMulticall,
    uploadImagesToIpfs,
    toast,
    isProfileRegistered,
  ]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          &nbsp;
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Mediolano</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/account">My Account</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
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

              <hr></hr>

              <SocialLinksSection
                socialLinks={user.socialMedia}
                onSocialLinksChange={(links) =>
                  setUser((prev) => ({ ...prev, socialMedia: links }))
                }
              />

               <hr></hr>

              <AdditionalInfoSection
                user={{
                  phone: user.phone,
                  location: user.location,
                  organization: user.org,
                }}
                onUserChange={handleInputChange}
              />

              <hr></hr>

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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-8 mt-4 rounded-lg text-lg"
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
              <DrawerTitle>You're saving your data onchain</DrawerTitle>
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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

      {/* User Stats Widgets 
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
      </div>*/}

      {/* Recent Transactions 
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
      */}


    </div>
  );
}
