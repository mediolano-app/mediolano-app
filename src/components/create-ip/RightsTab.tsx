import { UseFormReturn } from "react-hook-form";
import type { FormValues } from "@/app/create/asset/page";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";

interface RightsTabProps {
  form: UseFormReturn<FormValues>;
}

export function RightsTab({ form }: RightsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rights & Licensing</CardTitle>
        <CardDescription>
          Define the rights and licensing terms for your intellectual property
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="version">IP Version</Label>
          <Input
            id="version"
            placeholder="e.g., 1.0"
            {...form.register("version")}
          />
          <p className="text-sm text-muted-foreground">
            Version number to track updates to your intellectual property
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label htmlFor="licenseDuration">License Duration</Label>
          <Input
            id="licenseDuration"
            placeholder="50 years"
            {...form.register("licenseDuration")}
          />
          <p className="text-sm text-muted-foreground">
            License duration to specify how long the license is valid
          </p>
        </div>

        <div className="space-y-4">
          <Label htmlFor="licenseTerritory">License Territory</Label>
          <Input
            id="licenseTerritory"
            placeholder="Worldwide"
            {...form.register("licenseTerritory")}
          />
          <p className="text-sm text-muted-foreground">
            License territory to specify where the license is valid
          </p>
        </div>

        <div className="space-y-4">
          <Label htmlFor="license-type">License Type</Label>
          <RadioGroup
            defaultValue={form.getValues("licenseType")}
            onValueChange={(value) =>
              form.setValue("licenseType", value as FormValues["licenseType"], {
                shouldValidate: true,
              })
            }
            className="grid gap-4"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="all-rights" id="all-rights" className="mt-1" />
              <div>
                <Label htmlFor="all-rights" className="font-medium">
                  All Rights
                </Label>
                <p className="text-sm text-muted-foreground">
                  You retain all rights to your work. Others must obtain your permission for any use.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="creative-commons" id="creative-commons" className="mt-1" />
              <div>
                <Label htmlFor="creative-commons" className="font-medium">
                  Creative Commons
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow others to use your work with certain restrictions like attribution or non-commercial use.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="open-source" id="open-source" className="mt-1" />
              <div>
                <Label htmlFor="open-source" className="font-medium">
                  Open Source
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow others to use, modify, and distribute your work freely, typically for software.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="custom" id="custom" className="mt-1" />
              <div>
                <Label htmlFor="custom" className="font-medium">
                  Custom License
                </Label>
                <p className="text-sm text-muted-foreground">
                  Define your own custom licensing terms.
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="license-details">License Details</Label>
          <Textarea
            id="license-details"
            placeholder="Enter additional license details or terms"
            className="min-h-[120px]"
            {...form.register("licenseDetails")}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">License Permissions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="commercial-use">Commercial Use</Label>
                <p className="text-sm text-muted-foreground">
                  Allow others to use your IP for commercial purposes
                </p>
              </div>
                <Checkbox
                    id="commercial-use"
                    checked={form.watch("commercialUse")}
                    onCheckedChange={(checked) =>
                    form.setValue("commercialUse", checked as boolean)
                    }
                />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="modifications">Modifications</Label>
                <p className="text-sm text-muted-foreground">
                  Allow others to modify or create derivative works
                </p>
              </div>
              <Checkbox
                id="modifications"
                checked={form.watch("modifications")}
                onCheckedChange={(checked) =>
                  form.setValue("modifications", checked as boolean)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="attribution">Require Attribution</Label>
                <p className="text-sm text-muted-foreground">
                  Require others to credit you when using your IP
                </p>
              </div>
              <Checkbox
                id="attribution"
                checked={form.watch("attribution")}
                onCheckedChange={(checked) =>
                  form.setValue("attribution", checked as boolean)
                }
              />
            </div>
          </div>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Important Information</AlertTitle>
          <AlertDescription>
            Your IP will be registered on the Starknet blockchain and protected under The Berne Convention in 181
            countries. This provides immutable proof of ownership with a timestamp.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
} 