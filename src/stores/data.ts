import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DataStore } from '@/types/store/data';
import type { DevToolsConfig } from '@/types/store/middleware';

const devtoolsConfig: DevToolsConfig = {
  name: 'Data Store',
  enabled: process.env.NODE_ENV === 'development',
};

export const useDataStore = create<DataStore>()(
  devtools(
    (set) => ({
      metrics: {},
      analytics: null,
      lastFetch: null,
      fetchMetrics: async () => {
        try {
          // Implement actual API call here
          const dummyMetrics = {
            '1': { id: '1', label: 'Users', value: 100, percentage: 10, trend: 'up', timeframe: 'daily' },
          };
          set({ metrics: dummyMetrics, lastFetch: Date.now() });
        } catch (error) {
          console.error('Failed to fetch metrics:', error);
          throw error;
        }
      },
      updateMetric: (id, data) => {
        set((state) => ({
          metrics: {
            ...state.metrics,
            [id]: { ...state.metrics[id], ...data },
          },
        }));
      },
      clearCache: () => {
        set({ metrics: {}, analytics: null, lastFetch: null });
      },
    }),
    devtoolsConfig
  )
);