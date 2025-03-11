
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MetricData {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend: 'up' | 'down' | 'neutral';
  change: number;
  category: string;
}

export function useMetrics() {
  return useQuery({
    queryKey: ['admin', 'metrics'],
    queryFn: async (): Promise<MetricData[]> => {
      const { data, error } = await supabase
        .from('metrics_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(5);

      if (error) throw error;

      return data.map(metric => {
        // Safely extract tags as an object
        const tags = typeof metric.tags === 'string' 
          ? JSON.parse(metric.tags) 
          : metric.tags || {};

        return {
          id: metric.id,
          label: metric.metric_name,
          value: Number(metric.metric_value),
          unit: metric.metric_unit,
          trend: (tags.trend as 'up' | 'down' | 'neutral') || 'neutral',
          change: Number(tags.change || 0),
          category: metric.category
        };
      });
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
}
