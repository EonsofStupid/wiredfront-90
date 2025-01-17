import { useEffect } from 'react';
import { useVectorDBStore } from '@/stores/vectordb/store';
import { VectorDBService } from '@/services/supabase/VectorDBService';
import { VectorStoreConfig } from '@/types/store/settings/api-config';

export const useVectorDBConfigurations = () => {
  const {
    configurations,
    loading,
    selectedConfig,
    error,
    setConfigurations,
    addConfiguration,
    updateConfiguration,
    deleteConfiguration,
    setSelectedConfig,
    setLoading,
    setError
  } = useVectorDBStore();

  useEffect(() => {
    const loadConfigurations = async () => {
      setLoading(true);
      try {
        const data = await VectorDBService.getConfigurations();
        const transformedData = data.map((item): VectorStoreConfig => ({
          ...item,
          config: typeof item.config === 'string' ? JSON.parse(item.config) : item.config,
          cluster_info: typeof item.cluster_info === 'string' ? JSON.parse(item.cluster_info) : item.cluster_info
        }));
        setConfigurations(transformedData);
      } catch (err) {
        console.error('Error loading vector store configurations:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
      setLoading(false);
    };

    loadConfigurations();
  }, [setConfigurations, setLoading, setError]);

  const createConfiguration = async (config: Omit<VectorStoreConfig, 'id'>) => {
    setLoading(true);
    try {
      const newConfig = await VectorDBService.createConfiguration(config);
      if (newConfig) {
        const transformedConfig: VectorStoreConfig = {
          ...newConfig,
          config: typeof newConfig.config === 'string' ? JSON.parse(newConfig.config) : newConfig.config,
          cluster_info: typeof newConfig.cluster_info === 'string' ? JSON.parse(newConfig.cluster_info) : newConfig.cluster_info
        };
        addConfiguration(transformedConfig);
      }
      setLoading(false);
      return newConfig;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
      return null;
    }
  };

  const updateConfig = async (id: string, updates: Partial<VectorStoreConfig>) => {
    setLoading(true);
    try {
      const updated = await VectorDBService.updateConfiguration(id, updates);
      if (updated) {
        const transformedConfig: VectorStoreConfig = {
          ...updated,
          config: typeof updated.config === 'string' ? JSON.parse(updated.config) : updated.config,
          cluster_info: typeof updated.cluster_info === 'string' ? JSON.parse(updated.cluster_info) : updated.cluster_info
        };
        updateConfiguration(id, transformedConfig);
      }
      setLoading(false);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
      return null;
    }
  };

  const deleteConfig = async (id: string) => {
    setLoading(true);
    try {
      const success = await VectorDBService.deleteConfiguration(id);
      if (success) {
        deleteConfiguration(id);
      }
      setLoading(false);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
      return false;
    }
  };

  return {
    configurations,
    loading,
    selectedConfig,
    error,
    createConfiguration,
    updateConfiguration: updateConfig,
    deleteConfiguration: deleteConfig,
    setSelectedConfig
  };
};