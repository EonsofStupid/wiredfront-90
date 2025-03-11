
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

export function APIKeyManagement() {
  const { hasRole } = useRoleStore();
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

  const canManageKeys = hasRole('super_admin');

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
      <div className="grid gap-6">
        <APIKeyHeader onAddKey={handleOpenAddDialog} />

        {isLoading && configurations.length === 0 ? (
          <APIKeysSkeletonLoader />
        ) : hasConfigurations ? (
          <APIKeyList
            configurations={configurations}
            onValidate={validateConfig}
            onDelete={deleteConfig}
            onRefresh={fetchConfigurations}
          />
        ) : (
          <EmptyAPIKeysList onAddKey={handleOpenAddDialog} />
        )}
      </div>

      <APIKeyWizard
        open={showAddDialog}
        onOpenChange={handleCloseAddDialog}
        onSave={handleSaveKey}
        isSubmitting={isLoading}
      />
    </SettingsContainer>
  );
}
