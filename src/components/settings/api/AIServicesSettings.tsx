import { useState } from "react";
import { useAPIConfigurations } from "@/hooks/settings/useAPIConfigurations";
import { APIType } from "@/types/store/settings/api-config";
import { CreateConfigurationOptions } from "@/types/settings/api-configuration";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ServiceCard } from "./components/ServiceCard";
import { useServiceConnection } from "./hooks/useServiceConnection";
import { ServiceConfig, NewConfigState } from "./types";
import { API_CONFIGURATIONS } from "@/constants/api-configurations";

export function AIServicesSettings() {
  const { configurations, createConfiguration } = useAPIConfigurations();
  const { isConnecting, selectedConfig, handleConnect } = useServiceConnection();
  const [newConfigs, setNewConfigs] = useState<Record<APIType, NewConfigState>>({} as Record<APIType, NewConfigState>);

  const handleConfigChange = (type: APIType, field: string, value: string) => {
    setNewConfigs(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const handleSaveConfig = async (type: APIType) => {
    try {
      const config = newConfigs[type];
      if (!config?.name || !config?.key) {
        toast.error("Please provide both name and API key");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to save configurations");
        return;
      }

      const secretName = `${type.toUpperCase()}_API_KEY_${config.name.replace(/\s+/g, '_').toUpperCase()}`;
      
      const { data: secretData, error: secretError } = await supabase.functions.invoke('manage-api-secret', {
        body: { 
          secretName,
          secretValue: config.key,
          provider: type
        }
      });

      if (secretError) {
        console.error('Error saving secret:', secretError);
        throw new Error(secretError.message || 'Failed to save API key securely');
      }

      if (!secretData?.success) {
        throw new Error('Failed to save API key');
      }

      const configOptions: CreateConfigurationOptions = {
        name: config.name,
        provider_settings: {
          api_key_secret: secretName,
          provider: type
        }
      };

      await createConfiguration(type, configOptions);

      setNewConfigs(prev => ({
        ...prev,
        [type]: { name: '', key: '' }
      }));

      toast.success(`${type} configuration saved successfully`);
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error(error instanceof Error ? error.message : "Failed to save configuration");
    }
  };

  return (
    <div className="space-y-6">
      {API_CONFIGURATIONS.map(config => (
        <ServiceCard
          key={config.type}
          {...config}
          configurations={configurations.filter(c => c.api_type === config.type)}
          newConfig={newConfigs[config.type] || { name: '', key: '' }}
          isConnecting={isConnecting}
          selectedConfig={selectedConfig}
          onConnect={(configId) => {
            const configuration = configurations.find(c => c.id === configId);
            if (configuration) {
              handleConnect(configId, configuration.name || 'AI Service', configuration.api_type);
            }
          }}
          onConfigChange={handleConfigChange}
          onSaveConfig={handleSaveConfig}
        />
      ))}
    </div>
  );
}