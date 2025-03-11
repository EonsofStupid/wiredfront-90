
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

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
    <div className="flex justify-between mt-6 pt-4 border-t">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      
      <div className="flex gap-2">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
        )}
        
        <Button
          onClick={onNext}
          disabled={isSubmitting}
          className={`flex items-center gap-2 ${isLastStep ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isLastStep ? 'Saving...' : 'Processing...'}
            </>
          ) : (
            <>
              {isLastStep ? (
                <>
                  <Check className="h-4 w-4" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
