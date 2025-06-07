import { UseFormReturn } from "react-hook-form";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Loader2,
  CheckCircle2,
  X,
  Globe,
  FileText,
  Box,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import type { FormValues } from "@/app/create/asset/page";

interface TransactionDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<FormValues>;
  uploadedFiles: File[];
  previewUrls: { [key: string]: string };
  transactionStatus: "waiting" | "processing" | "success" | "error";
  onSignTransaction: () => void;
}

export function TransactionDrawer({
  isOpen,
  onOpenChange,
  form,
  uploadedFiles,
  previewUrls,
  transactionStatus,
  onSignTransaction,
}: TransactionDrawerProps) {
  const { toast } = useToast();

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="overflow-auto">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle>Create Your Asset</DrawerTitle>
          <DrawerDescription>
            Review the details and create your Programmable IP with immutable
            proof of ownership.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-6">
          {transactionStatus === "waiting" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Media Preview */}
                <div className="md:col-span-1 flex justify-center">
                  <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border bg-muted">
                    {uploadedFiles.length > 0 &&
                    Object.keys(previewUrls).length > 0 ? (
                      <img
                        src={Object.values(previewUrls)[0] || "/background.jpg"}
                        alt="IP Preview"
                        className="object-cover w-full h-full"
                      />
                    ) : form.watch("mediaUrl") ? (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <Globe className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground text-center break-all">
                          {form.watch("mediaUrl")}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground text-center">
                          No media preview available
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Main IP Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {form.watch("title") || "Untitled"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      By {form.watch("author") || "Unknown"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">
                      {form.watch("description") || "No description provided."}
                    </p>
                  </div>

                  {form.getValues("tags") && form.getValues("tags").length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {form.getValues("tags").map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <Alert variant="default" className="bg-primary/5 border-primary/20">
                <Shield className="h-4 w-4 text-primary" />
                <AlertTitle>Intellectual Property Protection</AlertTitle>
                <AlertDescription>
                  Your IP will be registered on the Starknet blockchain and
                  protected under The Berne Convention in 181 countries. This
                  provides immutable proof of ownership with a timestamp.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {transactionStatus === "processing" && (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-medium mb-2">Minting Your IP Asset</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Please wait while your intellectual property is being registered
                on the Starknet blockchain. This process creates an immutable
                record of your ownership.
              </p>
              <div className="w-full max-w-md mt-6 bg-muted p-4 rounded-md">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Transaction Status
                    </span>
                    <span className="text-xs font-medium">Processing</span>
                  </div>
                  <Progress value={45} className="h-1 mt-2" />
                </div>
              </div>
            </div>
          )}

          {transactionStatus === "success" && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20 mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {form.watch("title") || "Untitled"}
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                Please confirm with your encrypted wallet to successfully register
                on the blockchain with immutable proof of ownership.
              </p>

              <div className="w-full max-w-md bg-muted p-4 rounded-md mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Registration Date
                    </span>
                    <span className="text-sm font-medium">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Powered on
                    </span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      Starknet
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full max-w-xs">
                <Link href="/create">
                  <Button variant="outline" className="w-full">
                    <Box className="h-4 w-4 mr-2" />
                    Register Another Programmable IP
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Portfolio
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {transactionStatus === "error" && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20 mb-4">
                <X className="h-10 w-10 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Creation Failed</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                There was an error while registering your IP on the blockchain.
                This could be due to network congestion or wallet connection
                issues.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(true)}
                >
                  Try Again
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    onOpenChange(false);
                    toast({
                      title: "Registration Cancelled",
                      description:
                        "You can try again later from the Create IP page.",
                    });
                  }}
                >
                  Cancel Registration
                </Button>
              </div>
            </div>
          )}
        </div>

        <DrawerFooter className="border-t pt-4">
          {transactionStatus === "waiting" && (
            <>
              <Button
                onClick={onSignTransaction}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                <Shield className="h-5 w-5 mr-2" />
                Mint Programmable IP
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2 mb-4">
                By clicking &quot;Mint Programmable IP&quot;, you confirm that you are
                the lawful owner of this intellectual property and have the right
                to register it.
              </p>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </>
          )}

          {transactionStatus === "success" && (
            <DrawerClose asChild>
              <Button>
                <ArrowRight className="h-4 w-4 mr-2" />
                Close
              </Button>
            </DrawerClose>
          )}

          {transactionStatus === "error" && (
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
} 