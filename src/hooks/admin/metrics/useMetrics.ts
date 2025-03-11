
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TimeRangeOption } from "@/components/admin/metrics/TimeRangeSelector";

interface MetricData {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend: 'up' | 'down' | 'neutral';
  change: number;
  category: string;
}

export interface UseMetricsOptions {
  timeRange?: TimeRangeOption;
  category?: string;
}

export function useMetrics(options?: UseMetricsOptions) {
  const { timeRange = 'all', category } = options || {};

  return useQuery({
    queryKey: ['admin', 'metrics', { timeRange, category }],
    queryFn: async (): Promise<MetricData[]> => {
      // Calculate date range based on time range
      let fromDate: string | null = null;
      if (timeRange !== 'all') {
        const now = new Date();
        switch (timeRange) {
          case '24h':
            fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
            break;
          case '7d':
            fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
            break;
          case '30d':
            fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
            break;
          case '90d':
            fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
            break;
        }
      }

      // Build query
      let query = supabase
        .from('metrics_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      // Add time range filter if applicable
      if (fromDate) {
        query = query.gte('timestamp', fromDate);
      }

      // Add category filter if applicable
      if (category) {
        query = query.eq('category', category);
      }

      // Limit to most recent entries per metric name (using client-side filtering)
      const { data, error } = await query.limit(20);

      if (error) throw error;

      // Group by metric_name and take the most recent entry for each
      const metricMap = new Map<string, any>();
      data.forEach(metric => {
        if (!metricMap.has(metric.metric_name) || 
            new Date(metric.timestamp) > new Date(metricMap.get(metric.metric_name).timestamp)) {
          metricMap.set(metric.metric_name, metric);
        }
      });

      // Transform the data to our required format
      return Array.from(metricMap.values()).map(metric => {
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
