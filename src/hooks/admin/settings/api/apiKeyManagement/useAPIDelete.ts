
import { toast } from "sonner";
import { APIConfiguration } from "../useAPIKeyManagement";
import { useAPIOperation } from "./useAPIOperation";

export const useAPIDelete = (
  configurations: APIConfiguration[],
  fetchConfigurations: () => Promise<void>
) => {
  const { isProcessing: isDeleting, executeOperation } = useAPIOperation({
    onSuccess: fetchConfigurations,
    errorMessage: "Failed to delete API configuration",
    successMessage: "API configuration deleted successfully"
  });

  const deleteConfig = async (configId: string) => {
    if (!window.confirm('Are you sure you want to delete this API configuration?')) {
      return false;
    }

    const config = configurations.find(c => c.id === configId);
    if (!config) {
      toast.error('Configuration not found');
      return false;
    }

    return await executeOperation('delete', { memorableName: config.memorable_name });
  };

  return {
    isDeleting,
    deleteConfig
  };
};
