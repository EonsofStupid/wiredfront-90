import { useState } from "react";
import { AI_PROVIDERS } from "@/config/aiProviders";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import type { AIProvider } from "@/types/ai";

interface AIProviderSelectorProps {
  provider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
}

export const AIProviderSelector = ({ provider, onProviderChange }: AIProviderSelectorProps) => {
  const { toast } = useToast();
  const [enabledProviders, setEnabledProviders] = useState<Record<string, boolean>>({
    [provider]: true
  });

  const handleToggleProvider = async (providerId: string) => {
    const providerConfig = AI_PROVIDERS[providerId];
    
    if (providerConfig.apiKeyRequired && !enabledProviders[providerId]) {
      toast({
        title: `${providerConfig.name} API Key Required`,
        description: "Please add your API key in settings to enable this provider",
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/settings'}
          >
            Add Key
          </Button>
        ),
      });
    }

    setEnabledProviders(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));

    if (!enabledProviders[providerId]) {
      onProviderChange(providerId as AIProvider);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">AI Providers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(AI_PROVIDERS).map(([id, config]) => {
          const IconComponent = config.icon;
          return (
            <div 
              key={id}
              className={`glass-card p-4 flex items-center justify-between gap-4 ${
                enabledProviders[id] ? 'neon-glow' : 'opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className="w-5 h-5 text-neon-blue" />
                <div>
                  <h4 className="font-medium">{config.name}</h4>
                  <p className="text-sm text-gray-400">{config.description}</p>
                </div>
              </div>
              <Switch
                checked={enabledProviders[id]}
                onCheckedChange={() => handleToggleProvider(id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};