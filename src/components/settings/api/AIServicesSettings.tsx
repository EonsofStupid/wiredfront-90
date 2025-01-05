import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useAPIConfigurations } from "@/hooks/settings/useAPIConfigurations";
import { APIType } from "@/types/store/settings/api-config";
import { toast } from "sonner";

interface APIKeyConfig {
  name: string;
  key: string;
}

interface AIServicesSettingsProps {
  openaiKey: string;
  huggingfaceKey: string;
  geminiKey: string;
  anthropicKey: string;
  perplexityKey: string;
  onOpenAIKeyChange: (value: string) => void;
  onHuggingfaceKeyChange: (value: string) => void;
  onGeminiKeyChange: (value: string) => void;
  onAnthropicKeyChange: (value: string) => void;
  onPerplexityKeyChange: (value: string) => void;
}

export function AIServicesSettings() {
  const { configurations, createConfiguration, updateConfiguration } = useAPIConfigurations();
  const [newConfigs, setNewConfigs] = useState<Record<APIType, APIKeyConfig>>({
    openai: { name: '', key: '' },
    huggingface: { name: '', key: '' },
    gemini: { name: '', key: '' },
    anthropic: { name: '', key: '' }
  });

  const handleSaveConfig = async (type: APIType) => {
    try {
      const config = newConfigs[type];
      if (!config.name || !config.key) {
        toast.error("Please provide both name and API key");
        return;
      }

      await createConfiguration(type, {
        assistant_name: config.name,
        provider_settings: { api_key: config.key }
      });

      setNewConfigs(prev => ({
        ...prev,
        [type]: { name: '', key: '' }
      }));

      toast.success(`${type} configuration saved successfully`);
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error("Failed to save configuration");
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
              </div>
              <Input
                type="password"
                value="••••••••••••••••"
                disabled
              />
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