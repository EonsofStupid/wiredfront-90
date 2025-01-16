import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { VectorDBStore } from './types';
import { VectorStoreConfig } from '@/types/store/settings/api-config';

export const useVectorDBStore = create<VectorDBStore>()(
  devtools(
    (set) => ({
      configurations: [],
      loading: false,
      selectedConfig: null,
      error: null,

      setConfigurations: (configs) => set({ configurations: configs }),
      
      addConfiguration: (config) => 
        set((state) => ({
          configurations: [...state.configurations, config]
        })),
      
      updateConfiguration: (id, updates) =>
        set((state) => ({
          configurations: state.configurations.map((config) =>
            config.id === id ? { ...config, ...updates } : config
          )
        })),
      
      deleteConfiguration: (id) =>
        set((state) => ({
          configurations: state.configurations.filter((config) => config.id !== id)
        })),
      
      setSelectedConfig: (id) => set({ selectedConfig: id }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error })
    }),
    {
      name: 'VectorDB Store'
    }
  )
);