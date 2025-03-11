
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { APIConfiguration } from "../useAPIKeyManagement";

export const useAPIValidate = (
  configurations: APIConfiguration[],
  fetchConfigurations: () => Promise<void>
) => {
  const [isValidating, setIsValidating] = useState(false);

  const validateConfig = async (configId: string) => {
    setIsValidating(true);
    try {
      const config = configurations.find(c => c.id === configId);
      if (!config) {
        throw new Error('Configuration not found');
      }

      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: {
          action: 'validate',
          memorableName: config.memorable_name
        }
      });
      
      if (error) throw error;
      
      toast.success("API key validated successfully");
      await fetchConfigurations();
      return true;
    } catch (error) {
      console.error('Error validating API key:', error);
      toast.error("Failed to validate API key");
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  return {
    isValidating,
    validateConfig
  };
};
