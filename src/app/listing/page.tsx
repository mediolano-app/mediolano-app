"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copyright,
  DollarSign,
  Clock,
  Gavel,
  Users,
  LinkIcon,
  MoreVertical,
  Eye,
  Copy,
  FileSignature,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useCreateIPLising } from "@/hooks/useIPListingContract";
import { Listing } from "@/types/marketplace";
import { useAccount } from "@starknet-react/core";

// Mock data for previously registered IPs
const mockIPs = [
  {
    id: 1,
    name: "Novel: The Cosmic Journey",
    type: "Book",
    status: "Listed",
    price: "0.5 ETH",
    image: "/background.jpg",
  },
  {
    id: 2,
    name: "Song: Echoes of Tomorrow",
    type: "Music",
    status: "Pending",
    price: "0.2 ETH",
    image: "/background.jpg",
  },
  {
    id: 3,
    name: "Artwork: Nebula Dreams",
    type: "Image",
    status: "Listed",
    price: "1.5 ETH",
    image: "/background.jpg",
  },
  {
    id: 4,
    name: "Screenplay: The Last Frontier",
    type: "Text",
    status: "Draft",
    price: "N/A",
    image: "/background.jpg",
  },
  {
    id: 5,
    name: "Short Film: Beyond the Stars",
    type: "Video",
    status: "Listed",
    price: "3 ETH",
    image: "/background.jpg",
  },
];

export default function ListingIP() {
  const router = useRouter();

  const handleNavigation = (id: string) => {
    router.push(`/assets/${id}`);
  };

  const [listingData, setListingData] = useState<Listing>({
    assetContract: "",
    tokenId: "",
    startTime: Math.floor(Date.now() / 1000).toString(),
    endTime: "",
    secondsUntilEndTime: "",
    quantityToList: "1",
    currencyToAccept: process.env.NEXT_PUBLIC_STRK_ADDRESS as `0x${string}`,
    buyoutPricePerToken: "",
    tokenTypeOfListing: "0",
  });

  const { createListing, createListingError } = useCreateIPLising(listingData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { account, address } = useAccount();

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!listingData.assetContract) {
      errors.assetContract = "Asset contract address is required";
    }

    if (!listingData.tokenId) {
      errors.tokenId = "Token ID is required";
    }

    if (!listingData.secondsUntilEndTime) {
      errors.secondsUntilEndTime = "Duration is required";
    }

    if (!listingData.buyoutPricePerToken) {
      errors.buyoutPricePerToken = "Price per token is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        action: <ToastAction altText="OK">OK</ToastAction>,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (account && address) {
        // Call createListing and wait for the transaction to be sent
        const result = await createListing();

        // Only show success toast if the transaction was actually sent
        if (result) {
          toast({
            title: "Transaction Sent",
            description:
              "Please check your wallet to complete the transaction.",
            action: <ToastAction altText="OK">OK</ToastAction>,
          });

          // Reset form after successful submission
          setListingData({
            assetContract: "",
            tokenId: "",
            startTime: Math.floor(Date.now() / 1000).toString(),
            endTime: "",
            secondsUntilEndTime: "",
            quantityToList: "1",
            currencyToAccept: process.env
              .NEXT_PUBLIC_STRK_ADDRESS as `0x${string}`,
            buyoutPricePerToken: "",
            tokenTypeOfListing: "0",
          });
        }
      } else {
        toast({
          title: "Please connect your wallet",
          description: "Please connect your wallet to create a listing.",
          action: <ToastAction altText="OK">OK</ToastAction>,
        });
      }
    } catch (err) {
      console.error("Submission Error:", err, createListingError);
      toast({
        title: "Error",
        description: "Listing failed. Please try again or contact support.",
        action: <ToastAction altText="OK">OK</ToastAction>,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setListingData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="container mx-auto p-4 mt-10 mb-20">
      <h1 className="text-3xl font-bold mb-10 text-center">IP Listing</h1>
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Left column: List of previously registered IPs */}
        <div>
          <h2 className="text-1xl font-semibold mb-4">
            Your Intellectual Property Listings
          </h2>
          <div className="space-y-4">
            {mockIPs.map((ip) => (
              <Card
                key={ip.id}
                className="hover:shadow transition-shadow duration-300 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75 text-foreground"
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <CardTitle className="text-lg">{ip.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 ml-auto">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        <Button
                          key={ip.id}
                          onClick={() => handleNavigation(ip.name)}
                        >
                          View Details
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Create New Listing</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileSignature className="mr-2 h-4 w-4" />
                        <span>Create License</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <img
                      src={ip.image}
                      alt={ip.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {ip.type}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          ip.status === "Listed"
                            ? "text-green-500"
                            : ip.status === "Pending"
                            ? "text-yellow-500"
                            : "text-gray-500"
                        }`}
                      >
                        Status: {ip.status}
                      </p>
                      <p className="text-sm font-semibold mt-1">{ip.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right column: Form to register new IP */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Create a new listing</CardTitle>
              <CardDescription>
                Enter the details of your intellectual property to create an
                NFT.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="assetContract">Asset address</Label>
                    <Input
                      id="assetContract"
                      name="assetContract"
                      value={listingData.assetContract}
                      onChange={handleChange}
                      placeholder="Enter the asset contract address"
                      className={
                        formErrors.assetContract ? "border-red-500" : ""
                      }
                    />
                    {formErrors.assetContract && (
                      <p className="text-sm text-red-500">
                        {formErrors.assetContract}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="tokenId">Token Id</Label>
                    <Input
                      id="tokenId"
                      name="tokenId"
                      value={listingData.tokenId}
                      onChange={handleChange}
                      placeholder="Enter the asset token Id"
                      className={formErrors.tokenId ? "border-red-500" : ""}
                    />
                    {formErrors.tokenId && (
                      <p className="text-sm text-red-500">
                        {formErrors.tokenId}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="secondsUntilEndTime">
                      Duration (in seconds)
                    </Label>
                    <Input
                      id="secondsUntilEndTime"
                      name="secondsUntilEndTime"
                      value={listingData.secondsUntilEndTime}
                      onChange={handleChange}
                      placeholder="Enter listing duration in seconds"
                      className={
                        formErrors.secondsUntilEndTime ? "border-red-500" : ""
                      }
                    />
                    {formErrors.secondsUntilEndTime && (
                      <p className="text-sm text-red-500">
                        {formErrors.secondsUntilEndTime}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="buyoutPricePerToken">
                      Buy out price per token
                    </Label>
                    <Input
                      id="buyoutPricePerToken"
                      name="buyoutPricePerToken"
                      value={listingData.buyoutPricePerToken}
                      onChange={handleChange}
                      placeholder="Enter the price per token"
                      className={
                        formErrors.buyoutPricePerToken ? "border-red-500" : ""
                      }
                    />
                    {formErrors.buyoutPricePerToken && (
                      <p className="text-sm text-red-500">
                        {formErrors.buyoutPricePerToken}
                      </p>
                    )}
                  </div>
                </div>
                <CardFooter className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Submitting..." : "Create Listing"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="mt-32">
        <h2 className="text-2xl font-bold mb-10 text-center">
          Why Tokenize Your Intellectual Property?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/90 text-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copyright className="h-6 w-6 ml-blue" />
                Protect Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Secure and immutable proof of ownership on the blockchain,
                enhancing copyright protection.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/90 text-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 ml-blue" />
                Monetize Your Work
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Create new revenue streams through NFT sales, licensing, and
                royalties.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/90 text-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 ml-blue" />
                Expand Your Audience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Reach a global market of collectors and enthusiasts in the
                growing NFT ecosystem.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/90 text-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-6 w-6 ml-blue" />
                Flexible Sales Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Choose from various sale methods including fixed price,
                auctions, and crowdfunding.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/90 text-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6 ml-blue" />
                Provenance Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Maintain a transparent and verifiable history of ownership and
                transactions.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/90 text-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-6 w-6 ml-blue" />
                Interoperability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Leverage cross-platform compatibility and integration with
                various blockchain ecosystems.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
