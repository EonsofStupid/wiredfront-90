
import { Card, CardContent } from "@/components/ui/card";
import { APIConfiguration } from "@/types/admin/settings/api-configuration";
import { ServiceCard } from "./components/ServiceCard";
import { APIType } from "@/types/admin/settings/api";

const API_CONFIGS = {
  openai: {
    type: 'openai' as APIType,
    title: 'OpenAI',
    description: 'Configure your OpenAI API key for AI-powered features.',
    docsUrl: 'https://platform.openai.com/account/api-keys',
    docsText: 'OpenAI dashboard',
    placeholder: 'Enter your OpenAI API key'
  },
  huggingface: {
    type: 'huggingface' as APIType,
    title: 'Hugging Face',
    description: 'Configure your Hugging Face API key for model inference.',
    docsUrl: 'https://huggingface.co/settings/tokens',
    docsText: 'Hugging Face tokens page',
    placeholder: 'Enter your Hugging Face API key'
  },
  anthropic: {
    type: 'anthropic' as APIType,
    title: 'Anthropic',
    description: 'Configure your Anthropic API key for Claude integration.',
    docsUrl: 'https://console.anthropic.com/account/keys',
    docsText: 'Anthropic dashboard',
    placeholder: 'Enter your Anthropic API key'
  }
};

interface APIConfigurationListProps {
  configurations: APIConfiguration[];
  onConfigurationChange: (checked: boolean, config: APIConfiguration | undefined, apiType: APIType) => void;
  onSetDefault: (configId: string) => void;
  onDelete: (configId: string) => void;
}

export function APIConfigurationList({
  configurations,
  onConfigurationChange,
  onSetDefault,
  onDelete
}: APIConfigurationListProps) {
  const isConnecting = false; // TODO: Add loading state
  const selectedConfig = null; // TODO: Add selected config state
  const newConfig = {
    name: '',
    key: '',
    environment: '',
    index_name: ''
  };

  const handleConfigChange = (type: APIType, field: string, value: string) => {
    // TODO: Implement config change handler
  };

  const handleSaveConfig = async (type: APIType) => {
    // TODO: Implement save config handler
  };

  return (
    <div className="grid gap-6">
      {Object.values(API_CONFIGS).map((api) => (
        <ServiceCard
          key={api.type}
          type={api.type}
          title={api.title}
          description={api.description}
          docsUrl={api.docsUrl}
          docsText={api.docsText}
          placeholder={api.placeholder}
          isConnecting={isConnecting}
          selectedConfig={selectedConfig}
          newConfig={newConfig}
          onConfigChange={handleConfigChange}
          onSaveConfig={handleSaveConfig}
        />
      ))}
    </div>
  );
}
