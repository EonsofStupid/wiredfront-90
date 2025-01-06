import { useState } from "react";
import { useAPIConfigurations } from "@/hooks/settings/useAPIConfigurations";
import { APIType } from "@/types/store/settings/api-config";
import { CreateConfigurationOptions } from "@/types/settings/api-configuration";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMessageStore } from "@/features/chat/core/messaging/MessageManager";
import { useSessionManager } from "@/hooks/useSessionManager";
import { ServiceCard } from "./components/ServiceCard";

interface APIKeyConfig {
  name: string;
  key: string;
  assistantId?: string;
}

export function AIServicesSettings() {
  const { configurations, createConfiguration, updateConfiguration } = useAPIConfigurations();
  const { addMessage } = useMessageStore();
  const { createSession } = useSessionManager();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [newConfigs, setNewConfigs] = useState<Record<APIType, APIKeyConfig>>({
    openai: { name: '', key: '', assistantId: '' },
    huggingface: { name: '', key: '', assistantId: '' },
    gemini: { name: '', key: '', assistantId: '' },
    anthropic: { name: '', key: '', assistantId: '' }
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
      
      const { error: secretError } = await supabase.functions.invoke('save-api-secret', {
        body: { 
          secretName,
          secretValue: config.key,
          provider: type
        }
      });

      if (secretError) {
        throw new Error('Failed to save API key securely');
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
      toast.error("Failed to save configuration");
    }
  };

  const handleConnect = async (configId: string) => {
    try {
      setIsConnecting(true);
      setSelectedConfig(configId);

      const config = configurations.find(c => c.id === configId);
      if (!config) {
        throw new Error('Configuration not found');
      }

      const sessionId = await createSession();

      await addMessage({
        content: `Establishing connection to ${config.assistant_name}...`,
        type: 'system',
        chat_session_id: sessionId,
        metadata: {
          configId: config.id,
          provider: config.api_type
        }
      });

      const { data, error } = await supabase.functions.invoke('test-ai-connection', {
        body: {
          provider: config.api_type,
          configId: config.id
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        await addMessage({
          content: `Successfully connected to ${config.assistant_name}. You can now start chatting!`,
          type: 'system',
          chat_session_id: sessionId,
          metadata: {
            configId: config.id,
            provider: config.api_type,
            status: 'connected'
          }
        });

        toast.success(`Connected to ${config.assistant_name} successfully`);
        
        await updateConfiguration(config.id, {
          validation_status: 'valid',
          last_validated: new Date().toISOString()
        });
      } else {
        throw new Error('Failed to connect to AI service');
      }

    } catch (error) {
      console.error('Connection error:', error);
      toast.error("Failed to connect to AI service");
      
      if (sessionId) {
        await addMessage({
          content: `Failed to connect: ${error.message}`,
          type: 'system',
          chat_session_id: sessionId,
          metadata: {
            configId: config.id,
            provider: config.api_type,
            status: 'error'
          }
        });
      }
    } finally {
      setIsConnecting(false);
      setSelectedConfig(null);
    }
  };

  const serviceConfigs = [
    {
      type: 'openai' as APIType,
      title: 'OpenAI',
      description: 'Configure OpenAI API for GPT models and other AI services.',
      docsUrl: 'https://platform.openai.com/api-keys',
      docsText: 'OpenAI dashboard',
      placeholder: 'sk-...'
    },
    {
      type: 'anthropic' as APIType,
      title: 'Anthropic Claude',
      description: 'Set up Anthropic Claude for advanced AI capabilities.',
      docsUrl: 'https://console.anthropic.com/account/keys',
      docsText: 'Anthropic Console',
      placeholder: 'sk-ant-...'
    },
    {
      type: 'gemini' as APIType,
      title: 'Google Gemini',
      description: 'Configure Google Gemini API for AI services.',
      docsUrl: 'https://makersuite.google.com/app/apikey',
      docsText: 'Google AI Studio',
      placeholder: 'Enter Gemini API key'
    },
    {
      type: 'huggingface' as APIType,
      title: 'Hugging Face',
      description: 'Set up Hugging Face for access to open-source AI models.',
      docsUrl: 'https://huggingface.co/settings/tokens',
      docsText: 'Hugging Face settings',
      placeholder: 'hf_...'
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
          onConnect={handleConnect}
          onConfigChange={handleConfigChange}
          onSaveConfig={handleSaveConfig}
        />
      ))}
    </div>
  );
}