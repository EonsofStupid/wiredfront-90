import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { APIConfiguration, APIType } from '@/types/store/settings/api-config';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { logger } from '@/services/chat/LoggingService';

export const useAPIConfigurations = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: configurations = [], isLoading: isLoadingConfigs } = useQuery({
    queryKey: ['api-configurations'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          logger.warn('No authenticated user found');
          return [];
        }

        const { data, error } = await supabase
          .from('api_configurations')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          logger.error('Error fetching API configurations:', error);
          toast.error('Failed to load API configurations');
          return [];
        }

        return data as APIConfiguration[];
      } catch (error) {
        logger.error('Error in API configurations query:', error);
        toast.error('Failed to load API configurations');
        return [];
      }
    },
    retry: 2,
    staleTime: 30000
  });

  const createConfiguration = async (apiType: APIType) => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('You must be logged in to create API configurations');
        return null;
      }

      const { data, error } = await supabase
        .from('api_configurations')
        .insert({
          user_id: session.user.id,
          api_type: apiType,
          is_enabled: true
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['api-configurations'] });
      return data;
    } catch (error) {
      logger.error('Error creating API configuration:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfiguration = async (id: string, updates: Partial<APIConfiguration>) => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('You must be logged in to update API configurations');
        return null;
      }

      const { data, error } = await supabase
        .from('api_configurations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['api-configurations'] });
      return data;
    } catch (error) {
      logger.error('Error updating API configuration:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConfiguration = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('You must be logged in to delete API configurations');
        return null;
      }

      const { error } = await supabase
        .from('api_configurations')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) {
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['api-configurations'] });
      return true;
    } catch (error) {
      logger.error('Error deleting API configuration:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    configurations,
    loading: isLoading || isLoadingConfigs,
    createConfiguration,
    updateConfiguration,
    deleteConfiguration,
  };
};