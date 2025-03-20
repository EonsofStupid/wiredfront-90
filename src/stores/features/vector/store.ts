
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { VectorState, VectorStore } from './types';
import { VectorConfiguration, VectorConfigId } from '@/types/domain/vector/types';
import { supabase } from '@/integrations/supabase/client';

const initialState: VectorState = {
  configurations: [],
  selectedConfig: null,
  isLoading: false,
  error: null
};

export const useVectorStore = create<VectorStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      setConfigurations: (configs) => {
        set({ configurations: configs });
      },
      
      addConfiguration: (config) => {
        set(state => ({
          configurations: [...state.configurations, config]
        }));
      },
      
      updateConfiguration: (id, updates) => {
        set(state => ({
          configurations: state.configurations.map(config => 
            config.id === id ? { ...config, ...updates } : config
          )
        }));
      },
      
      deleteConfiguration: (id) => {
        set(state => ({
          configurations: state.configurations.filter(config => config.id !== id),
          selectedConfig: state.selectedConfig === id ? null : state.selectedConfig
        }));
      },
      
      setSelectedConfig: (id) => {
        set({ selectedConfig: id });
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      setError: (error) => {
        set({ error });
      }
    }),
    {
      name: 'VectorStore',
      enabled: process.env.NODE_ENV !== 'production'
    }
  )
);

// Selector hooks
export const useVectorConfigurations = () => useVectorStore(state => state.configurations);
export const useSelectedVectorConfig = () => {
  const { configurations, selectedConfig } = useVectorStore();
  return selectedConfig ? configurations.find(config => config.id === selectedConfig) : null;
};
export const useVectorLoadingState = () => useVectorStore(state => state.isLoading);
export const useVectorError = () => useVectorStore(state => state.error);

// Helper utility for the vector store
export const utils = {
  async fetchConfigurations() {
    useVectorStore.getState().setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('vector_configurations')
        .select('*');
        
      if (error) throw error;
      
      useVectorStore.getState().setConfigurations(data as VectorConfiguration[]);
      useVectorStore.getState().setLoading(false);
      
      return data as VectorConfiguration[];
    } catch (error) {
      useVectorStore.getState().setError(error as Error);
      useVectorStore.getState().setLoading(false);
      return [];
    }
  }
};
