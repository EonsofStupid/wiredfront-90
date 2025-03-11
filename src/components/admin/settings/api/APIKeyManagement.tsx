
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Key, PlusCircle } from "lucide-react";
import { useRoleStore } from "@/stores/role";
import { SettingsContainer } from "../layout/SettingsContainer";
import { APIKeyWizard } from "./APIKeyWizard";
import { APIKeyCard } from "./APIKeyCard";
import { useAPIKeyManagement } from "@/hooks/admin/settings/api/useAPIKeyManagement";
import { APIType } from "@/types/admin/settings/api";
import { AccessRestrictionCard } from "./components/AccessRestrictionCard";
import { EmptyAPIKeysList } from "./components/EmptyAPIKeysList";
import { APIKeysSkeletonLoader } from "./components/APIKeysSkeletonLoader";

export function APIKeyManagement() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { hasRole } = useRoleStore();
  const { 
    isLoading,
    configurations,
    fetchConfigurations,
    createApiKey,
    deleteConfig,
    validateConfig
  } = useAPIKeyManagement();

  const canManageKeys = hasRole('super_admin');

  const handleSaveKey = async (
    provider: APIType,
    memorableName: string,
    secretValue: string,
    settings: any,
    roleBindings: string[],
    userBindings: string[] = []
  ) => {
    return createApiKey(
      provider, 
      memorableName, 
      secretValue, 
      settings, 
      roleBindings,
      userBindings
    );
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
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-lg flex items-center">
              <Key className="w-5 h-5 mr-2" />
              API Configurations
            </h3>
            <p className="text-sm text-muted-foreground">
              Manage your API keys and configurations for different services
            </p>
          </div>
          <Button 
            className="admin-primary-button"
            onClick={() => setShowAddDialog(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New API Key
          </Button>
        </div>

        {isLoading && configurations.length === 0 ? (
          <APIKeysSkeletonLoader />
        ) : configurations.length > 0 ? (
          <div className="space-y-4">
            {configurations.map((config) => (
              <APIKeyCard
                key={config.id}
                config={config}
                onValidate={validateConfig}
                onDelete={deleteConfig}
                onRefresh={fetchConfigurations}
              />
            ))}
          </div>
        ) : (
          <EmptyAPIKeysList onAddKey={() => setShowAddDialog(true)} />
        )}
      </div>

      <APIKeyWizard
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={handleSaveKey}
        isSubmitting={isLoading}
      />
    </SettingsContainer>
  );
}
