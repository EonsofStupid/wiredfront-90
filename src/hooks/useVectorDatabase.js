import { useState, useCallback } from 'react';
import { useVectorStore, useVectorConfigurations, useSelectedVectorConfig } from '@/stores/features/vector';
import { formatNewVectorConfig } from '@/stores/features/vector/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
/**
 * Hook for vector database management operations
 */
export function useVectorDatabase() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const configurations = useVectorConfigurations();
    const selectedConfigId = useSelectedVectorConfig();
    const { setConfigurations, addConfiguration, updateConfiguration, deleteConfiguration, setSelectedConfig, setLoading: setStoreLoading, setError: setStoreError } = useVectorStore();
    // Get the selected configuration
    const selectedConfig = configurations.find(config => config.id === selectedConfigId) || null;
    // Load all configurations from Supabase
    const loadConfigurations = useCallback(async () => {
        setIsLoading(true);
        setStoreLoading(true);
        try {
            const { data, error } = await supabase
                .from('vector_configurations')
                .select('*');
            if (error) {
                throw new Error(`Failed to load vector configurations: ${error.message}`);
            }
            // Transform the configurations from snake_case to camelCase
            const transformedConfigs = data.map(item => ({
                id: item.id,
                name: item.name,
                description: item.description,
                storeType: item.store_type,
                config: item.config,
                isActive: item.is_active,
                clusterInfo: item.cluster_info,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
                endpointUrl: item.endpoint_url,
                grpcEndpoint: item.grpc_endpoint,
                readOnlyKey: item.read_only_key,
                userId: item.user_id
            }));
            setConfigurations(transformedConfigs);
            return transformedConfigs;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('An unknown error occurred while loading configurations');
            setError(error);
            setStoreError(error);
            toast.error(error.message);
            return [];
        }
        finally {
            setIsLoading(false);
            setStoreLoading(false);
        }
    }, [setConfigurations, setStoreLoading, setStoreError]);
    // Create a new configuration
    const createConfiguration = useCallback(async (configInput) => {
        setIsLoading(true);
        try {
            const newConfig = formatNewVectorConfig(configInput);
            // Save to Supabase
            const { error } = await supabase
                .from('vector_configurations')
                .insert({
                id: newConfig.id,
                name: newConfig.name,
                description: newConfig.description,
                store_type: newConfig.storeType,
                config: newConfig.config,
                is_active: newConfig.isActive,
                created_at: newConfig.createdAt,
                updated_at: newConfig.updatedAt
            });
            if (error) {
                throw new Error(`Failed to create vector configuration: ${error.message}`);
            }
            // Add to local state
            addConfiguration(newConfig);
            // Set as selected
            setSelectedConfig(newConfig.id);
            toast.success(`Vector configuration "${newConfig.name}" created successfully`);
            return newConfig;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('An unknown error occurred while creating configuration');
            setError(error);
            toast.error(error.message);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }, [addConfiguration, setSelectedConfig]);
    // Update an existing configuration
    const updateConfigurationById = useCallback(async (id, updates) => {
        setIsLoading(true);
        try {
            // Update in Supabase
            const { error } = await supabase
                .from('vector_configurations')
                .update({
                name: updates.name,
                description: updates.description,
                store_type: updates.storeType,
                config: updates.config,
                is_active: updates.isActive,
                updated_at: new Date().toISOString()
            })
                .eq('id', id);
            if (error) {
                throw new Error(`Failed to update vector configuration: ${error.message}`);
            }
            // Update in local state
            updateConfiguration(id, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
            toast.success('Vector configuration updated successfully');
            return true;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('An unknown error occurred while updating configuration');
            setError(error);
            toast.error(error.message);
            return false;
        }
        finally {
            setIsLoading(false);
        }
    }, [updateConfiguration]);
    // Delete a configuration
    const deleteConfigurationById = useCallback(async (id) => {
        setIsLoading(true);
        try {
            // Delete from Supabase
            const { error } = await supabase
                .from('vector_configurations')
                .delete()
                .eq('id', id);
            if (error) {
                throw new Error(`Failed to delete vector configuration: ${error.message}`);
            }
            // Delete from local state
            deleteConfiguration(id);
            // Unselect if this was the selected config
            if (selectedConfigId === id) {
                setSelectedConfig(null);
            }
            toast.success('Vector configuration deleted successfully');
            return true;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('An unknown error occurred while deleting configuration');
            setError(error);
            toast.error(error.message);
            return false;
        }
        finally {
            setIsLoading(false);
        }
    }, [deleteConfiguration, selectedConfigId, setSelectedConfig]);
    return {
        configurations,
        selectedConfig,
        selectedConfigId,
        isLoading,
        error,
        // Actions
        loadConfigurations,
        createConfiguration,
        updateConfiguration: updateConfigurationById,
        deleteConfiguration: deleteConfigurationById,
        setSelectedConfig
    };
}
