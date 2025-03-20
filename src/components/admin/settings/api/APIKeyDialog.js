import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Copy, CheckCircle, Key, Info, Zap, Database, MessageSquare, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
export function APIKeyDialog({ isOpen, onClose, onKeyAdded }) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiType, setApiType] = useState('openai');
    const [memorableName, setMemorableName] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [usageType, setUsageType] = useState('all');
    const [ragPreference, setRagPreference] = useState('supabase');
    const [planningMode, setPlanningMode] = useState('basic');
    const [savedApiKey, setSavedApiKey] = useState('');
    const [keyCopied, setKeyCopied] = useState(false);
    const resetForm = () => {
        setStep(1);
        setApiType('openai');
        setMemorableName('');
        setApiKey('');
        setUsageType('all');
        setRagPreference('supabase');
        setPlanningMode('basic');
        setSavedApiKey('');
        setKeyCopied(false);
    };
    const handleClose = () => {
        resetForm();
        onClose();
    };
    const nextStep = () => {
        if (step === 1 && (!apiType || !memorableName || !apiKey)) {
            toast.error("Please fill out all fields");
            return;
        }
        setStep(step + 1);
    };
    const prevStep = () => {
        setStep(step - 1);
    };
    const copyToClipboard = () => {
        navigator.clipboard.writeText(savedApiKey);
        setKeyCopied(true);
        toast.success("API key copied to clipboard");
        setTimeout(() => {
            setKeyCopied(false);
        }, 3000);
    };
    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            // Create configuration object with all settings
            const configSettings = {
                usage_type: usageType,
                rag_preference: ragPreference,
                planning_mode: planningMode,
                feature_bindings: []
            };
            if (usageType === 'chat') {
                configSettings.feature_bindings.push('chat');
            }
            else if (usageType === 'rag') {
                configSettings.feature_bindings.push('rag');
            }
            else if (usageType === 'planning') {
                configSettings.feature_bindings.push('planning');
            }
            else {
                configSettings.feature_bindings = ['chat', 'rag', 'planning'];
            }
            const result = await supabase.functions.invoke('manage-api-secret', {
                body: {
                    action: 'create',
                    provider: apiType,
                    memorableName,
                    secretValue: apiKey,
                    settings: configSettings
                },
            });
            if (result.error) {
                throw new Error(result.error.message || 'Failed to save API key');
            }
            toast.success("API key saved successfully");
            setSavedApiKey(apiKey);
            setStep(3);
        }
        catch (error) {
            console.error('Error saving API key:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to save API key');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const getApiTypeLabel = (type) => {
        switch (type) {
            case 'openai':
                return 'OpenAI';
            case 'anthropic':
                return 'Anthropic (Claude)';
            case 'gemini':
                return 'Google Gemini';
            case 'huggingface':
                return 'HuggingFace';
            case 'pinecone':
                return 'Pinecone (Vector DB)';
            default:
                return type;
        }
    };
    return (_jsx(Dialog, { open: isOpen, onOpenChange: handleClose, children: _jsxs(DialogContent, { className: "sm:max-w-[550px]", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(Key, { className: "h-5 w-5 text-primary" }), step === 1 && "Add New API Key", step === 2 && "Configure Key Usage", step === 3 && "API Key Added Successfully"] }), _jsxs(DialogDescription, { children: [step === 1 && "Enter your API key details. This key will be securely stored and never displayed again.", step === 2 && "Configure how this API key will be used in the system.", step === 3 && "Your API key has been securely stored. Please save it now as it won't be displayed again."] })] }), step === 1 && (_jsxs("div", { className: "space-y-4 py-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "api-type", children: "API Provider" }), _jsxs(Select, { value: apiType, onValueChange: (value) => setApiType(value), children: [_jsx(SelectTrigger, { id: "api-type", children: _jsx(SelectValue, { placeholder: "Select API provider" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "openai", children: "OpenAI" }), _jsx(SelectItem, { value: "anthropic", children: "Anthropic (Claude)" }), _jsx(SelectItem, { value: "gemini", children: "Google Gemini" }), _jsx(SelectItem, { value: "huggingface", children: "HuggingFace" }), _jsx(SelectItem, { value: "pinecone", children: "Pinecone Vector DB" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "memorable-name", children: "Memorable Name" }), _jsx(Input, { id: "memorable-name", placeholder: "e.g., OpenAI Production, Claude Testing", value: memorableName, onChange: (e) => setMemorableName(e.target.value) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "A friendly name to help you identify this key later" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "api-key", children: "API Key" }), _jsx(Input, { id: "api-key", type: "password", placeholder: "Enter your API key", value: apiKey, onChange: (e) => setApiKey(e.target.value) }), _jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [_jsx(Info, { className: "h-3 w-3" }), "This key will be securely stored and never displayed again"] })] })] })), step === 2 && (_jsxs("div", { className: "space-y-6 py-2", children: [_jsxs("div", { className: "space-y-4", children: [_jsx(Label, { children: "Key Usage" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs(Button, { type: "button", variant: usageType === 'all' ? 'default' : 'outline', className: `h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 ${usageType === 'all' ? 'border-primary/50' : ''}`, onClick: () => setUsageType('all'), children: [_jsx(Zap, { className: "h-5 w-5" }), _jsx("span", { className: "text-sm font-medium", children: "All Features" }), _jsx("span", { className: "text-xs text-muted-foreground text-center", children: "Use for all AI capabilities" })] }), _jsxs(Button, { type: "button", variant: usageType === 'chat' ? 'default' : 'outline', className: `h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 ${usageType === 'chat' ? 'border-primary/50' : ''}`, onClick: () => setUsageType('chat'), children: [_jsx(MessageSquare, { className: "h-5 w-5" }), _jsx("span", { className: "text-sm font-medium", children: "Chat Only" }), _jsx("span", { className: "text-xs text-muted-foreground text-center", children: "Use for chatbot features" })] }), _jsxs(Button, { type: "button", variant: usageType === 'rag' ? 'default' : 'outline', className: `h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 ${usageType === 'rag' ? 'border-primary/50' : ''}`, onClick: () => setUsageType('rag'), children: [_jsx(Database, { className: "h-5 w-5" }), _jsx("span", { className: "text-sm font-medium", children: "RAG Only" }), _jsx("span", { className: "text-xs text-muted-foreground text-center", children: "Use for document retrieval" })] }), _jsxs(Button, { type: "button", variant: usageType === 'planning' ? 'default' : 'outline', className: `h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 ${usageType === 'planning' ? 'border-primary/50' : ''}`, onClick: () => setUsageType('planning'), children: [_jsx(BrainCircuit, { className: "h-5 w-5" }), _jsx("span", { className: "text-sm font-medium", children: "Planning Only" }), _jsx("span", { className: "text-xs text-muted-foreground text-center", children: "Use for code planning" })] })] })] }), (usageType === 'all' || usageType === 'rag') && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "rag-preference", children: "RAG Preference" }), _jsxs(Select, { value: ragPreference, onValueChange: setRagPreference, children: [_jsx(SelectTrigger, { id: "rag-preference", children: _jsx(SelectValue, { placeholder: "Select RAG preference" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "supabase", children: "Supabase (Standard)" }), _jsx(SelectItem, { value: "pinecone", children: "Pinecone (Premium)" })] })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Standard uses Supabase for basic indexing, Premium uses Pinecone for deep indexing" })] })), (usageType === 'all' || usageType === 'planning') && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "planning-mode", children: "Planning Mode" }), _jsxs(Select, { value: planningMode, onValueChange: setPlanningMode, children: [_jsx(SelectTrigger, { id: "planning-mode", children: _jsx(SelectValue, { placeholder: "Select planning mode" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "basic", children: "Basic Planning" }), _jsx(SelectItem, { value: "detailed", children: "Detailed Planning" }), _jsx(SelectItem, { value: "architectural", children: "Architectural Planning" })] })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Determines the depth of planning for code generation and architectural decisions" })] }))] })), step === 3 && (_jsxs("div", { className: "space-y-4 py-2", children: [_jsxs("div", { className: "p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" }), _jsx("p", { className: "text-sm", children: "This is the only time your API key will be displayed. Please copy it now if you need to keep a backup." })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "saved-api-key", children: "Your API Key" }), _jsxs("div", { className: "flex", children: [_jsx(Input, { id: "saved-api-key", value: savedApiKey, readOnly: true, className: "rounded-r-none font-mono text-xs pr-2" }), _jsx(Button, { type: "button", variant: "outline", className: "rounded-l-none border-l-0", onClick: copyToClipboard, children: keyCopied ? (_jsx(CheckCircle, { className: "h-4 w-4 text-green-500" })) : (_jsx(Copy, { className: "h-4 w-4" })) })] })] }), _jsxs("div", { className: "space-y-2 pt-2", children: [_jsx("h4", { className: "text-sm font-medium", children: "Key Details" }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [_jsxs("div", { className: "p-2 bg-muted/30 rounded-md", children: [_jsx("div", { className: "text-xs text-muted-foreground", children: "Provider" }), _jsx("div", { className: "font-medium", children: getApiTypeLabel(apiType) })] }), _jsxs("div", { className: "p-2 bg-muted/30 rounded-md", children: [_jsx("div", { className: "text-xs text-muted-foreground", children: "Name" }), _jsx("div", { className: "font-medium", children: memorableName })] }), _jsxs("div", { className: "p-2 bg-muted/30 rounded-md", children: [_jsx("div", { className: "text-xs text-muted-foreground", children: "Usage" }), _jsx("div", { className: "font-medium capitalize", children: usageType === 'all' ? 'All Features' : `${usageType} Only` })] }), (usageType === 'all' || usageType === 'rag') && (_jsxs("div", { className: "p-2 bg-muted/30 rounded-md", children: [_jsx("div", { className: "text-xs text-muted-foreground", children: "RAG Preference" }), _jsx("div", { className: "font-medium capitalize", children: ragPreference })] })), (usageType === 'all' || usageType === 'planning') && (_jsxs("div", { className: "p-2 bg-muted/30 rounded-md", children: [_jsx("div", { className: "text-xs text-muted-foreground", children: "Planning Mode" }), _jsx("div", { className: "font-medium capitalize", children: planningMode })] }))] })] })] })), _jsxs(DialogFooter, { className: "flex items-center justify-between sm:justify-between", children: [step === 1 && (_jsxs(_Fragment, { children: [_jsx(Button, { type: "button", variant: "outline", onClick: handleClose, children: "Cancel" }), _jsx(Button, { type: "button", onClick: nextStep, disabled: !apiType || !memorableName || !apiKey, children: "Continue" })] })), step === 2 && (_jsxs(_Fragment, { children: [_jsx(Button, { type: "button", variant: "outline", onClick: prevStep, children: "Back" }), _jsx(Button, { type: "button", onClick: handleSubmit, disabled: isSubmitting, children: isSubmitting ? 'Saving...' : 'Save API Key' })] })), step === 3 && (_jsxs(_Fragment, { children: [_jsx("div", {}), _jsx(Button, { type: "button", onClick: () => {
                                        onKeyAdded();
                                        handleClose();
                                    }, children: "Done" })] }))] })] }) }));
}
