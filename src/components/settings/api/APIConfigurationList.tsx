import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { APIType } from "@/types/store/settings/api-config";

interface APIConfigurationListProps {
  configurations: any[];
  onConfigurationChange: (checked: boolean, config: any | undefined, apiType: APIType) => void;
  onSetDefault: (configId: string) => void;
}

export function APIConfigurationList({ configurations, onConfigurationChange, onSetDefault }: APIConfigurationListProps) {
  const API_TYPES = [
    {
      type: 'openai' as APIType,
      label: 'OpenAI',
      description: 'GPT models for advanced language tasks'
    },
    {
      type: 'gemini' as APIType,
      label: 'Google Gemini',
      description: 'Google\'s latest AI model'
    },
    {
      type: 'anthropic' as APIType,
      label: 'Anthropic Claude',
      description: 'Advanced reasoning and analysis'
    },
    {
      type: 'huggingface' as APIType,
      label: 'Hugging Face',
      description: 'Open-source AI models'
    }
  ];

  return (
    <div className="grid gap-4">
      {API_TYPES.map((api) => {
        const config = configurations.find(c => c.api_type === api.type);
        
        return (
          <Card key={api.type}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{api.label}</CardTitle>
                <Switch
                  checked={config?.is_enabled ?? false}
                  onCheckedChange={(checked) => {
                    onConfigurationChange(checked, config, api.type);
                  }}
                />
              </div>
              <CardDescription>{api.description}</CardDescription>
            </CardHeader>
            {config?.is_enabled && (
              <CardContent>
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">API Key configured</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSetDefault(config.id)}
                    disabled={config.is_default}
                  >
                    {config.is_default ? 'Default API' : 'Set as Default'}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}