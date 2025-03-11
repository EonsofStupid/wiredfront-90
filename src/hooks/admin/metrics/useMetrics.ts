
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

      return data.map(metric => ({
        id: metric.id,
        label: metric.metric_name,
        value: Number(metric.metric_value),
        unit: metric.metric_unit,
        trend: metric.tags?.trend || 'neutral',
        change: metric.tags?.change || 0,
        category: metric.category
      }));
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
}
