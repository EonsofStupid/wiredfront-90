import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { logger } from '@/services/chat/LoggingService';
import { AIProviderService } from '@/services/chat/AIProviderService';
const initialState = {
    providers: [],
    currentProviderId: null,
    isInitialized: false,
    isLoading: false,
    error: null
};
export const useProviderRegistry = create()(devtools(persist((set, get) => ({
    ...initialState,
    registerProvider: (provider) => {
        set(state => {
            // Check if provider already exists
            const exists = state.providers.some(p => p.id === provider.id);
            if (exists) {
                return state; // Don't add duplicate
            }
            logger.info(`Registering provider: ${provider.name}`, { provider });
            return {
                providers: [...state.providers, provider]
            };
        });
    },
    updateProvider: (id, updates) => {
        set(state => {
            const providerIndex = state.providers.findIndex(p => p.id === id);
            if (providerIndex === -1) {
                logger.warn(`Attempted to update non-existent provider: ${id}`);
                return state;
            }
            const updatedProviders = [...state.providers];
            updatedProviders[providerIndex] = {
                ...updatedProviders[providerIndex],
                ...updates
            };
            logger.debug(`Updated provider: ${id}`, { updates });
            return {
                providers: updatedProviders
            };
        });
    },
    setCurrentProvider: (id) => {
        const provider = get().providers.find(p => p.id === id);
        if (!provider) {
            logger.error(`Attempted to set current provider to non-existent provider: ${id}`);
            return;
        }
        logger.info(`Setting current provider: ${provider.name}`);
        set({ currentProviderId: id });
    },
    testConnection: async (id) => {
        const provider = get().providers.find(p => p.id === id);
        if (!provider) {
            logger.error(`Cannot test connection for non-existent provider: ${id}`);
            return false;
        }
        try {
            set(state => ({
                providers: state.providers.map(p => p.id === id
                    ? { ...p, status: { ...p.status, connected: false, error: null } }
                    : p)
            }));
            // Use the AIProviderService to test the connection
            const result = await AIProviderService.testProviderConnection(id);
            set(state => ({
                providers: state.providers.map(p => p.id === id
                    ? {
                        ...p,
                        status: {
                            ...p.status,
                            connected: result.success,
                            error: result.success ? null : result.message,
                            lastConnected: result.success ? new Date().toISOString() : p.status.lastConnected
                        }
                    }
                    : p)
            }));
            return result.success;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error(`Connection test failed for provider: ${provider.name}`, { error });
            set(state => ({
                providers: state.providers.map(p => p.id === id
                    ? {
                        ...p,
                        status: {
                            ...p.status,
                            connected: false,
                            error: errorMessage
                        }
                    }
                    : p)
            }));
            return false;
        }
    },
    verifyApiKey: async (id) => {
        const provider = get().providers.find(p => p.id === id);
        if (!provider) {
            logger.error(`Cannot verify API key for non-existent provider: ${id}`);
            return false;
        }
        if (!provider.config.apiKey) {
            logger.error(`No API key configured for provider: ${provider.name}`);
            return false;
        }
        // API key verification is essentially a connection test
        return get().testConnection(id);
    },
    getProvidersByCategory: (category) => {
        return get().providers.filter(p => p.category === category && p.isEnabled);
    },
    getProviderById: (id) => {
        return get().providers.find(p => p.id === id) || null;
    },
    getDefaultProvider: (category) => {
        // First try to find a default provider for the category
        const defaultProvider = get().providers.find(p => p.category === category && p.isDefault && p.isEnabled);
        if (defaultProvider)
            return defaultProvider;
        // If no default, get the first enabled provider in this category
        return get().providers.find(p => p.category === category && p.isEnabled) || null;
    }
}), {
    name: 'provider-registry',
    partialize: (state) => ({
        providers: state.providers,
        currentProviderId: state.currentProviderId,
        isInitialized: state.isInitialized
    }),
}), {
    name: 'Provider Registry',
    enabled: process.env.NODE_ENV === 'development',
}));
