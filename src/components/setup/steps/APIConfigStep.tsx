import { Card, CardContent } from "@/components/ui/card";
import { useAPIConfigurations } from "@/hooks/settings/useAPIConfigurations";
import { APIType } from "@/types/store/settings/api-config";
import { useCallback } from "react";
import { APIConfigurationList } from "@/components/settings/api/APIConfigurationList";
import { useAPISettings } from "@/hooks/settings/api";

export function APIConfigStep() {
  const { configurations, loading, updateConfiguration, createConfiguration } = useAPIConfigurations();
  const { settings } = useAPISettings();

  const handleConfigurationChange = useCallback(async (checked: boolean, config: typeof configurations[0] | undefined, apiType: APIType) => {
    if (config) {
      await updateConfiguration(config.id, { is_enabled: checked });
    } else {
      await createConfiguration(apiType);
    }
  }, [updateConfiguration, createConfiguration]);

  const handleSetDefault = useCallback(async (configId: string) => {
    await updateConfiguration(configId, { is_default: true });
  }, [updateConfiguration]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Configure your API keys to enable AI features. You can update these later in settings.
          </p>
          <APIConfigurationList
            configurations={configurations}
            onConfigurationChange={handleConfigurationChange}
            onSetDefault={handleSetDefault}
          />
        </div>
      </CardContent>
    </Card>
  );
}
