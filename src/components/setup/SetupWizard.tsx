
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { WelcomeStep } from "./steps/WelcomeStep";
import { APIConfigStep } from "./steps/APIConfigStep";
import { PreferencesStep } from "./steps/PreferencesStep";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth";

interface SetupWizardProps {
  onComplete: () => void;
  isFirstTimeUser?: boolean;
}

export function SetupWizard({ onComplete, isFirstTimeUser = false }: SetupWizardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuthStore();

  const steps = [
    { title: "Welcome", component: WelcomeStep },
    { title: "API Configuration", component: APIConfigStep },
    { title: "Preferences", component: PreferencesStep },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // Track step completion
      if (user) {
        await supabase.from('onboarding_steps').upsert({
          user_id: user.id,
          step_name: steps[currentStep].title.toLowerCase(),
          completed: true,
          completed_at: new Date().toISOString(),
        });
      }
    } else {
      // Mark setup as completed
      if (user) {
        await supabase.from('profiles').update({
          setup_completed_at: new Date().toISOString(),
          onboarding_status: {
            completed: true,
            current_step: 'completed',
            steps_completed: steps.map(s => s.title.toLowerCase())
          }
        }).eq('id', user.id);
      }
      
      setIsOpen(false);
      onComplete();
      toast.success("Setup completed successfully!");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // This is where we need to properly pass all required props to the component
  const renderCurrentStep = () => {
    if (CurrentStepComponent === APIConfigStep) {
      return (
        <APIConfigStep 
          onNext={handleNext} 
          onBack={handleBack}
          isFirstTimeUser={isFirstTimeUser}
        />
      );
    } else {
      return <CurrentStepComponent isFirstTimeUser={isFirstTimeUser} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          {renderCurrentStep()}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? (
                <>
                  Finish
                  <Check className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
