
import { useAPIKeyState } from "./useAPIKeyState";
import { useAPISave } from "./useAPISave";
import { useAPIDelete } from "./useAPIDelete";
import { useAPIValidate } from "./useAPIValidate";
import { APIType } from "@/types/admin/settings/api";

// Update the type definition to align with types/admin/settings/api.ts
export type APIConfiguration = {
  id: string;
  user_id?: string | null; // Added to match the type in types/admin/settings/api.ts
  api_type: APIType;
  memorable_name: string;
  is_enabled: boolean;
  is_default: boolean;
  validation_status: string;
  feature_bindings?: string[];
  last_validated?: string;
  provider_settings?: any;
  usage_metrics?: any;
  rag_preference?: string;
  planning_mode?: string;
  role_assignments?: string[];
  user_assignments?: string[];
  created_at?: string;
};

export const useAPIKeyManagement = () => {
  const { 
    isLoading, 
    setIsLoading,
    configurations, 
    setConfigurations,
    fetchConfigurations 
  } = useAPIKeyState();
  
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
