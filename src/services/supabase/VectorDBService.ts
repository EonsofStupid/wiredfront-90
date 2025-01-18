import { supabase } from '@/integrations/supabase/client';
import { VectorStoreConfig } from '@/types/store/settings/api-config';
import { toast } from 'sonner';

export class VectorDBService {
  static async getConfigurations() {
    try {
      const { data, error } = await supabase
        .from('vector_store_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching vector store configs:', error);
      toast.error('Failed to load vector store configurations');
      return [];
    }
  }

  static async createConfiguration(config: Omit<VectorStoreConfig, 'id'>) {
    try {
      const configToSave = {
        ...config,
        config: typeof config.config === 'string' ? config.config : JSON.stringify(config.config),
        cluster_info: config.cluster_info ? JSON.stringify(config.cluster_info) : null
      };

      const { data, error } = await supabase
        .from('vector_store_configs')
        .insert(configToSave)
        .select()
        .single();

      if (error) throw error;
      toast.success('Vector store configuration created successfully');
      return data;
    } catch (error) {
      console.error('Error creating vector store config:', error);
      toast.error('Failed to create vector store configuration');
      return null;
    }
  }

  static async updateConfiguration(id: string, updates: Partial<VectorStoreConfig>) {
    try {
      const configToUpdate = {
        ...updates,
        config: updates.config ? JSON.stringify(updates.config) : undefined,
        cluster_info: updates.cluster_info ? JSON.stringify(updates.cluster_info) : undefined
      };

      const { data, error } = await supabase
        .from('vector_store_configs')
        .update(configToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Vector store configuration updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating vector store config:', error);
      toast.error('Failed to update vector store configuration');
      return null;
    }
  }

  static async deleteConfiguration(id: string) {
    try {
      const { error } = await supabase
        .from('vector_store_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Vector store configuration deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting vector store config:', error);
      toast.error('Failed to delete vector store configuration');
      return false;
    }
  }
}