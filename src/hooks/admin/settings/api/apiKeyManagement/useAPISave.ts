
import { APIType } from "@/types/admin/settings/api";
import { useAPIOperation } from "./useAPIOperation";

export const useAPISave = (fetchConfigurations: () => Promise<void>) => {
  const { isProcessing: isSaving, executeOperation } = useAPIOperation({
    onSuccess: fetchConfigurations,
    errorMessage: "Failed to save API key",
    successMessage: "API key saved successfully"
  });

  const createApiKey = async (
    provider: APIType,
    memorableName: string,
    secretValue: string,
    settings: {
      feature_bindings: string[];
      rag_preference: string;
      planning_mode: string;
    },
    roleBindings: string[],
    userBindings: string[] = []
  ) => {
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
