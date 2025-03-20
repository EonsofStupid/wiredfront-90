import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ServiceCard } from "./components/ServiceCard";
import { toast } from "sonner";
import { SettingsContainer } from "../layout/SettingsContainer";
export function AIServicesSettings() {
    const [isConnecting, setIsConnecting] = useState(false);
    const [newConfig, setNewConfig] = useState({ name: '', key: '' });
    const [selectedConfig, setSelectedConfig] = useState(null);
    const handleConfigChange = (type, field, value) => {
        setNewConfig(prev => ({ ...prev, [field]: value }));
    };
    const handleSaveConfig = async (type, config) => {
        try {
            setIsConnecting(true);
            // Implementation of save logic will go here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
            toast.success(`${type} configuration saved successfully`);
            setNewConfig({ name: '', key: '' });
        }
        catch (error) {
            console.error(`Error saving ${type} configuration:`, error);
            toast.error(`Failed to save ${type} configuration`);
        }
        finally {
            setIsConnecting(false);
        }
    };
    return (_jsx(SettingsContainer, { title: "AI Services Settings", description: "Configure your AI service connections.", children: _jsxs("div", { className: "grid gap-6", children: [_jsx(ServiceCard, { type: "openai", title: "OpenAI", description: "Configure OpenAI API access", docsUrl: "https://platform.openai.com/docs/api-reference", docsText: "OpenAI documentation", placeholder: "sk-...", onSaveConfig: handleSaveConfig, isConnecting: isConnecting, selectedConfig: selectedConfig, newConfig: newConfig, onConfigChange: handleConfigChange }), _jsx(ServiceCard, { type: "anthropic", title: "Anthropic", description: "Configure Anthropic Claude API access", docsUrl: "https://docs.anthropic.com/claude/reference/getting-started-with-the-api", docsText: "Anthropic documentation", placeholder: "sk-ant-...", onSaveConfig: handleSaveConfig, isConnecting: isConnecting, selectedConfig: selectedConfig, newConfig: newConfig, onConfigChange: handleConfigChange }), _jsx(ServiceCard, { type: "gemini", title: "Google Gemini", description: "Configure Google Gemini API access", docsUrl: "https://ai.google.dev/docs", docsText: "Gemini documentation", placeholder: "AIza...", onSaveConfig: handleSaveConfig, isConnecting: isConnecting, selectedConfig: selectedConfig, newConfig: newConfig, onConfigChange: handleConfigChange })] }) }));
}
