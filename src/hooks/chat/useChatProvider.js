import { useState, useEffect, useCallback } from 'react';
import { useChatStore } from '@/components/chat/store/chatStore';
import { getProvider } from '@/services/llm/providers';
import { logger } from '@/services/chat/LoggingService';
export function useChatProvider() {
    const { currentProvider } = useChatStore();
    const [provider, setProvider] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // Get the actual provider implementation when the currentProvider changes
    useEffect(() => {
        if (!currentProvider)
            return;
        const providerImpl = getProvider(currentProvider.id);
        setProvider(providerImpl || null);
        if (!providerImpl) {
            logger.warn(`Provider not found for id: ${currentProvider.id}`);
            setError(`Provider not found: ${currentProvider.name}`);
        }
        else {
            setError(null);
        }
    }, [currentProvider]);
    // Generate text using the current provider
    const generateText = useCallback(async (prompt, options) => {
        if (!provider) {
            return "No provider selected.";
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await provider.generateText(prompt, options);
            return response;
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMsg);
            logger.error('Error generating text', err);
            return `Error: ${errorMsg}`;
        }
        finally {
            setIsLoading(false);
        }
    }, [provider]);
    // Generate image using the current provider
    const generateImage = useCallback(async (prompt, options) => {
        if (!provider) {
            return "No provider selected.";
        }
        if (!provider.capabilities.image) {
            return `Provider ${provider.name} does not support image generation.`;
        }
        setIsLoading(true);
        setError(null);
        try {
            // @ts-ignore - Some providers might not implement generateImage
            if (!provider.generateImage) {
                throw new Error(`Image generation not implemented for ${provider.name}`);
            }
            // @ts-ignore - TypeScript doesn't know that we've checked for existence
            const response = await provider.generateImage(prompt, options);
            return response;
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMsg);
            logger.error('Error generating image', err);
            return `Error: ${errorMsg}`;
        }
        finally {
            setIsLoading(false);
        }
    }, [provider]);
    // Generate code using the current provider
    const generateCode = useCallback(async (prompt, options) => {
        if (!provider) {
            return "No provider selected.";
        }
        if (!provider.capabilities.dev) {
            return `Provider ${provider.name} does not support code generation.`;
        }
        setIsLoading(true);
        setError(null);
        try {
            // @ts-ignore - Some providers might not implement generateCode
            if (!provider.generateCode) {
                // Fall back to regular text generation
                return await provider.generateText(prompt, options);
            }
            // @ts-ignore - TypeScript doesn't know that we've checked for existence
            const response = await provider.generateCode(prompt, options);
            return response;
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMsg);
            logger.error('Error generating code', err);
            return `Error: ${errorMsg}`;
        }
        finally {
            setIsLoading(false);
        }
    }, [provider]);
    // Test connection to the provider
    const testConnection = useCallback(async () => {
        if (!provider) {
            return false;
        }
        setIsLoading(true);
        setError(null);
        try {
            const success = await provider.testConnection();
            if (!success) {
                setError(`Failed to connect to ${provider.name}`);
            }
            return success;
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMsg);
            logger.error('Error testing connection', err);
            return false;
        }
        finally {
            setIsLoading(false);
        }
    }, [provider]);
    return {
        provider,
        currentProviderType: provider?.type,
        providerName: provider?.name,
        isLoading,
        error,
        capabilities: provider?.capabilities,
        generateText,
        generateImage,
        generateCode,
        testConnection
    };
}
