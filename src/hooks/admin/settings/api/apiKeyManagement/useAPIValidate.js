import { toast } from "sonner";
import { useAPIOperation } from "./useAPIOperation";
export const useAPIValidate = (configurations, fetchConfigurations) => {
    const { isProcessing: isValidating, executeOperation } = useAPIOperation({
        onSuccess: fetchConfigurations,
        errorMessage: "Failed to validate API key",
        successMessage: "API key validated successfully"
    });
    const validateConfig = async (configId) => {
        const config = configurations.find(c => c.id === configId);
        if (!config) {
            toast.error('Configuration not found');
            return false;
        }
        return await executeOperation('validate', { memorableName: config.memorable_name });
    };
    return {
        isValidating,
        validateConfig
    };
};
