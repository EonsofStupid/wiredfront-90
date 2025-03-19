
import { useEffect } from 'react';
import { useVectorStore } from '@/stores/features/vector/store';
import { VectorDBService } from '@/services/supabase/VectorDBService';
import { 
  VectorConfiguration, 
  VectorConfigId, 
  createVectorConfigId,
  VectorConfig,
  ClusterInfo,
  VectorStoreType
} from '@/types/domain/vector';
import { toast } from 'sonner';

/**
 * Hook for managing vector database configurations
 */
export const useVectorDBConfigurations = () => {
  const {
    configurations,
    isLoading,
    selectedConfig,
    error,
    setConfigurations,
    addConfiguration,
    updateConfiguration,
    deleteConfiguration,
    setSelectedConfig,
    setLoading,
    setError
  } = useVectorStore();

  // Load configurations
  useEffect(() => {
    const loadConfigurations = async () => {
      setLoading(true);
      try {
        const data = await VectorDBService.getConfigurations();
        
        // Transform database data to domain types
        const transformedConfigs: VectorConfiguration[] = data.map((item): VectorConfiguration => {
          // Parse JSON strings if needed
          const configObj = typeof item.config === 'string' 
            ? JSON.parse(item.config) 
            : item.config;
            
          const clusterObj = typeof item.cluster_info === 'string' 
            ? JSON.parse(item.cluster_info) 
            : item.cluster_info;
            
          return {
            id: createVectorConfigId(item.id),
            userId: item.user_id,
            storeType: item.store_type as VectorStoreType,
            config: configObj as VectorConfig,
            isActive: item.is_active,
            clusterInfo: clusterObj as ClusterInfo,
            createdAt: new Date(item.created_at),
            updatedAt: new Date(item.updated_at),
            endpointUrl: item.endpoint_url,
            grpcEndpoint: item.grpc_endpoint,
            readOnlyKey: item.read_only_key,
            environment: item.environment,
            indexName: item.index_name
          };
        });
        
        setConfigurations(transformedConfigs);
        setError(null);
      } catch (err) {
        console.error('Error loading vector store configurations:', err);
        setError(err instanceof Error ? err : new Error('Unknown error loading configurations'));
      }
      setLoading(false);
    };

    loadConfigurations();
  }, [setConfigurations, setLoading, setError]);

  // Create new configuration
  const createConfiguration = async (config: Omit<VectorConfiguration, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      // Convert from domain type to database type for API
      const dbConfig = {
        store_type: config.storeType,
        config: config.config,
        is_active: config.isActive,
        cluster_info: config.clusterInfo,
        endpoint_url: config.endpointUrl,
        grpc_endpoint: config.grpcEndpoint,
        read_only_key: config.readOnlyKey,
        environment: config.environment,
        index_name: config.indexName
      };
      
      const newConfig = await VectorDBService.createConfiguration(dbConfig);
      
      if (newConfig) {
        // Transform to domain type
        const configObj = typeof newConfig.config === 'string' 
          ? JSON.parse(newConfig.config) 
          : newConfig.config;
          
        const clusterObj = typeof newConfig.cluster_info === 'string' 
          ? JSON.parse(newConfig.cluster_info) 
          : newConfig.cluster_info;
          
        const transformedConfig: VectorConfiguration = {
          id: createVectorConfigId(newConfig.id),
          userId: newConfig.user_id,
          storeType: newConfig.store_type as VectorStoreType,
          config: configObj as VectorConfig,
          isActive: newConfig.is_active,
          clusterInfo: clusterObj as ClusterInfo,
          createdAt: new Date(newConfig.created_at),
          updatedAt: new Date(newConfig.updated_at),
          endpointUrl: newConfig.endpoint_url,
          grpcEndpoint: newConfig.grpc_endpoint,
          readOnlyKey: newConfig.read_only_key,
          environment: newConfig.environment,
          indexName: newConfig.index_name
        };
        
        addConfiguration(transformedConfig);
        toast.success("Vector configuration created successfully");
        return transformedConfig;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error creating configuration'));
      toast.error("Failed to create vector configuration");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update configuration
  const updateConfig = async (id: VectorConfigId, updates: Partial<VectorConfiguration>) => {
    setLoading(true);
    try {
      // Convert domain updates to DB updates
      const dbUpdates: any = {};
      
      if (updates.storeType) dbUpdates.store_type = updates.storeType;
      if (updates.config) dbUpdates.config = updates.config;
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
      if (updates.clusterInfo) dbUpdates.cluster_info = updates.clusterInfo;
      if (updates.endpointUrl) dbUpdates.endpoint_url = updates.endpointUrl;
      if (updates.grpcEndpoint) dbUpdates.grpc_endpoint = updates.grpcEndpoint;
      if (updates.readOnlyKey) dbUpdates.read_only_key = updates.readOnlyKey;
      if (updates.environment) dbUpdates.environment = updates.environment;
      if (updates.indexName) dbUpdates.index_name = updates.indexName;
      
      const updated = await VectorDBService.updateConfiguration(id.toString(), dbUpdates);
      
      if (updated) {
        // Transform response back to domain type
        const configObj = typeof updated.config === 'string' 
          ? JSON.parse(updated.config) 
          : updated.config;
          
        const clusterObj = typeof updated.cluster_info === 'string' 
          ? JSON.parse(updated.cluster_info) 
          : updated.cluster_info;
          
        const transformedConfig: VectorConfiguration = {
          id: createVectorConfigId(updated.id),
          userId: updated.user_id,
          storeType: updated.store_type as VectorStoreType,
          config: configObj as VectorConfig,
          isActive: updated.is_active,
          clusterInfo: clusterObj as ClusterInfo,
          createdAt: new Date(updated.created_at),
          updatedAt: new Date(updated.updated_at),
          endpointUrl: updated.endpoint_url,
          grpcEndpoint: updated.grpc_endpoint,
          readOnlyKey: updated.read_only_key,
          environment: updated.environment,
          indexName: updated.index_name
        };
        
        updateConfiguration(id, transformedConfig);
        toast.success("Vector configuration updated successfully");
        return transformedConfig;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error updating configuration'));
      toast.error("Failed to update vector configuration");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete configuration
  const deleteConfig = async (id: VectorConfigId) => {
    setLoading(true);
    try {
      const success = await VectorDBService.deleteConfiguration(id.toString());
      if (success) {
        deleteConfiguration(id);
        toast.success("Vector configuration deleted successfully");
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error deleting configuration'));
      toast.error("Failed to delete vector configuration");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    configurations,
    isLoading,
    selectedConfig,
    error,
    createConfiguration,
    updateConfiguration: updateConfig,
    deleteConfiguration: deleteConfig,
    setSelectedConfig
  };
};
