
import { useRoleStore } from "@/stores/role";
import { SettingsContainer } from "../layout/SettingsContainer";
import { APIKeyWizard } from "./APIKeyWizard";
import { useAPIKeyManagement } from "@/hooks/admin/settings/api/useAPIKeyManagement";
import { APIKeyHeader } from "./components/APIKeyHeader";
import { APIKeyList } from "./components/APIKeyList";
import { EmptyAPIKeysList } from "./components/EmptyAPIKeysList";
import { APIKeysSkeletonLoader } from "./components/APIKeysSkeletonLoader";
import { AccessRestrictionCard } from "./components/AccessRestrictionCard";
import { useAPIKeyList } from "@/hooks/admin/settings/api/useAPIKeyList";
import { APIType } from "@/types/admin/settings/api";
import { useAPIManagementPermissions } from "./hooks/useAPIManagementPermissions";
import { KeyManagementContent } from "./components/KeyManagementContent";
import { useEnsureUserProfile } from "@/hooks/useEnsureUserProfile";

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
  const { isChecking } = useEnsureUserProfile();

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

  if (!canManageKeys) {
    return (
      <SettingsContainer
        title="API Key Management"
        description="Manage API keys for different services"
      >
        <AccessRestrictionCard />
      </SettingsContainer>
    );
  }

  return (
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
  );
}
