
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Key, Lock, PlusCircle } from "lucide-react";
import { useRoleStore } from "@/stores/role";
import { SettingsContainer } from "../layout/SettingsContainer";
import { APIKeyWizard } from "./APIKeyWizard";
import { APIKeyCard } from "./APIKeyCard";
import { useAPIKeyManagement } from "@/hooks/admin/settings/api/useAPIKeyManagement";
import { APIType } from "@/types/admin/settings/api";

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
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2 text-destructive" />
              Access Restricted
            </CardTitle>
            <CardDescription>
              You don't have permission to manage API keys. This feature is restricted to Super Admin users.
            </CardDescription>
          </CardHeader>
        </Card>
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
          <div className="space-y-3">
            <Skeleton className="h-[125px] w-full rounded-lg" />
            <Skeleton className="h-[125px] w-full rounded-lg" />
          </div>
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
          <Card>
            <CardHeader>
              <CardTitle>No API Keys</CardTitle>
              <CardDescription>
                You haven't configured any API keys yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Add your first API key to start using AI services and other integrations.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="admin-primary-button w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First API Key
              </Button>
            </CardFooter>
          </Card>
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
