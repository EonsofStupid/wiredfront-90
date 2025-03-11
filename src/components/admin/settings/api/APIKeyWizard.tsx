
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { APIType } from "@/types/admin/settings/api";
import { WizardProgress } from "./wizard/WizardProgress";
import { KeyDetailsStep } from "./wizard/KeyDetailsStep";
import { PermissionsStep } from "./wizard/PermissionsStep";
import { FeaturesStep } from "./wizard/FeaturesStep";
import { WizardNavigation } from "./wizard/WizardNavigation";

interface APIKeyWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (provider: APIType, name: string, key: string, settings: any, roles: string[], users: string[]) => Promise<boolean>;
  isSubmitting: boolean;
}

export function APIKeyWizard({ open, onOpenChange, onSave, isSubmitting }: APIKeyWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<APIType>("openai");
  const [newKey, setNewKey] = useState({ name: "", key: "", provider: "openai" as APIType });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [ragPreference, setRagPreference] = useState("supabase");
  const [planningMode, setPlanningMode] = useState("basic");

  const TOTAL_STEPS = 3;
  const STEP_NAMES = ["Key Details", "Permissions", "Features"];

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedProvider("openai");
    setNewKey({ name: "", key: "", provider: "openai" });
    setSelectedRoles([]);
    setSelectedFeatures([]);
    setRagPreference("supabase");
    setPlanningMode("basic");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSave();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (!newKey.name || !newKey.key) {
      return;
    }

    const result = await onSave(
      selectedProvider,
      newKey.name,
      newKey.key,
      {
        feature_bindings: selectedFeatures,
        rag_preference: ragPreference,
        planning_mode: planningMode
      },
      selectedRoles,
      []
    );

    if (result) {
      resetForm();
      onOpenChange(false);
    }
  };

  const handleProviderChange = (value: string) => {
    const providerValue = value as APIType;
    setSelectedProvider(providerValue);
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles([...selectedRoles, role]);
    } else {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    }
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setSelectedFeatures([...selectedFeatures, feature]);
    } else {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    }
  };

  const getStepDescription = () => {
    switch(currentStep) {
      case 1: return "Enter your API key information";
      case 2: return "Configure key permissions and assignments";
      case 3: return "Set up RAG and planning preferences";
      default: return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New API Key</DialogTitle>
          <DialogDescription>
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <WizardProgress 
            currentStep={currentStep} 
            totalSteps={TOTAL_STEPS} 
            steps={STEP_NAMES} 
          />

          {currentStep === 1 && (
            <KeyDetailsStep 
              selectedProvider={selectedProvider}
              onProviderChange={handleProviderChange}
              keyName={newKey.name}
              onKeyNameChange={(value) => setNewKey({...newKey, name: value})}
              keyValue={newKey.key}
              onKeyValueChange={(value) => setNewKey({...newKey, key: value})}
            />
          )}

          {currentStep === 2 && (
            <PermissionsStep 
              selectedRoles={selectedRoles}
              onRoleChange={handleRoleChange}
              selectedFeatures={selectedFeatures}
              onFeatureChange={handleFeatureChange}
            />
          )}

          {currentStep === 3 && (
            <FeaturesStep 
              ragPreference={ragPreference}
              onRagPreferenceChange={setRagPreference}
              planningMode={planningMode}
              onPlanningModeChange={setPlanningMode}
            />
          )}

          <WizardNavigation 
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onNext={nextStep}
            onPrevious={prevStep}
            onCancel={handleClose}
            isSubmitting={isSubmitting}
            isLastStep={currentStep === TOTAL_STEPS}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
