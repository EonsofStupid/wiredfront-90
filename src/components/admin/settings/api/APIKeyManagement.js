import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SettingsContainer } from "../layout/SettingsContainer";
import { APIKeyWizard } from "./APIKeyWizard";
import { useAPIKeyManagement } from "@/hooks/admin/settings/api/useAPIKeyManagement";
import { useAPIKeyList } from "@/hooks/admin/settings/api/useAPIKeyList";
import { useAPIManagementPermissions } from "./hooks/useAPIManagementPermissions";
import { KeyManagementContent } from "./components/KeyManagementContent";
import { useEnsureUserProfile } from "@/hooks/useEnsureUserProfile";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
export function APIKeyManagement() {
    const { isLoading, configurations, fetchConfigurations, createApiKey, deleteConfig, validateConfig } = useAPIKeyManagement();
    const { showAddDialog, handleOpenAddDialog, handleCloseAddDialog, hasConfigurations } = useAPIKeyList(configurations);
    const { canManageKeys } = useAPIManagementPermissions();
    const { isChecking, isProfileReady, error } = useEnsureUserProfile();
    const handleSaveKey = async (provider, memorableName, secretValue, settings, roleBindings, userBindings = []) => {
        const success = await createApiKey(provider, memorableName, secretValue, settings, roleBindings, userBindings);
        if (success) {
            handleCloseAddDialog();
        }
        return success;
    };
    if (error) {
        return (_jsx(SettingsContainer, { title: "API Key Management", description: "Manage API keys for different services", children: _jsxs(Alert, { variant: "destructive", children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "Profile Error" }), _jsxs(AlertDescription, { children: [error.message, _jsx("div", { className: "mt-2", children: _jsx(Button, { variant: "outline", onClick: () => window.location.reload(), children: "Retry" }) })] })] }) }));
    }
    if (!canManageKeys) {
        return (_jsx(SettingsContainer, { title: "API Key Management", description: "Manage API keys for different services", children: _jsxs(Alert, { children: [_jsx(AlertTitle, { children: "Access Restricted" }), _jsx(AlertDescription, { children: "You don't have permission to manage API keys. Please contact an administrator." })] }) }));
    }
    return (_jsx(ErrorBoundary, { children: _jsxs(SettingsContainer, { title: "API Key Management", description: "Securely manage API keys for AI services and integrations", children: [_jsx(KeyManagementContent, { isLoading: isLoading || isChecking, configurations: configurations, hasConfigurations: hasConfigurations, onAddKey: handleOpenAddDialog, onValidate: validateConfig, onDelete: deleteConfig, onRefresh: fetchConfigurations }), _jsx(APIKeyWizard, { open: showAddDialog, onOpenChange: handleCloseAddDialog, onSave: handleSaveKey, isSubmitting: isLoading })] }) }));
}
