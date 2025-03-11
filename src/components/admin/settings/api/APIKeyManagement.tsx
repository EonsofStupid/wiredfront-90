
import { useRoleStore } from "@/stores/role";
import { SettingsContainer } from "../layout/SettingsContainer";
import { APIKeyWizard } from "./APIKeyWizard";
import { useAPIKeyManagement } from "@/hooks/admin/settings/api/useAPIKeyManagement";
import { useAPIKeyList } from "@/hooks/admin/settings/api/useAPIKeyList";
import { APIType } from "@/types/admin/settings/api";
import { useAPIManagementPermissions } from "./hooks/useAPIManagementPermissions";
import { KeyManagementContent } from "./components/KeyManagementContent";
import { useEnsureUserProfile } from "@/hooks/useEnsureUserProfile";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

export function APIKeyManagement() {
  const { 
    isLoading,
    configurations,
    fetchConfigurations,
    createApiKey,
    deleteConfig,
    validateConfig
  } = useAPIKeyManagement();

  const {
    showAddDialog,
    handleOpenAddDialog,
    handleCloseAddDialog,
    hasConfigurations
  } = useAPIKeyList(configurations);

  const { canManageKeys } = useAPIManagementPermissions();
  const { isChecking, isProfileReady, error } = useEnsureUserProfile();

  const handleSaveKey = async (
    provider: APIType,
    memorableName: string,
    secretValue: string,
    settings: any,
    roleBindings: string[],
    userBindings: string[] = []
  ) => {
    const success = await createApiKey(
      provider, 
      memorableName, 
      secretValue, 
      settings, 
      roleBindings,
      userBindings
    );
    
    if (success) {
      handleCloseAddDialog();
    }
    return success;
  };

  if (error) {
    return (
      <SettingsContainer
        title="API Key Management"
        description="Manage API keys for different services"
      >
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Profile Error</AlertTitle>
          <AlertDescription>
            {error.message}
            <div className="mt-2">
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </SettingsContainer>
    );
  }

  if (!canManageKeys) {
    return (
      <SettingsContainer
        title="API Key Management"
        description="Manage API keys for different services"
      >
        <Alert>
          <AlertTitle>Access Restricted</AlertTitle>
          <AlertDescription>
            You don't have permission to manage API keys. Please contact an administrator.
          </AlertDescription>
        </Alert>
      </SettingsContainer>
    );
  }

  return (
    <ErrorBoundary>
      <SettingsContainer
        title="API Key Management" 
        description="Securely manage API keys for AI services and integrations"
      >
        <KeyManagementContent 
          isLoading={isLoading || isChecking}
          configurations={configurations}
          hasConfigurations={hasConfigurations}
          onAddKey={handleOpenAddDialog}
          onValidate={validateConfig}
          onDelete={deleteConfig}
          onRefresh={fetchConfigurations}
        />

        <APIKeyWizard
          open={showAddDialog}
          onOpenChange={handleCloseAddDialog}
          onSave={handleSaveKey}
          isSubmitting={isLoading}
        />
      </SettingsContainer>
    </ErrorBoundary>
  );
}
