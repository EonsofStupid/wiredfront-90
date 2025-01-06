import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAPIConfigurations } from "@/hooks/settings/useAPIConfigurations";
import { APIType } from "@/types/store/settings/api-config";
import { CreateConfigurationOptions } from "@/types/settings/api-configuration";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface APIKeyConfig {
  name: string;
  key: string;
  assistantId?: string;
}

export function AIServicesSettings() {
  const { configurations, createConfiguration, updateConfiguration } = useAPIConfigurations();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [newConfigs, setNewConfigs] = useState<Record<APIType, APIKeyConfig>>({
    openai: { name: '', key: '', assistantId: '' },
    huggingface: { name: '', key: '', assistantId: '' },
    gemini: { name: '', key: '', assistantId: '' },
    anthropic: { name: '', key: '', assistantId: '' }
  });

  const handleSaveConfig = async (type: APIType) => {
    try {
      const config = newConfigs[type];
      if (!config.name || !config.key) {
        toast.error("Please provide both name and API key");
        return;
      }

      // Store API key in Supabase secrets
      const secretName = `${type.toUpperCase()}_API_KEY_${config.name.replace(/\s+/g, '_').toUpperCase()}`;
      
      // Save API key to Supabase secrets using Edge Function
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
      
      // Create configuration with placeholder
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

      // Test connection logic here
      const testResponse = await fetch('/api/test-ai-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: config.api_type,
          configId: config.id
        })
      });

      if (!testResponse.ok) {
        throw new Error('Failed to connect to AI service');
      }

      toast.success(`Connected to ${config.assistant_name} successfully`);
      
      // Update configuration status
      await updateConfiguration(config.id, {
        validation_status: 'valid',
        last_validated: new Date().toISOString()
      });

    } catch (error) {
      console.error('Connection error:', error);
      toast.error("Failed to connect to AI service");
    } finally {
      setIsConnecting(false);
      setSelectedConfig(null);
    }
  };

  const renderServiceCard = (
    type: APIType,
    title: string,
    description: string,
    docsUrl: string,
    docsText: string,
    placeholder: string
  ) => {
    const configs = configurations.filter(c => c.api_type === type);
    const newConfig = newConfigs[type];

    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {configs.map((config) => (
            <div key={config.id} className="space-y-2 border-b pb-4">
              <div className="flex items-center justify-between">
                <Label>{config.assistant_name}</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConnect(config.id)}
                  disabled={isConnecting && selectedConfig === config.id}
                >
                  {isConnecting && selectedConfig === config.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect'
                  )}
                </Button>
              </div>
              {config.assistant_id && (
                <div className="text-sm text-muted-foreground">
                  Assistant ID: {config.assistant_id}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                Status: {config.validation_status}
              </div>
            </div>
          ))}

          <div className="space-y-2 pt-4">
            <Label>Add New Configuration</Label>
            <div className="space-y-2">
              <Input
                placeholder="Configuration Name"
                value={newConfig.name}
                onChange={(e) => setNewConfigs(prev => ({
                  ...prev,
                  [type]: { ...prev[type], name: e.target.value }
                }))}
              />
              <Input
                type="password"
                placeholder={placeholder}
                value={newConfig.key}
                onChange={(e) => setNewConfigs(prev => ({
                  ...prev,
                  [type]: { ...prev[type], key: e.target.value }
                }))}
              />
              <Input
                placeholder="Assistant ID (optional)"
                value={newConfig.assistantId}
                onChange={(e) => setNewConfigs(prev => ({
                  ...prev,
                  [type]: { ...prev[type], assistantId: e.target.value }
                }))}
              />
              <Button 
                onClick={() => handleSaveConfig(type)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Configuration
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Get your API key from the{" "}
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {docsText}
            </a>
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {renderServiceCard(
        'openai',
        'OpenAI',
        'Configure OpenAI API for GPT models and other AI services.',
        'https://platform.openai.com/api-keys',
        'OpenAI dashboard',
        'sk-...'
      )}
      {renderServiceCard(
        'anthropic',
        'Anthropic Claude',
        'Set up Anthropic Claude for advanced AI capabilities.',
        'https://console.anthropic.com/account/keys',
        'Anthropic Console',
        'sk-ant-...'
      )}
      {renderServiceCard(
        'gemini',
        'Google Gemini',
        'Configure Google Gemini API for AI services.',
        'https://makersuite.google.com/app/apikey',
        'Google AI Studio',
        'Enter Gemini API key'
      )}
      {renderServiceCard(
        'huggingface',
        'Hugging Face',
        'Set up Hugging Face for access to open-source AI models.',
        'https://huggingface.co/settings/tokens',
        'Hugging Face settings',
        'hf_...'
      )}
    </div>
  );
}