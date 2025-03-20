
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  VectorStore, 
  VectorState, 
  VectorActions,
  NewVectorConfig
} from '@/types/store/features/vector/types';
import { VectorConfiguration, VectorConfigId } from '@/types/domain/vector/types';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';

// Initial state
const initialState: VectorState = {
  configurations: [],
  selectedConfig: null,
  isLoading: false,
  error: null
};

// Create store
export const useVectorStore = create<VectorStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Configuration setters
        setConfigurations: (configurations) => set({ configurations }),
        
        addConfiguration: (config) => set(state => ({ 
          configurations: [...state.configurations, config]
        })),
        
        updateConfiguration: (id, updates) => set(state => ({
          configurations: state.configurations.map(config => 
            config.id === id ? { ...config, ...updates } : config
          )
        })),
        
        deleteConfiguration: (id) => set(state => ({
          configurations: state.configurations.filter(config => config.id !== id),
          selectedConfig: state.selectedConfig === id ? null : state.selectedConfig
        })),
        
        setSelectedConfig: (id) => set({ selectedConfig: id }),
        
        // Loading and error state
        setLoading: (loading) => set({ isLoading: loading }),
        
        setError: (error) => set({ error })
      }),
      {
        name: 'vector-store',
        partialize: (state) => ({
          configurations: state.configurations,
          selectedConfig: state.selectedConfig
        })
      }
    ),
    {
      name: 'VectorStore',
      enabled: process.env.NODE_ENV !== 'production'
    }
  )
);

// Utility functions
export const createVectorConfiguration = async (newConfig: NewVectorConfig): Promise<VectorConfiguration | null> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Create configuration in Supabase
    const { data, error } = await supabase
      .from('vector_configurations')
      .insert({
        name: newConfig.name,
        description: newConfig.description || '',
        store_type: newConfig.storeType,
        config: newConfig.config,
        is_active: newConfig.isActive ?? false,
        user_id: user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    if (data) {
      const config: VectorConfiguration = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        storeType: data.store_type,
        config: data.config,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        userId: data.user_id
      };
      
      // Add to store
      useVectorStore.getState().addConfiguration(config);
      logger.info('Vector configuration created', { id: config.id, name: config.name });
      
      return config;
    }
    
    return null;
  } catch (error) {
    logger.error('Error creating vector configuration', { error });
    useVectorStore.getState().setError(error as Error);
    return null;
  }
};

// Selector hooks for more focused state access
export const useVectorConfigurations = () => useVectorStore(state => state.configurations);
export const useSelectedVectorConfig = () => {
  const { configurations, selectedConfig } = useVectorStore();
  return configurations.find(config => config.id === selectedConfig) || null;
};
export const useVectorLoadingState = () => {
  const { isLoading, error } = useVectorStore();
  return { isLoading, error };
};
export const useVectorError = () => useVectorStore(state => state.error);
