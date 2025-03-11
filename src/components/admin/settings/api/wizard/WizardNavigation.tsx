
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
      ) : (
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
      <Button onClick={onNext} disabled={isSubmitting}>
        {!isLastStep ? (
          <>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </>
        ) : (
          <>
            {isSubmitting ? "Saving..." : "Save API Key"}
          </>
        )}
      </Button>
    </div>
  );
}
