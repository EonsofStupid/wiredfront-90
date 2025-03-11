
import { Card, CardContent } from "@/components/ui/card";
import { APIConfigurationList } from "@/components/admin/settings/api/APIConfigurationList";
import { useAPIConfigurations } from "@/hooks/admin/settings/useAPIConfigurations";
import { APIType } from "@/types/admin/settings/api-configuration";
import { useCallback } from "react";

interface APIConfigStepProps {
  isFirstTimeUser?: boolean;
}

export function APIConfigStep({ isFirstTimeUser = false }: APIConfigStepProps) {
  const { configurations, loading, updateConfiguration, createConfiguration, deleteConfiguration } = useAPIConfigurations();

  const handleConfigurationChange = useCallback(async (checked: boolean, config: any, apiType: APIType) => {
    if (config) {
      await updateConfiguration(config.id, { is_enabled: checked });
    } else {
      // Generate a memorable name for new configurations
      const name = `${apiType}_config_${Date.now()}`;
      await createConfiguration(apiType, name);
    }
  }, [updateConfiguration, createConfiguration]);

  const handleSetDefault = useCallback(async (configId: string) => {
    await updateConfiguration(configId, { is_default: true });
  }, [updateConfiguration]);

  const handleDelete = useCallback(async (configId: string) => {
    await deleteConfiguration(configId);
  }, [deleteConfiguration]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            {isFirstTimeUser 
              ? "To get started, you'll need to configure at least one AI provider. Don't worry, you can always update these later."
              : "Configure your API keys to enable AI features. You can update these later in settings."}
          </p>
          <APIConfigurationList
            configurations={configurations}
            onConfigurationChange={handleConfigurationChange}
            onSetDefault={handleSetDefault}
            onDelete={handleDelete}
          />
        </div>
      </CardContent>
    </Card>
  );
}
