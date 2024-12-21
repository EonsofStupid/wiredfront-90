import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAPIConfigurations = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createConfiguration = async (apiType: string) => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to create API configurations');
        return;
      }

      const { data, error } = await supabase
        .from('api_configurations')
        .insert([
          {
            user_id: user.id,
            api_type: apiType,
            is_enabled: true,
            is_default: false,
            priority: 0
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating API configuration:', error);
        toast.error(error.message);
        return null;
      }

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

  const updateConfiguration = async (id: string, updates: any) => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to update API configurations');
        return;
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
    createConfiguration,
    updateConfiguration,
    isLoading
  };
};