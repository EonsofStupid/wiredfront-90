
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
      setConfigurations(data);
    } catch (error) {
      toast.error('Failed to load API configurations');
      console.error('Error fetching configurations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

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
        config.id === id ? { ...config, ...data } : config
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
    updateConfiguration,
    deleteConfiguration,
    isSuperAdmin,
  };
}
