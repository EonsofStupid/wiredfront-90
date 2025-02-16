
import { supabase } from "@/integrations/supabase/client";
import { APIConfiguration, APIType } from "@/types/store/settings/api-config";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import { useRoleStore } from "@/stores/role";

export function useAPIConfigurations() {
  const [configurations, setConfigurations] = useState<APIConfiguration[]>([]);
  const [loading, setLoading] = useState(false);
  const { roles } = useRoleStore();
  const isSuperAdmin = roles.includes('super_admin');

  const fetchConfigurations = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('api_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfigurations(data as APIConfiguration[]);
    } catch (error) {
      console.error('Error fetching configurations:', error);
      toast.error('Failed to load API configurations');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfiguration = useCallback(async (id: string, updates: Partial<APIConfiguration>) => {
    if (!isSuperAdmin) {
      toast.error('Only super admins can update configurations');
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
      toast.success('API configuration updated successfully');
      return data as APIConfiguration;
    } catch (error) {
      console.error('Error updating configuration:', error);
      toast.error('Failed to update API configuration');
      throw error;
    }
  }, [isSuperAdmin]);

  const deleteConfiguration = useCallback(async (id: string) => {
    if (!isSuperAdmin) {
      toast.error('Only super admins can delete configurations');
      return;
    }

    try {
      const config = configurations.find(c => c.id === id);
      if (!config) throw new Error('Configuration not found');

      const { error } = await supabase.functions.invoke('manage-api-secret', {
        body: {
          action: 'delete',
          memorableName: config.memorable_name,
          provider: config.api_type
        }
      });

      if (error) throw error;
      setConfigurations(prev => prev.filter(config => config.id !== id));
      toast.success('API configuration deleted successfully');
    } catch (error) {
      console.error('Error deleting configuration:', error);
      toast.error('Failed to delete API configuration');
      throw error;
    }
  }, [isSuperAdmin, configurations]);

  return {
    configurations,
    loading,
    fetchConfigurations,
    updateConfiguration,
    deleteConfiguration,
    isSuperAdmin
  };
}
