import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { APIConfiguration, APIType } from '@/types/store/settings/api-config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useAPIConfigurations = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: configurations = [], isLoading: isLoadingConfigs } = useQuery({
    queryKey: ['api-configurations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('api_configurations')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching API configurations:', error);
        toast.error(error.message);
        return [];
      }

      return data as APIConfiguration[];
    }
  });

  const createConfiguration = async (apiType: APIType) => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to create API configurations');
        return null;
      }

      const { data, error } = await supabase
        .from('api_configurations')
        .insert({
          user_id: user.id,
          api_type: apiType,
          is_enabled: true,
          is_default: false,
          priority: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating API configuration:', error);
        toast.error(error.message);
        return null;
      }

      queryClient.invalidateQueries({ queryKey: ['api-configurations'] });
      toast.success('API configuration created successfully');
      return data;
    } catch (error) {
      console.error('Error creating API configuration:', error);
      toast.error('Failed to create API configuration');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfiguration = async (id: string, updates: Partial<APIConfiguration>) => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to update API configurations');
        return null;
      }

      const { data, error } = await supabase
        .from('api_configurations')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating API configuration:', error);
        toast.error(error.message);
        return null;
      }

      queryClient.invalidateQueries({ queryKey: ['api-configurations'] });
      toast.success('API configuration updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating API configuration:', error);
      toast.error('Failed to update API configuration');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    configurations,
    loading: isLoading || isLoadingConfigs,
    createConfiguration,
    updateConfiguration,
  };
};