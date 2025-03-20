import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAPIKeyManagement } from '@/hooks/admin/settings/api/useAPIKeyManagement';
export const APIConfigStep = ({ onNext, onBack, isFirstTimeUser }) => {
    const [openaiKey, setOpenaiKey] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createApiKey } = useAPIKeyManagement();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!openaiKey)
            return;
        setIsSubmitting(true);
        try {
            await createApiKey('openai', // Fix: Add type assertion
            'Primary OpenAI Key', openaiKey, {
                feature_bindings: ['chat', 'embeddings'],
                rag_preference: 'supabase',
                planning_mode: 'basic'
            }, ['user', 'developer', 'admin'], []);
            onNext();
        }
        catch (error) {
            console.error('Error saving API key:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "openaiKey", children: "OpenAI API Key" }), _jsx(Input, { id: "openaiKey", type: "password", placeholder: "sk-...", value: openaiKey, onChange: (e) => setOpenaiKey(e.target.value) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx(Button, { variant: "outline", onClick: onBack, children: "Back" }), _jsx(Button, { type: "submit", disabled: isSubmitting, children: isSubmitting ? 'Submitting...' : 'Next' })] })] }));
};
