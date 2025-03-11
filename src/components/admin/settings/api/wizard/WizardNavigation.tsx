
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
    <div className="flex justify-between pt-4 border-t border-gray-800">
      <div>
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isSubmitting}
            className="mr-2 border-gray-700 hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-gray-400 hover:text-gray-300 hover:bg-slate-800"
        >
          Cancel
        </Button>
      </div>
      
      <Button
        onClick={onNext}
        disabled={isSubmitting}
        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition-opacity"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : isLastStep ? (
          <Check className="h-4 w-4 mr-2" />
        ) : (
          <ArrowRight className="h-4 w-4 mr-2" />
        )}
        
        {isSubmitting ? 'Saving...' : isLastStep ? 'Save API Key' : 'Next Step'}
      </Button>
    </div>
  );
}
