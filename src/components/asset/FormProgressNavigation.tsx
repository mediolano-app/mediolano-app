import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FormProgressNavigationProps } from "./types";

export function FormProgressNavigation({
  activeTab,
  setActiveTab,
  formValues,
  uploadedFiles,
  setTransactionStatus,
  onOpenChange,
}: FormProgressNavigationProps) {
  const progress = ((activeTab + 1) / 3) * 100;

  const handleNext = () => {
    if (activeTab < 2) {
      setActiveTab(activeTab + 1);
    }
  };

  const handleBack = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const handleSubmit = () => {
    setTransactionStatus("waiting");
    onOpenChange(true);
  };

  const isNextDisabled = () => {
    switch (activeTab) {
      case 0:
        return !formValues.title || !formValues.author || !formValues.type;
      case 1:
        return !formValues.mediaUrl && uploadedFiles.length === 0;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={activeTab === 0}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {activeTab < 2 ? (
          <Button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className="flex items-center"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!formValues.title || !formValues.author || !formValues.type}
            className="flex items-center"
          >
            Create IP
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
} 