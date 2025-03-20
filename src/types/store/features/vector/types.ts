
import { 
  VectorConfiguration, 
  VectorConfigId, 
  VectorConfig,
  VectorStoreType 
} from '@/types/domain/vector/types';

/**
 * Store state for vector configurations
 */
export interface VectorState {
  configurations: VectorConfiguration[];
  selectedConfig: VectorConfigId | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Store actions for vector configurations
 */
export interface VectorActions {
  setConfigurations: (configs: VectorConfiguration[]) => void;
  addConfiguration: (config: VectorConfiguration) => void;
  updateConfiguration: (id: VectorConfigId, updates: Partial<VectorConfiguration>) => void;
  deleteConfiguration: (id: VectorConfigId) => void;
  setSelectedConfig: (id: VectorConfigId | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

/**
 * Vector configuration input for creating new configurations
 */
export interface NewVectorConfig {
  storeType: VectorStoreType;
  config: VectorConfig;
  isActive?: boolean;
  name: string;
  description?: string;
}

/**
 * Complete vector store
 */
export type VectorStore = VectorState & VectorActions;
