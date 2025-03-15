
import React, { useState, useEffect } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Check, RefreshCw } from 'lucide-react';
import { useAIProviders } from '@/hooks/chat/useAIProviders';
import { ChatProvider } from '@/components/chat/store/types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';
import { AIProviderService } from '@/services/chat/AIProviderService';
import { toast } from 'sonner';

// Define available provider types
type ProviderType = 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'pinecone' | 
  'weaviate' | 'openrouter' | 'replicate' | 'sonnet' | 'elevenlabs' | 'whisper' | 'github';

export function AIProviderStatusDialog() {
  const { providers, selectedProvider, isLoading, refreshProviders, selectProvider } = useAIProviders();
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      refreshProviders();
    }
  }, [isOpen, refreshProviders]);

  const handleProviderSelect = async (providerId: string) => {
    try {
      await selectProvider(providerId);
      toast.success("AI provider updated successfully");
      logger.info("AI provider changed", { id: providerId });
    } catch (error) {
      toast.error("Failed to update AI provider");
      logger.error("Error changing AI provider", error);
    }
  };

  const testProviderConnection = async (providerId: string) => {
    setTestingProvider(providerId);
    try {
      const result = await AIProviderService.testProviderConnection(providerId);
      if (result.success) {
        toast.success(`Connection to provider successful: ${result.message}`);
      } else {
        toast.error(`Connection failed: ${result.message}`);
      }
      logger.info("Provider connection test", { id: providerId, success: result.success });
    } catch (error) {
      toast.error("Error testing provider connection");
      logger.error("Error testing provider connection", error);
    } finally {
      setTestingProvider(null);
    }
  };

  // Group providers by type
  const groupedProviders = providers.reduce((acc, provider) => {
    const type = provider.type as ProviderType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(provider);
    return acc;
  }, {} as Record<ProviderType, ChatProvider[]>);

  // Get display name for provider type
  const getProviderTypeDisplayName = (type: string): string => {
    const displayNames: Record<string, string> = {
      'openai': 'OpenAI',
      'anthropic': 'Anthropic',
      'gemini': 'Google Gemini',
      'huggingface': 'Hugging Face',
      'pinecone': 'Pinecone',
      'weaviate': 'Weaviate',
      'openrouter': 'OpenRouter',
      'replicate': 'Replicate',
      'sonnet': 'Adept Sonnet',
      'elevenlabs': 'Eleven Labs',
      'whisper': 'Whisper',
      'github': 'GitHub'
    };
    return displayNames[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <DialogContent className="chat-dialog-content max-w-2xl">
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <DialogTitle>AI Provider Settings</DialogTitle>
        </div>
        <DialogDescription>
          Select which AI provider to use for chat, code, and image generation
        </DialogDescription>
      </DialogHeader>

      <div className="max-h-[60vh] overflow-y-auto pr-2">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading providers...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedProviders).map(([type, typeProviders]) => (
              <div key={type} className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-1">
                  {getProviderTypeDisplayName(type)}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {typeProviders.map(provider => (
                    <div 
                      key={provider.id} 
                      className={`
                        flex items-center justify-between p-3 rounded-md border 
                        ${selectedProvider?.id === provider.id ? 'border-primary bg-primary/5' : 'border-border'}
                        hover:border-primary/50 transition-colors
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{provider.name}</p>
                          <p className="text-xs text-muted-foreground">{type}</p>
                        </div>
                        {provider.isDefault && (
                          <Badge variant="outline" className="ml-2 text-xs">Default</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testProviderConnection(provider.id)}
                          disabled={testingProvider === provider.id}
                        >
                          {testingProvider === provider.id ? (
                            <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            "Test"
                          )}
                        </Button>
                        <Button
                          variant={selectedProvider?.id === provider.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleProviderSelect(provider.id)}
                          disabled={selectedProvider?.id === provider.id}
                        >
                          {selectedProvider?.id === provider.id ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Selected
                            </>
                          ) : (
                            "Select"
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DialogFooter>
        <Button onClick={() => refreshProviders()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Providers
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
