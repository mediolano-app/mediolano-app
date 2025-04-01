"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Save, Plus, Trash } from "lucide-react";
import {
  type Address,
  useAccount,
  useSendTransaction,
  useUniversalDeployerContract,
} from "@starknet-react/core";
import { CallData } from "starknet";
import { ip_agreement_abi } from "@/abis/ip_agreement";

interface AgreementFormData {
  title: string;
  type: string;
  description: string;
  parties: {
    id: string;
    name: string;
    walletAddress: string;
    role: string;
    email?: string;
  }[];
  terms: {
    duration: string;
    territory: string;
    rights: string;
    royalties: string;
    termination: string;
  };
}

export default function CreateAgreementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const { address, status } = useAccount();

  const [formData, setFormData] = useState<AgreementFormData>({
    title: "",
    type: "",
    description: "",
    parties: [
      {
        id: crypto.randomUUID(),
        name: "User",
        walletAddress: address || "",
        role: "licensor",
        email: "",
      },
      {
        id: crypto.randomUUID(),
        name: "",
        walletAddress: "",
        role: "licensee",
        email: "",
      },
    ],
    terms: {
      duration: "",
      territory: "",
      rights: "",
      royalties: "",
      termination: "",
    },
  });

  const [errors, setErrors] = useState<
    Record<string, { walletAddress?: string }>
  >({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isFormDataValid, setIsFormDataValid] = useState(false);

  const agreementContractClassHash =
    process.env.NEXT_PUBLIC_AGREEMENT_CONTRACT_HASH?.toString();
  const agreementFactoryAddress =
    process.env.NEXT_PUBLIC_AGREEMENT_FACTORY_ADDRESS?.toString();

  const { udc } = useUniversalDeployerContract();

  const getConstructorCalldata = (creatorAddress: Address) => {
    const signers = formData.parties
      .map((party) => party.walletAddress)
      .filter(Boolean);

    // Create metadata object with additional agreement details
    const metadata = {
      type: formData.type,
      parties: formData.parties.map((party) => ({
        name: party.name,
        role: party.role,
        email: party.email || undefined,
      })),
      terms: {
        duration: formData.terms.duration,
        territory: formData.terms.territory,
        rights: formData.terms.rights,
        royalties: formData.terms.royalties,
        termination: formData.terms.termination,
      },
    };

    // Serialize metadata to a JSON string
    const ip_metadata = JSON.stringify(metadata);

    return new CallData(ip_agreement_abi).compile("constructor", {
      creator: creatorAddress,
      factory: agreementFactoryAddress!,
      title: formData.title,
      description: formData.description,
      ip_metadata, // Pass the serialized metadata
      signers,
    });
  };

  const { send, isPending: isCreatingAgreement, error: agreementError, data: agreementData } = useSendTransaction({
    calls:
      isFormDataValid && udc && address
        ? [
            udc.populate("deploy_contract", [
              agreementContractClassHash!,
              23,
              false,
              getConstructorCalldata(address),
            ]),
          ]
        : undefined,
  });

  // Centralized validation function
  const validateFormData = (data: AgreementFormData, creatorAddress: string): boolean => {
    const isValidHex = (str: string): boolean => /^0x[0-9a-fA-F]+$/.test(str);

    if (!creatorAddress || !isValidHex(creatorAddress)) return false;
    if (!agreementFactoryAddress || !isValidHex(agreementFactoryAddress)) return false;
    if (!agreementContractClassHash || !isValidHex(agreementContractClassHash)) return false;

    if (!data.title) return false;
    if (!data.type) return false;
    if (!data.description) return false;

    if (data.parties.length < 2) return false;
    for (const party of data.parties) {
      if (!party.name || !party.walletAddress || !isValidHex(party.walletAddress) || !party.role) return false;
    }

    if (
      !data.terms.duration ||
      !data.terms.territory ||
      !data.terms.rights ||
      !data.terms.royalties ||
      !data.terms.termination
    ) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    try {
      if (!address) throw new Error("Wallet not connected");
      if (!udc) throw new Error("Universal Deployer Contract not available");

      // Validate form data
      if (!validateFormData(formData, address)) {
        throw new Error("Invalid form data. Please check your inputs.");
      }

      // If valid, set isFormDataValid to true and trigger the transaction
      setIsFormDataValid(true);
      await send();
    } catch (error: any) {
      console.error("Error creating agreement:", error);
      const errorMessage = error.message || "Failed to create agreement. Please try again.";
      setSubmissionError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // Reset isFormDataValid after submission attempt
      setIsFormDataValid(false);
    }
  };

  useEffect(() => {
    if (agreementError) {
      setSubmissionError(agreementError.message || "Failed to create agreement. Please try again.");
      toast({
        title: "Error",
        description: agreementError.message || "Failed to create agreement. Please try again.",
        variant: "destructive",
      });
    }
  }, [agreementError, toast]);

  useEffect(() => {
    if (agreementData) {
      setSubmissionError(null);
      toast({
        title: "Agreement Created",
        description: "Your licensing agreement has been created successfully",
      });
      router.push("/agreements");
    }
  }, [agreementData, router, toast]);

  const steps = [
    { title: "Agreement Details", description: "Basic information about the agreement" },
    { title: "Parties", description: "Define the parties involved in this agreement" },
    { title: "Terms & Conditions", description: "Specify the terms of the licensing agreement" },
    { title: "Review & Create", description: "Review and finalize your agreement" },
  ];

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateTerm = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      terms: { ...prev.terms, [field]: value },
    }));
  };

  const updateParty = (index: number, field: string, value: string) => {
    const updatedParties = [...formData.parties];
    updatedParties[index] = { ...updatedParties[index], [field]: value };
    setFormData((prev) => ({ ...prev, parties: updatedParties }));

    if (field === "walletAddress") {
      const partyId = formData.parties[index].id;
      const isValidHex = (str: string) => /^0x[0-9a-fA-F]+$/.test(str);
      if (value && !isValidHex(value)) {
        setErrors((prev) => ({
          ...prev,
          [partyId]: { walletAddress: "Invalid address: must be a hex string starting with '0x'" },
        }));
      } else {
        setErrors((prev) => {
          const { [partyId]: _, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const addParty = () => {
    setFormData((prev) => ({
      ...prev,
      parties: [
        ...prev.parties,
        { id: crypto.randomUUID(), name: "", walletAddress: "", role: "witness", email: "" },
      ],
    }));
  };

  const removeParty = (index: number) => {
    if (formData.parties.length <= 2) return;
    const updatedParties = [...formData.parties];
    updatedParties.splice(index, 1);
    setFormData((prev) => ({ ...prev, parties: updatedParties }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!formData.title && !!formData.type && !!formData.description;
      case 1:
        return (
          formData.parties.every((party) => !!party.name && !!party.walletAddress && !!party.role) &&
          Object.values(errors).every((error) => !error.walletAddress)
        );
      case 2:
        return (
          !!formData.terms.duration &&
          !!formData.terms.territory &&
          !!formData.terms.rights &&
          !!formData.terms.royalties &&
          !!formData.terms.termination
        );
      default:
        return true;
    }
  };

  const formatValue = (value: string) => (value ? value.replace(/_/g, " ") : "");

  useEffect(() => {
    if (status === "disconnected") {
      setShowForm(false);
      setFormData((prev) => ({
        ...prev,
        parties: [{ ...prev.parties[0], walletAddress: "" }, ...prev.parties.slice(1)],
      }));
    } else if (status === "connected") {
      setShowForm(true);
      setFormData((prev) => ({
        ...prev,
        parties: [{ ...prev.parties[0], walletAddress: address || "" }, ...prev.parties.slice(1)],
      }));
    }
  }, [address, status]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => router.push("/agreements")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Agreements
        </Button>
        <h1 className="text-3xl font-bold">Create New Agreement</h1>
        <p className="text-muted-foreground mt-1">
          Define the details of your intellectual property licensing agreement
        </p>
      </div>
      {status === "disconnected" && (
        <div className="text-center py-8">
          <p>Please connect your wallet to create an agreement.</p>
        </div>
      )}
      {showForm && (
        <>
          <div className="mb-8 bg-background border border-muted rounded-lg p-4">
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex-1 text-center ${index < steps.length - 1 ? "border-b-2" : ""} ${
                    index < currentStep ? "border-primary" : "border-muted"
                  } pb-2`}
                >
                  <div
                    className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      index < currentStep
                        ? "bg-primary text-primary-foreground"
                        : index === currentStep
                        ? "bg-primary/20 text-primary border border-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index < currentStep ? "✓" : index + 1}
                  </div>
                  <div
                    className={`text-sm font-medium ${index === currentStep ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-1">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>
            <form onSubmit={handleSubmit}>
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Agreement Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="e.g., Software Development License Agreement"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Agreement Type</Label>
                    <Select value={formData.type} onValueChange={(value) => updateField("type", value)}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select agreement type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Software License">Software License</SelectItem>
                        <SelectItem value="Content License">Content License</SelectItem>
                        <SelectItem value="Patent License">Patent License</SelectItem>
                        <SelectItem value="Trademark License">Trademark License</SelectItem>
                        <SelectItem value="Copyright License">Copyright License</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      placeholder="Describe the purpose and scope of this agreement"
                      rows={5}
                    />
                  </div>
                </div>
              )}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {formData.parties.map((party, index) => (
                    <div key={party.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">
                          {party.role === "licensor"
                            ? "Licensor (You)"
                            : party.role === "licensee"
                            ? "Licensee"
                            : `Additional Party ${index - 1}`}
                        </h3>
                        {index >= 2 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeParty(index)}>
                            <Trash className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`party-name-${index}`}>Name</Label>
                          <Input
                            id={`party-name-${index}`}
                            value={party.name}
                            onChange={(e) => updateParty(index, "name", e.target.value)}
                            placeholder="Full name or company name"
                            disabled={index === 0}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`party-wallet-${index}`}>Wallet Address</Label>
                          <Input
                            id={`party-wallet-${index}`}
                            value={party.walletAddress}
                            onChange={(e) => updateParty(index, "walletAddress", e.target.value)}
                            placeholder="0x..."
                            disabled={index === 0}
                          />
                          {errors[party.id]?.walletAddress && (
                            <p className="text-red-500 text-sm">{errors[party.id].walletAddress}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`party-role-${index}`}>Role</Label>
                          <Select
                            value={party.role}
                            onValueChange={(value) => updateParty(index, "role", value)}
                            disabled={index < 2}
                          >
                            <SelectTrigger id={`party-role-${index}`}>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="licensor">Licensor</SelectItem>
                              <SelectItem value="licensee">Licensee</SelectItem>
                              <SelectItem value="witness">Witness</SelectItem>
                              <SelectItem value="advisor">Advisor</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`party-email-${index}`}>Email (Optional)</Label>
                          <Input
                            id={`party-email-${index}`}
                            type="email"
                            value={party.email || ""}
                            onChange={(e) => updateParty(index, "email", e.target.value)}
                            placeholder="[email address removed]"
                            disabled={index === 0}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addParty} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Party
                  </Button>
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="duration">License Duration</Label>
                      <Select value={formData.terms.duration} onValueChange={(value) => updateTerm("duration", value)}>
                        <SelectTrigger id="duration">
                          <SelectValue placeholder="Select license duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1_year">1 Year</SelectItem>
                          <SelectItem value="2_years">2 Years</SelectItem>
                          <SelectItem value="3_years">3 Years</SelectItem>
                          <SelectItem value="5_years">5 Years</SelectItem>
                          <SelectItem value="10_years">10 Years</SelectItem>
                          <SelectItem value="perpetual">Perpetual</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="territory">Territory</Label>
                      <Select value={formData.terms.territory} onValueChange={(value) => updateTerm("territory", value)}>
                        <SelectTrigger id="territory">
                          <SelectValue placeholder="Select territory" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="worldwide">Worldwide</SelectItem>
                          <SelectItem value="north_america">North America</SelectItem>
                          <SelectItem value="europe">Europe</SelectItem>
                          <SelectItem value="asia">Asia</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rights">Licensed Rights</Label>
                    <Textarea
                      id="rights"
                      value={formData.terms.rights}
                      onChange={(e) => updateTerm("rights", e.target.value)}
                      placeholder="Describe the specific rights being licensed (e.g., use, modify, distribute)"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="royalties">Royalties & Payments</Label>
                    <Textarea
                      id="royalties"
                      value={formData.terms.royalties}
                      onChange={(e) => updateTerm("royalties", e.target.value)}
                      placeholder="Describe the royalty structure and payment terms"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="termination">Termination Conditions</Label>
                    <Textarea
                      id="termination"
                      value={formData.terms.termination}
                      onChange={(e) => updateTerm("termination", e.target.value)}
                      placeholder="Describe the conditions under which this agreement may be terminated"
                      rows={4}
                    />
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg space-y-4">
                    <h3 className="font-medium">Agreement Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Title</div>
                        <div>{formData.title || "Not specified"}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Type</div>
                        <div>{formData.type || "Not specified"}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Description</div>
                      <div className="whitespace-pre-line">{formData.description || "Not specified"}</div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg space-y-4">
                    <h3 className="font-medium">Parties</h3>
                    <div className="space-y-3">
                      {formData.parties.map((party, index) => (
                        <div key={party.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 border-b last:border-b-0">
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">
                              {party.role.charAt(0).toUpperCase() + party.role.slice(1)}
                              {index === 0 ? " (You)" : ""}
                            </div>
                            <div>{party.name || "Not specified"}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Wallet Address</div>
                            <div className="font-mono text-xs truncate">{party.walletAddress || "Not specified"}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg space-y-4">
                    <h3 className="font-medium">Terms & Conditions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Duration</div>
                        <div>{formatValue(formData.terms.duration) || "Not specified"}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Territory</div>
                        <div>{formatValue(formData.terms.territory) || "Not specified"}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Licensed Rights</div>
                      <div className="whitespace-pre-line">{formData.terms.rights || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Royalties & Payments</div>
                      <div className="whitespace-pre-line">{formData.terms.royalties || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Termination Conditions</div>
                      <div className="whitespace-pre-line">{formData.terms.termination || "Not specified"}</div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                      By creating this agreement, you are initiating a blockchain-based licensing contract. Once created,
                      the agreement will be in draft status until all parties have signed it. As the creator, you will be
                      able to make changes while it’s in draft status.
                    </p>
                  </div>
                  {submissionError && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                      <h3 className="font-medium">Submission Error</h3>
                      <p>{submissionError}</p>
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-between mt-8">
                {currentStep > 0 ? (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                ) : (
                  <div></div>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep} disabled={!validateCurrentStep()}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isCreatingAgreement || !validateCurrentStep()}
                    className={isCreatingAgreement ? "animate-pulse" : ""}
                  >
                    {isCreatingAgreement ? (
                      <>Creating Agreement...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Agreement
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}