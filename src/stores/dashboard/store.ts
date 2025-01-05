import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DashboardStore } from './types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const initialState = {
  metrics: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  selectedPanel: null,
};

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setMetrics: (metrics) => set({ metrics }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      setSelectedPanel: (selectedPanel) => set({ selectedPanel }),

      fetchMetrics: async () => {
        const { setLoading, setError, setMetrics } = get();
        
        try {
          setLoading(true);
          setError(null);

          const { data: metricsData, error } = await supabase
            .from('metrics')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Transform the data to match DashboardMetric type
          const transformedMetrics = metricsData?.map(metric => ({
            id: metric.id,
            label: metric.label || '',
            value: Number(metric.value || 0),
            percentage: Number(metric.percentage || 0),
            trend: (metric.trend as 'up' | 'down' | 'neutral') || 'neutral',
            timeframe: metric.timeframe || 'daily',
            status: metric.status || 'success'
          })) || [];

          setMetrics(transformedMetrics);
          set({ lastUpdated: new Date() });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch metrics';
          setError(message);
          toast.error(message);
        } finally {
          setLoading(false);
        }
      },

      refreshDashboard: async () => {
        const { fetchMetrics } = get();
        await fetchMetrics();
        toast.success('Dashboard refreshed');
      },
    }),
    {
      name: 'Dashboard Store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);