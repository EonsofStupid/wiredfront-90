
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { APIConfiguration } from "../useAPIKeyManagement";

export const useAPIDelete = (
  configurations: APIConfiguration[],
  fetchConfigurations: () => Promise<void>
) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteConfig = async (configId: string) => {
    if (!window.confirm('Are you sure you want to delete this API configuration?')) {
      return false;
    }

    setIsDeleting(true);
    try {
      const config = configurations.find(c => c.id === configId);
      if (!config) {
        throw new Error('Configuration not found');
      }

      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: {
          action: 'delete',
          memorableName: config.memorable_name
        }
      });
      
      if (error) throw error;
      
      toast.success("API configuration deleted successfully");
      await fetchConfigurations();
      return true;
    } catch (error) {
      console.error('Error deleting API configuration:', error);
      toast.error("Failed to delete API configuration");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deleteConfig
  };
};
