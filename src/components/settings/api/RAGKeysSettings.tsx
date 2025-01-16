import { useState } from "react";
import { useAPIConfigurations } from "@/hooks/settings/useAPIConfigurations";
import { APIType } from "@/types/store/settings/api-config";
import { Database } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ServiceCard } from "./components/ServiceCard";
import { useServiceConnection } from "./hooks/useServiceConnection";

export function RAGKeysSettings() {
  const { configurations, createConfiguration } = useAPIConfigurations();
  const { isConnecting, selectedConfig, handleConnect } = useServiceConnection();
  const [newConfigs, setNewConfigs] = useState<Record<APIType, { name: string; key: string; assistantId: string }>>({
    pinecone: { name: '', key: '', assistantId: '' },
    weaviate: { name: '', key: '', assistantId: '' }
  });

  const handleConfigChange = (type: APIType, field: string, value: string) => {
    setNewConfigs(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const handleSaveConfig = async (type: APIType) => {
    try {
      const config = newConfigs[type];
      if (!config.name || !config.key) {
        toast.error("Please provide both name and API key");
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

      await createConfiguration(type, {
        assistant_name: config.name,
        provider_settings: {
          api_key_secret: secretName,
          provider: type
        }
      });

      setNewConfigs(prev => ({
        ...prev,
        [type]: { name: '', key: '', assistantId: '' }
      }));

      toast.success(`${type} configuration saved successfully`);
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error(error instanceof Error ? error.message : "Failed to save configuration");
    }
  };

  const serviceConfigs = [
    {
      type: 'pinecone' as APIType,
      title: 'Pinecone',
      description: 'Vector database for embeddings and similarity search.',
      docsUrl: 'https://console.pinecone.io/organizations/-/apikeys',
      docsText: 'Pinecone Console',
      placeholder: 'Enter Pinecone API key'
    },
    {
      type: 'weaviate' as APIType,
      title: 'Weaviate',
      description: 'Vector database with semantic search capabilities.',
      docsUrl: 'https://console.weaviate.cloud/dashboard',
      docsText: 'Weaviate Cloud Console',
      placeholder: 'Enter Weaviate API key'
    }
  ];

  return (
    <div className="space-y-6">
      {serviceConfigs.map(config => (
        <ServiceCard
          key={config.type}
          {...config}
          configurations={configurations.filter(c => c.api_type === config.type)}
          newConfig={newConfigs[config.type]}
          isConnecting={isConnecting}
          selectedConfig={selectedConfig}
          onConnect={(configId) => {
            const configuration = configurations.find(c => c.id === configId);
            if (configuration) {
              handleConnect(configId, configuration.assistant_name || 'RAG Service', configuration.api_type);
            }
          }}
          onConfigChange={handleConfigChange}
          onSaveConfig={handleSaveConfig}
        />
      ))}
    </div>
  );
}