import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings2, Key } from "lucide-react";
import { useAPIConfigurations } from "@/hooks/settings/useAPIConfigurations";
import { APIType } from "@/types/store/settings/api-config";
import { Skeleton } from "@/components/ui/skeleton";

const API_TYPES: { type: APIType; label: string; description: string }[] = [
  {
    type: 'openai',
    label: 'OpenAI',
    description: 'GPT models for advanced language tasks'
  },
  {
    type: 'gemini',
    label: 'Google Gemini',
    description: 'Google\'s latest AI model'
  },
  {
    type: 'anthropic',
    label: 'Anthropic Claude',
    description: 'Advanced reasoning and analysis'
  },
  {
    type: 'huggingface',
    label: 'Hugging Face',
    description: 'Open-source AI models'
  }
];

export function APIConfigurationPanel() {
  const { configurations, loading, updateConfiguration, createConfiguration } = useAPIConfigurations();

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

      <div className="grid gap-4">
        {API_TYPES.map((api) => {
          const config = configurations.find(c => c.apiType === api.type);
          
          return (
            <Card key={api.type}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{api.label}</CardTitle>
                  <Switch
                    checked={config?.isEnabled ?? false}
                    onCheckedChange={(checked) => {
                      if (config) {
                        updateConfiguration(config.id, { isEnabled: checked });
                      } else {
                        createConfiguration(api.type);
                      }
                    }}
                  />
                </div>
                <CardDescription>{api.description}</CardDescription>
              </CardHeader>
              {config?.isEnabled && (
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">API Key configured</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateConfiguration(config.id, { isDefault: true })}
                      disabled={config.isDefault}
                    >
                      {config.isDefault ? 'Default API' : 'Set as Default'}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}