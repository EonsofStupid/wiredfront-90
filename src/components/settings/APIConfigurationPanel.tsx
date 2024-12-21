import { Settings2 } from "lucide-react";
import { useAPIConfigurations } from "@/hooks/settings/useAPIConfigurations";
import { APIType } from "@/types/store/settings/api-config";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback } from "react";
import { APIConfigurationList } from "./api/APIConfigurationList";

export function APIConfigurationPanel() {
  const { configurations, loading, updateConfiguration, createConfiguration } = useAPIConfigurations();

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

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings2 className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-medium">API Configuration</h2>
      </div>

      <APIConfigurationList
        configurations={configurations}
        onConfigurationChange={handleConfigurationChange}
        onSetDefault={handleSetDefault}
      />
    </div>
  );
}