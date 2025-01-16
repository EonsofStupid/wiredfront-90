import { VectorStoreConfig } from '@/types/store/settings/api-config';

export interface VectorDBState {
  configurations: VectorStoreConfig[];
  loading: boolean;
  selectedConfig: string | null;
  error: string | null;
}

export interface VectorDBActions {
  setConfigurations: (configs: VectorStoreConfig[]) => void;
  addConfiguration: (config: VectorStoreConfig) => void;
  updateConfiguration: (id: string, updates: Partial<VectorStoreConfig>) => void;
  deleteConfiguration: (id: string) => void;
  setSelectedConfig: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export type VectorDBStore = VectorDBState & VectorDBActions;