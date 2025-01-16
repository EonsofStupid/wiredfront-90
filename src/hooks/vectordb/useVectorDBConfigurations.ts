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
      const data = await VectorDBService.getConfigurations();
      setConfigurations(data);
      setLoading(false);
    };

    loadConfigurations();
  }, [setConfigurations, setLoading]);

  const createConfiguration = async (config: Omit<VectorStoreConfig, 'id'>) => {
    setLoading(true);
    const newConfig = await VectorDBService.createConfiguration(config);
    if (newConfig) {
      addConfiguration(newConfig);
    }
    setLoading(false);
    return newConfig;
  };

  const updateConfig = async (id: string, updates: Partial<VectorStoreConfig>) => {
    setLoading(true);
    const updated = await VectorDBService.updateConfiguration(id, updates);
    if (updated) {
      updateConfiguration(id, updated);
    }
    setLoading(false);
    return updated;
  };

  const deleteConfig = async (id: string) => {
    setLoading(true);
    const success = await VectorDBService.deleteConfiguration(id);
    if (success) {
      deleteConfiguration(id);
    }
    setLoading(false);
    return success;
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