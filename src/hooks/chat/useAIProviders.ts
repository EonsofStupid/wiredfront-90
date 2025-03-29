
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useChatStore } from '@/components/chat/store';
import { ChatProvider } from '@/components/chat/store/types/chat-store-types';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

/**
 * Hook for managing AI providers
 */
export function useAIProviders() {
  const { currentProvider, setCurrentProvider, setAvailableProviders } = useChatStore();
  const [providers, setProviders] = useState<ChatProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ChatProvider | null>(currentProvider);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch providers on first load
  useEffect(() => {
    fetchProviders();
  }, []);

  // Update selected provider when the store's current provider changes
  useEffect(() => {
    if (currentProvider) {
      setSelectedProvider(currentProvider);
    }
  }, [currentProvider]);

  /**
   * Fetch all available AI providers
   */
  const fetchProviders = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('ai_providers')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      const typedProviders = data as ChatProvider[];
      setProviders(typedProviders);
      setAvailableProviders(typedProviders);
      
      // If we have providers but no current provider set, use the default one
      if (typedProviders.length > 0 && !currentProvider) {
        const defaultProvider = typedProviders.find(p => p.isDefault) || typedProviders[0];
        setCurrentProvider(defaultProvider);
        setSelectedProvider(defaultProvider);
      }
      
      return typedProviders;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      toast.error('Failed to load AI providers');
      logger.error('Failed to fetch AI providers', { error: err });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [currentProvider, setAvailableProviders, setCurrentProvider]);

  /**
   * Refresh providers list
   */
  const refreshProviders = useCallback(() => {
    return fetchProviders();
  }, [fetchProviders]);

  return {
    providers,
    selectedProvider,
    isLoading,
    error,
    refreshProviders
  };
}
