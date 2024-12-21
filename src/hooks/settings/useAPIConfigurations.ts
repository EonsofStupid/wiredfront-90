import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { APIConfiguration, APIType } from '@/types/store/settings/api-config';

export function useAPIConfigurations() {
  const [configurations, setConfigurations] = useState<APIConfiguration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfigurations();
    
    const channel = supabase
      .channel('api-config-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'api_configurations' },
        (payload) => {
          console.log('API configuration changed:', payload);
          fetchConfigurations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchConfigurations = async () => {
    try {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;

      setConfigurations(data.map(config => ({
        id: config.id,
        apiType: config.api_type,
        isEnabled: config.is_enabled,
        isDefault: config.is_default,
        priority: config.priority
      })));
    } catch (error) {
      console.error('Error fetching API configurations:', error);
      toast.error('Failed to load API configurations');
    } finally {
      setLoading(false);
    }
  };

  const updateConfiguration = async (id: string, updates: Partial<APIConfiguration>) => {
    try {
      const { error } = await supabase
        .from('api_configurations')
        .update({
          is_enabled: updates.isEnabled,
          is_default: updates.isDefault,
          priority: updates.priority
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('API configuration updated');
    } catch (error) {
      console.error('Error updating API configuration:', error);
      toast.error('Failed to update API configuration');
    }
  };

  const createConfiguration = async (apiType: APIType) => {
    try {
      const { error } = await supabase
        .from('api_configurations')
        .insert({
          api_type: apiType,
          is_enabled: false,
          is_default: false,
          priority: 0
        });

      if (error) throw error;
      toast.success('API configuration created');
    } catch (error) {
      console.error('Error creating API configuration:', error);
      toast.error('Failed to create API configuration');
    }
  };

  return {
    configurations,
    loading,
    updateConfiguration,
    createConfiguration
  };
}