import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
export function SetupWizard({ onComplete, isFirstTimeUser = false }) {
    const [isOpen, setIsOpen] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const { user } = useAuthStore();
    const steps = [
        { title: "Welcome", component: WelcomeStep },
        { title: "API Configuration", component: APIConfigStep },
        { title: "Preferences", component: PreferencesStep },
    ];
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
        }
        else {
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
    // Render the current step with appropriate props
    const renderCurrentStep = () => {
        const StepComponent = steps[currentStep].component;
        if (StepComponent === APIConfigStep) {
            return (_jsx(APIConfigStep, { onNext: handleNext, onBack: handleBack, isFirstTimeUser: isFirstTimeUser }));
        }
        else {
            // For other components that only need isFirstTimeUser
            return _jsx(StepComponent, { isFirstTimeUser: isFirstTimeUser });
        }
    };
    return (_jsx(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: _jsx(DialogContent, { className: "sm:max-w-[600px]", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-bold", children: steps[currentStep].title }), _jsxs("div", { className: "text-sm text-muted-foreground", children: ["Step ", currentStep + 1, " of ", steps.length] })] }), renderCurrentStep(), _jsxs("div", { className: "flex justify-between mt-6", children: [_jsxs(Button, { variant: "outline", onClick: handleBack, disabled: currentStep === 0, children: [_jsx(ChevronLeft, { className: "w-4 h-4 mr-2" }), "Back"] }), _jsx(Button, { onClick: handleNext, children: currentStep === steps.length - 1 ? (_jsxs(_Fragment, { children: ["Finish", _jsx(Check, { className: "w-4 h-4 ml-2" })] })) : (_jsxs(_Fragment, { children: ["Next", _jsx(ChevronRight, { className: "w-4 h-4 ml-2" })] })) })] })] }) }) }));
}
