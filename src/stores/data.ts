import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DataStore, DataAction } from '@/types/store/data';
import type { DevToolsConfig } from '@/types/store/middleware';
import type { DashboardMetric } from '@/types/dashboard/metrics';

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
          const dummyMetrics: Record<string, DashboardMetric> = {
            '1': {
              id: '1',
              label: 'Users',
              value: 100,
              percentage: 10,
              trend: 'up',
              timeframe: 'daily',
              status: 'success'
            },
          };
          set(
            { metrics: dummyMetrics, lastFetch: Date.now() },
            false,
            { type: 'SET_METRICS', payload: dummyMetrics }
          );
        } catch (error) {
          console.error('Failed to fetch metrics:', error);
          throw error;
        }
      },
      updateMetric: (id, data) => {
        set(
          (state) => ({
            metrics: {
              ...state.metrics,
              [id]: { ...state.metrics[id], ...data },
            },
          }),
          false,
          { type: 'UPDATE_METRIC', payload: { id, data } }
        );
      },
      clearCache: () => {
        set(
          { metrics: {}, analytics: null, lastFetch: null },
          false,
          { type: 'CLEAR_CACHE' }
        );
      },
    }),
    devtoolsConfig
  )
);