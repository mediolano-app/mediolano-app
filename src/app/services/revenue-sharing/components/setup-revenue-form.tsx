"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { getUserAssets } from "@/app/services/revenue-sharing/lib/mock-data";
import { Loader2, Plus, Trash2, AlertCircle, Info, ExternalLink, Check, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Abi, useAccount, useContract, useSendTransaction, useTransactionReceipt } from "@starknet-react/core";
import { ConnectWallet } from "@/components/ConnectWallet";
import { ip_revenue_abi } from "@/abis/ip_revenue";
import Link from "next/link";

// Form schema
const formSchema = z.object({
  assetId: z.string({
    required_error: "Please select an asset.",
  }),
  totalShares: z
    .number()
    .min(1, {
      message: "Total shares must be at least 1.",
    })
    .max(10000, {
      message: "Total shares cannot exceed 10,000.",
    }),
  creatorShare: z
    .number()
    .min(1, {
      message: "Creator share must be at least 1%.",
    })
    .max(100, {
      message: "Creator share cannot exceed 100%.",
    }),
  claimPeriod: z.string(),
  autoDistribute: z.boolean().default(false),
  distributionFrequency: z.string().optional(),
  minimumDistributionAmount: z.number().optional(),
  recipients: z
    .array(
      z.object({
        address: z
          .string()
          .min(1, {
            message: "Wallet address is required.",
          })
          .regex(/^0x[0-9a-fA-F]+$/, { message: "Invalid Starknet address format." }),
        percentage: z
          .number()
          .min(1, {
            message: "Percentage must be at least 1%.",
          })
          .max(99, {
            message: "Percentage cannot exceed 99%.",
          }),
      }),
    )
    .optional(),
});

export default function SetupRevenueForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [transactionHash, setTransactionHash] = useState<string | undefined>();
  const { status, address } = useAccount();
  const router = useRouter();
  const assets = getUserAssets();
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS as `0x${string}`;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalShares: 100,
      creatorShare: 70,
      claimPeriod: "30days",
      autoDistribute: false,
      distributionFrequency: "monthly",
      minimumDistributionAmount: 0.1,
      recipients: [{ address: "", percentage: 30 }],
    },
  });

  const creatorShare = form.watch("creatorShare");
  const autoDistribute = form.watch("autoDistribute");
  const recipients = form.watch("recipients") || [];
  const selectedAssetId = form.watch("assetId");

  const addRecipient = () => {
    const currentRecipients = form.getValues("recipients") || [];
    form.setValue("recipients", [
      ...currentRecipients,
      { address: "", percentage: 0 },
    ]);
  };

  const removeRecipient = (index: number) => {
    const currentRecipients = form.getValues("recipients") || [];
    form.setValue(
      "recipients",
      currentRecipients.filter((_, i) => i !== index),
    );
  };

  const totalRecipientPercentage = recipients.reduce(
    (sum, recipient) => sum + (recipient.percentage || 0),
    0,
  );
  const isPercentageValid = totalRecipientPercentage + creatorShare === 100;

  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId);

  const { contract } = useContract({
    abi: ip_revenue_abi as Abi,
    address: CONTRACT_ADDRESS,
  });

const calls = useMemo(() => {
  if (
    !selectedAsset ||
    !address ||
    !contract ||
    !selectedAsset.nftContract ||
    !selectedAsset.id ||
    !selectedAsset.metadataHash ||
    !selectedAsset.licenseHash ||
    !form.getValues().totalShares
  ) {
    console.warn("Missing required fields for contract call");
    return [];
  }
  console.log(selectedAsset);
  console.log(contract);
  
  return [
    contract.populate("create_ip_asset", [
      selectedAsset.nftContract,
      Number(selectedAsset?.id),
      selectedAsset.metadataHash,
      selectedAsset.licenseHash,
      form.getValues().totalShares.toString(),
    ]),
  ];
}, [selectedAsset, address, contract]);


  const { sendAsync } = useSendTransaction({
    calls,
  });

  const {data: waitData, status: waitStatus} = useTransactionReceipt({ 
    watch: true, 
    hash: transactionHash,
    enabled: !!transactionHash,
  });

  useEffect(() => {
    if (waitStatus === 'success' && waitData && transactionHash) {
      console.log('Transaction status:', waitData.execution_status);
      
      // Handle all possible execution statuses
      switch (waitData.execution_status) {
        case 'SUCCEEDED':
          setCurrentStep(4);
          setIsSubmitting(false);
          toast({
            title: "Transaction Confirmed",
            description: "Your revenue sharing has been successfully set up!",
            variant: "default",
          });
          break;
        case 'REVERTED':
          setIsSubmitting(false);
          toast({
            title: "Transaction Failed",
            description: "The transaction was reverted. Please try again.",
            variant: "destructive",
          });
          break;
        case 'REJECTED':
          setIsSubmitting(false);
          toast({
            title: "Transaction Rejected",
            description: "The transaction was rejected by the network. Please try again.",
            variant: "destructive",
          });
          break;
        default:
          console.log('Unknown transaction status:', waitData.execution_status);
      }
    } else if (waitStatus === 'error') {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to fetch transaction receipt. Please check the transaction manually on the explorer.",
        variant: "destructive",
      });
    }
  }, [waitStatus, waitData, transactionHash]);

  const handleSubmit = async () => {
    if (status === "disconnected") {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedAsset) {
      toast({
        title: "Error",
        description: "Please select an asset.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendAsync();
      console.log('Transaction hash:', result.transaction_hash);
      setTransactionHash(result.transaction_hash);
      toast({
        title: "Transaction Submitted",
        description: "Your transaction has been submitted to the network and is being processed.",
      });
    } catch (err) {
      console.error("Submission error:", err);
      toast({
        title: "Failed to Set Up Revenue Sharing",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    // Validate step 1
    if (currentStep === 1) {
      const assetId = form.getValues("assetId");
      const totalShares = form.getValues("totalShares");
      
      if (!assetId || !totalShares) {
        toast({
          title: "Missing Information",
          description: "Please select an asset and specify total shares before proceeding.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate step 2
    if (currentStep === 2) {
      const creatorShare = form.getValues("creatorShare");
      const recipients = form.getValues("recipients") || [];
      
      // Check if all recipient addresses are filled
      const hasEmptyAddresses = recipients.some(recipient => !recipient.address);
      if (hasEmptyAddresses) {
        toast({
          title: "Missing Information",
          description: "Please fill in all recipient addresses.",
          variant: "destructive",
        });
        return;
      }

      // Check if percentages add up to 100%
      if (!isPercentageValid) {
        toast({
          title: "Invalid Percentages",
          description: "Total percentage must equal 100%. Please adjust the shares.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate step 3
    if (currentStep === 3) {
      const claimPeriod = form.getValues("claimPeriod");
      const autoDistribute = form.getValues("autoDistribute");
      
      if (!claimPeriod) {
        toast({
          title: "Missing Information",
          description: "Please select a claim period.",
          variant: "destructive",
        });
        return;
      }

      if (autoDistribute) {
        const distributionFrequency = form.getValues("distributionFrequency");
        const minimumDistributionAmount = form.getValues("minimumDistributionAmount");
        
        if (!distributionFrequency || minimumDistributionAmount === undefined) {
          toast({
            title: "Missing Information",
            description: "Please fill in all auto-distribution settings.",
            variant: "destructive",
          });
          return;
        }
      }
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    // Validate step 1
    if (currentStep === 1) {
      const assetId = form.getValues("assetId");
      const totalShares = form.getValues("totalShares");
      return !!(assetId && totalShares);
    }

    // Validate step 2
    if (currentStep === 2) {
      const recipients = form.getValues("recipients") || [];
      const hasEmptyAddresses = recipients.some(recipient => !recipient.address);
      return !hasEmptyAddresses && isPercentageValid;
    }

    // Validate step 3
    if (currentStep === 3) {
      const claimPeriod = form.getValues("claimPeriod");
      const autoDistribute = form.getValues("autoDistribute");
      
      if (!claimPeriod) return false;
      
      if (autoDistribute) {
        const distributionFrequency = form.getValues("distributionFrequency");
        const minimumDistributionAmount = form.getValues("minimumDistributionAmount");
        return !!(distributionFrequency && minimumDistributionAmount !== undefined);
      }
      
      return true;
    }

    return false;
  };

  return (
    <div className="space-y-6">
      {/* Wallet Connection Section */}
      {status === "disconnected" && (
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Wallet Required</AlertTitle>
            <AlertDescription>
              Connect your Starknet wallet to set up revenue sharing.
            </AlertDescription>
          </Alert>
          <ConnectWallet />
        </div>
      )}

      {/* Form */}
      {status === "connected" && (
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">
                  {currentStep < 4 ? `Step ${currentStep} of 3` : "Complete"}
                </div>
                <div className="text-sm text-gray-500">
                  {currentStep === 1
                    ? "Asset Selection"
                    : currentStep === 2
                    ? "Revenue Distribution"
                    : currentStep === 3
                    ? "Claim Settings"
                    : "Success"}
                </div>
              </div>
              <Progress value={currentStep === 4 ? 100 : (currentStep / 3) * 100} className="h-2" />
            </div>

            {currentStep === 1 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="assetId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select IP Asset</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an IP asset" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {assets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id}>
                              {asset.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the IP asset you want to configure revenue sharing for.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalShares"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Shares</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                          value={field.value || 0}
                        />
                      </FormControl>
                      <FormDescription>
                        The total number of shares to create for this asset. This determines the
                        granularity of ownership.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>What are shares?</AlertTitle>
                  <AlertDescription>
                    Shares represent ownership in your IP asset. The more shares someone owns, the
                    larger their percentage of revenue they'll receive. For example, if there are 100
                    total shares and someone owns 10 shares, they'll receive 10% of the revenue.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="creatorShare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creator Share: {field.value}%</FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          min={1}
                          max={100}
                          step={1}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="py-4"
                        />
                      </FormControl>
                      <FormDescription>
                        The percentage of revenue you'll retain as the creator.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Revenue Recipients</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addRecipient}
                      className="flex items-center"
                      aria-label="Add new recipient"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Recipient
                    </Button>
                  </div>

                  {recipients.map((_, index) => (
                    <div key={index} className="flex items-end gap-4">
                      <FormField
                        control={form.control}
                        name={`recipients.${index}.address`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Wallet Address</FormLabel>
                            <FormControl>
                              <Input placeholder="0x..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`recipients.${index}.percentage`}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormLabel>Share %</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                                value={field.value || 0}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRecipient(index)}
                        className="mb-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="bg-gray-50 text-black p-4 rounded-md">
                    <div className="flex justify-between">
                      <span>Creator Share:</span>
                      <span className="font-medium">{creatorShare}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Recipients:</span>
                      <span className="font-medium">{totalRecipientPercentage}%</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600"
                        style={{ width: `${creatorShare}%` }}
                      ></div>
                    </div>

                    {!isPercentageValid && (
                      <div className="mt-4 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        Total percentage must equal 100%. Current total:{" "}
                        {creatorShare + totalRecipientPercentage}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="claimPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Claim Period</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select claim period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="7days">7 Days</SelectItem>
                          <SelectItem value="14days">14 Days</SelectItem>
                          <SelectItem value="30days">30 Days</SelectItem>
                          <SelectItem value="90days">90 Days</SelectItem>
                          <SelectItem value="unlimited">No Expiration</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The period during which fractional owners can claim their revenue before it
                        expires.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Distribution Settings</h3>

                  <FormField
                    control={form.control}
                    name="autoDistribute"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Auto-Distribution</FormLabel>
                          <FormDescription>
                            Automatically distribute revenue to fractional owners on a schedule
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {autoDistribute && (
                    <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                      <FormField
                        control={form.control}
                        name="distributionFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Distribution Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How often revenue should be distributed.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="minimumDistributionAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Distribution Amount (ETH)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                value={field.value || 0}
                              />
                            </FormControl>
                            <FormDescription>
                              Minimum amount of revenue required to trigger a distribution.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Even with auto-distribution enabled, recipients will still need to manually claim
                    their share of the revenue. Auto-distribution only handles the allocation of funds
                    to the smart contract.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 py-8">
                <div className="text-center space-y-4">
                  <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold">Revenue Sharing Setup Complete!</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Your revenue sharing contract has been successfully configured on the blockchain.
                  </p>
                  
                  <div className="rounded-md bg-gray-50 p-4 my-6 text-left">
                    <h3 className="font-medium mb-2">Transaction Details:</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Transaction Hash:</span>
                      <div className="flex items-center">
                        <span className="text-xs font-mono truncate max-w-[200px]">
                          {transactionHash}
                        </span>
                        <Link 
                          href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${transactionHash}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-emerald-600 hover:text-emerald-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-500">Status:</span>
                      <span className="text-emerald-600 font-medium">Confirmed</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => router.push("/services/revenue-sharing/management")}
                      className="bg-emerald-600 hover:bg-emerald-700 w-full"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Go to Revenue Dashboard
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/")}
                      className="w-full"
                    >
                      Return to Home
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {currentStep > 1 && currentStep < 4 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting || !isStepValid()}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Next
                </Button>
              ) : currentStep === 3 ? (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isStepValid()}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting Up...
                    </>
                  ) : (
                    "Set Up Revenue Sharing"
                  )}
                </Button>
              ) : null}
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}