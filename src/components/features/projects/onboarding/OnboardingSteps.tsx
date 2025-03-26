
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface OnboardingStepsProps {
  steps: string[];
  currentStep: number;
}

export function OnboardingSteps({
  steps,
  currentStep
}: OnboardingStepsProps) {
  return (
    <div className="flex items-center justify-center space-x-2">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          {index > 0 && (
            <div 
              className={cn(
                "h-px w-12 mx-2", 
                index <= currentStep ? "bg-neon-blue" : "bg-gray-600"
              )} 
            />
          )}
          <div 
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full border", 
              index < currentStep 
                ? "bg-neon-blue border-neon-blue text-white" 
                : index === currentStep 
                  ? "border-neon-blue text-neon-blue" 
                  : "border-gray-600 text-gray-500"
            )}
          >
            {index < currentStep ? (
              <Check className="w-4 h-4" />
            ) : (
              <span className="text-sm">{index + 1}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
