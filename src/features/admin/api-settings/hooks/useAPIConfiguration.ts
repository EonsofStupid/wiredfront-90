
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { APIConfiguration } from '../types/api-config.types';
import { useRoleStore } from '@/stores/role';
import { toast } from 'sonner';

export function useAPIConfiguration() {
  const [configurations, setConfigurations] = useState<APIConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const { roles } = useRoleStore();
  const isSuperAdmin = roles.includes('super_admin');

  const fetchConfigurations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our APIConfiguration type
      const transformedData: APIConfiguration[] = data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        api_type: item.api_type,
        memorable_name: item.memorable_name || '',
        secret_key_name: item.secret_key_name || '',
        is_enabled: item.is_enabled ?? true,
        is_default: item.is_default ?? false,
        validation_status: item.validation_status || 'pending',
        provider_settings: {
          endpoint_url: item.endpoint_url,
          grpc_endpoint: item.grpc_endpoint,
          cluster_info: item.cluster_info,
          usage_metrics: item.cost_tracking ? {
            total_requests: item.usage_count || 0,
            total_cost: item.cost_tracking?.total_cost || 0,
            last_used: item.last_successful_use || new Date().toISOString(),
          } : undefined,
        },
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      setConfigurations(transformedData);
    } catch (error) {
      toast.error('Failed to load API configurations');
      console.error('Error fetching configurations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createConfiguration = useCallback(async (apiType: APIConfiguration['api_type']) => {
    if (!isSuperAdmin) {
      toast.error('Only super admins can create configurations');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('api_configurations')
        .insert({
          api_type: apiType,
          memorable_name: `New ${apiType} Configuration`,
          secret_key_name: `${apiType}_key_${Date.now()}`,
          is_enabled: true,
          validation_status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      
      setConfigurations(prev => [...prev, data as APIConfiguration]);
      toast.success('Configuration created successfully');
      return data;
    } catch (error) {
      toast.error('Failed to create configuration');
      console.error('Error creating configuration:', error);
    }
  }, [isSuperAdmin]);

  const updateConfiguration = useCallback(async (id: string, updates: Partial<APIConfiguration>) => {
    if (!isSuperAdmin) {
      toast.error('Only super admins can modify configurations');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('api_configurations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setConfigurations(prev => prev.map(config => 
        config.id === id ? { ...config, ...data } as APIConfiguration : config
      ));
      toast.success('Configuration updated successfully');
    } catch (error) {
      toast.error('Failed to update configuration');
      console.error('Error updating configuration:', error);
    }
  }, [isSuperAdmin]);

  const deleteConfiguration = useCallback(async (id: string) => {
    if (!isSuperAdmin) {
      toast.error('Only super admins can delete configurations');
      return;
    }

    try {
      const { error } = await supabase
        .from('api_configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setConfigurations(prev => prev.filter(config => config.id !== id));
      toast.success('Configuration deleted successfully');
    } catch (error) {
      toast.error('Failed to delete configuration');
      console.error('Error deleting configuration:', error);
    }
  }, [isSuperAdmin]);

  return {
    configurations,
    loading,
    fetchConfigurations,
    createConfiguration,
    updateConfiguration,
    deleteConfiguration,
    isSuperAdmin,
  };
}
