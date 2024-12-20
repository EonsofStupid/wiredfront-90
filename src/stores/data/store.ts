import { create } from 'zustand';
import type { DataState, DataStore } from './types';

const initialState: DataState = {
  metrics: {},
  analytics: null,
  lastFetch: null,
  status: 'idle',
  error: null,
  lastUpdated: null,
};

export const useDataStore = create<DataStore>()((set) => ({
  ...initialState,
  fetchMetrics: async () => {
    set({ status: 'loading' });
    try {
      // Implement metrics fetching logic here
      set({ status: 'success', lastFetch: Date.now() });
    } catch (error) {
      set({ status: 'error', error: (error as Error).message });
    }
  },
  updateMetric: (id, data) =>
    set((state) => ({
      metrics: {
        ...state.metrics,
        [id]: { ...state.metrics[id], ...data },
      },
    })),
  clearCache: () => set({ metrics: {}, analytics: null, lastFetch: null }),
}));