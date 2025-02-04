import { Settings2 } from "lucide-react";
import { useAPIConfigurations } from "@/hooks/settings/useAPIConfigurations";
import { APIType } from "@/types/store/settings/api-config";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback } from "react";
import { APIConfigurationList } from "./api/APIConfigurationList";
import { toast } from "sonner";

export function APIConfigurationPanel() {
  const { configurations, loading, updateConfiguration, createConfiguration, deleteConfiguration } = useAPIConfigurations();

  const handleConfigurationChange = useCallback(async (checked: boolean, config: typeof configurations[0] | undefined, apiType: APIType) => {
    try {
      if (config) {
        await updateConfiguration(config.id, { is_enabled: checked });
        toast.success(`${apiType} configuration ${checked ? 'enabled' : 'disabled'}`);
      } else {
        await createConfiguration(apiType);
        toast.success(`New ${apiType} configuration created`);
      }
    } catch (error) {
      console.error('Error updating configuration:', error);
      toast.error('Failed to update configuration');
    }
  }, [updateConfiguration, createConfiguration]);

  const handleSetDefault = useCallback(async (configId: string) => {
    try {
      await updateConfiguration(configId, { is_default: true });
      toast.success('Default configuration updated');
    } catch (error) {
      console.error('Error setting default configuration:', error);
      toast.error('Failed to set default configuration');
    }
  }, [updateConfiguration]);

  const handleDelete = useCallback(async (configId: string) => {
    try {
      await deleteConfiguration(configId);
      toast.success('Configuration deleted successfully');
    } catch (error) {
      console.error('Error deleting configuration:', error);
      toast.error('Failed to delete configuration');
    }
  }, [deleteConfiguration]);

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
        onDelete={handleDelete}
      />
    </div>
  );
}