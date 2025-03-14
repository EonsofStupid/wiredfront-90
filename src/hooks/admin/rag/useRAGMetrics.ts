
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RAGMetrics {
  user_id: string;
  query_count: number;
  vector_count: number;
  token_usage: number;
  average_latency: number;
  created_at?: string;
  updated_at?: string;
}

interface TrackRAGUsageParams {
  operation: 'query' | 'index';
  vectorsAdded?: number;
  tokensUsed?: number;
  latencyMs?: number;
  userId?: string;
}

export function useRAGMetrics(userId?: string) {
  const queryClient = useQueryClient();

  // Fetch metrics for a specific user or all users
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['rag-metrics', userId],
    queryFn: async (): Promise<RAGMetrics[]> => {
      let query = supabase.from('rag_metrics').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  // Track RAG usage mutation
  const { mutate: trackUsage } = useMutation({
    mutationFn: async (params: TrackRAGUsageParams) => {
      const { data, error } = await supabase.functions.invoke('track-rag-usage', {
        body: params
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Refresh metrics after tracking usage
      queryClient.invalidateQueries({
        queryKey: ['rag-metrics']
      });
    }
  });

  return {
    metrics,
    isLoading,
    error,
    trackUsage
  };
}
