import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AIServicesSettings } from "./api/AIServicesSettings";
import { CloudStorageSettings } from "./api/CloudStorageSettings";
import { DevelopmentSettings } from "./api/DevelopmentSettings";
import { VoiceSettings } from "./api/VoiceSettings";
import { RAGKeysSettings } from "./api/RAGKeysSettings";
import { OAuthConnectionsSettings } from "./api/oauth/OAuthConnectionsSettings";
import { ChatProviderSettings } from "./api/chat/ChatProviderSettings";
import { useAPISettings } from "@/hooks/admin/settings/api";
import { toast } from "sonner";
import { AdminCard, AdminCardContent } from "@/components/admin/ui/AdminCard";
import { Save, MessageSquare, KeyRound } from "lucide-react";
import { ChatSettings } from "./ChatSettings";
import { APIKeyManagement } from "./api/APIKeyManagement";
import { useRoleStore } from "@/stores/role";
export function APISettings() {
    const { settings, updateSetting, isSaving, handleSave, user } = useAPISettings();
    const { hasRole } = useRoleStore();
    const isAdmin = hasRole('super_admin') || hasRole('admin');
    const onSave = async () => {
        try {
            await handleSave();
            toast.success("API settings saved successfully", {
                className: "admin-toast",
                description: "Your API configuration has been updated."
            });
        }
        catch (error) {
            console.error('Failed to save API settings:', error);
            toast.error("Failed to save API settings", {
                className: "admin-toast admin-toast-error",
                description: "Please try again or check the console for details."
            });
        }
    };
    if (!user) {
        return null;
    }
    return (_jsxs("div", { className: "admin-container space-y-6", children: [_jsxs("header", { className: "space-y-2", children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight admin-heading", children: "API Settings" }), _jsx("p", { className: "text-muted-foreground", children: "Configure your API keys and tokens for various services." })] }), _jsx(AdminCard, { children: _jsxs(AdminCardContent, { children: [_jsxs(Tabs, { defaultValue: "ai-services", className: "space-y-4", children: [_jsxs(TabsList, { className: "admin-tabs-list", children: [_jsx(TabsTrigger, { value: "ai-services", className: "admin-tab", children: "AI Services" }), _jsx(TabsTrigger, { value: "chat-providers", className: "admin-tab", children: "Chat Providers" }), _jsxs(TabsTrigger, { value: "chat-settings", className: "admin-tab", children: [_jsx(MessageSquare, { className: "h-4 w-4 mr-2" }), "Chat Settings"] }), hasRole('super_admin') && (_jsxs(TabsTrigger, { value: "api-keys", className: "admin-tab", children: [_jsx(KeyRound, { className: "h-4 w-4 mr-2" }), "API Key Management"] })), _jsx(TabsTrigger, { value: "oauth", className: "admin-tab", children: "OAuth Providers" }), _jsx(TabsTrigger, { value: "rag-keys", className: "admin-tab", children: "Vector DB Keys" }), _jsx(TabsTrigger, { value: "voice", className: "admin-tab", children: "Voice" }), _jsx(TabsTrigger, { value: "cloud-storage", className: "admin-tab", children: "Cloud Storage" }), _jsx(TabsTrigger, { value: "development", className: "admin-tab", children: "Development" })] }), _jsx(TabsContent, { value: "ai-services", className: "pt-4", children: _jsx(AIServicesSettings, {}) }), _jsx(TabsContent, { value: "chat-providers", className: "pt-4", children: _jsx(ChatProviderSettings, {}) }), _jsx(TabsContent, { value: "chat-settings", className: "pt-4", children: _jsx(ChatSettings, {}) }), hasRole('super_admin') && (_jsx(TabsContent, { value: "api-keys", className: "pt-4", children: _jsx(APIKeyManagement, {}) })), _jsx(TabsContent, { value: "oauth", className: "pt-4", children: _jsx(OAuthConnectionsSettings, {}) }), _jsx(TabsContent, { value: "rag-keys", className: "pt-4", children: _jsx(RAGKeysSettings, {}) }), _jsx(TabsContent, { value: "voice", className: "pt-4", children: _jsx(VoiceSettings, { elevenLabsKey: settings.elevenLabsKey, onElevenLabsKeyChange: (value) => updateSetting('elevenLabsKey', value), selectedVoice: settings.selectedVoice, onVoiceChange: (value) => updateSetting('selectedVoice', value) }) }), _jsx(TabsContent, { value: "cloud-storage", className: "pt-4", children: _jsx(CloudStorageSettings, { googleDriveKey: settings.googleDriveKey, dropboxKey: settings.dropboxKey, awsAccessKey: settings.awsAccessKey, awsSecretKey: settings.awsSecretKey, onGoogleDriveKeyChange: (value) => updateSetting('googleDriveKey', value), onDropboxKeyChange: (value) => updateSetting('dropboxKey', value), onAwsAccessKeyChange: (value) => updateSetting('awsAccessKey', value), onAwsSecretKeyChange: (value) => updateSetting('awsSecretKey', value) }) }), _jsx(TabsContent, { value: "development", className: "pt-4", children: _jsx(DevelopmentSettings, { githubToken: settings.githubToken, dockerToken: settings.dockerToken, onGithubTokenChange: (value) => updateSetting('githubToken', value), onDockerTokenChange: (value) => updateSetting('dockerToken', value) }) })] }), _jsx("div", { className: "flex justify-end mt-8", children: _jsx(Button, { onClick: onSave, disabled: isSaving, className: "admin-primary-button group", children: isSaving ? (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" }), "Saving..."] })) : (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Save, { className: "h-4 w-4 transition-transform group-hover:scale-110" }), "Save API Settings"] })) }) })] }) })] }));
}
