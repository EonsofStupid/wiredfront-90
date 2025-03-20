import { useAPIKeyState } from "./useAPIKeyState";
import { useAPISave } from "./useAPISave";
import { useAPIDelete } from "./useAPIDelete";
import { useAPIValidate } from "./useAPIValidate";
export const useAPIKeyManagement = () => {
    const { isLoading, setIsLoading, configurations, setConfigurations, fetchConfigurations } = useAPIKeyState();
    const { createApiKey } = useAPISave(fetchConfigurations);
    const { deleteConfig } = useAPIDelete(configurations, fetchConfigurations);
    const { validateConfig } = useAPIValidate(configurations, fetchConfigurations);
    return {
        isLoading,
        configurations,
        fetchConfigurations,
        createApiKey,
        deleteConfig,
        validateConfig
    };
};
