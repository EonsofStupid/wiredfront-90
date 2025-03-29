
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useChatStore } from '@/components/chat/store/chatStore';
import { Provider, mapDbProviderToProvider } from '@/components/chat/types/provider-types';
import { logger } from '@/services/chat/LoggingService';

/**
 * Hook for managing AI providers
 */
export function useAIProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { updateChatProvider, updateAvailableProviders } = useChatStore();
  
  // Fetch providers on component mount
  useEffect(() => {
    fetchProviders();
  }, []);
  
  // Fetch providers from the database
  const fetchProviders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get a list of available providers from the API
      const { data, error } = await supabase
        .from('available_providers')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      // Convert to Provider type
      const providersData: Provider[] = data.map(provider => mapDbProviderToProvider(provider));
      
      setProviders(providersData);
      
      // Update the store with the available providers
      updateAvailableProviders(providersData);
      
      // Set the default provider if available
      const defaultProvider = providersData.find(p => p.isDefault);
      if (defaultProvider) {
        updateChatProvider(defaultProvider);
      }
      
      logger.info('Loaded providers', { count: providersData.length });
      
      return providersData;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      logger.error('Failed to fetch providers', { error: err });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [updateAvailableProviders, updateChatProvider]);
  
  return {
    providers,
    isLoading,
    error,
    fetchProviders
  };
}
