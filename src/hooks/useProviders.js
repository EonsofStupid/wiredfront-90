import { useState, useEffect, useCallback } from 'react';
import { useChatStore } from '@/components/chat/store';
import { getAllProviders, getDefaultProvider, getProvider, getProvidersByCategory } from '@/services/llm/providers';
import { logger } from '@/services/chat/LoggingService';
export function useProviders() {
    const [isLoading, setIsLoading] = useState(true);
    const { currentProvider, updateCurrentProvider, currentMode, setCurrentMode } = useChatStore();
    // Load providers and set default on mount
    useEffect(() => {
        const initializeProviders = async () => {
            setIsLoading(true);
            try {
                // Get all providers
                const providers = getAllProviders();
                // Determine the provider category based on the current mode
                let category = 'chat';
                if (currentMode === 'image') {
                    category = 'image';
                }
                else if (currentMode === 'dev') {
                    category = 'chat'; // Use chat providers for dev mode too
                }
                // Get the default provider for the category
                const defaultProvider = getDefaultProvider(category);
                if (defaultProvider) {
                    // Map to the ChatProvider type expected by the store
                    const chatProvider = {
                        id: defaultProvider.id,
                        name: defaultProvider.name,
                        type: defaultProvider.type,
                        models: [defaultProvider.config.modelName],
                        enabled: true,
                        category: defaultProvider.category,
                        isDefault: true
                    };
                    // Update the store with the default provider
                    updateCurrentProvider(chatProvider);
                    logger.info(`Set default provider: ${defaultProvider.name}`);
                }
                else {
                    logger.warn(`No default provider found for category: ${category}`);
                }
            }
            catch (error) {
                logger.error("Error initializing providers", error);
            }
            finally {
                setIsLoading(false);
            }
        };
        initializeProviders();
    }, [currentMode, updateCurrentProvider]);
    // Change provider
    const changeProvider = useCallback((providerId) => {
        try {
            const providerInstance = getProvider(providerId);
            if (!providerInstance) {
                logger.error(`Provider not found: ${providerId}`);
                return;
            }
            // Map to the ChatProvider type expected by the store
            const chatProvider = {
                id: providerInstance.id,
                name: providerInstance.name,
                type: providerInstance.type,
                models: [providerInstance.config.modelName],
                enabled: true,
                category: providerInstance.category,
                isDefault: false
            };
            // Update the store
            updateCurrentProvider(chatProvider);
            logger.info(`Changed provider to: ${providerInstance.name}`);
        }
        catch (error) {
            logger.error("Error changing provider", error);
        }
    }, [updateCurrentProvider]);
    // Get providers by category
    const getProviders = useCallback((category) => {
        const providers = getProvidersByCategory(category);
        // Map to the ChatProvider type expected by the components
        return providers.map(provider => ({
            id: provider.id,
            name: provider.name,
            type: provider.type,
            models: [provider.config.modelName],
            enabled: true,
            category: provider.category,
            isDefault: provider === getDefaultProvider(category)
        }));
    }, []);
    return {
        isLoading,
        currentProvider,
        changeProvider,
        getProviders
    };
}
