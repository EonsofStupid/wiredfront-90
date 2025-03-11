
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isLastStep: boolean;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onCancel,
  isSubmitting,
  isLastStep
}: WizardNavigationProps) {
  return (
    <div className="flex justify-between mt-6">
      {currentStep > 1 ? (
        <Button variant="outline" onClick={onPrevious} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      ) : (
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
      <Button onClick={onNext} disabled={isSubmitting} className="gap-2">
        {!isLastStep ? (
          <>
            Next <ArrowRight className="h-4 w-4" />
          </>
        ) : (
          <>
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save API Key
              </>
            )}
          </>
        )}
      </Button>
    </div>
  );
}
