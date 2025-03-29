
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Provider, ProviderType, AvailableProviderRecord } from '@/components/chat/types/provider-types';

/**
 * Hook for fetching and managing AI providers
 */
export const useAIProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load providers from database
  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('available_providers')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      // Transform database records to Provider interface
      const transformedProviders = data.map((record: AvailableProviderRecord) => ({
        id: record.id,
        name: record.name,
        type: record.provider_type as ProviderType,
        isDefault: false, // We'll set this separately since it's not in the database schema
        isEnabled: record.is_enabled,
        category: record.provider_type === 'image' ? 'image' :
                  record.provider_type === 'integration' ? 'integration' : 'chat',
        description: record.display_name || record.name,
        models: []
      }));
      
      setProviders(transformedProviders);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch providers'));
      console.error('Error fetching providers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProviders();
  }, []);

  return {
    providers,
    isLoading,
    error,
    fetchProviders
  };
};
