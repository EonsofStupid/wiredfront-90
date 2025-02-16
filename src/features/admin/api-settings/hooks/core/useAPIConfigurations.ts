
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProviderCategory } from "../../types/common";
import { APIType } from "@/integrations/supabase/types";

const AI_PROVIDERS: APIType[] = ['openai', 'anthropic', 'gemini', 'huggingface', 'openrouter', 'replicate', 'sonnet'];
const VECTOR_PROVIDERS: APIType[] = ['pinecone', 'weaviate'];

export function useAPIConfigurations(category?: ProviderCategory) {
  const queryClient = useQueryClient();

  const getProvidersByCategory = (category: ProviderCategory) => {
    switch (category) {
      case 'ai':
        return AI_PROVIDERS;
      case 'vector':
        return VECTOR_PROVIDERS;
      default:
        return [];
    }
  };

  const { data: configurations = [], isLoading, error } = useQuery({
    queryKey: ['api-configurations', category],
    queryFn: async () => {
      let query = supabase.from('api_configurations').select('*');
      
      if (category) {
        query = query.in('api_type', getProvidersByCategory(category));
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createConfiguration = useMutation({
    mutationFn: async (newConfig: any) => {
      const { data, error } = await supabase
        .from('api_configurations')
        .insert(newConfig)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-configurations'] });
      toast.success('Configuration created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create configuration');
      console.error('Error creating configuration:', error);
    },
  });

  const updateConfiguration = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('api_configurations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-configurations'] });
      toast.success('Configuration updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update configuration');
      console.error('Error updating configuration:', error);
    },
  });

  const deleteConfiguration = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('api_configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-configurations'] });
      toast.success('Configuration deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete configuration');
      console.error('Error deleting configuration:', error);
    },
  });

  return {
    configurations,
    isLoading,
    error,
    createConfiguration,
    updateConfiguration,
    deleteConfiguration,
  };
}
