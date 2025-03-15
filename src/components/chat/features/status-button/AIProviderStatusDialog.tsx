
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, BotMessageSquare, Sparkles, Command, Network, AlertCircle, Check } from 'lucide-react';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';
import { RAGTierService } from '@/services/rag/RAGTierService';
import { useRAGTier } from '@/hooks/rag/useRAGTier';

// Define provider types and interfaces
interface AIProvider {
  id: string;
  name: string;
  type: string;
  description: string;
  isEnabled: boolean;
  isDefault: boolean;
  apiKeySecret?: string;
  category: 'chat' | 'image' | 'integration';
  status?: 'valid' | 'invalid' | 'pending';
}

export function AIProviderStatusDialog() {
  const [availableProviders, setAvailableProviders] = useState<AIProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const { isPremiumAvailable, upgradeToRagPremium, isUpgrading } = useRAGTier();

  // Fetch available providers when component mounts
  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setIsLoading(true);
    try {
      // Fetch providers from Supabase
      const { data: apiConfigurations, error } = await supabase
        .from('api_configurations')
        .select('*')
        .order('is_default', { ascending: false });
        
      if (error) throw error;
      
      // Map to providers format
      const providers: AIProvider[] = apiConfigurations?.map(config => ({
        id: config.id,
        name: config.memorable_name || `${config.api_type} Provider`,
        type: config.api_type,
        description: getProviderDescription(config.api_type),
        isEnabled: config.is_enabled || false,
        isDefault: config.is_default || false,
        apiKeySecret: config.secret_key_name,
        category: getCategoryForProvider(config.api_type),
        status: config.validation_status as 'valid' | 'invalid' | 'pending'
      })) || [];
      
      setAvailableProviders(providers);
      logger.info("Fetched AI providers", { count: providers.length });
    } catch (error) {
      logger.error("Error fetching AI providers", error);
      toast.error("Failed to load AI providers");
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryForProvider = (type: string): 'chat' | 'image' | 'integration' => {
    if (['openai', 'anthropic', 'gemini', 'perplexity', 'openrouter'].includes(type)) {
      return 'chat';
    } else if (['dalle', 'stabilityai', 'replicate'].includes(type)) {
      return 'image';
    }
    return 'integration';
  };

  const getProviderDescription = (type: string): string => {
    switch (type) {
      case 'openai': return 'OpenAI models including GPT-4 and GPT-3.5';
      case 'anthropic': return 'Anthropic\'s Claude models for thoughtful AI';
      case 'gemini': return 'Google\'s latest multimodal AI model';
      case 'stabilityai': return 'Stability AI for image generation';
      case 'replicate': return 'Replicate for various AI models';
      case 'openrouter': return 'Open Router for accessing multiple models';
      case 'pinecone': return 'Pinecone vector database for premium RAG';
      default: return 'AI service provider';
    }
  };

  const handleSetDefault = async (providerId: string) => {
    try {
      const selectedProvider = availableProviders.find(p => p.id === providerId);
      if (!selectedProvider) return;
      
      // Update the default provider in Supabase
      const { error } = await supabase.rpc('set_default_api_config', { config_id: providerId });
      
      if (error) throw error;
      
      // Update local state
      setAvailableProviders(prev => prev.map(provider => ({
        ...provider,
        isDefault: provider.id === providerId
      })));
      
      toast.success(`Set ${selectedProvider.name} as default`);
      logger.info("Set default AI provider", { providerId, type: selectedProvider.type });
    } catch (error) {
      logger.error("Error setting default provider", error);
      toast.error("Failed to set default provider");
    }
  };

  const handleEnableDisable = async (providerId: string, enable: boolean) => {
    try {
      const selectedProvider = availableProviders.find(p => p.id === providerId);
      if (!selectedProvider) return;
      
      // Update the provider status in Supabase
      const { error } = await supabase
        .from('api_configurations')
        .update({ is_enabled: enable })
        .eq('id', providerId);
        
      if (error) throw error;
      
      // Update local state
      setAvailableProviders(prev => prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, isEnabled: enable } 
          : provider
      ));
      
      toast.success(`${enable ? 'Enabled' : 'Disabled'} ${selectedProvider.name}`);
      logger.info(`${enable ? 'Enabled' : 'Disabled'} AI provider`, { providerId, type: selectedProvider.type });
    } catch (error) {
      logger.error("Error updating provider status", error);
      toast.error(`Failed to ${enable ? 'enable' : 'disable'} provider`);
    }
  };

  const checkPremiumStatus = async (type: string) => {
    if (type === 'pinecone' && !isPremiumAvailable) {
      const shouldUpgrade = window.confirm(
        "Pinecone vector database requires a premium subscription. Would you like to upgrade to premium?"
      );
      
      if (shouldUpgrade) {
        try {
          await upgradeToRagPremium();
          toast.success("Successfully upgraded to premium tier!");
        } catch (error) {
          logger.error("Error upgrading to premium tier", error);
          toast.error("Failed to upgrade to premium tier");
        }
      }
      return false;
    }
    return true;
  };

  const testProviderConnection = async (providerId: string) => {
    try {
      const provider = availableProviders.find(p => p.id === providerId);
      if (!provider) return;
      
      // Check premium status for Pinecone
      if (provider.type === 'pinecone' && !await checkPremiumStatus(provider.type)) {
        return;
      }
      
      toast.info(`Testing connection to ${provider.name}...`);
      
      // Test connection via the edge function
      const { data, error } = await supabase.functions.invoke('test-ai-connection', {
        body: { provider: provider.type, configId: provider.id }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success(`Successfully connected to ${provider.name}`);
        
        // Update local state with valid status
        setAvailableProviders(prev => prev.map(p => 
          p.id === providerId ? { ...p, status: 'valid' } : p
        ));
      } else {
        toast.error(`Failed to connect to ${provider.name}: ${data?.message || 'Unknown error'}`);
        
        // Update local state with invalid status
        setAvailableProviders(prev => prev.map(p => 
          p.id === providerId ? { ...p, status: 'invalid' } : p
        ));
      }
      logger.info("Tested AI provider connection", { 
        providerId, 
        type: provider.type, 
        success: data?.success,
        details: data?.details 
      });
    } catch (error) {
      logger.error("Error testing provider connection", error);
      toast.error("Failed to test provider connection");
    }
  };

  const getProviderStatusBadge = (status?: 'valid' | 'invalid' | 'pending') => {
    switch (status) {
      case 'valid':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <Check className="h-3 w-3 mr-1" /> Valid
          </Badge>
        );
      case 'invalid':
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            <AlertCircle className="h-3 w-3 mr-1" /> Invalid
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            Pending
          </Badge>
        );
    }
  };

  return (
    <DialogContent className="min-w-[600px] max-w-[800px] chat-dialog-content">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <BotMessageSquare className="h-5 w-5 text-primary" />
          AI Provider Settings
        </DialogTitle>
      </DialogHeader>
      
      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="chat" className="flex items-center gap-1.5">
            <BotMessageSquare className="h-4 w-4" />
            Chat Providers
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            Image Providers
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-1.5">
            <Network className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>
        
        {['chat', 'image', 'integration'].map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Loading providers...</p>
              </div>
            ) : availableProviders.filter(p => p.category === category).length === 0 ? (
              <div className="p-8 text-center border rounded-lg">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No {category} providers configured</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.href = '/settings/api'}>
                  Add Provider
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {availableProviders
                  .filter(provider => provider.category === category)
                  .map(provider => (
                    <div 
                      key={provider.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/5"
                    >
                      <div className="flex items-center gap-3">
                        <Bot className="h-8 w-8 p-1.5 bg-primary/10 text-primary rounded" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{provider.name}</p>
                            {getProviderStatusBadge(provider.status)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{provider.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8"
                          onClick={() => testProviderConnection(provider.id)}
                        >
                          Test
                        </Button>
                        <Button
                          variant={provider.isEnabled ? "outline" : "secondary"}
                          size="sm"
                          className="h-8"
                          onClick={() => handleEnableDisable(provider.id, !provider.isEnabled)}
                        >
                          {provider.isEnabled ? 'Disable' : 'Enable'}
                        </Button>
                        {provider.isDefault ? (
                          <Badge variant="default" className="h-8 px-3">Default</Badge>
                        ) : (
                          <Button
                            variant="default" 
                            size="sm"
                            className="h-8"
                            onClick={() => handleSetDefault(provider.id)}
                            disabled={!provider.isEnabled}
                          >
                            Set Default
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Need to add more AI providers? Configure them in the API settings.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.href = '/settings/api'}
        >
          <Command className="h-4 w-4 mr-2" />
          Manage API Keys
        </Button>
      </div>
    </DialogContent>
  );
}
