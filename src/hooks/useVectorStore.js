import { useEffect, useState } from 'react';
import { useVectorStore, useVectorConfigurations, useSelectedVectorConfig, useVectorLoadingState, createVectorConfiguration } from '@/stores/features/vector/store';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth/store';
/**
 * Hook for managing vector store configurations
 */
export function useVectorStoreManagement() {
    const { setConfigurations, setSelectedConfig, updateConfiguration, deleteConfiguration, setLoading, setError } = useVectorStore();
    const { isLoading, error } = useVectorLoadingState();
    const configurations = useVectorConfigurations();
    const selectedConfig = useSelectedVectorConfig();
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const [initialized, setInitialized] = useState(false);
    // Load configurations on mount if authenticated
    useEffect(() => {
        const fetchConfigurations = async () => {
            if (!isAuthenticated || initialized)
                return;
            try {
                setLoading(true);
                // Get current user
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    setLoading(false);
                    return;
                }
                // Get configurations from Supabase
                const { data, error } = await supabase
                    .from('vector_configurations')
                    .select('*')
                    .eq('user_id', user.id);
                if (error)
                    throw error;
                // Transform to VectorConfiguration objects
                const configs = (data || []).map(item => ({
                    id: item.id,
                    name: item.name,
                    description: item.description || '',
                    storeType: item.store_type,
                    config: item.config,
                    isActive: item.is_active,
                    createdAt: item.created_at,
                    updatedAt: item.updated_at,
                    userId: item.user_id
                }));
                setConfigurations(configs);
                // Set selected config if there's an active one
                const activeConfig = configs.find(c => c.isActive);
                if (activeConfig) {
                    setSelectedConfig(activeConfig.id);
                }
                setInitialized(true);
                logger.info('Vector configurations loaded', { count: configs.length });
            }
            catch (error) {
                logger.error('Error fetching vector configurations', { error });
                setError(error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchConfigurations();
    }, [isAuthenticated, initialized, setConfigurations, setSelectedConfig, setLoading, setError]);
    /**
     * Create a new vector configuration
     */
    const createConfig = async (config) => {
        try {
            setLoading(true);
            const newConfig = await createVectorConfiguration(config);
            if (newConfig) {
                toast.success(`Vector configuration "${config.name}" created`);
                // If this is the first configuration or it's set to active, select it
                if (configurations.length === 0 || config.isActive) {
                    setSelectedConfig(newConfig.id);
                }
                return newConfig;
            }
            toast.error('Failed to create vector configuration');
            return null;
        }
        catch (error) {
            logger.error('Error creating vector configuration', { error });
            setError(error);
            toast.error('Error creating configuration');
            return null;
        }
        finally {
            setLoading(false);
        }
    };
    /**
     * Update an existing vector configuration
     */
    const updateConfig = async (id, updates) => {
        try {
            setLoading(true);
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
            if (error)
                throw error;
            // Update in store
            updateConfiguration(id, updates);
            toast.success('Vector configuration updated');
            return true;
        }
        catch (error) {
            logger.error('Error updating vector configuration', { error, id });
            setError(error);
            toast.error('Error updating configuration');
            return false;
        }
        finally {
            setLoading(false);
        }
    };
    /**
     * Delete a vector configuration
     */
    const deleteConfig = async (id) => {
        try {
            setLoading(true);
            // Delete from Supabase
            const { error } = await supabase
                .from('vector_configurations')
                .delete()
                .eq('id', id);
            if (error)
                throw error;
            // Delete from store
            deleteConfiguration(id);
            toast.success('Vector configuration deleted');
            return true;
        }
        catch (error) {
            logger.error('Error deleting vector configuration', { error, id });
            setError(error);
            toast.error('Error deleting configuration');
            return false;
        }
        finally {
            setLoading(false);
        }
    };
    /**
     * Set the active vector configuration
     */
    const setActiveConfig = async (id) => {
        try {
            setLoading(true);
            // First deactivate all configurations
            await supabase
                .from('vector_configurations')
                .update({ is_active: false })
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all rows
            // Then activate the selected configuration
            const { error } = await supabase
                .from('vector_configurations')
                .update({ is_active: true })
                .eq('id', id);
            if (error)
                throw error;
            // Update in store
            const updatedConfigs = configurations.map(config => ({
                ...config,
                isActive: config.id === id
            }));
            setConfigurations(updatedConfigs);
            setSelectedConfig(id);
            toast.success('Vector configuration activated');
            return true;
        }
        catch (error) {
            logger.error('Error setting active vector configuration', { error, id });
            setError(error);
            toast.error('Error activating configuration');
            return false;
        }
        finally {
            setLoading(false);
        }
    };
    return {
        // State
        configurations,
        selectedConfig,
        isLoading,
        error,
        // Actions
        createConfig,
        updateConfig,
        deleteConfig,
        setActiveConfig,
        selectConfig: setSelectedConfig
    };
}
