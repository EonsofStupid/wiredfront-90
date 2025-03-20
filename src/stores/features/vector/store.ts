
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  VectorStore,
  VectorState,
  VectorActions
} from '@/types/store/features/vector/types';
import { 
  VectorConfiguration, 
  VectorConfigId,
  createVectorConfigId
} from '@/types/domain/vector/types';

const initialState: VectorState = {
  configurations: [],
  selectedConfig: null,
  isLoading: false,
  error: null
};

/**
 * Store for managing vector database configurations
 */
export const useVectorStore = create<VectorStore>()(
  devtools(
    (set) => ({
      ...initialState,

      // Actions
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
          configurations: state.configurations.filter((config) => config.id !== id),
          selectedConfig: state.selectedConfig === id ? null : state.selectedConfig
        })),
      
      setSelectedConfig: (id) => set({ selectedConfig: id }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error })
    }),
    {
      name: 'Vector-Store'
    }
  )
);

// Selectors as custom hooks for better type safety and easier usage
export const useVectorConfigurations = () => useVectorStore((state) => state.configurations);
export const useSelectedVectorConfig = () => useVectorStore((state) => state.selectedConfig);
export const useVectorLoadingState = () => useVectorStore((state) => state.isLoading);
export const useVectorError = () => useVectorStore((state) => state.error);
