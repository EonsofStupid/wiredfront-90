import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { WizardProgress } from "./wizard/WizardProgress";
import { KeyDetailsStep } from "./wizard/KeyDetailsStep";
import { PermissionsStep } from "./wizard/PermissionsStep";
import { FeaturesStep } from "./wizard/FeaturesStep";
import { WizardNavigation } from "./wizard/WizardNavigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
export function APIKeyWizard({ open, onOpenChange, onSave, isSubmitting }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedProvider, setSelectedProvider] = useState("openai");
    const [newKey, setNewKey] = useState({ name: "", key: "", provider: "openai" });
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [ragPreference, setRagPreference] = useState("supabase");
    const [planningMode, setPlanningMode] = useState("basic");
    const TOTAL_STEPS = 3;
    const STEP_NAMES = ["Key Details", "Permissions", "Features"];
    useEffect(() => {
        if (open) {
        }
        else {
            resetForm();
        }
    }, [open]);
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
        onOpenChange(false);
    };
    const nextStep = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1);
        }
        else {
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
        const result = await onSave(selectedProvider, newKey.name, newKey.key, {
            feature_bindings: selectedFeatures,
            rag_preference: ragPreference,
            planning_mode: planningMode
        }, selectedRoles, []);
        if (result) {
            resetForm();
            onOpenChange(false);
        }
    };
    const handleProviderChange = (value) => {
        const providerValue = value;
        setSelectedProvider(providerValue);
    };
    const handleRoleChange = (role, checked) => {
        if (checked) {
            setSelectedRoles([...selectedRoles, role]);
        }
        else {
            setSelectedRoles(selectedRoles.filter(r => r !== role));
        }
    };
    const handleFeatureChange = (feature, checked) => {
        if (checked) {
            setSelectedFeatures([...selectedFeatures, feature]);
        }
        else {
            setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
        }
    };
    const getStepDescription = () => {
        switch (currentStep) {
            case 1: return "Enter your API key information";
            case 2: return "Configure key permissions and assignments";
            case 3: return "Set up RAG and planning preferences";
            default: return "";
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: handleClose, children: _jsxs(DialogContent, { className: "sm:max-w-[540px] rounded-lg border border-[#2A3148] bg-[#1A1F2C] backdrop-blur-lg shadow-xl", children: [_jsxs(DialogHeader, { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx(DialogTitle, { className: "text-xl font-bold gradient-text", children: "Add New API Key" }), _jsx(Button, { variant: "ghost", size: "icon", onClick: handleClose, className: "h-8 w-8 rounded-full hover:bg-slate-800", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsx(DialogDescription, { className: "text-muted-foreground", children: getStepDescription() })] }), _jsxs("div", { className: "mt-4 space-y-5", children: [_jsx(WizardProgress, { currentStep: currentStep, totalSteps: TOTAL_STEPS, steps: STEP_NAMES }), _jsxs("div", { className: "py-3", children: [currentStep === 1 && (_jsx(KeyDetailsStep, { selectedProvider: selectedProvider, onProviderChange: handleProviderChange, keyName: newKey.name, onKeyNameChange: (value) => setNewKey({ ...newKey, name: value }), keyValue: newKey.key, onKeyValueChange: (value) => setNewKey({ ...newKey, key: value }) })), currentStep === 2 && (_jsx(PermissionsStep, { selectedRoles: selectedRoles, onRoleChange: handleRoleChange, selectedFeatures: selectedFeatures, onFeatureChange: handleFeatureChange })), currentStep === 3 && (_jsx(FeaturesStep, { ragPreference: ragPreference, onRagPreferenceChange: setRagPreference, planningMode: planningMode, onPlanningModeChange: setPlanningMode }))] }), _jsx(WizardNavigation, { currentStep: currentStep, totalSteps: TOTAL_STEPS, onNext: nextStep, onPrevious: prevStep, onCancel: handleClose, isSubmitting: isSubmitting, isLastStep: currentStep === TOTAL_STEPS })] })] }) }));
}
