
import { useState, useEffect } from 'react';
import { AIProviderService } from '@/services/chat/AIProviderService';
import { ChatProvider } from '@/components/chat/store/types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';
import { useChatStore } from '@/components/chat/store';

/**
 * Hook for managing AI providers in the chat interface
 */
export function useAIProviders() {
  const [providers, setProviders] = useState<ChatProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<ChatProvider | null>(null);
  const { updateCurrentProvider, updateAvailableProviders } = useChatStore();
  
  // Load providers when component mounts
  useEffect(() => {
    loadProviders();
  }, []);
  
  // Load available providers from the service
  const loadProviders = async () => {
    setIsLoading(true);
    try {
      const allProviders = await AIProviderService.getAllProviders();
      setProviders(allProviders);
      
      // Also update the providers in the global store
      updateAvailableProviders(allProviders);
      
      // Set default provider
      const defaultProvider = allProviders.find(p => p.isDefault) || 
                             (allProviders.length > 0 ? allProviders[0] : null);
      if (defaultProvider) {
        setSelectedProvider(defaultProvider);
        updateCurrentProvider(defaultProvider);
      }
      
      logger.info("Loaded AI providers", { count: allProviders.length });
    } catch (error) {
      logger.error("Error loading AI providers", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Select a specific provider
  const selectProvider = async (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return;
    
    setSelectedProvider(provider);
    updateCurrentProvider(provider);
    logger.info("Selected AI provider", { id: provider.id, type: provider.type });
  };
  
  // Track usage of the current provider
  const trackProviderUsage = async (operation: 'query' | 'index' | 'image', metrics: any) => {
    if (!selectedProvider) return;
    
    await AIProviderService.trackProviderUsage(
      selectedProvider.id,
      operation,
      metrics
    );
  };
  
  return {
    providers,
    selectedProvider,
    isLoading,
    refreshProviders: loadProviders,
    selectProvider,
    trackProviderUsage
  };
}
