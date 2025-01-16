import { useState } from "react";
import { useAPIConfigurations } from "@/hooks/settings/useAPIConfigurations";
import { APIType } from "@/types/store/settings/api-config";
import { CreateConfigurationOptions } from "@/types/settings/api-configuration";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ServiceCard } from "./components/ServiceCard";
import { useServiceConnection } from "./hooks/useServiceConnection";
import { ServiceConfig, NewConfigState } from "./types";

export function AIServicesSettings() {
  const { configurations, createConfiguration } = useAPIConfigurations();
  const { isConnecting, selectedConfig, handleConnect } = useServiceConnection();
  const [newConfigs, setNewConfigs] = useState<Record<APIType, NewConfigState>>({
    openai: { name: '', key: '', assistantId: '' },
    huggingface: { name: '', key: '', assistantId: '' },
    gemini: { name: '', key: '', assistantId: '' },
    anthropic: { name: '', key: '', assistantId: '' },
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
        assistant_name: config.name,
        assistant_id: config.assistantId || null,
        provider_settings: {
          api_key_secret: secretName,
          provider: type
        }
      };

      await createConfiguration(type, configOptions);

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

  const serviceConfigs: ServiceConfig[] = [
    {
      type: 'openai',
      title: 'OpenAI',
      description: 'Configure OpenAI API for GPT models and other AI services.',
      docsUrl: 'https://platform.openai.com/api-keys',
      docsText: 'OpenAI dashboard',
      placeholder: 'sk-...'
    },
    {
      type: 'anthropic',
      title: 'Anthropic Claude',
      description: 'Set up Anthropic Claude for advanced AI capabilities.',
      docsUrl: 'https://console.anthropic.com/account/keys',
      docsText: 'Anthropic Console',
      placeholder: 'sk-ant-...'
    },
    {
      type: 'gemini',
      title: 'Google Gemini',
      description: 'Configure Google Gemini API for AI services.',
      docsUrl: 'https://makersuite.google.com/app/apikey',
      docsText: 'Google AI Studio',
      placeholder: 'Enter Gemini API key'
    },
    {
      type: 'huggingface',
      title: 'Hugging Face',
      description: 'Set up Hugging Face for access to open-source AI models.',
      docsUrl: 'https://huggingface.co/settings/tokens',
      docsText: 'Hugging Face settings',
      placeholder: 'hf_...'
    },
    {
      type: 'pinecone',
      title: 'Pinecone',
      description: 'Vector database for embeddings and similarity search.',
      docsUrl: 'https://console.pinecone.io/organizations/-/apikeys',
      docsText: 'Pinecone Console',
      placeholder: 'Enter Pinecone API key'
    },
    {
      type: 'weaviate',
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
              handleConnect(configId, configuration.assistant_name || 'AI Service', configuration.api_type);
            }
          }}
          onConfigChange={handleConfigChange}
          onSaveConfig={handleSaveConfig}
        />
      ))}
    </div>
  );
}