import { useAPIOperation } from "./useAPIOperation";
export const useAPISave = (fetchConfigurations) => {
    const { isProcessing: isSaving, executeOperation } = useAPIOperation({
        onSuccess: fetchConfigurations,
        errorMessage: "Failed to save API key",
        successMessage: "API key saved successfully"
    });
    const createApiKey = async (provider, memorableName, secretValue, settings, roleBindings, userBindings = []) => {
        return await executeOperation('create', {
            secretValue,
            provider,
            memorableName,
            settings,
            roleBindings,
            userBindings
        });
    };
    return {
        isSaving,
        createApiKey
    };
};
