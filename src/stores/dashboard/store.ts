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

          const { data, error } = await supabase
            .from('metrics')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          setMetrics(data);
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