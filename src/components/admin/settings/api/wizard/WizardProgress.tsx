
import { Progress } from "@/components/ui/progress";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function WizardProgress({ currentStep, totalSteps, steps }: WizardProgressProps) {
  return (
    <div className="mb-5">
      <Progress className="h-2" value={(currentStep / totalSteps) * 100} />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        {steps.map((step, index) => (
          <span 
            key={index} 
            className={currentStep >= index + 1 ? "text-primary" : ""}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
