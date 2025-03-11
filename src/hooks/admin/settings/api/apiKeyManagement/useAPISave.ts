
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { APIType } from "@/types/admin/settings/api";

export const useAPISave = (fetchConfigurations: () => Promise<void>) => {
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: {
          action: 'create',
          secretValue,
          provider,
          memorableName,
          settings,
          roleBindings,
          userBindings
        }
      });
      
      if (error) throw error;
      
      toast.success("API key saved successfully");
      await fetchConfigurations();
      return true;
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error("Failed to save API key");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    createApiKey
  };
};
