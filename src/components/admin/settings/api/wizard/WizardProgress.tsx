
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function WizardProgress({ 
  currentStep, 
  totalSteps, 
  steps 
}: WizardProgressProps) {
  return (
    <div className="space-y-2">
      <div className="relative flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index + 1;
          const isActive = currentStep === index + 1;
          
          return (
            <div key={index} className="flex flex-col items-center z-10">
              <div 
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                  isCompleted ? "bg-indigo-600 border-indigo-400 text-white" : 
                  isActive ? "bg-indigo-500/20 border-indigo-500 text-white" : 
                  "bg-slate-800/50 border-slate-700 text-gray-400"
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className={cn(
                "text-xs mt-1 font-medium",
                isActive || isCompleted ? "text-gray-200" : "text-gray-500"
              )}>
                {step}
              </span>
            </div>
          );
        })}
        
        {/* Progress line */}
        <div className="absolute left-0 top-4 -mt-px w-full h-[2px] -z-0">
          <div className="absolute left-0 top-0 h-full bg-slate-700 w-full" />
          <div 
            className="absolute left-0 top-0 h-full bg-indigo-500 transition-all"
            style={{ width: `${(Math.max(0, currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
